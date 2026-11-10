"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMotionPrefs } from "./useMotionPrefs";

/** Small accent dot that trails the mouse and grows over links/buttons. Desktop mouse only. */
export function Cursor() {
  const { reduced, finePointer } = useMotionPrefs();
  const [hovering, setHovering] = useState(false);
  const [seen, setSeen] = useState(false);
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40 });
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setSeen(true);
      setHovering(Boolean((e.target as Element | null)?.closest?.("a, button, [role=button]")));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled || !seen) return null;
  return (
    <motion.div
      data-cursor
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] rounded-full bg-accent mix-blend-difference"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: hovering ? 48 : 12, height: hovering ? 48 : 12 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    />
  );
}
