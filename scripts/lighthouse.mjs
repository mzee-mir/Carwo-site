// Mobile Lighthouse run against a running server. Usage: node scripts/lighthouse.mjs http://localhost:3200 / /shop
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";

const [base, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ args: ["--remote-debugging-port=9333"] });
let failed = false;
for (const p of paths) {
  const { lhr } = await lighthouse(base + p, { port: 9333, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility"] });
  const perf = Math.round(lhr.categories.performance.score * 100);
  const a11y = Math.round(lhr.categories.accessibility.score * 100);
  const a = lhr.audits;
  console.log(`${p}  perf ${perf}  a11y ${a11y}  LCP ${a["largest-contentful-paint"].displayValue}  CLS ${a["cumulative-layout-shift"].displayValue}  TBT ${a["total-blocking-time"].displayValue}`);
  const bad = Object.values(lhr.audits).filter((x) => x.score !== null && x.score < 0.9 && lhr.categories.accessibility.auditRefs.some((r) => r.id === x.id));
  for (const b of bad) console.log(`   a11y: ${b.id} — ${b.title}`);
  if (perf < 85 || a11y < 85) failed = true;
}
await browser.close();
process.exit(failed ? 1 : 0);
