import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../../tmp/preview-v2");
mkdirSync(outDir, { recursive: true });

const BASE = "http://localhost:3300";

const browser = await chromium.launch();

// ── Desktop ──────────────────────────────────────────────────────────────
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

// Homepage: hero + studio-day signature
const p = await ctx.newPage();
await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await p.screenshot({ path: resolve(outDir, "homepage-hero.png") });
// Scroll to studio-day
await p.evaluate(() => {
  const h = Array.from(document.querySelectorAll("dt")).find(el => el.textContent?.includes("06:30"));
  if (h) {
    const r = h.getBoundingClientRect();
    window.scrollBy(0, r.top - 120);
  }
});
await p.waitForTimeout(900);
await p.screenshot({ path: resolve(outDir, "homepage-studio-day.png") });
// Scroll to editorial breakout
await p.evaluate(() => {
  const all = Array.from(document.querySelectorAll("p.font-display"));
  const h = all.find(el => el.textContent?.includes("Bookings, memberships"));
  if (h) {
    const r = h.getBoundingClientRect();
    window.scrollBy(0, r.top - 200);
  }
});
await p.waitForTimeout(700);
await p.screenshot({ path: resolve(outDir, "homepage-editorial.png") });
// FAQ
await p.evaluate(() => {
  const h = Array.from(document.querySelectorAll("h2")).find(el => el.textContent?.includes("Frequently asked"));
  if (h) {
    const r = h.getBoundingClientRect();
    window.scrollBy(0, r.top - 100);
  }
});
await p.waitForTimeout(500);
// Click first FAQ to show animation state
const firstFaq = await p.locator("details").first();
await firstFaq.locator("summary").click();
await p.waitForTimeout(400);
await p.screenshot({ path: resolve(outDir, "homepage-faq-open.png") });

// /yoga-studio-software
await p.goto(`${BASE}/yoga-studio-software`, { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await p.screenshot({ path: resolve(outDir, "yss-hero.png") });
await p.evaluate(() => {
  const h = Array.from(document.querySelectorAll("dt")).find(el => el.textContent?.includes("06:30"));
  if (h) {
    const r = h.getBoundingClientRect();
    window.scrollBy(0, r.top - 120);
  }
});
await p.waitForTimeout(900);
await p.screenshot({ path: resolve(outDir, "yss-studio-day.png") });
// Editorial
await p.evaluate(() => {
  const all = Array.from(document.querySelectorAll("p.font-display"));
  const h = all.find(el => el.textContent?.includes("Run your yoga studio"));
  if (h) {
    const r = h.getBoundingClientRect();
    window.scrollBy(0, r.top - 200);
  }
});
await p.waitForTimeout(700);
await p.screenshot({ path: resolve(outDir, "yss-editorial.png") });

// /pricing
await p.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
await p.waitForTimeout(700);
await p.screenshot({ path: resolve(outDir, "pricing-hero.png") });
// Scroll to pricing cards
await p.evaluate(() => {
  const h = Array.from(document.querySelectorAll("button")).find(el => el.textContent?.includes("Start free trial"));
  if (h) {
    const r = h.getBoundingClientRect();
    window.scrollBy(0, r.top - 200);
  }
});
await p.waitForTimeout(600);
await p.screenshot({ path: resolve(outDir, "pricing-cards.png") });
// Editorial
await p.evaluate(() => {
  const all = Array.from(document.querySelectorAll("p.font-display"));
  const h = all.find(el => el.textContent?.includes("Every feature, every integration"));
  if (h) {
    const r = h.getBoundingClientRect();
    window.scrollBy(0, r.top - 200);
  }
});
await p.waitForTimeout(600);
await p.screenshot({ path: resolve(outDir, "pricing-editorial.png") });

// ── Mobile ──────────────────────────────────────────────────────────────
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const m = await mobile.newPage();

await m.goto(`${BASE}/`, { waitUntil: "networkidle" });
await m.waitForTimeout(700);
await m.screenshot({ path: resolve(outDir, "homepage-mobile-hero.png") });
await m.evaluate(() => {
  const h = Array.from(document.querySelectorAll("dt")).find(el => el.textContent?.includes("06:30"));
  if (h) {
    const r = h.getBoundingClientRect();
    window.scrollBy(0, r.top - 80);
  }
});
await m.waitForTimeout(700);
await m.screenshot({ path: resolve(outDir, "homepage-mobile-studio-day.png") });

await m.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
await m.waitForTimeout(700);
await m.screenshot({ path: resolve(outDir, "pricing-mobile-cards.png"), fullPage: false });

await browser.close();
console.log("Screenshots in", outDir);
