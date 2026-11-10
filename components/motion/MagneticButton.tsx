"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { useMotionPrefs } from "./useMotionPrefs";

/** Wrapper that pulls its child gently toward the mouse. Inert on touch and for reduced motion. */
export function MagneticButton({ children, strength = 0.3, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const { reduced, finePointer } = useMotionPrefs();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const active = finePointer && !reduced;
  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={active ? { x, y } : undefined}
      onMouseMove={(e) => {
        if (!active || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
