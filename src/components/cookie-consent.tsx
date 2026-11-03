'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { closeConsentPanel, openConsentPanel, setConsent, useConsent } from '@/lib/consent';
import { startAnalytics } from '@/lib/analytics';

/** Banner shown until a choice is made, and again when "Cookie settings" is used. Also gates analytics. */
export function CookieConsent() {
  const { choice, panelOpen } = useConsent();
  const visible = choice !== 'server' && (choice === 'unset' || panelOpen);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (choice === 'granted') startAnalytics();
  }, [choice]);

  useEffect(() => {
    if (panelOpen) ref.current?.querySelector<HTMLElement>('button')?.focus();
  }, [panelOpen]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Cookie preferences"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && choice !== 'unset') closeConsentPanel();
      }}
      className="on-dark fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-[2px] border border-gold-light/60 bg-night p-5 text-white shadow-2xl sm:inset-x-6 sm:bottom-6"
    >
      <p className="text-[0.95rem] leading-relaxed">
        We use analytics cookies only with your consent. Right now this prototype loads no analytics at all, whatever you choose.{' '}
        <Link href="/privacy" className="font-medium text-gold-light underline underline-offset-4">
          Read the privacy notice
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setConsent('granted')}
          className="min-h-11 rounded-[2px] border border-gold-light bg-gold-light px-5 text-sm font-medium text-deep hover:bg-[#e8cb90]"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => setConsent('denied')}
          className="min-h-11 rounded-[2px] border border-white/70 px-5 text-sm font-medium text-white hover:bg-white/10"
        >
          Decline
        </button>
        {choice !== 'unset' && (
          <button type="button" onClick={closeConsentPanel} className="min-h-11 px-3 text-sm underline underline-offset-4">
            Close
          </button>
        )}
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentPanel} className={className}>
      Cookie settings
    </button>
  );
}
