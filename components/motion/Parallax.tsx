"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./useMotionPrefs";

/** Moves its content slower (speed > 0) or faster (speed < 0) than the page while scrolling. speed: -1..1 */
export function Parallax({ speed = 0.3, className, children }: { speed?: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion() || speed === 0) return;
      gsap.fromTo(
        ref.current,
        { yPercent: -speed * 15 },
        { yPercent: speed * 15, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
