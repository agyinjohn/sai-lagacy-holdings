import ExcelJS from 'exceljs';
import type { RegistrationRecord } from '@/lib/types';
import { PATHWAY_LIST } from '@/content/pathways';
import { sourceLabel } from '@/content/sources';

/**
 * Export helpers for the team view. Every cell goes through neutraliseCell() so a
 * submission such as "=HYPERLINK(...)" cannot run as a formula in Excel, Sheets or LibreOffice.
 */

export const EXPORT_COLUMNS = [
  'Date',
  'Category',
  'Name',
  'Email',
  'Phone',
  'Location',
  'Detail',
  'Organisation',
  'Message',
  'Consent',
  'Consent notice version',
  'Registration source',
  'Reference',
] as const;

/**
 * Prefixes values that a spreadsheet could read as a formula with an apostrophe
 * (OWASP guidance). Also catches values with leading whitespace or control characters
 * and values beginning with tab or carriage return.
 */
export function neutraliseCell(value: unknown): string {
  const s = value == null ? '' : String(value);
   
  const trimmed = s.replace(/^[\s\u0000-\u001f ﻿]+/, '');
  if (/^[=+\-@]/.test(trimmed) || /^[\t\r]/.test(s)) return `'${s}`;
  return s;
}

export function recordToRow(r: RegistrationRecord): string[] {
  return [
    r.date,
    r.category,
    r.name,
    r.email,
    r.phone,
    r.location,
    r.detail,
    r.organisation,
    r.message,
    r.consent ? 'Yes' : 'No',
    r.consentNoticeVersion,
    sourceLabel(r.source),
    r.ref,
  ].map(neutraliseCell);
}

function csvField(v: string): string {
  return `"${v.replace(/"/g, '""')}"`;
}

/** UTF-8 CSV with BOM (so Excel reads accents correctly), CRLF rows, every field quoted. */
export function toCsv(records: RegistrationRecord[]): string {
  const lines = [EXPORT_COLUMNS.map((c) => csvField(c)).join(',')];
  for (const r of records) lines.push(recordToRow(r).map(csvField).join(','));
  return `﻿${lines.join('\r\n')}\r\n`;
}

export async function toXlsx(records: RegistrationRecord[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'The Courtyard by Sai (prototype)';
  wb.created = new Date();

  const addSheet = (name: string, rows: RegistrationRecord[]) => {
    const ws = wb.addWorksheet(name.slice(0, 31), { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = EXPORT_COLUMNS.map((header) => ({
      header,
      key: header,
      width: header === 'Message' ? 48 : header === 'Category' ? 40 : 22,
    }));
    ws.getRow(1).font = { bold: true };
    for (const r of rows) {
      const row = ws.addRow(recordToRow(r));
      // Store every value as text so nothing is interpreted as a number, date or formula.
      row.eachCell((cell) => {
        cell.numFmt = '@';
        cell.alignment = { vertical: 'top', wrapText: true };
      });
    }
    return ws;
  };

  addSheet('All', records);
  for (const p of PATHWAY_LIST) addSheet(p.sheet, records.filter((r) => r.pathway === p.slug));

  const out = await wb.xlsx.writeBuffer();
  return Buffer.from(out);
}

export { filterRecords, type RecordFilter } from '@/lib/filter';
