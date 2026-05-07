/**
 * One-shot demo orchestrator: starts the dev server on a fixed port, waits
 * for it to be ready, runs the seeder, runs the Playwright tour, kills the
 * dev server, then stitches the screenshots into an MP4.
 *
 * Usage: npm run demo
 */

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = process.env.DEMO_PORT || "3300";
const APP_URL = `http://localhost:${PORT}`;
process.env.DEMO_APP_URL = APP_URL;

function spawnPromise(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: true,
      ...opts,
    });
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`)),
    );
    child.on("error", reject);
  });
}

async function waitForReady(url, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url, {
        signal: AbortSignal.timeout(2000),
      });
      if (r.ok || r.status === 307 || r.status === 308) return true;
    } catch {
      /* not ready */
    }
    await sleep(1000);
  }
  throw new Error(`Server didn't respond at ${url} within ${timeoutMs}ms`);
}

async function main() {
  console.log(`▸ Starting dev server on port ${PORT}…`);
  // Use `next dev` (Turbopack) for fast incremental compilation.
  const dev = spawn("npx", ["next", "dev", "--turbopack", "-p", PORT], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, NEXT_PUBLIC_APP_URL: APP_URL },
  });

  let killed = false;
  const stopDev = () => {
    if (killed) return;
    killed = true;
    try {
      // Windows: taskkill cleans up the entire tree.
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(dev.pid), "/f", "/t"]);
      } else {
        dev.kill("SIGTERM");
      }
    } catch (e) {
      console.warn("Failed to stop dev server:", e);
    }
  };
  process.on("SIGINT", () => {
    stopDev();
    process.exit(130);
  });

  try {
    await waitForReady(APP_URL);
    // Brief grace period for the first compile to complete fully
    await sleep(2000);

    console.log("\n▸ Seeding demo data…");
    await spawnPromise("npx", ["tsx", "scripts/demo/seed.mts"], {
      env: { ...process.env, DEMO_APP_URL: APP_URL },
    });

    console.log("\n▸ Running Playwright tour…");
    await spawnPromise("node", ["scripts/demo/tour.mjs"], {
      env: { ...process.env, DEMO_APP_URL: APP_URL },
    });
  } finally {
    console.log("\n▸ Stopping dev server…");
    stopDev();
    await sleep(1500);
  }

  console.log("\n▸ Stitching video with ffmpeg…");
  await spawnPromise("node", ["scripts/demo/stitch.mjs"]);

  console.log("\n🎬 Done. Open: demo-output/yogateacher-demo.mp4");
}

main().catch((e) => {
  console.error("Demo failed:", e);
  process.exit(1);
});
