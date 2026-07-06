import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
for (let y = 0; y < 6000; y += 450) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(80); }
const r = await page.evaluate(() => {
  const el = document.querySelector(".gallery-shell");
  const tests = {};
  const vals = [
    "max(6.25vw, calc((100vw - 1260px) / 2))",
    "max(6.25vw, (100vw - 1260px) / 2)",
    "calc(max(6.25vw, (100vw - 1260px) / 2))",
    "90px",
  ];
  for (const v of vals) { el.style.paddingLeft = ""; el.style.paddingLeft = v; tests[v] = getComputedStyle(el).paddingLeft; }
  el.style.paddingLeft = "";
  return { fromClass: getComputedStyle(el).paddingLeft, tests };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
