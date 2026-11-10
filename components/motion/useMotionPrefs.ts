"use client";

import { useEffect, useState } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const FINE = "(hover: hover) and (pointer: fine)";

/** Reduced motion + mouse-pointer detection. Both start false on the server and settle after mount. */
export function useMotionPrefs(): { reduced: boolean; finePointer: boolean } {
  const [prefs, setPrefs] = useState({ reduced: false, finePointer: false });
  useEffect(() => {
    const r = window.matchMedia(REDUCED);
    const f = window.matchMedia(FINE);
    const update = () => setPrefs({ reduced: r.matches, finePointer: f.matches });
    update();
    r.addEventListener("change", update);
    f.addEventListener("change", update);
    return () => {
      r.removeEventListener("change", update);
      f.removeEventListener("change", update);
    };
  }, []);
  return prefs;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}
