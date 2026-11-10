"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./useMotionPrefs";

type Props = { as?: ElementType; delay?: number; variant?: "fade-up" | "mask"; className?: string; children: React.ReactNode };

/** Reveals its content when scrolled into view: a fade-up, or a bottom-to-top wipe for photos. */
export function Reveal({ as: Tag = "div", delay = 0, variant = "fade-up", className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Content already on screen at load stays put: hiding it until JS runs would delay the page's main paint.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const scrollTrigger = { trigger: el, start: "top 88%", once: true };
      if (prefersReducedMotion()) {
        gsap.from(el, { opacity: 0, duration: 0.4, delay, scrollTrigger });
      } else if (variant === "mask") {
        gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out", delay, scrollTrigger });
      } else {
        gsap.from(el, { y: 48, opacity: 0, duration: 0.9, ease: "power3.out", delay, scrollTrigger });
      }
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
