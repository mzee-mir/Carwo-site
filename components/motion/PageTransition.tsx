"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useRef } from "react";

/**
 * Fades/slides each page in on client navigation (opacity only for reduced motion).
 * The first page load is not animated so content paints immediately.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const firstPath = useRef(pathname);
  const navigated = useRef(false);
  if (pathname !== firstPath.current) navigated.current = true;
  return (
    <motion.div
      key={pathname}
      initial={navigated.current ? (reduced ? { opacity: 0 } : { opacity: 0, y: 24 }) : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
