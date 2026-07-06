import { chromium } from "playwright-core";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.env.QA_URL || "http://localhost:3000";

async function run(width, height, label) {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  await page.waitForSelector('[data-name="Section - What denker can do?"]', { timeout: 30_000 });
  await page.evaluate(() => {
    document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({ block: "start" });
    window.scrollBy(0, -80);
  });
  await page.waitForTimeout(500);

  // Click dot 2 (slide index 1) via JS dispatch to avoid interception issues
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Go to slide 2"]');
    btn?.click();
  });
  // Wait past SUMMARY_DEMO_MOTION_MS (4600ms) so summaryDemoCompleted flips
  // true and the CSS final-state override (transform:none) actually applies,
  // but before the DEMO_FINAL_HOLD_MS (500ms) advance to slide index 2.
  await page.waitForTimeout(4850);

  const card = await page.evaluateHandle(() => {
    const cards = document.querySelectorAll("[data-denker-feature-card]");
    return cards[1];
  });
  const cardBox = await card.asElement()?.boundingBox();

  const selectors = [
    "p.what-denker-feature-copy",
    ".what-denker-summary-browser",
    ".what-denker-summary-frame",
    ".what-denker-summary-bubble-writing",
    ".what-denker-summary-bubble-done",
  ];

  const rows = [];
  for (const sel of selectors) {
    const scoped = await card.asElement()?.$(sel);
    const el = scoped || (await page.$(sel));
    if (!el) {
      rows.push({ sel, missing: true });
      continue;
    }
    const box = await el.boundingBox();
    if (!box || !cardBox) {
      rows.push({ sel, missing: true });
      continue;
    }
    const xPct = ((box.x - cardBox.x) / cardBox.width) * 100;
    const yPct = ((box.y - cardBox.y) / cardBox.height) * 100;
    const wPct = (box.width / cardBox.width) * 100;
    const hPct = (box.height / cardBox.height) * 100;
    rows.push({
      sel,
      xPx: box.x - cardBox.x,
      yPx: box.y - cardBox.y,
      wPx: box.width,
      hPx: box.height,
      x: xPct.toFixed(2),
      y: yPct.toFixed(2),
      w: wPct.toFixed(2),
      h: hPct.toFixed(2),
      bottom: (yPct + hPct).toFixed(2),
      bottomPx: (box.y - cardBox.y + box.height).toFixed(1),
    });
  }

  // Also measure slide 1 (index 0)'s copy top for comparison
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Go to slide 1"]');
    btn?.click();
  });
  await page.waitForTimeout(600);
  const card0 = await page.evaluateHandle(() => document.querySelectorAll("[data-denker-feature-card]")[0]);
  const card0Box = await card0.asElement()?.boundingBox();
  const copy0 = await card0.asElement()?.$("p.what-denker-feature-copy");
  const copy0Box = copy0 ? await copy0.boundingBox() : null;
  let slide0CopyTopPct = null;
  if (copy0Box && card0Box) {
    slide0CopyTopPct = (((copy0Box.y - card0Box.y) / card0Box.height) * 100).toFixed(2);
  }

  console.log(`\n=== ${label} (${width}x${height}) ===`);
  console.log(`card: ${cardBox ? `${cardBox.width.toFixed(1)}x${cardBox.height.toFixed(1)}` : "n/a"}`);
  for (const r of rows) {
    if (r.missing) {
      console.log(`  ${r.sel}: MISSING`);
    } else {
      console.log(
        `  ${r.sel}: top=${r.y}% (${r.yPx.toFixed(1)}px) left=${r.x}% w=${r.w}% h=${r.h}% bottom=${r.bottom}% (${r.bottomPx}px)`
      );
    }
  }
  console.log(`  slide0 copy top: ${slide0CopyTopPct}%`);

  await browser.close();
}

const width = Number(process.argv[2] || 1440);
const height = Number(process.argv[3] || 900);
await run(width, height, `${width}x${height}`);
