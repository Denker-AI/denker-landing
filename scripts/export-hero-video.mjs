import { mkdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright-core";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.env.HERO_EXPORT_URL || "http://localhost:3000";
const width = Number(process.env.HERO_EXPORT_WIDTH || 2500);
const height = Number(process.env.HERO_EXPORT_HEIGHT || 950);
const fps = Number(process.env.HERO_EXPORT_FPS || 30);
const duration = Number(process.env.HERO_EXPORT_DURATION || 23);
const outFile = resolve(
  process.env.HERO_EXPORT_FILE || "tmp/hero-export/denker-hero.mp4",
);
const frameDir = resolve(process.env.HERO_EXPORT_FRAME_DIR || "tmp/hero-export/frames");
const frameCount = Math.round(duration * fps);

if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
  throw new Error("HERO_EXPORT_WIDTH and HERO_EXPORT_HEIGHT must be positive numbers.");
}

if (!Number.isFinite(fps) || !Number.isFinite(duration) || fps <= 0 || duration <= 0) {
  throw new Error("HERO_EXPORT_FPS and HERO_EXPORT_DURATION must be positive numbers.");
}

await rm(frameDir, { recursive: true, force: true });
await mkdir(frameDir, { recursive: true });
await mkdir(dirname(outFile), { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    `--window-size=${width},${height}`,
  ],
});

try {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForSelector(".hero-production-cinema", { timeout: 30_000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: /stop hero animation/i }).click().catch(() => {});

  await page.addStyleTag({
    content: `
      :root { --hero-export-time: 0ms; }
      *,
      *::before,
      *::after {
        animation-delay: var(--hero-export-time) !important;
        animation-play-state: paused !important;
        transition: none !important;
      }
      .hero-production-playback-control,
      .hero-actions {
        display: none !important;
      }
    `,
  });

  for (let frame = 0; frame < frameCount; frame += 1) {
    const elapsedMs = (frame / fps) * 1000;
    const framePath = join(frameDir, `frame-${String(frame).padStart(4, "0")}.jpg`);

    await page.evaluate((time) => {
      document.documentElement.style.setProperty("--hero-export-time", `-${time}ms`);
    }, elapsedMs.toFixed(3));

    await page.screenshot({
      path: framePath,
      type: "jpeg",
      quality: 94,
      fullPage: false,
    });

    if (frame % fps === 0) {
      process.stdout.write(`Captured ${Math.round(frame / fps)}s / ${duration}s\r`);
    }
  }
} finally {
  await browser.close();
}

process.stdout.write(`Captured ${duration}s / ${duration}s\n`);

const ffmpeg = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-framerate",
    String(fps),
    "-i",
    join(frameDir, "frame-%04d.jpg"),
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outFile,
  ],
  { stdio: "inherit" },
);

if (ffmpeg.error) {
  throw ffmpeg.error;
}

if (ffmpeg.status !== 0) {
  throw new Error(`ffmpeg exited with status ${ffmpeg.status}`);
}

console.log(`Wrote ${outFile}`);
