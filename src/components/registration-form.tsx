'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useRef, useState } from 'react';
import { CONSENT_TEXT, PATHWAYS, type PathwaySlug } from '@/content/pathways';
import { PROTOTYPE_FORM_NOTICE } from '@/content/site';
import { fieldErrorsFrom, schemaFor } from '@/lib/validation';

type Values = {
  name: string;
  email: string;
  phone: string;
  location: string;
  detail: string;
  organisation: string;
  message: string;
  consent: boolean;
  website: string; // honeypot
};

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'error'; message: string };

const FIELD_LABELS: Record<string, string> = {
  name: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  location: 'Country or city',
  detail: 'Your selection',
  organisation: 'Organisation',
  message: 'Message',
  consent: 'Consent',
};

export function RegistrationForm({
  pathway,
  source,
  initialDetail,
}: {
  pathway: PathwaySlug;
  source: string;
  initialDetail?: string;
}) {
  const cfg = PATHWAYS[pathway];
  const router = useRouter();
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const summaryRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    phone: '',
    location: '',
    detail: initialDetail && (cfg.detailOptions as readonly string[]).includes(initialDetail) ? initialDetail : '',
    organisation: '',
    message: '',
    consent: false,
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const submitting = status.kind === 'submitting';

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const showErrors = (next: Record<string, string>) => {
    setErrors(next);
    // Move focus to the summary so keyboard and screen reader users hear what to fix.
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setStatus({ kind: 'idle' });

    // Same schema as the server. The server result is the only one that counts.
    const payload = { ...values, pathway, source };
    const parsed = schemaFor(pathway).safeParse(payload);
    if (!parsed.success) {
      showErrors(fieldErrorsFrom(parsed.error));
      return;
    }

    setStatus({ kind: 'submitting' });
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        ref?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
        retryAfterSeconds?: number;
      };

      if (res.ok && body.ok && body.ref) {
        router.push(`/register/confirmation?pathway=${pathway}&ref=${encodeURIComponent(body.ref)}`);
        return;
      }
      if (res.status === 422 && body.fieldErrors) {
        setStatus({ kind: 'idle' });
        showErrors(body.fieldErrors);
        return;
      }
      if (res.status === 429) {
        const mins = Math.max(1, Math.ceil((body.retryAfterSeconds ?? 60) / 60));
        setStatus({ kind: 'error', message: `You have sent several registrations in a short time. Please try again in about ${mins} minute${mins === 1 ? '' : 's'}.` });
        return;
      }
      setStatus({ kind: 'error', message: 'Something went wrong on our side, and your registration was not saved. Please try again in a moment.' });
    } catch {
      setStatus({ kind: 'error', message: 'We could not reach the server. Check your connection and try again. Your answers are still here.' });
    }
  }

  const errorList = Object.entries(errors).filter(([, m]) => m);
  const describe = (field: string, hint?: boolean) => [errors[field] ? `${id(field)}-err` : '', hint ? `${id(field)}-hint` : ''].filter(Boolean).join(' ') || undefined;

  const inputClass = (field: string) =>
    `min-h-[48px] w-full rounded-[2px] border bg-white px-3 py-2 text-deep placeholder:text-deep/50 ${
      errors[field] ? 'border-error border-2' : 'border-deep'
    }`;

  return (
    <form onSubmit={onSubmit} noValidate aria-label={cfg.title} className="rounded-[2px] border border-pale bg-white p-5 sm:p-8">
      <p role="note" className="mb-6 rounded-[2px] border border-gold-ink/50 bg-gold-light/20 px-4 py-3 text-[0.95rem] text-deep">
        <strong>Prototype.</strong> {PROTOTYPE_FORM_NOTICE}
        {cfg.sensitiveReminder ? ` ${cfg.sensitiveReminder}` : ''}
      </p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 rounded-[2px] border-2 border-error bg-[#fdf2f2] p-4 outline-none">
          <p className="font-semibold text-error">Please fix {errorList.length === 1 ? 'this' : 'these'} before sending:</p>
          <ul className="mt-2 list-disc pl-5">
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${id(field)}`}
                  className="text-error underline underline-offset-2"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id(field))?.focus();
                  }}
                >
                  {FIELD_LABELS[field] ?? field}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status.kind === 'error' && (
        <p role="alert" className="mb-6 rounded-[2px] border-2 border-error bg-[#fdf2f2] p-4 text-error">
          {status.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" id={id('name')} error={errors.name} errId={`${id('name')}-err`} className="sm:col-span-2">
          <input id={id('name')} name="name" type="text" autoComplete="name" required aria-required="true" aria-invalid={!!errors.name} aria-describedby={describe('name')} value={values.name} onChange={(e) => set('name', e.target.value)} className={inputClass('name')} />
        </Field>

        <Field label="Email address" id={id('email')} error={errors.email} errId={`${id('email')}-err`}>
          <input id={id('email')} name="email" type="email" autoComplete="email" inputMode="email" required aria-required="true" aria-invalid={!!errors.email} aria-describedby={describe('email')} value={values.email} onChange={(e) => set('email', e.target.value)} className={inputClass('email')} />
        </Field>

        <Field label="Phone number (optional)" id={id('phone')} error={errors.phone} errId={`${id('phone')}-err`}>
          <input id={id('phone')} name="phone" type="tel" autoComplete="tel" inputMode="tel" aria-invalid={!!errors.phone} aria-describedby={describe('phone')} value={values.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass('phone')} />
        </Field>

        <Field label="Country or city" id={id('location')} error={errors.location} errId={`${id('location')}-err`} className={cfg.hasOrganisation ? '' : 'sm:col-span-2'}>
          <input id={id('location')} name="location" type="text" autoComplete="off" required aria-required="true" aria-invalid={!!errors.location} aria-describedby={describe('location')} value={values.location} onChange={(e) => set('location', e.target.value)} className={inputClass('location')} />
        </Field>

        {cfg.hasOrganisation && (
          <Field label="Organisation (optional)" id={id('organisation')} error={errors.organisation} errId={`${id('organisation')}-err`}>
            <input id={id('organisation')} name="organisation" type="text" autoComplete="organization" aria-invalid={!!errors.organisation} aria-describedby={describe('organisation')} value={values.organisation} onChange={(e) => set('organisation', e.target.value)} className={inputClass('organisation')} />
          </Field>
        )}

        <Field label={cfg.detailLabel} id={id('detail')} error={errors.detail} errId={`${id('detail')}-err`} className="sm:col-span-2">
          <select id={id('detail')} name="detail" required aria-required="true" aria-invalid={!!errors.detail} aria-describedby={describe('detail')} value={values.detail} onChange={(e) => set('detail', e.target.value)} className={inputClass('detail')}>
            <option value="">Choose an option</option>
            {cfg.detailOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Message (optional)" id={id('message')} error={errors.message} errId={`${id('message')}-err`} hint={cfg.messageHint} hintId={`${id('message')}-hint`} className="sm:col-span-2">
          <textarea id={id('message')} name="message" rows={4} maxLength={2100} aria-invalid={!!errors.message} aria-describedby={describe('message', true)} value={values.message} onChange={(e) => set('message', e.target.value)} className={inputClass('message')} />
        </Field>

        {/* Honeypot: hidden from people and assistive tech. Bots fill it, so the server discards the submission. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={id('website')}>Leave this field empty</label>
          <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              id={id('consent')}
              name="consent"
              type="checkbox"
              required
              aria-required="true"
              aria-invalid={!!errors.consent}
              aria-describedby={describe('consent')}
              checked={values.consent}
              onChange={(e) => set('consent', e.target.checked)}
              className="mt-1 h-6 w-6 shrink-0 accent-deep"
            />
            <label htmlFor={id('consent')} className="text-[0.975rem] leading-snug">
              {CONSENT_TEXT}{' '}
              <Link href="/privacy" target="_blank" className="font-medium underline underline-offset-4">
                Read the privacy notice
              </Link>
              .
            </label>
          </div>
          {errors.consent && (
            <p id={`${id('consent')}-err`} className="mt-2 font-medium text-error">
              {errors.consent}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-[2px] border border-deep bg-deep px-7 font-medium text-white transition-colors hover:bg-mid disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {submitting ? 'Sending…' : cfg.action}
      </button>
      <p className="mt-3 text-sm text-deep/75" aria-live="polite">
        {submitting ? 'Sending your registration. Please wait.' : 'Fields marked optional can be left blank.'}
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  errId,
  hint,
  hintId,
  className = '',
  children,
}: {
  label: string;
  id: string;
  error?: string;
  errId: string;
  hint?: string;
  hintId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-deep/75">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={errId} className="font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
