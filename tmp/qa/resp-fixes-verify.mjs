import { chromium } from "playwright-core";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.env.QA_URL || "http://localhost:3000";

async function scrollSectionIntoView(page) {
  // Programmatic scrollIntoView / window.scrollTo don't reliably move this
  // page's scroll position (something intercepts/clamps native scrollTop
  // assignment); real wheel events do. Wheel-scroll in small increments,
  // checking after each, until the target section's top edge is within the
  // viewport (roughly centered).
  for (let i = 0; i < 40; i++) {
    const rect = await page.evaluate(() => {
      const el = document.querySelector('[data-name="Section - What denker can do?"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, height: r.height, viewportH: window.innerHeight };
    });
    if (!rect) break;
    // Stop once the section's top is at/above viewport center (fully engaged).
    if (rect.top <= rect.viewportH * 0.3 && rect.top > -rect.height * 0.5) break;
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(600);
}

async function gotoSection(page) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector('[data-name="Section - What denker can do?"]', {
    timeout: 30_000,
  });
  await scrollSectionIntoView(page);
}

async function pollUntil(page, fn, { timeoutMs = 90_000, intervalMs = 500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const ok = await page.evaluate(fn);
      if (ok) return;
    } catch (err) {
      // HMR/full-reload from a sibling session editing this tree can blow
      // away the execution context mid-poll; just retry.
      if (!/Execution context was destroyed|Target closed|Target page/.test(err.message)) {
        throw err;
      }
    }
    await page.waitForTimeout(intervalMs);
  }
  throw new Error("pollUntil: condition never became true within " + timeoutMs + "ms");
}

async function waitForTaskboardActive(page) {
  await pollUntil(
    page,
    () => document.querySelector('.what-denker-taskboard-shell[data-active="true"]') !== null,
    { timeoutMs: 60_000 }
  );
  // Give the 4.6s choreography time to reach the "card flies + toast pops"
  // beat (~88% through, per taskboard-toast-pop keyframe).
  await page.waitForTimeout(3600);
}

async function waitForMemoryFinal(page) {
  await pollUntil(
    page,
    () => {
      const el = document.querySelector(".what-denker-graph-motion");
      return !!el && (el.getAttribute("data-motion-state") === "playing" || el.getAttribute("data-motion-state") === "final");
    },
    { timeoutMs: 90_000 }
  );
  // Wait for the panel-in beat (2.3s delay) plus settle time.
  await page.waitForTimeout(2800);
}

async function run() {
  const browser = await chromium.launch({ executablePath: chromePath });

  // FIX A: Taskboard slide (active index 3) at 1280 / 900 / 390
  for (const { width, height, label } of [
    { width: 1280, height: 900, label: "1280" },
    { width: 900, height: 900, label: "900" },
    { width: 390, height: 844, label: "390" },
  ]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await gotoSection(page);
    await waitForTaskboardActive(page);

    const info = await page.evaluate(() => {
      const shell = document.querySelector(".what-denker-taskboard-shell");
      if (!shell) return { found: false };
      const visibleStatuses = Array.from(shell.querySelectorAll("[data-status]"))
        .filter((el) => getComputedStyle(el).display !== "none")
        .map((el) => el.getAttribute("data-status"));
      const researchCursor = shell.querySelector(".taskboard-agent-cursor-research");
      const researchDisplay = researchCursor ? getComputedStyle(researchCursor).display : null;
      const coderCursor = shell.querySelector(".taskboard-agent-cursor-coder");
      const coderDisplay = coderCursor ? getComputedStyle(coderCursor).display : null;
      const movingTask = shell.querySelector(".taskboard-moving-task");
      const movingRect = movingTask ? movingTask.getBoundingClientRect() : null;
      const movingOpacity = movingTask ? getComputedStyle(movingTask).opacity : null;
      const doneCol = shell.querySelector('[data-status="done"]');
      const doneRect = doneCol ? doneCol.getBoundingClientRect() : null;
      const toast = shell.querySelector(".taskboard-toast");
      const toastOpacity = toast ? getComputedStyle(toast).opacity : null;
      return {
        found: true,
        visibleStatuses,
        researchDisplay,
        coderDisplay,
        movingOpacity,
        toastOpacity,
        doneRect: doneRect && { left: doneRect.left, right: doneRect.right },
        movingRect: movingRect && { left: movingRect.left, right: movingRect.right },
        columnWidthVar: getComputedStyle(shell).getPropertyValue("--taskboard-column-width"),
      };
    });
    console.log(`\n[FIX A] width=${label}`, JSON.stringify(info, null, 2));

    await page.screenshot({ path: `tmp/qa/respA-${label}.png` });
    await context.close();
  }

  // FIX B: Memory slide details panel opacity at 1440
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await gotoSection(page);
    await waitForMemoryFinal(page);

    const panelInfo = await page.evaluate(() => {
      const panel = document.querySelector(".what-denker-memory-panel");
      if (!panel) return { found: false };
      const cs = getComputedStyle(panel);
      const wrap = document.querySelector(".what-denker-memory-panel-wrap");
      const wrapOpacity = wrap ? getComputedStyle(wrap).opacity : null;
      return {
        found: true,
        backgroundColor: cs.backgroundColor,
        backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        wrapOpacity,
        classList: panel.className,
      };
    });
    console.log("\n[FIX B] 1440 panel:", JSON.stringify(panelInfo, null, 2));

    await page.screenshot({ path: "tmp/qa/respB-1440.png" });
    await context.close();
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
