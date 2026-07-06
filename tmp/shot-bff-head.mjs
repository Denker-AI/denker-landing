import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = process.env.OUT;
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
for (let y = 0; y < 6000; y += 400) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(110); }
await page.evaluate(() => document.querySelector("[data-name='Section - Built for Founders & Product Builders']")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(700);
const introW = await page.evaluate(() => {
  const p = [...document.querySelectorAll("p")].find(x=>/wear every hat/i.test(x.textContent||""));
  return p ? Math.round(p.getBoundingClientRect().width) : null;
});
console.log("intro width:", introW);
await page.screenshot({ path: `${OUT}/bff-head-wide.png`, clip: { x: 0, y: 0, width: 1440, height: 520 } });
await browser.close();
