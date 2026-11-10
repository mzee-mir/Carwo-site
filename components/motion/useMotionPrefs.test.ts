import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMotionPrefs } from "./useMotionPrefs";

function mockMatchMedia(matches: Record<string, boolean>) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

describe("useMotionPrefs", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reports reduced motion when the OS asks for it", async () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    const { result } = renderHook(() => useMotionPrefs());
    await waitFor(() => expect(result.current.reduced).toBe(true));
  });

  it("reports a fine pointer on mouse devices", async () => {
    mockMatchMedia({ "(hover: hover) and (pointer: fine)": true });
    const { result } = renderHook(() => useMotionPrefs());
    await waitFor(() => expect(result.current.finePointer).toBe(true));
    expect(result.current.reduced).toBe(false);
  });
});
