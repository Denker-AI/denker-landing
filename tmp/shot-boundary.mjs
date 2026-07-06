import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = process.env.OUT;
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
for (let y = 0; y < 6000; y += 400) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
// motion section full
await page.evaluate(() => document.querySelector("#features")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/final-motion.png` });
await browser.close();
