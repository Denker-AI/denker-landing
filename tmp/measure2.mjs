import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = process.env.OUT;
const VW = Number(process.env.VW || 1440);
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: VW, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
for (let y = 0; y < 6000; y += 450) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
await page.waitForTimeout(800);
const L = (sel) => { const el = document.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().left) : null; };
const data = await page.evaluate(() => {
  const g = (sel) => { const el = document.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().left) : null; };
  const eyebrow = [...document.querySelectorAll("p")].find((p) => /Built for founders/i.test(p.textContent || ""));
  return {
    vw: window.innerWidth,
    motionHeadingLeft: g(".what-denker-heading-align"),
    motionCardLeft: g("[data-denker-feature-card]"),
    bffEyebrowLeft: eyebrow ? Math.round(eyebrow.getBoundingClientRect().left) : null,
    galleryCardLeft: g(".gallery-card"),
  };
});
console.log(JSON.stringify(data));
const motion = await page.$("#features");
if (motion) { await motion.scrollIntoViewIfNeeded(); await page.waitForTimeout(700); await page.screenshot({ path: `${OUT}/live-motion-${VW}.png` }); }
await browser.close();
