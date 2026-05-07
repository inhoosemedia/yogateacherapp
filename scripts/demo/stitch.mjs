/**
 * Stitches numbered PNG screenshots into an MP4 slideshow with crossfades.
 *
 * Each frame is shown for SHOT_DUR seconds, with FADE_DUR seconds of crossfade
 * between consecutive frames. Output: demo-output/yogateacher-demo.mp4
 *
 * Usage: node scripts/demo/stitch.mjs
 */

import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";

const SHOTS_DIR = path.resolve("demo-output/screenshots");
const OUT_FILE = path.resolve("demo-output/yogateacher-demo.mp4");

// Per-frame display time (after the fade lands, the image is visible for
// SHOT_DUR - FADE_DUR seconds at full opacity; for the last frame, full SHOT_DUR).
const SHOT_DUR = 4.0;
const FADE_DUR = 0.5;

async function main() {
  const files = (await readdir(SHOTS_DIR))
    .filter((f) => f.endsWith(".png"))
    .sort();
  if (files.length === 0) {
    console.error("No screenshots found in", SHOTS_DIR);
    process.exit(1);
  }
  console.log(`Stitching ${files.length} frames @ ${SHOT_DUR}s each…`);

  const args = [];
  // Each input is the same image looped to SHOT_DUR seconds.
  for (const f of files) {
    args.push("-loop", "1", "-t", String(SHOT_DUR), "-i", path.join(SHOTS_DIR, f));
  }

  // Build the xfade filter chain: [0][1]xfade=offset=(SHOT_DUR-FADE_DUR)
  // → [v0]; [v0][2]xfade=offset=(2*SHOT_DUR-2*FADE_DUR) → [v1]; …
  let filter = "";
  let prev = "[0:v]";
  let cumulative = SHOT_DUR;
  for (let i = 1; i < files.length; i++) {
    const offset = (cumulative - FADE_DUR).toFixed(3);
    const out = i === files.length - 1 ? "[vout]" : `[v${i}]`;
    filter += `${prev}[${i}:v]xfade=transition=fade:duration=${FADE_DUR}:offset=${offset}${out};`;
    prev = out;
    cumulative += SHOT_DUR - FADE_DUR;
  }
  // Standardise pixel format + scale (already 1920×1080 from Playwright but be explicit).
  filter += `[vout]scale=1920:1080,format=yuv420p,fps=30[vfinal]`;

  args.push(
    "-filter_complex",
    filter,
    "-map",
    "[vfinal]",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "20",
    "-movflags",
    "+faststart",
    "-y",
    OUT_FILE,
  );

  const child = spawn("ffmpeg", args, { stdio: "inherit" });
  await new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with ${code}`));
    });
    child.on("error", reject);
  });
  console.log(`\n✓ Demo video written to ${OUT_FILE}`);
}

main().catch((e) => {
  console.error("Stitch failed:", e);
  process.exit(1);
});
