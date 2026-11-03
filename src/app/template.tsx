'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useSyncExternalStore, type ReactNode } from 'react';

const noop = () => () => {};
/** False on the server and during hydration, so first paint is never hidden. True for later client navigations. */
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

/** A quiet fade as pages change. Skipped for reduced motion and on the very first load. */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  if (reduce || !mounted) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
