"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

/** Fades/slides each page in on navigation (opacity only for reduced motion). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  return (
    <motion.div
      key={pathname}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
