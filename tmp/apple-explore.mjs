import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("https://www.apple.com/os/visionos/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3000);
// scroll through to trigger lazy content
for (let y = 0; y < 12000; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(150); }
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const round = (n) => Math.round(n);
  // find headings
  const heads = [...document.querySelectorAll("h1,h2,h3")].map((h) => h.textContent.trim().slice(0, 40)).filter(Boolean);
  // find the "Explore what's new" heading and its section
  const target = [...document.querySelectorAll("h1,h2,h3")].find((h) => /Explore what.?s new/i.test(h.textContent || ""));
  let cards = [];
  let sectionInfo = null;
  if (target) {
    let sec = target.closest("section") || target.parentElement;
    const r = target.getBoundingClientRect();
    sectionInfo = { headingText: target.textContent.trim().slice(0, 40), headingLeft: round(r.left) };
    // find candidate card elements within section: elements w>300 h>300
    const all = [...(sec ? sec.querySelectorAll("*") : [])];
    cards = all
      .map((el) => {
        const b = el.getBoundingClientRect();
        return { tag: el.tagName, cls: (el.className && el.className.toString ? el.className.toString() : "").slice(0, 46), w: round(b.width), h: round(b.height), left: round(b.left) };
      })
      .filter((c) => c.w > 300 && c.w < 1400 && c.h > 300)
      .slice(0, 14);
  }
  return { vw: window.innerWidth, heads, sectionInfo, cards };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
