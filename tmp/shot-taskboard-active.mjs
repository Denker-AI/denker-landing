import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const out = process.argv[2] || "tmp/qa/t5-taskboard-active.png";
await mkdir("tmp/qa", { recursive: true });
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
const el = page.locator('#features').first();
await el.scrollIntoViewIfNeeded();
await page.waitForFunction(() => {
  const el = document.querySelector('.what-denker-taskboard-shell');
  return el && el.getAttribute('data-active') === 'true';
}, { timeout: 60000 });
await page.waitForTimeout(Number(process.argv[3] || 2000));
await el.screenshot({ path: out });
await browser.close();
console.log(out);
