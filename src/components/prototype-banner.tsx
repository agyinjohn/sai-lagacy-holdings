import { PROTOTYPE_BANNER } from '@/content/site';

export function PrototypeBanner() {
  return (
    <p role="note" className="bg-night px-5 py-2 text-center text-sm leading-snug text-white">
      <strong className="font-semibold">Prototype.</strong> {PROTOTYPE_BANNER.replace(/^Prototype for discussion\.\s*/, 'For discussion. ')}
    </p>
  );
}
