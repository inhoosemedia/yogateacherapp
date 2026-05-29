// Drive a real browser against the live site, flip the next-themes class on
// <html>, screenshot before/after. Verifies the CSS custom-property override
// block in .dark actually changes the rendered colours.

import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../../tmp/theme-smoke");
mkdirSync(outDir, { recursive: true });

const URL = "https://www.yogateacherapp.com/";
const REPORT = {};

async function runOnce({ name, viewport, deviceScale }) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: deviceScale ?? 1,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });

  // Light baseline
  const bgLight = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  const fgLight = await page.evaluate(
    () => getComputedStyle(document.body).color,
  );
  const isDarkBefore = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.screenshot({
    path: resolve(outDir, `${name}-light.png`),
    fullPage: false,
  });

  // Flip next-themes via localStorage + class — this is exactly what the
  // ModeToggle button does, just without clicking the button (the button
  // only exists on /dashboard which would need auth).
  await page.evaluate(() => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  });
  await page.waitForTimeout(200); // let computed styles settle
  const bgDark = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  const fgDark = await page.evaluate(
    () => getComputedStyle(document.body).color,
  );
  const isDarkAfter = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.screenshot({
    path: resolve(outDir, `${name}-dark.png`),
    fullPage: false,
  });

  // Reload with localStorage already set — should come up dark with no flash
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(200);
  const bgReload = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  const isDarkReload = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.screenshot({
    path: resolve(outDir, `${name}-dark-reload.png`),
    fullPage: false,
  });

  REPORT[name] = {
    light: { bg: bgLight, fg: fgLight, hadDarkClass: isDarkBefore },
    dark: { bg: bgDark, fg: fgDark, hadDarkClass: isDarkAfter },
    reload: { bg: bgReload, hadDarkClass: isDarkReload },
  };

  await browser.close();
}

await runOnce({ name: "desktop", viewport: { width: 1280, height: 800 } });
await runOnce({
  name: "mobile",
  viewport: { width: 390, height: 844 },
  deviceScale: 2,
});

const passes = [];
const fails = [];
for (const [name, r] of Object.entries(REPORT)) {
  console.log("\n--", name, "--");
  console.log("  light bg:", r.light.bg, "fg:", r.light.fg);
  console.log("  dark  bg:", r.dark.bg, "fg:", r.dark.fg);
  console.log("  reload bg:", r.reload.bg, "darkClass:", r.reload.hadDarkClass);
  if (r.light.bg !== r.dark.bg) passes.push(`${name}: bg changed`);
  else fails.push(`${name}: bg unchanged (${r.light.bg})`);
  if (r.light.fg !== r.dark.fg) passes.push(`${name}: fg changed`);
  else fails.push(`${name}: fg unchanged (${r.light.fg})`);
  if (r.reload.hadDarkClass) passes.push(`${name}: dark persists across reload`);
  else fails.push(`${name}: dark did not persist across reload`);
}

writeFileSync(
  resolve(outDir, "report.json"),
  JSON.stringify(REPORT, null, 2),
);

console.log("\nPASSES:");
for (const p of passes) console.log(" ✓", p);
if (fails.length) {
  console.log("\nFAILS:");
  for (const f of fails) console.log(" ✗", f);
  process.exit(1);
}
console.log("\nAll checks passed. Screenshots in", outDir);
