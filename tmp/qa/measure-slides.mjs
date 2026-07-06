import { chromium } from "playwright-core";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.env.QA_URL || "http://localhost:3000";

const SELECTORS = {
  0: [".what-denker-motion-browser"],
  1: [".what-denker-summary-browser", ".what-denker-summary-frame"],
  2: [".what-denker-gmail-browser"],
  3: [".what-denker-taskboard-shell"],
  4: [".what-denker-memory-shell", ".what-denker-memory-panel-wrap"],
};

async function measureViewport(browser, width, height, label) {
  // Fresh incognito-style context per viewport so we never reuse a stale
  // disk/HTTP cache entry for the CSS chunk across runs.
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await context.route("**/*.css*", (route) =>
    route.continue({ headers: { ...route.request().headers(), "Cache-Control": "no-cache" } })
  );
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  await page.reload({ waitUntil: "load", timeout: 60_000 });
  await page.waitForSelector('[data-name="Section - What denker can do?"]', {
    timeout: 30_000,
  });
  await page.evaluate(() => {
    document
      .querySelector('[data-name="Section - What denker can do?"]')
      ?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(400);

  const results = [];
  // Per-slide "settled" wait: long enough for that slide's own choreography
  // to finish (so components are in their final resting layout), but
  // before the carousel auto-advances to the next slide. Completion times
  // mirror FIRST_DEMO_MOTION_MS / SUMMARY_/GMAIL_/TASKBOARD_DEMO_MOTION_MS /
  // GRAPH_DEMO_MOTION_MS in WhatDenkerCanDo.tsx; auto-advance fires at
  // completion + DEMO_FINAL_HOLD_MS (500ms).
  const SETTLE_MS = { 0: 4300, 1: 4700, 2: 4700, 3: 4700, 4: 3900 };

  for (let i = 0; i < 5; i++) {
    const dot = page.getByRole("button", { name: `Go to slide ${i + 1}` });
    await dot.click();
    await page.waitForTimeout(SETTLE_MS[i]);

    const card = await page.evaluateHandle((idx) => {
      const cards = document.querySelectorAll("[data-denker-feature-card]");
      return cards[idx];
    }, i);
    const cardBox = await card.asElement()?.boundingBox();

    const rows = [];
    for (const sel of SELECTORS[i]) {
      const el = await page.$(sel);
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
        x: xPct.toFixed(1),
        y: yPct.toFixed(1),
        w: wPct.toFixed(1),
        h: hPct.toFixed(1),
        bottom: (yPct + hPct).toFixed(1),
      });
    }

    // Also measure the copy <p> for this slide.
    const copyEl = await card.asElement()?.$("p.what-denker-feature-copy");
    if (copyEl && cardBox) {
      const box = await copyEl.boundingBox();
      if (box) {
        const xPct = ((box.x - cardBox.x) / cardBox.width) * 100;
        const yPct = ((box.y - cardBox.y) / cardBox.height) * 100;
        const wPct = (box.width / cardBox.width) * 100;
        const hPct = (box.height / cardBox.height) * 100;
        rows.push({
          sel: "p.what-denker-feature-copy",
          x: xPct.toFixed(1),
          y: yPct.toFixed(1),
          w: wPct.toFixed(1),
          h: hPct.toFixed(1),
          bottom: (yPct + hPct).toFixed(1),
        });
      }
    }

    results.push({ slide: i, cardBox, rows });
  }

  console.log(`\n=== ${label} (${width}x${height}) ===`);
  for (const r of results) {
    console.log(
      `Slide ${r.slide} — card ${r.cardBox ? `${r.cardBox.width.toFixed(0)}x${r.cardBox.height.toFixed(0)}` : "n/a"}`
    );
    for (const row of r.rows) {
      if (row.missing) {
        console.log(`  ${row.sel}: MISSING`);
      } else {
        console.log(
          `  ${row.sel}: x${row.x} y${row.y} w${row.w} h${row.h} (bottom ${row.bottom})`
        );
      }
    }
  }

  await context.close();
  return results;
}

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});

try {
  await measureViewport(browser, 1440, 900, "Desktop");
  await measureViewport(browser, 390, 844, "Mobile");
} finally {
  await browser.close();
}
