// E2E test of the "skip the trial, subscribe now" path.
//
// /pricing → click "subscribe now" link → /sign-up?returnTo=… →
// /onboarding?next=… → /billing?subscribe=studio → checkout.stripe.com

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../../tmp/buy-now-e2e");
mkdirSync(outDir, { recursive: true });

const BASE = "https://www.yogateacherapp.com";
const STAMP = Date.now().toString(36);
const TEST_EMAIL = `test+buynow-${STAMP}@example.com`;
const TEST_PASSWORD = "TestPass#" + randomBytes(4).toString("hex");
const STUDIO_NAME = `BuyNow ${STAMP}`;

console.log("Target:", BASE);
console.log("Email:", TEST_EMAIL);
console.log("Studio:", STUDIO_NAME);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const report = [];
function check(name, ok, detail = "") {
  report.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

// 1. Visit /pricing
console.log("\n[1] Open /pricing");
await page.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
await page.screenshot({ path: resolve(outDir, "01-pricing.png") });

// 2. Find the "skip the trial, subscribe now" link on the Studio plan
const link = page.locator("a", { hasText: /skip the trial.*subscribe now/i }).first();
const linkCount = await page.locator("a", { hasText: /skip the trial.*subscribe now/i }).count();
check("'skip trial, subscribe now' link exists on pricing", linkCount >= 1, `${linkCount} found`);

if (linkCount < 1) {
  await browser.close();
  process.exit(1);
}

await link.click();
await page.waitForURL(/\/sign-up/, { timeout: 15000 });
check("redirected to /sign-up with returnTo", page.url().includes("returnTo"), page.url().slice(0, 100));
await page.screenshot({ path: resolve(outDir, "02-signup.png") });

// 3. Fill sign-up
console.log("\n[2] Sign up");
await page.fill("#name", "BuyNow Tester");
await page.fill("#email", TEST_EMAIL);
await page.fill("#password", TEST_PASSWORD);
await page.click('button[type="submit"]');
// Wait specifically for /onboarding pathname (not regex that matches in query)
await page.waitForURL((url) => url.pathname === "/onboarding", { timeout: 30000 });
check("redirected to /onboarding (not /dashboard)", page.url().includes("/onboarding"));
// Hydration + SSR settle
await page.waitForTimeout(1500);
await page.screenshot({ path: resolve(outDir, "03-onboarding.png") });

// 4. Onboarding should show the sage callout + a different button label
const calloutVisible = await page
  .locator("text=Subscribing now")
  .count();
check("onboarding shows 'Subscribing now' callout", calloutVisible >= 1);

const buttonText = await page.locator("button[type=submit]").innerText();
check(
  "submit button reads 'continue to checkout' or similar",
  /continue to checkout/i.test(buttonText),
  buttonText,
);

// 5. Fill studio + submit
console.log("\n[3] Create studio");
await page.fill("#name", STUDIO_NAME);
await page.click('button[type="submit"]');

// 6. Should redirect to /billing?subscribe=studio, then auto-fire and land on Stripe
console.log("\n[4] Auto-redirect to Stripe Checkout");
try {
  await page.waitForURL(/checkout\.stripe\.com/, {
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });
  check(
    "auto-redirected to checkout.stripe.com",
    page.url().includes("checkout.stripe.com"),
    page.url().slice(0, 100),
  );
  await page.waitForTimeout(2000);
  await page.screenshot({ path: resolve(outDir, "04-stripe-checkout.png") });
} catch (e) {
  check("auto-redirect to Stripe", false, `failed: ${e.message}`);
  await page.screenshot({ path: resolve(outDir, "04-failed.png") });
  console.log("Current URL:", page.url());
}

await browser.close();

const pass = report.filter((r) => r.ok).length;
const fail = report.length - pass;
console.log(`\n${pass} / ${report.length} pass`);
process.exit(fail === 0 ? 0 : 1);
