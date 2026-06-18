// Local SEO smoke test. Screenshots a representative page from each category
// running against the local production server (assumed at :3300).

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../../tmp/seo-smoke");
mkdirSync(outDir, { recursive: true });

const BASE = "http://localhost:3300";

const ROUTES = [
  { slug: "homepage", url: "/" },
  { slug: "yoga-studio-software", url: "/yoga-studio-software" },
  { slug: "pilates-studio-software", url: "/pilates-studio-software" },
  { slug: "vs-mindbody", url: "/vs-mindbody" },
  { slug: "vs-vagaro", url: "/vs-vagaro" },
  { slug: "pricing", url: "/pricing" },
  { slug: "yoga-booking-software", url: "/yoga-booking-software" },
  { slug: "multi-location", url: "/multi-location" },
  { slug: "online-payments", url: "/online-payments" },
  { slug: "blog-index", url: "/blog" },
  { slug: "blog-yoga-growth", url: "/blog/grow-your-yoga-studio" },
  { slug: "customers-index", url: "/customers" },
  { slug: "customers-cape-town", url: "/customers/cape-town-pilates-studio" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
});
const page = await ctx.newPage();

const report = [];
for (const r of ROUTES) {
  try {
    await page.goto(`${BASE}${r.url}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.screenshot({
      path: resolve(outDir, `${r.slug}.png`),
      fullPage: false,
    });
    const title = await page.title();
    const ldjsonCount = await page.locator('script[type="application/ld+json"]').count();
    const h1Count = await page.locator("h1").count();
    const firstH1 = h1Count > 0 ? await page.locator("h1").first().innerText() : "(none)";
    report.push({
      url: r.url,
      title,
      jsonLdBlocks: ldjsonCount,
      h1Count,
      firstH1: firstH1.split("\n")[0].slice(0, 80),
    });
    console.log(`✓ ${r.url}`);
  } catch (e) {
    console.log(`✗ ${r.url} —`, e.message);
    report.push({ url: r.url, error: e.message });
  }
}

await browser.close();

console.log("\n── SEO smoke report ──\n");
for (const x of report) {
  if (x.error) {
    console.log(`✗ ${x.url}`);
    console.log(`  error: ${x.error}`);
    continue;
  }
  console.log(`✓ ${x.url}`);
  console.log(`  title:  ${x.title}`);
  console.log(`  H1:     ${x.firstH1}`);
  console.log(`  JSON-LD blocks: ${x.jsonLdBlocks}`);
}

import { writeFileSync } from "node:fs";
writeFileSync(resolve(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(`\nScreenshots in: ${outDir}`);
