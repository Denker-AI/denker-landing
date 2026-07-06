import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const widths = [1920, 1680, 1440, 1280, 1180, 1024, 834, 768, 640, 390];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("https://www.apple.com/os/visionos/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
for (let y = 0; y < 12000; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }

const results = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 1000 });
  await page.waitForTimeout(500);
  // ensure the carousel is in view so it lays out
  await page.evaluate(() => {
    const h = [...document.querySelectorAll("h2,h3")].find((x) => /Explore what.?s new/i.test(x.textContent || ""));
    if (h) h.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const round = (n) => Math.round(n);
    const h = [...document.querySelectorAll("h2,h3")].find((x) => /Explore what.?s new/i.test(x.textContent || ""));
    if (!h) return null;
    const sec = h.closest("section") || h.parentElement;
    // carousel track: first UL/OL with multiple wide LI children
    const uls = [...sec.querySelectorAll("ul,ol")];
    let track = null, items = [];
    for (const ul of uls) {
      const lis = [...ul.children].filter((c) => c.getBoundingClientRect().width > 200);
      if (lis.length >= 2) { track = ul; items = lis; break; }
    }
    const rectOf = (el) => { const b = el.getBoundingClientRect(); return { w: round(b.width), h: round(b.height), left: round(b.left), right: round(b.right) }; };
    const a = items[0] ? rectOf(items[0]) : null;
    const b = items[1] ? rectOf(items[1]) : null;
    return {
      vw: window.innerWidth,
      headingLeft: round(h.getBoundingClientRect().left),
      card0: a,
      card1: b,
      gap: a && b ? b.left - a.right : null,
      radius: items[0] ? getComputedStyle(items[0].querySelector("*") || items[0]).borderTopLeftRadius : null,
    };
  });
  results.push(m);
}
console.log(JSON.stringify(results, null, 1));
await browser.close();
