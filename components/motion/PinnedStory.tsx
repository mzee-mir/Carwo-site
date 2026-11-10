"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./useMotionPrefs";

/**
 * Full-screen scene that pins while the background slowly zooms out and the title slides across.
 * `media` is the background (photo), `title` the big moving type, `children` the overlay content.
 */
export function PinnedStory({ media, title, children, className = "" }: { media: React.ReactNode; title?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=100%", pin: true, scrub: 1 } });
      tl.fromTo(ref.current.querySelector("[data-media]"), { scale: 1.2 }, { scale: 1, ease: "none" }, 0);
      const t = ref.current.querySelector("[data-title]");
      if (t) tl.fromTo(t, { xPercent: 15 }, { xPercent: -15, ease: "none" }, 0);
    },
    { scope: ref },
  );
  return (
    <section ref={ref} data-pinned className={`relative h-svh min-h-[560px] overflow-hidden ${className}`}>
      <div data-media className="absolute inset-0">
        {media}
      </div>
      <div className="absolute inset-0 bg-black/35" aria-hidden />
      {title && (
        <div data-title className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap">
          {title}
        </div>
      )}
      <div className="relative h-full">{children}</div>
    </section>
  );
}
