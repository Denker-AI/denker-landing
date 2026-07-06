import { chromium } from "playwright-core";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on("console", (m) => console.log("PAGE:", m.text()));
await page.goto("http://localhost:3000", { waitUntil: "load" });
await page.waitForSelector('[data-name="Section - What denker can do?"]');
await page.evaluate(() => document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({block:"start"}));
await page.waitForTimeout(500);

console.log("--- initial ---");
console.log(await page.evaluate(() => {
  const layer = document.querySelector('.what-denker-motion-layer');
  return { dataActive: layer?.getAttribute('data-active'), state: layer?.getAttribute('data-motion-state') };
}));

await page.evaluate(() => document.querySelector('button[aria-label="Pause carousel"]')?.click());
await page.waitForTimeout(200);
console.log("--- after pause click ---");
console.log(await page.evaluate(() => {
  const btn = document.querySelector('.bottom-10 button:last-child');
  return { label: btn?.getAttribute('aria-label') };
}));

await page.evaluate(() => document.querySelector('button[aria-label="Go to slide 1"]')?.click());
await page.waitForTimeout(200);
console.log("--- after click dot1 ---");
console.log(await page.evaluate(() => {
  const layer = document.querySelector('.what-denker-motion-layer');
  const btn = document.querySelector('.bottom-10 button:last-child');
  return { dataActive: layer?.getAttribute('data-active'), state: layer?.getAttribute('data-motion-state'), playLabel: btn?.getAttribute('aria-label') };
}));

await page.evaluate(() => document.querySelector('button[aria-label="Pause carousel"]')?.click());
await page.waitForTimeout(700);
console.log("--- after pause again ---");
console.log(await page.evaluate(() => {
  const layer = document.querySelector('.what-denker-motion-layer');
  const btn = document.querySelector('.bottom-10 button:last-child');
  return { dataActive: layer?.getAttribute('data-active'), state: layer?.getAttribute('data-motion-state'), playLabel: btn?.getAttribute('aria-label') };
}));

await browser.close();
