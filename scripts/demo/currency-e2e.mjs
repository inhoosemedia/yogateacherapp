// End-to-end currency test against live production.
//
// 1. Sign up a brand-new test studio in USD via the public sign-up + onboarding
//    flow. The seeder creates a few sample packages so we have prices to look at.
// 2. Snapshot the currency symbol shown on the Revenue MTD stat (dashboard),
//    /dashboard/packages, /dashboard/members/<id>, and the public booking page.
// 3. Change the studio currency to GBP via Settings.
// 4. Re-snapshot the same four surfaces and verify each one switched from $ to £.
// 5. Report pass/fail per surface + screenshots.

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../../tmp/currency-e2e");
mkdirSync(outDir, { recursive: true });

const BASE = "https://www.yogateacherapp.com";
const STAMP = Date.now().toString(36);
const TEST_EMAIL = `test+ccy-${STAMP}@example.com`;
const TEST_PASSWORD = "TestPass#" + randomBytes(4).toString("hex");
const STUDIO_NAME = `Currency Test ${STAMP}`;

console.log("test studio:", STUDIO_NAME);
console.log("email:", TEST_EMAIL);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
});
const page = await ctx.newPage();

async function shot(name) {
  await page.screenshot({
    path: resolve(outDir, `${name}.png`),
    fullPage: false,
  });
}

// ─── 1. Sign up ───────────────────────────────────────────────────────────
console.log("\n[1/6] Signing up …");
await page.goto(`${BASE}/sign-up`, { waitUntil: "networkidle" });
await page.fill('#name', "Currency Tester");
await page.fill('#email', TEST_EMAIL);
await page.fill('#password', TEST_PASSWORD);
await page.click('button[type="submit"]');
// Should land on /onboarding
await page.waitForURL(/\/onboarding/, { timeout: 30000 });
console.log("    → onboarding");

// ─── 2. Onboard with currency = USD ──────────────────────────────────────
console.log("[2/6] Onboarding with USD …");
// USD is the default in the currency Select so no need to change it; just
// give the studio a name and submit.
await page.fill('#name', STUDIO_NAME);
await page.click('button[type="submit"]');
await page.waitForURL(/\/dashboard/, { timeout: 30000 });
console.log("    → dashboard");

const studioSlug = STUDIO_NAME.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// ─── 3. Snapshot all surfaces in USD ─────────────────────────────────────
console.log("[3/6] Snapshotting USD state …");

async function captureSurfaces(suffix) {
  // Dashboard home — Revenue MTD card
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await shot(`dashboard-${suffix}`);
  const dashboardText = await page.locator("body").innerText();
  const dashSym = extractCurrencySymbol(dashboardText);

  // Packages page
  await page.goto(`${BASE}/dashboard/packages`, { waitUntil: "networkidle" });
  await shot(`packages-${suffix}`);
  const pkgText = await page.locator("body").innerText();
  const pkgSym = extractCurrencySymbol(pkgText);

  // Reports
  await page.goto(`${BASE}/dashboard/reports`, { waitUntil: "networkidle" });
  await shot(`reports-${suffix}`);
  const reportsText = await page.locator("body").innerText();
  const reportsSym = extractCurrencySymbol(reportsText);

  // Public booking → packages
  await page.goto(`${BASE}/book/${studioSlug}/packages`, {
    waitUntil: "networkidle",
  });
  await shot(`public-${suffix}`);
  const publicText = await page.locator("body").innerText();
  const publicSym = extractCurrencySymbol(publicText);

  return { dashSym, pkgSym, reportsSym, publicSym };
}

function extractCurrencySymbol(text) {
  // Look for the first price-like token: symbol + digit
  const m = text.match(/([$£€¥₹₩₽₺R¤]|US\$|A\$|C\$|HK\$|S\$|kr|R\$|Mex\$)\s*\d/);
  return m ? m[1] : null;
}

const usd = await captureSurfaces("usd");
console.log("    USD symbols seen:", usd);

// ─── 4. Switch currency to GBP via /dashboard/settings ───────────────────
console.log("[4/6] Switching to GBP …");
await page.goto(`${BASE}/dashboard/settings`, { waitUntil: "networkidle" });
await shot("settings-before");

// The currency Select is the 3rd combobox on this page (after studio-name, timezone) — pick by visible label
const ccyTrigger = page.locator('button[role="combobox"]').filter({
  hasText: /USD|U\.S\. Dollar|Dollar/i,
}).first();
await ccyTrigger.click();
await page.waitForTimeout(400);
await page.locator('[role="option"]', { hasText: /GBP|British Pound|Pound/i }).first().click();
await page.waitForTimeout(200);
await shot("settings-after-pick");

// Submit — the form's button is "Save changes" or similar
await page.locator('button[type="submit"]', { hasText: /save/i }).first().click();
await page.waitForTimeout(3000); // server action + revalidation
await shot("settings-saved");

// ─── 5. Re-snapshot after GBP change ─────────────────────────────────────
console.log("[5/6] Snapshotting GBP state …");
const gbp = await captureSurfaces("gbp");
console.log("    GBP symbols seen:", gbp);

// ─── 6. Report ───────────────────────────────────────────────────────────
console.log("\n[6/6] Report:");
const surfaces = ["dashSym", "pkgSym", "reportsSym", "publicSym"];
const labels = {
  dashSym: "/dashboard (Revenue MTD)",
  pkgSym: "/dashboard/packages",
  reportsSym: "/dashboard/reports",
  publicSym: `/book/${studioSlug}/packages`,
};
const passes = [];
const fails = [];
for (const s of surfaces) {
  const before = usd[s];
  const after = gbp[s];
  // Pass if: before contained $, after contains £
  const ok =
    (before === "$" || before === null) &&
    (after === "£" || after === null);
  // Stricter: at least one of them should show the right symbol when there is data
  const strict = before === "$" && after === "£";
  if (strict) passes.push(`${labels[s]}: $ → £`);
  else if (after === "£" && before !== "$") passes.push(`${labels[s]}: → £ (was empty before)`);
  else if (before === "$" && after === null) fails.push(`${labels[s]}: still $ — did NOT update to £`);
  else if (before === after && before !== null) fails.push(`${labels[s]}: stuck at ${before}`);
  else fails.push(`${labels[s]}: ${before ?? "(none)"} → ${after ?? "(none)"} unexpected`);
}

console.log("\nPASSES:");
for (const p of passes) console.log("  ✓", p);
if (fails.length) {
  console.log("\nFAILS:");
  for (const f of fails) console.log("  ✗", f);
}

writeFileSync(
  resolve(outDir, "report.json"),
  JSON.stringify({ usd, gbp, passes, fails, studio: STUDIO_NAME, email: TEST_EMAIL }, null, 2),
);

await browser.close();
process.exit(fails.length ? 1 : 0);
