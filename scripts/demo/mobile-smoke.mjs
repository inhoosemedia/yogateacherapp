/**
 * Quick mobile-viewport smoke test against a live URL. Captures key screens
 * at 390x844 (iPhone 13/14 size) so we can eyeball mobile responsiveness.
 *
 * Usage: node scripts/demo/mobile-smoke.mjs [appUrl]
 */
import { chromium, devices } from "playwright";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const APP_URL = process.argv[2] || "https://www.yogateacherapp.com";
const OUT = path.resolve("demo-output/mobile");

if (existsSync(OUT)) await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  ...devices["iPhone 13"],
  // Force-set deviceScaleFactor=2 for crisper screenshots
});
const page = await ctx.newPage();
page.setDefaultTimeout(20_000);

const shot = async (label, opts = {}) => {
  await page.waitForTimeout(opts.settle ?? 600);
  await page.screenshot({
    path: path.join(OUT, `${label}.png`),
    fullPage: opts.fullPage ?? false,
  });
  console.log(`  📸 ${label}`);
};

console.log("Mobile smoke test against", APP_URL);

// Landing
await page.goto(`${APP_URL}/`, { waitUntil: "networkidle" });
await shot("01-landing-hero");
await page.evaluate(() => window.scrollTo({ top: 1200 }));
await shot("02-landing-features");
await page.evaluate(() => window.scrollTo({ top: 0 }));

// Sign-up flow
await page.goto(`${APP_URL}/sign-up`, { waitUntil: "networkidle" });
await shot("03-sign-up-blank");
await page.locator("#name").fill("Test Mobile");
await page.locator("#email").fill(`mobile-${Date.now()}@example.test`);
await page.locator("#password").fill("MobileTest1234");
await shot("04-sign-up-filled");
// Click the submit button (but don't actually create a real user)
const btn = page.locator('button[type="submit"]');
const btnVisible = await btn.isVisible();
const btnEnabled = await btn.isEnabled();
console.log(`  Submit button visible=${btnVisible} enabled=${btnEnabled}`);

// Sign-in
await page.goto(`${APP_URL}/sign-in`, { waitUntil: "networkidle" });
await shot("05-sign-in");

// Forgot password
await page.goto(`${APP_URL}/forgot-password`, { waitUntil: "networkidle" });
await shot("06-forgot-password");

await ctx.close();
await browser.close();
console.log(`\n✓ Mobile screenshots in ${OUT}`);
