"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./useMotionPrefs";

/**
 * Desktop: pins the section and slides the row sideways as you scroll down.
 * Phones / reduced motion: a normal swipeable row.
 */
export function HorizontalScroll({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!section.current || !track.current || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: section },
  );
  return (
    <div ref={section} data-pinned className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max gap-3 overflow-x-auto px-5 md:gap-6 md:overflow-visible md:px-12 [scrollbar-width:none]">
        {children}
      </div>
    </div>
  );
}
