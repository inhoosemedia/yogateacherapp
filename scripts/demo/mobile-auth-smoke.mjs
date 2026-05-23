/**
 * Authenticated mobile smoke. Signs in as the customer's super admin and
 * captures the dashboard + admin pages so we can verify the burger menu is
 * actually visible at iPhone-13 width.
 *
 * Usage: node scripts/demo/mobile-auth-smoke.mjs <appUrl> <email> <password>
 */
import { chromium, devices } from "playwright";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const APP_URL = process.argv[2];
const EMAIL = process.argv[3];
const PASSWORD = process.argv[4];
if (!APP_URL || !EMAIL || !PASSWORD) {
  console.error(
    "Usage: node scripts/demo/mobile-auth-smoke.mjs <url> <email> <password>",
  );
  process.exit(1);
}

const OUT = path.resolve("demo-output/mobile-auth");
if (existsSync(OUT)) await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();
page.setDefaultTimeout(30_000);

const shot = async (label, opts = {}) => {
  await page.waitForTimeout(opts.settle ?? 600);
  await page.screenshot({
    path: path.join(OUT, `${label}.png`),
    fullPage: opts.fullPage ?? false,
  });
  console.log(`  📸 ${label}`);
};

console.log("Authenticated mobile smoke at", APP_URL);

// Sign in
await page.goto(`${APP_URL}/sign-in`, { waitUntil: "networkidle" });
await shot("01-sign-in");
await page.locator("#email").fill(EMAIL);
await page.locator("#password").fill(PASSWORD);
await Promise.all([
  page.waitForURL(
    (url) =>
      url.pathname === "/dashboard" ||
      url.pathname === "/onboarding" ||
      url.pathname === "/admin",
    { timeout: 30_000 },
  ),
  page.locator('button[type="submit"]').click(),
]);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1200);

// After login — could land at /onboarding if no studio yet, or /dashboard
const url1 = page.url();
console.log("  Landed at:", url1);
await shot("02-after-sign-in");

if (url1.includes("/onboarding")) {
  // Skip onboarding for now — capture and bail to admin
  await page.goto(`${APP_URL}/admin`, { waitUntil: "networkidle" });
  await shot("03-admin-overview");
  // Tap burger
  const burger = page.locator('button[aria-label="Open menu"]');
  if (await burger.count()) {
    await burger.click();
    await page.waitForTimeout(500);
    await shot("04-admin-burger-open");
  } else {
    console.log("  ⚠ burger button not found on /admin");
  }
} else {
  // Dashboard route
  await shot("03-dashboard");
  const burger = page.locator('button[aria-label="Open menu"]');
  if (await burger.count()) {
    await burger.click();
    await page.waitForTimeout(500);
    await shot("04-dashboard-burger-open");
  } else {
    console.log("  ⚠ burger button not found on /dashboard");
  }

  // Admin too
  await page.goto(`${APP_URL}/admin`, { waitUntil: "networkidle" });
  await shot("05-admin-overview");
  const burger2 = page.locator('button[aria-label="Open menu"]');
  if (await burger2.count()) {
    await burger2.click();
    await page.waitForTimeout(500);
    await shot("06-admin-burger-open");
  }
}

await ctx.close();
await browser.close();
console.log(`\n✓ ${OUT}`);
