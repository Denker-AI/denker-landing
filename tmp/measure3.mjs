import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const widths = [1920, 1440, 1280, 1024];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
for (let y = 0; y < 6000; y += 450) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(100); }
const rows = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 1000 });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector("#features")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const R = (n) => Math.round(n);
    const card = document.querySelector(".what-denker-feature-frame") || document.querySelector("[data-denker-feature-card] > *");
    const head = document.querySelector(".what-denker-heading-align");
    const b = card ? card.getBoundingClientRect() : null;
    const appleCardW = Math.min(1260, window.innerWidth * 0.875);
    return {
      vw: window.innerWidth,
      ourCardW: b ? R(b.width) : null,
      ourCardH: b ? R(b.height) : null,
      ourCardLeft: b ? R(b.left) : null,
      headLeft: head ? R(head.getBoundingClientRect().left) : null,
      appleCardW: R(appleCardW),
      appleGutter: R((window.innerWidth - appleCardW) / 2),
    };
  });
  rows.push(m);
}
for (const r of rows) console.log(`vw=${String(r.vw).padEnd(5)} ourW=${String(r.ourCardW).padEnd(5)} appleW=${String(r.appleCardW).padEnd(5)} | ourLeft=${String(r.ourCardLeft).padEnd(4)} headLeft=${String(r.headLeft).padEnd(4)} appleGutter=${r.appleGutter} | ourH=${r.ourCardH}`);
await browser.close();
