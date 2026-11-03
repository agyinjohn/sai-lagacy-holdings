export function imageIds(source: string): string[];
export function imageAspect(source: string, id: string): number | null;
export function applyImage(
  source: string,
  id: string,
  info: {
    kind: string;
    src: string;
    width: number;
    height: number;
    register: { source: string; licence: string; permittedUse: string; approvalStatus: string; approvedBy: string; notes: string };
  },
): string;
export function aiRegister(opts: { tool?: string; date?: string; file: string }): {
  source: string; licence: string; permittedUse: string; approvalStatus: string; approvedBy: string; notes: string;
};
