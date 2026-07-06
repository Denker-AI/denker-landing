import { chromium } from "playwright-core";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForSelector('[data-name="Section - What denker can do?"]');
await page.evaluate(() => {
  document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(500);
await page.getByRole("button", { name: "Go to slide 1" }).click();
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const cards = [...document.querySelectorAll("[data-denker-feature-card]")];
  return cards.map((c, idx) => {
    const rect = c.getBoundingClientRect();
    const layer = c.querySelector(".what-denker-motion-layer");
    return {
      idx,
      x: rect.x,
      width: rect.width,
      dataActive: layer?.getAttribute("data-active"),
      dataMotionState: layer?.getAttribute("data-motion-state"),
    };
  });
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
