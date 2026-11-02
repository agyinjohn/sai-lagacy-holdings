'use client';

import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { useSyncExternalStore, type ReactNode } from 'react';

const noopSubscribe = () => () => {};
/** False on the server and during hydration, true afterwards, so SSR markup is never left hidden. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** Subtle fade-and-rise as content enters view. Does nothing when reduced motion is preferred. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  if (reduce || !mounted) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
