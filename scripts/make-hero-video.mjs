// Records a short placeholder hero loop (WebM) with Playwright's Chromium, since ffmpeg isn't required.
// Run: node scripts/make-hero-video.mjs  → public/fixtures/hero.webm
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const browser = await chromium.launch();
const page = await browser.newPage();
const b64 = await page.evaluate(async () => {
  const W = 1280, H = 800, SECONDS = 6, FPS = 30;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const rec = new MediaRecorder(c.captureStream(FPS), { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 600_000 });
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  const done = new Promise((r) => (rec.onstop = r));
  rec.start();
  const start = performance.now();
  await new Promise((resolve) => {
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      const p = (t / SECONDS) * Math.PI * 2; // one full cycle → seamless loop
      const g = ctx.createLinearGradient(W * (0.5 + 0.5 * Math.cos(p)), 0, W * (0.5 - 0.5 * Math.cos(p)), H);
      g.addColorStop(0, "#2b2b28");
      g.addColorStop(1, "#0f0f0f");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(198,255,0,0.08)";
      ctx.beginPath();
      ctx.arc(W * 0.6 + Math.sin(p) * 160, H * 0.5 + Math.cos(p) * 90, 260, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8a877f";
      ctx.font = "700 32px Arial";
      ctx.fillText("HERO VIDEO", 48, H - 48);
      if (t < SECONDS) requestAnimationFrame(draw);
      else resolve();
    };
    draw();
  });
  rec.stop();
  await done;
  const buf = await new Blob(chunks, { type: "video/webm" }).arrayBuffer();
  let s = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
});
await browser.close();
const out = fileURLToPath(new URL("../public/fixtures/hero.webm", import.meta.url));
writeFileSync(out, Buffer.from(b64, "base64"));
console.log("wrote", out, Math.round(Buffer.from(b64, "base64").length / 1024), "KB");
