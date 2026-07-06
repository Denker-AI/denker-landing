import { chromium } from "playwright-core";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = "http://localhost:3000";

const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
await page.waitForSelector('[data-name="Section - What denker can do?"]');
await page.evaluate(() => {
  document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(400);

const dot = page.getByRole("button", { name: "Go to slide 1" });
await dot.click();
await page.waitForTimeout(6000);

const info = await page.evaluate(() => {
  const el = document.querySelector(".what-denker-motion-browser");
  const layer = document.querySelector(".what-denker-motion-layer");
  const cs = getComputedStyle(el);
  const box = el.getBoundingClientRect();
  const card = document.querySelectorAll("[data-denker-feature-card]")[0].getBoundingClientRect();
  return {
    dataMotionState: layer?.getAttribute("data-motion-state"),
    dataActive: layer?.getAttribute("data-active"),
    top: cs.top,
    transform: cs.transform,
    animation: cs.animationName,
    box,
    card,
    yPct: ((box.y - card.y) / card.height) * 100,
    hPct: (box.height / card.height) * 100,
  };
});
console.log(JSON.stringify(info, null, 2));

await browser.close();
