/**
 * Playwright screenshot tour. Walks through every major screen of YogaTeacher
 * in narrative order at 1920×1080, signing in as the demo owner created by
 * scripts/demo/seed.mts. Output: demo-output/screenshots/NN-name.png
 *
 * Run AFTER the dev server is up and the seeder has populated the demo studio.
 */

import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const APP_URL = process.env.DEMO_APP_URL || "http://localhost:3300";
const STUDIO_SLUG = "demo-sunrise-yoga";
const OWNER_EMAIL = "demo-owner@yogateacherapp.dev";
const OWNER_PASSWORD = "DemoYoga2026!";

const OUT_DIR = path.resolve("demo-output/screenshots");

let shotIndex = 0;
async function shot(page, label, opts = {}) {
  shotIndex++;
  const num = String(shotIndex).padStart(3, "0");
  const file = path.join(OUT_DIR, `${num}-${label}.png`);
  await page.waitForTimeout(opts.settle ?? 600);
  await page.screenshot({ path: file, fullPage: opts.fullPage ?? false });
  console.log(`  📸 ${num}-${label}.png`);
}

async function scrollTo(page, y) {
  await page.evaluate((target) => window.scrollTo({ top: target }), y);
  await page.waitForTimeout(400);
}

async function setup() {
  if (existsSync(OUT_DIR)) {
    await rm(OUT_DIR, { recursive: true, force: true });
  }
  await mkdir(OUT_DIR, { recursive: true });
}

/**
 * Navigate using direct URL — avoids the Next.js client-side router cache that
 * sometimes serves a stale page after sign-in.
 */
async function gotoFresh(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
}

/**
 * Sign in by submitting the form and waiting for the dashboard URL — using a
 * pathname-only check so the `?returnTo=/dashboard` query doesn't false-match.
 */
async function signIn(page) {
  await page.goto(`${APP_URL}/sign-in`, { waitUntil: "networkidle" });
  await page.locator("input#email").fill(OWNER_EMAIL);
  await page.locator("input#password").fill(OWNER_PASSWORD);
  await Promise.all([
    page.waitForURL(
      (url) => url.pathname === "/dashboard" && !url.search.includes("returnTo"),
      { timeout: 25_000 },
    ),
    page.locator('button[type="submit"]').click(),
  ]);
  await page.waitForLoadState("networkidle");
  // Wait for an actual dashboard element to confirm render.
  await page
    .getByText(/Good (morning|afternoon|evening)/i)
    .first()
    .waitFor({ timeout: 15_000 });
}

async function tour() {
  await setup();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    colorScheme: "light",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);

  // ─── [1] Marketing ────────────────────────────────────────────
  console.log("\n[1/4] Marketing pages…");
  await gotoFresh(page, `${APP_URL}/`);
  await page.waitForTimeout(800);
  await shot(page, "landing-hero");
  await scrollTo(page, 1100);
  await shot(page, "landing-features");
  await scrollTo(page, 2400);
  await shot(page, "landing-schedule-showcase");
  await scrollTo(page, 3500);
  await shot(page, "landing-roster-showcase");
  await scrollTo(page, 4800);
  await shot(page, "landing-pricing");
  await scrollTo(page, 6000);
  await shot(page, "landing-comparison");

  await gotoFresh(page, `${APP_URL}/sign-up`);
  await shot(page, "sign-up");
  await gotoFresh(page, `${APP_URL}/sign-in`);
  await shot(page, "sign-in");

  // ─── [2] Public booking (no auth) ─────────────────────────────
  console.log("\n[2/4] Public booking pages…");
  await gotoFresh(page, `${APP_URL}/book/${STUDIO_SLUG}`);
  await shot(page, "public-schedule");

  const firstClassLink = page
    .locator(`a[href^="/book/${STUDIO_SLUG}/"]`)
    .filter({ hasNotText: "" })
    .first();
  if (await firstClassLink.count()) {
    await firstClassLink.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    await shot(page, "public-class-detail");
  }

  await gotoFresh(page, `${APP_URL}/book/${STUDIO_SLUG}/packages`);
  await shot(page, "public-packages");

  // ─── [3] Owner dashboard ──────────────────────────────────────
  console.log("\n[3/4] Owner dashboard…");
  await signIn(page);
  await page.waitForTimeout(1500);
  await shot(page, "dashboard-home", { settle: 600 });

  await gotoFresh(page, `${APP_URL}/dashboard/members`);
  await page.waitForTimeout(800);
  await shot(page, "dashboard-members");

  // First member detail — click the avatar/name link in the table
  const firstMember = page
    .locator('table a[href^="/dashboard/members/"]')
    .first();
  if (await firstMember.count()) {
    await firstMember.click();
    await page.waitForURL(/\/dashboard\/members\/[^/?]+$/, { timeout: 10_000 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);
    await shot(page, "dashboard-member-detail");
  }

  await gotoFresh(page, `${APP_URL}/dashboard/classes?view=week`);
  await page.waitForTimeout(800);
  await shot(page, "dashboard-week-grid");

  await gotoFresh(page, `${APP_URL}/dashboard/classes?view=list&filter=upcoming`);
  await shot(page, "dashboard-list-view");

  // First upcoming class detail (the seeded "full" one with waitlist).
  // Filter to hrefs that have a slug after /dashboard/classes/ — the toggle
  // link "/dashboard/classes?view=list..." would otherwise match.
  const firstClass = page
    .locator('a[href*="/dashboard/classes/"]:not([href*="?"])')
    .first();
  if (await firstClass.count()) {
    await firstClass.click();
    await page.waitForURL(/\/dashboard\/classes\/[^/?]+$/, { timeout: 15_000 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(700);
    await shot(page, "dashboard-class-detail");
    await scrollTo(page, 600);
    await shot(page, "dashboard-class-detail-waitlist");
  }

  await gotoFresh(page, `${APP_URL}/dashboard/class-types`);
  await shot(page, "dashboard-class-types");
  await gotoFresh(page, `${APP_URL}/dashboard/instructors`);
  await shot(page, "dashboard-instructors");
  await gotoFresh(page, `${APP_URL}/dashboard/packages`);
  await shot(page, "dashboard-packages");
  await gotoFresh(page, `${APP_URL}/dashboard/reports`);
  await shot(page, "dashboard-reports");

  await gotoFresh(page, `${APP_URL}/dashboard/settings`);
  await shot(page, "settings-hub");
  await gotoFresh(page, `${APP_URL}/dashboard/settings/team`);
  await shot(page, "settings-team");
  await gotoFresh(page, `${APP_URL}/dashboard/settings/notifications`);
  await shot(page, "settings-notifications");
  await gotoFresh(page, `${APP_URL}/dashboard/settings/payments`);
  await shot(page, "settings-payments-razorpay");
  // Stripe tab — the toggle button uses pill style with text "Stripe ✓" or
  // "Stripe ". Match the second pill button (after the Razorpay one).
  const stripeTab = page
    .locator(
      'button:has-text("Stripe"):not(:has-text("Save")):not(:has-text("Use"))',
    )
    .first();
  if (await stripeTab.count()) {
    await stripeTab.click();
    await page.waitForTimeout(700);
    await shot(page, "settings-payments-stripe");
  }

  // ─── [4] Super admin ─────────────────────────────────────────
  console.log("\n[4/4] Super admin console…");
  await gotoFresh(page, `${APP_URL}/admin`);
  await shot(page, "admin-overview");
  await gotoFresh(page, `${APP_URL}/admin/studios`);
  await shot(page, "admin-studios");
  await gotoFresh(page, `${APP_URL}/admin/users`);
  await shot(page, "admin-users");
  await gotoFresh(page, `${APP_URL}/admin/settings`);
  await shot(page, "admin-api-keys-top");
  await scrollTo(page, 600);
  await shot(page, "admin-api-keys-mid");
  await scrollTo(page, 1400);
  await shot(page, "admin-api-keys-bottom");

  await context.close();
  await browser.close();
  console.log(`\n✓ ${shotIndex} screenshots written to ${OUT_DIR}`);
}

tour().catch((e) => {
  console.error("Tour failed:", e);
  process.exit(1);
});
