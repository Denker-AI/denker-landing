import { chromium } from "playwright-core";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.goto("http://localhost:3000", { waitUntil: "load" });
await page.waitForSelector('[data-name="Section - What denker can do?"]');
await page.evaluate(() => document.querySelector('[data-name="Section - What denker can do?"]')?.scrollIntoView({block:"start"}));
await page.waitForTimeout(400);
await page.evaluate(() => document.querySelector('button[aria-label="Go to slide 2"]')?.click());
await page.waitForTimeout(5200);
const info = await page.evaluate(() => {
  const el = document.querySelector('.what-denker-summary-browser');
  const cs = getComputedStyle(el);
  const card = el.closest('[data-denker-feature-card]');
  const cardRect = card.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const copy = document.querySelector('p.what-denker-feature-copy[data-copy-layout="side"]');
  const copyRect = copy ? copy.getBoundingClientRect() : null;
  const copyCs = copy ? getComputedStyle(copy) : null;
  return {
    browserTop: cs.top, browserPosition: cs.position, browserTransform: cs.transform,
    cardH: cardRect.height,
    browserRectTopRel: elRect.top - cardRect.top,
    copyTop: copyCs?.top, copyTranslate: copyCs?.translate,
    copyRectTopRel: copyRect ? copyRect.top - cardRect.top : null,
  };
});
console.log(info);
await browser.close();
