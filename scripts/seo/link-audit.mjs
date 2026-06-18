// SEO internal-link audit. Walks app/ + lib/ + components/ for every file,
// counts how often each commercial-page target appears as href, and prints
// any that have fewer than 3 internal links pointing at them.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const targets = [
  // Commercial category pages
  "/yoga-studio-software",
  "/pilates-studio-software",
  // Feature pages
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
  // Competitor pages
  "/vs-mindbody",
  "/vs-momence",
  "/vs-wellnessliving",
  "/vs-vagaro",
  "/vs-glofox",
  // Other commercial
  "/pricing",
  "/blog",
  "/customers",
];

function walk(dir) {
  const out = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) out.push(...walk(full));
      else if (
        entry.endsWith(".tsx") ||
        entry.endsWith(".ts") ||
        entry.endsWith(".mdx")
      )
        out.push(full);
    }
  } catch {
    // dir doesn't exist; skip
  }
  return out;
}

const root = process.cwd();
const files = [
  ...walk(resolve(root, "app")),
  ...walk(resolve(root, "components")),
  ...walk(resolve(root, "lib")),
];

const linkCount = Object.fromEntries(targets.map((t) => [t, 0]));
const sourcesByTarget = Object.fromEntries(targets.map((t) => [t, []]));
for (const f of files) {
  const content = readFileSync(f, "utf-8");
  const rel = f.replace(root + "\\", "").replace(root + "/", "");
  for (const t of targets) {
    // Match the target only when surrounded by quote characters so we don't
    // over-count partial matches like /yoga-studio-software-uk.
    const re = new RegExp(`["'\`]${t.replaceAll("/", "\\/")}["'\`]`, "g");
    const matches = content.match(re) || [];
    // Don't count self-links (a page linking to itself is not "internal" for
    // audit purposes — every page would otherwise pass trivially).
    if (rel.includes(t.slice(1).replaceAll("/", "\\")) || rel.includes(t.slice(1))) {
      // Subtract self-links: a page about /yoga-studio-software at
      // app/yoga-studio-software/page.tsx shouldn't credit itself.
      continue;
    }
    if (matches.length > 0) {
      linkCount[t] += matches.length;
      sourcesByTarget[t].push(`${rel} (${matches.length})`);
    }
  }
}

const MIN = 3;
console.log("── Internal-link audit ──\n");
const fails = [];
for (const [t, n] of Object.entries(linkCount)) {
  const flag = n < MIN ? "⚠️" : "✓";
  console.log(`  ${flag} ${t.padEnd(35)} ${n} links`);
  if (n < MIN) fails.push({ target: t, count: n });
}

if (fails.length) {
  console.log("\n── Below threshold (need at least " + MIN + ") ──");
  for (const f of fails) {
    console.log(`\n  ${f.target} — ${f.count} links`);
    if (sourcesByTarget[f.target].length > 0) {
      console.log("    sources:");
      for (const s of sourcesByTarget[f.target]) console.log(`      - ${s}`);
    }
  }
  process.exit(1);
}

console.log("\nAll commercial pages have ≥ " + MIN + " internal links pointing at them.");
