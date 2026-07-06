import { chromium } from "playwright-core";
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
const el = page.locator('#features').first();
await el.scrollIntoViewIfNeeded();
await page.waitForFunction(() => {
  const el = document.querySelector('.what-denker-taskboard-shell');
  return el && el.getAttribute('data-active') === 'true';
}, { timeout: 60000 });
await page.waitForTimeout(500);

const rects = await page.evaluate(() => {
  const shell = document.querySelector('.what-denker-taskboard-shell');
  const shellRect = shell.getBoundingClientRect();
  function pctRect(r) {
    return {
      leftPct: +((r.left - shellRect.left) / shellRect.width * 100).toFixed(1),
      rightPct: +((r.right - shellRect.left) / shellRect.width * 100).toFixed(1),
      topPct: +((r.top - shellRect.top) / shellRect.height * 100).toFixed(1),
      bottomPct: +((r.bottom - shellRect.top) / shellRect.height * 100).toFixed(1),
    };
  }
  const cards = [...document.querySelectorAll('[data-status] [data-testid], [data-status] .cursor-pointer, [data-status] > div > div')];
  const cols = [...document.querySelectorAll('[data-status]')].map(c => {
    // find first card-like child
    const cardEl = c.querySelector('article, [class*="card"], [class*="Card"]') || c.children[1] || null;
    return {
      status: c.getAttribute('data-status'),
      col: pctRect(c.getBoundingClientRect()),
      firstChild: cardEl ? pctRect(cardEl.getBoundingClientRect()) : null,
      html: c.outerHTML.slice(0, 200),
    };
  });
  return cols;
});
console.log(JSON.stringify(rects, null, 1));
await browser.close();
