import { chromium } from "playwright-core";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = "http://localhost:3000";

const SETTLE_MS = { 1: 4700, 2: 4700, 3: 4700 };

const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.reload({ waitUntil: "networkidle", timeout: 60000 });
await page.waitForSelector('[data-name="Section - What denker can do?"]');
await page.evaluate(() => {
  document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(400);

for (const i of [1, 2, 3]) {
  await page.getByRole("button", { name: `Go to slide ${i + 1}` }).click();
  await page.waitForTimeout(SETTLE_MS[i]);
  const card = await page.evaluateHandle((idx) => {
    return document.querySelectorAll("[data-denker-feature-card]")[idx];
  }, i);
  await card.asElement().screenshot({ path: `tmp/qa/comp-slide${i}.png` });
}

await browser.close();
console.log("done");
