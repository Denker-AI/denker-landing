import { chromium } from "playwright-core";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.env.QA_URL || "http://localhost:3000";

const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.goto(url, { waitUntil: "load", timeout: 60_000 });
await page.waitForSelector('[data-name="Section - What denker can do?"]', { timeout: 30_000 });
await page.evaluate(() => {
  document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(600);

for (let i = 1; i <= 5; i++) {
  // Re-scroll the section into view each iteration (defensive against any
  // layout/scroll drift across iterations).
  await page.evaluate(() => {
    document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(150);

  await page.evaluate((idx) => {
    document.querySelector(`button[aria-label="Go to slide ${idx}"]`)?.click();
  }, i);
  await page.waitForTimeout(250);

  const pauseState = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Pause carousel"]');
    if (btn) {
      btn.click();
      return "paused-from-playing";
    }
    return "already-paused-or-hidden";
  });
  await page.waitForTimeout(700);

  const state = await page.evaluate((idx) => {
    const card = document.querySelectorAll("[data-denker-feature-card]")[idx - 1];
    const layer = card?.querySelector(
      ".what-denker-motion-layer, .what-denker-taskboard-shell, .what-denker-memory-shell"
    );
    return {
      dataActive: layer?.getAttribute("data-active"),
      motionState: layer?.getAttribute("data-motion-state"),
      layerClass: layer?.className,
    };
  }, i);

  await page.waitForTimeout(100);
  await page.screenshot({ path: `tmp/qa/final-state-slide${i}.png` });
  console.log(`Saved slide ${i} (${pauseState})`, state);
}

await browser.close();
