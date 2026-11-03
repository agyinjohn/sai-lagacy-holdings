'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/** Moves its children slowly against the scroll, inside a clipped frame. Static when reduced motion is preferred. */
export function Parallax({ children, amount = 70, className = '' }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div style={{ y: reduce ? 0 : y }} className="absolute inset-x-0 inset-y-[-14%]">
        {children}
      </motion.div>
    </div>
  );
}
