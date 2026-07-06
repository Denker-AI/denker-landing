import { chromium } from "playwright-core";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.env.QA_URL || "http://localhost:3000";

async function run(width, height) {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  await page.waitForSelector('[data-name="Section - What denker can do?"]', { timeout: 60_000 });
  await page.evaluate(() => {
    document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => document.querySelector('button[aria-label="Go to slide 2"]')?.click());

  const card = await page.evaluateHandle(() => document.querySelectorAll("[data-denker-feature-card]")[1]);

  async function measure(label) {
    const cardBox = await card.asElement()?.boundingBox();
    const selectors = [
      ".what-denker-summary-browser",
      ".what-denker-summary-frame",
      ".what-denker-summary-bubble-writing",
      ".what-denker-summary-bubble-done",
    ];
    console.log(`\n-- ${label} --`);
    console.log(`card: ${cardBox ? `${cardBox.width.toFixed(1)}x${cardBox.height.toFixed(1)}` : "n/a"}`);
    for (const sel of selectors) {
      const el = await card.asElement()?.$(sel);
      if (!el) { console.log(`  ${sel}: MISSING`); continue; }
      const box = await el.boundingBox();
      if (!box || !cardBox) { console.log(`  ${sel}: no box`); continue; }
      const yPct = ((box.y - cardBox.y) / cardBox.height) * 100;
      const hPct = (box.height / cardBox.height) * 100;
      const midPct = yPct + hPct / 2;
      console.log(`  ${sel}: top=${yPct.toFixed(1)}% h=${hPct.toFixed(1)}% bottom=${(yPct+hPct).toFixed(1)}% mid=${midPct.toFixed(1)}%`);
    }
  }

  // mid-demo: bubble-writing visible (~1.5-2s in, before bubble-done phase)
  await page.waitForTimeout(1800);
  await measure("mid-demo (~1.8s)");

  // final state: wait past SUMMARY_DEMO_MOTION_MS
  await page.waitForTimeout(3200); // total ~5s
  await measure("final (~5s)");

  await browser.close();
}

const width = Number(process.argv[2] || 390);
const height = Number(process.argv[3] || 844);
await run(width, height);
