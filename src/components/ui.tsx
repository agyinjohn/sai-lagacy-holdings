import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/* ---------- Buttons ---------- */

type Variant = 'primary' | 'secondary' | 'gold' | 'outline-light';

const BUTTON_BASE =
  'inline-flex min-h-[52px] items-center justify-center rounded-[2px] border px-7 text-base font-medium transition-colors duration-200 text-center';

const VARIANTS: Record<Variant, string> = {
  primary: 'border-deep bg-deep text-white hover:bg-mid hover:border-mid',
  secondary: 'border-deep bg-transparent text-deep hover:bg-deep/10',
  gold: 'border-gold-light bg-gold-light text-deep hover:bg-[#e8cb90] hover:border-[#e8cb90]',
  'outline-light': 'border-white/70 bg-transparent text-white hover:bg-white/10',
};

export function buttonClass(variant: Variant = 'primary', extra?: string) {
  return cx(BUTTON_BASE, VARIANTS[variant], extra);
}

export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link {...props} className={buttonClass(variant, className)} />;
}

/** Underlined text link. `onDark` switches to gold for dark sections. */
export function TextLink({ onDark, className, ...props }: ComponentProps<typeof Link> & { onDark?: boolean }) {
  return (
    <Link
      {...props}
      className={cx(
        'inline-flex min-h-11 items-center font-medium underline underline-offset-4 decoration-1 transition-colors',
        onDark ? 'text-gold-light hover:text-[#e8cb90]' : 'text-deep hover:text-gold-ink',
        className,
      )}
    />
  );
}

/* ---------- Layout ---------- */

export type SectionTone = 'mist' | 'paper' | 'deep' | 'mid' | 'white';

const TONE_CLASS: Record<SectionTone, string> = {
  mist: 'bg-mist text-deep',
  paper: 'bg-paper text-deep',
  white: 'bg-white text-deep',
  deep: 'on-dark bg-deep text-white',
  mid: 'on-dark bg-mid text-white',
};

export function Section({
  tone = 'paper',
  pad = true,
  id,
  className,
  labelledBy,
  children,
}: {
  tone?: SectionTone;
  pad?: boolean;
  id?: string;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(TONE_CLASS[tone], className)}>
      <div className={cx('wrap', pad && 'section-pad')}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, onDark, className }: { children: ReactNode; onDark?: boolean; className?: string }) {
  return <p className={cx('eyebrow mb-4', onDark ? 'text-gold-light' : 'text-gold-ink', className)}>{children}</p>;
}

/** Visible, styled marker for information that has not been supplied yet. */
export function Placeholder({ children, onDark }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p
      className={cx(
        'rounded-[2px] border border-dashed px-4 py-3 text-[0.95rem]',
        onDark ? 'border-gold-light/70 bg-white/5 text-pale' : 'border-gold-ink/60 bg-gold-light/15 text-gold-ink',
      )}
    >
      {children}
    </p>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('rounded-[2px] border border-pale bg-white p-6 sm:p-8', className)}>{children}</div>;
}
