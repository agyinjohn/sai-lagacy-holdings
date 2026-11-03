'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV } from '@/content/site';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { RidgeGlyph, RidgeScene } from '@/components/ridge';

/** A thin ridge line under the header that draws across as the page is read. */
function ReadingRidge() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const draw = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 1440 10" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 -bottom-[5px] h-[10px] w-full">
      <path d="M0 6 C180 1 340 8 540 4 C740 0 900 8 1100 3 C1240 0 1350 5 1440 3" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeOpacity="0.25" />
      <motion.path d="M0 6 C180 1 340 8 540 4 C740 0 900 8 1100 3 C1240 0 1350 5 1440 3" fill="none" stroke="var(--color-gold)" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 0 : draw }} />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  // Menu is open only for the page it was opened on, so navigating closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = useCallback((v: boolean | ((o: boolean) => boolean)) => {
    setOpenFor((cur) => {
      const was = cur === pathname;
      const next = typeof v === 'function' ? v(was) : v;
      return next ? pathname : null;
    });
  }, [pathname]);
  const [scrolled, setScrolled] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const headerEl = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const onHome = pathname === '/';
  const light = onHome && !scrolled && !open; // light text over the dark hero

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) menuBtn.current?.focus();
  }, [setOpen]);

  // Lock scroll and trap focus while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [menuBtn.current, ...Array.from(panel.current.querySelectorAll<HTMLElement>('a'))].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const linkBase = 'inline-flex min-h-11 items-center border-b-2 border-transparent text-[0.95rem] transition-colors';
  const linkTone = light ? 'text-white hover:border-gold-light' : 'text-deep hover:border-gold';

  return (
    <header
      ref={headerEl}
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        light ? 'on-dark bg-transparent' : 'bg-mist/95 shadow-[0_1px_0_rgba(18,59,42,0.12)] backdrop-blur'
      } ${open ? 'on-dark' : ''}`}
    >
      {!open && <ReadingRidge />}
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className={`flex min-h-11 items-center gap-2.5 whitespace-nowrap font-heading text-[1.1rem] sm:gap-3 sm:text-[1.35rem] ${light ? 'text-white' : 'text-deep'}`} aria-label="The Courtyard by Sai, home">
          <RidgeGlyph className="h-5 w-8 sm:h-6 sm:w-9" />
          <span>The Courtyard by Sai</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-x-5 xl:flex">
          {NAV.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={`${linkBase} ${linkTone} ${current ? (light ? 'border-gold-light font-semibold' : 'border-deep font-semibold') : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/register"
            className={`ml-1 inline-flex min-h-11 items-center rounded-[2px] border px-5 text-[0.95rem] font-medium transition-colors ${
              light ? 'border-gold-light bg-gold-light text-deep hover:bg-[#e8cb90]' : 'border-deep bg-deep text-white hover:bg-mid'
            }`}
          >
            Join a waitlist
          </Link>
        </nav>

        <button
          ref={menuBtn}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => {
            if (!open && headerEl.current) {
              // Bring the sticky header to the top so the menu panel fills the screen below it.
              window.scrollTo({ top: Math.max(window.scrollY, headerEl.current.offsetTop), behavior: 'instant' });
            }
            setOpen((v) => !v);
          }}
          className={`inline-flex min-h-11 items-center gap-2 rounded-[2px] border px-4 text-[0.95rem] xl:hidden ${
            light || open ? 'border-white/70 text-white' : 'border-deep text-deep'
          }`}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div
        id="mobile-nav"
        ref={panel}
        hidden={!open}
        className="absolute inset-x-0 top-full h-[calc(100svh-64px)] overflow-hidden bg-deep xl:hidden"
      >
        <RidgeScene mood="dawn" className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] w-full opacity-40" />
        <nav aria-label="Main (mobile)" className="wrap relative flex h-full flex-col overflow-y-auto py-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className="flex min-h-14 items-center border-b border-white/15 font-heading text-[1.7rem] text-white aria-[current=page]:text-gold-light"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-[2px] border border-gold-light bg-gold-light px-7 font-medium text-deep"
          >
            Join a waitlist
          </Link>
        </nav>
      </div>
    </header>
  );
}
