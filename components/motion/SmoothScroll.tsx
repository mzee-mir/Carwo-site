"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useMotionPrefs } from "./useMotionPrefs";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { reduced } = useMotionPrefs();
  useEffect(() => {
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);
  return <>{children}</>;
}
