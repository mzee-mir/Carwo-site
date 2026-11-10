// Generates stand-in photos in public/fixtures until the client's real photos are added.
// Run: node scripts/make-placeholders.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const out = new URL("../public/fixtures/", import.meta.url);
mkdirSync(out, { recursive: true });

const tones = ["#2b2b28", "#24261f", "#2a2422", "#1f2326", "#28262b", "#232723"];

async function make(file, w, h, label, i) {
  const a = tones[i % tones.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="#121212"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="${Math.round(w * 0.05)}" y="${h - Math.round(h * 0.05)}" font-family="Arial" font-weight="700" letter-spacing="4" font-size="${Math.round(w / 32)}" fill="#8a877f">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 70 }).toFile(fileURLToPath(new URL(file, out)));
}

let i = 0;
await make("hero.jpg", 1600, 1000, "HERO PHOTO", i++);
for (let p = 1; p <= 10; p++) {
  await make(`p${p}-a.jpg`, 800, 1000, "PHOTO", i++);
  await make(`p${p}-b.jpg`, 800, 1000, "PHOTO · BACK", i++);
}
for (const s of [1, 2]) {
  await make(`s${s}-cover.jpg`, 1600, 1000, `STORY ${s} COVER`, i++);
  for (let n = 1; n <= 5; n++) await make(`s${s}-${n}.jpg`, 1200, 1500, `LOOK ${n}`, i++);
}
console.log("placeholders written");
