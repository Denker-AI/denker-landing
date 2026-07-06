import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const widths = [1440, 1280, 1024];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("https://www.apple.com/os/visionos/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
for (let y = 0; y < 16000; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(100); }
await page.evaluate(() => window.scrollTo(0,0));
await page.waitForTimeout(500);
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 1000 });
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => {
    const R = (n) => Math.round(n);
    const findH = (re) => [...document.querySelectorAll("h1,h2,h3")].find((h) => re.test(h.textContent||""));
    const findP = (re) => [...document.querySelectorAll("p")].find((p) => re.test(p.textContent||""));
    const box = (el) => { if(!el) return null; const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { left: R(b.left), width: R(b.width), maxW: cs.maxWidth, fs: cs.fontSize, lh: cs.lineHeight }; };
    // scroll the target into view first
    const riff = findH(/Helpful in all the right places/i);
    if (riff) riff.scrollIntoView({block:"center"});
    return {
      vw: window.innerWidth,
      riff: box(riff),
      intro: box(findP(/Express yourself through images/i)),
      spatialRiff: box(findH(/spatial scene|panorama|Bring your space/i)),
    };
  });
  console.log(JSON.stringify(m));
}
await browser.close();
