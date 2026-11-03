import type { ReactNode } from 'react';

const cx = (...p: (string | false | undefined)[]) => p.filter(Boolean).join(' ');

/**
 * Editorial list with hairline rules and large numerals, used instead of boxed cards.
 * `children` render inside the row after the description (for example a link).
 */
export function OpenList({
  items,
  onDark = false,
  cols = 3,
  className,
}: {
  items: readonly { title: string; description?: string; extra?: ReactNode }[];
  onDark?: boolean;
  cols?: 2 | 3;
  className?: string;
}) {
  return (
    <ol className={cx('grid gap-x-12', cols === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2', className)}>
      {items.map((item, i) => (
        <li key={item.title} className={cx('border-t pb-10 pt-6', onDark ? 'border-gold-light/60' : 'border-gold-ink/50')}>
          <span aria-hidden="true" className={cx('block font-heading text-[2.75rem] leading-none', onDark ? 'text-gold-light' : 'text-gold-ink')}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="display-3 mt-4">{item.title}</h3>
          {item.description && <p className={cx('mt-3 max-w-[26em]', onDark ? 'text-pale' : 'text-deep/85')}>{item.description}</p>}
          {item.extra}
        </li>
      ))}
    </ol>
  );
}

/** A large line of text pulled from the page copy. Not a quotation, so it carries no attribution. */
export function PullLine({ children, onDark = false, className }: { children: ReactNode; onDark?: boolean; className?: string }) {
  return (
    <p
      className={cx(
        'border-l-2 pl-6 font-heading text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.18] text-balance md:pl-8',
        onDark ? 'border-gold-light text-white' : 'border-gold text-deep',
        className,
      )}
    >
      {children}
    </p>
  );
}
