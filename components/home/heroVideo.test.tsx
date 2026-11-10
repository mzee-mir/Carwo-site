import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";
import { shouldPlayHeroVideo } from "./heroVideo";

const image = { url: "/fixtures/hero.jpg", alt: "Model in the Carwo hoodie", width: 1600, height: 1000 };
const video = { url: "https://cdn.sanity.io/files/x/production/hero.mp4", mimeType: "video/mp4" };

describe("shouldPlayHeroVideo", () => {
  it("plays on a normal connection", () => {
    expect(shouldPlayHeroVideo({ reducedMotion: false })).toBe(true);
    expect(shouldPlayHeroVideo({ reducedMotion: false, effectiveType: "4g", saveData: false })).toBe(true);
  });
  it("keeps the photo for reduced motion, data saver and slow connections", () => {
    expect(shouldPlayHeroVideo({ reducedMotion: true })).toBe(false);
    expect(shouldPlayHeroVideo({ reducedMotion: false, saveData: true })).toBe(false);
    for (const effectiveType of ["slow-2g", "2g", "3g"]) expect(shouldPlayHeroVideo({ reducedMotion: false, effectiveType })).toBe(false);
  });
});

function mockEnv({ reduced = false, saveData = false, effectiveType = "4g" } = {}) {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") ? reduced : false, media: q, addEventListener() {}, removeEventListener() {} }));
  Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData, effectiveType } });
}

describe("Hero with a video", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(navigator, "connection", { configurable: true, value: undefined });
  });

  it("always shows the photo and adds a muted looping video when allowed", async () => {
    mockEnv();
    const { container } = render(<Hero image={image} video={video} />);
    expect(screen.getByRole("img", { name: image.alt })).toBeInTheDocument();
    await waitFor(() => expect(container.querySelector("video source")).toHaveAttribute("src", video.url));
    const v = container.querySelector("video")!;
    expect(v.muted).toBe(true);
    expect(v.loop).toBe(true);
    expect(v).toHaveAttribute("playsinline");
    expect(v).toHaveAttribute("aria-hidden", "true");
  });

  it("does not load the video for reduced motion or data saver", async () => {
    mockEnv({ reduced: true });
    const a = render(<Hero image={image} video={video} />);
    mockEnv({ saveData: true });
    const b = render(<Hero image={image} video={video} />);
    await new Promise((r) => setTimeout(r, 50));
    expect(a.container.querySelector("video")).toBeNull();
    expect(b.container.querySelector("video")).toBeNull();
  });

  it("shows only the photo when no video is set", async () => {
    mockEnv();
    const { container } = render(<Hero image={image} />);
    await new Promise((r) => setTimeout(r, 50));
    expect(container.querySelector("video")).toBeNull();
  });
});
