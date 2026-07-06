import { chromium } from "playwright-core";
const W = Number(process.argv[2]||1440), H = Number(process.argv[3]||900);
const out = process.argv[4] || "/tmp/align.png";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000/?box", { waitUntil: "networkidle" });
await page.addStyleTag({ content: `.hero-production-stage-final{animation-delay:-22990ms !important;animation-play-state:paused !important;opacity:1 !important;}` });
await page.waitForTimeout(500);
const d = await page.evaluate(() => {
  const q = (s)=>{const e=document.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect(); return {top:Math.round(b.top),bottom:Math.round(b.bottom),h:Math.round(b.height),w:Math.round(b.width),left:Math.round(b.left)};};
  const copy = document.querySelector(".hero-copy-block");
  const cb = copy.getBoundingClientRect();
  return {
    viewportH: window.innerHeight,
    headlineBottom: Math.round(cb.bottom),
    stage: q(".hero-production-cinema"),
    box: q(".hero-motion-canvas"),
    layout: q(".hero-production-final-layout"),
  };
});
console.log(JSON.stringify(d,null,1));
await page.screenshot({ path: out, fullPage: false });
await browser.close();
