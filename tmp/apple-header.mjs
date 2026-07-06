import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const widths = [1440, 1280, 1024];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("https://www.apple.com/os/visionos/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
for (let y = 0; y < 12000; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 1000 });
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const R = (n) => Math.round(n);
    const riff = [...document.querySelectorAll("h1,h2,h3")].find((h) => /Your AI assistant/i.test(h.textContent||""));
    const intro = [...document.querySelectorAll("p")].find((p) => /Siri AI is powered by Apple Intelligence/i.test(p.textContent||""));
    const eyebrow = [...document.querySelectorAll("p,span")].find((p) => /^Siri AI on Apple Vision Pro/i.test((p.textContent||"").trim()));
    const box = (el) => { if(!el) return null; const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { left: R(b.left), width: R(b.width), maxW: cs.maxWidth, fs: cs.fontSize, lh: cs.lineHeight, mt: cs.marginTop }; };
    return { vw: window.innerWidth, eyebrow: box(eyebrow), riff: box(riff), intro: box(intro) };
  });
  console.log(JSON.stringify(m));
}
await browser.close();
