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
const info = await page.evaluate(() => {
  const section = document.querySelector('[data-name="Section - What denker can do?"]');
  const rect = section.getBoundingClientRect();
  return { scrollY: window.scrollY, sectionRect: rect, innerHeight: window.innerHeight };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
