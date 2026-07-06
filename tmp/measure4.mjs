import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const widths = [1920, 1440, 1280, 1024];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
for (let y = 0; y < 6000; y += 450) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(100); }
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 1000 });
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const R = (n) => (n==null?null:Math.round(n));
    const L = (el) => el ? R(el.getBoundingClientRect().left) : null;
    const eyebrow = [...document.querySelectorAll("p")].find((p) => /Built for founders/i.test(p.textContent||""));
    const apple = Math.max(0.0625*window.innerWidth, (window.innerWidth-1260)/2);
    return { vw: window.innerWidth, motionHead: L(document.querySelector(".what-denker-heading-align")), bffEyebrow: eyebrow?R(eyebrow.getBoundingClientRect().left):null, bffCard: L(document.querySelector(".gallery-card")), appleGutter: R(apple) };
  });
  console.log(`vw=${String(m.vw).padEnd(5)} motion=${String(m.motionHead).padEnd(4)} bffText=${String(m.bffEyebrow).padEnd(4)} bffCard=${String(m.bffCard).padEnd(4)} appleGutter=${m.appleGutter}`);
}
await browser.close();
