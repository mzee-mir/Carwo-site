"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./useMotionPrefs";

type Props = { text: string; as?: ElementType; className?: string; onScroll?: boolean; delay?: number };

/**
 * Headline whose words rise into place. Screen readers get the whole text via aria-label.
 * onScroll=false (page titles): pure CSS, runs at first paint. onScroll=true: GSAP when scrolled into view.
 */
export function SplitText({ text, as: Tag = "h2", className, onScroll = true, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!onScroll || !ref.current || prefersReducedMotion()) return;
      if (ref.current.getBoundingClientRect().top < window.innerHeight) return; // already visible: don't hide it
      gsap.from(ref.current.querySelectorAll("[data-word]"), {
        yPercent: 110,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.06,
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <span data-word className={`inline-block ${onScroll ? "" : "intro-rise"}`} style={onScroll ? undefined : ({ "--i": i } as CSSProperties)}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
