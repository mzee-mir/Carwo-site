export type ConnectionInfo = { reducedMotion: boolean; saveData?: boolean; effectiveType?: string };

/** The hero video only plays when it won't hurt: no reduced motion, no data saver, not a slow (≤3G) connection. */
export function shouldPlayHeroVideo({ reducedMotion, saveData, effectiveType }: ConnectionInfo): boolean {
  if (reducedMotion || saveData) return false;
  return !["slow-2g", "2g", "3g"].includes(effectiveType ?? "");
}

/** Reads the browser's motion preference and Network Information (where supported). */
export function readConnection(): ConnectionInfo {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: c?.saveData,
    effectiveType: c?.effectiveType,
  };
}
