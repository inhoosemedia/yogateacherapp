// Live SEO smoke test. Hits production https://www.yogateacherapp.com and
// verifies every new URL from the SEO sprint returns 200, plus checks the
// sitemap and robots are live.

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../../tmp/seo-live");
mkdirSync(outDir, { recursive: true });

const BASE = "https://www.yogateacherapp.com";

const ROUTES = [
  "/sitemap.xml",
  "/robots.txt",
  "/yoga-studio-software",
  "/pilates-studio-software",
  "/pricing",
  "/vs-mindbody",
  "/vs-vagaro",
  "/vs-wellnessliving",
  "/vs-momence",
  "/vs-glofox",
  "/yoga-booking-software",
  "/pilates-booking-software",
  "/class-scheduling-software",
  "/membership-management-software",
  "/online-payments",
  "/instructor-management",
  "/check-in-system",
  "/multi-location",
  "/reporting-analytics",
  "/customer-app",
  "/blog",
  "/blog/grow-your-yoga-studio",
  "/blog/grow-your-pilates-studio",
  "/blog/how-to-switch-yoga-studio-software",
  "/blog/how-to-get-more-yoga-students",
  "/blog/yoga-studio-marketing-ideas",
  "/blog/how-to-open-a-pilates-studio",
  "/blog/migrate-from-mindbody-to-yogateacher",
  "/blog/yoga-software-migration-checklist",
  "/customers",
  "/customers/london-solo-teacher",
  "/customers/cape-town-pilates-studio",
  "/customers/toronto-multi-location",
];

const results = [];
let pass = 0;
let fail = 0;

for (const url of ROUTES) {
  try {
    const r = await fetch(`${BASE}${url}`, { method: "GET", redirect: "manual" });
    const ok = r.status === 200;
    results.push({ url, status: r.status, ok });
    if (ok) pass++;
    else fail++;
    console.log(`${ok ? "✓" : "✗"} ${url.padEnd(48)} ${r.status}`);
  } catch (e) {
    results.push({ url, status: 0, ok: false, error: e.message });
    fail++;
    console.log(`✗ ${url.padEnd(48)} ERROR ${e.message}`);
  }
}

console.log(`\nResult: ${pass}/${ROUTES.length} passed, ${fail} failed`);

// Spot-check homepage for the SEO H1 (sr-only) and a couple of JSON-LD types
console.log("\n── Homepage SEO spot-checks ──");
const homepageHtml = await fetch(`${BASE}/`).then((r) => r.text());
const has = (re) => re.test(homepageHtml);
const checks = {
  "sr-only SEO H1": has(/sr-only[^>]*>Yoga.*Pilates Studio Management Software/i),
  "Organization schema": has(/"@type":\s*"Organization"/),
  "SoftwareApplication schema": has(/"@type":\s*"SoftwareApplication"/),
  "FAQPage schema (homepage)": has(/"@type":\s*"FAQPage"/),
  "New title tag": has(/<title>Yoga &amp; Pilates Studio Management Software/i),
  "New nav links (Yoga)": has(/href="\/yoga-studio-software"/),
  "New nav links (Pilates)": has(/href="\/pilates-studio-software"/),
  "New nav links (vs Mindbody)": has(/href="\/vs-mindbody"/),
};
for (const [name, ok] of Object.entries(checks)) {
  console.log(`  ${ok ? "✓" : "✗"} ${name}`);
}

// Sitemap content
console.log("\n── Sitemap content ──");
const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
const urls = (sitemap.match(/<loc>[^<]+<\/loc>/g) || []).length;
console.log(`  ${urls} URLs in sitemap`);
const required = [
  "/yoga-studio-software",
  "/pilates-studio-software",
  "/vs-mindbody",
  "/pricing",
  "/blog",
];
for (const path of required) {
  const present = sitemap.includes(`<loc>https://www.yogateacherapp.com${path}</loc>`);
  console.log(`  ${present ? "✓" : "✗"} ${path}`);
}

writeFileSync(
  resolve(outDir, "report.json"),
  JSON.stringify({ results, checks, sitemapUrls: urls }, null, 2),
);

process.exit(fail === 0 ? 0 : 1);
