import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const widths = [1920, 1440, 1280, 1024];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("https://www.apple.com/os/visionos/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
for (let y = 0; y < 14000; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }

const out = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 1000 });
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => {
    const R = (n) => Math.round(n);
    const pick = (re) => [...document.querySelectorAll("h2,h3")].find((x) => re.test(x.textContent || ""));
    const measure = (h) => {
      if (!h) return null;
      const sec = h.closest("section") || h.parentElement;
      const uls = [...sec.querySelectorAll("ul,ol")];
      let items = [];
      for (const ul of uls) { const lis = [...ul.children].filter((c) => c.getBoundingClientRect().width > 150); if (lis.length >= 2) { items = lis; break; } }
      const rb = (el) => { const b = el.getBoundingClientRect(); return { w: R(b.width), h: R(b.height), left: R(b.left) }; };
      return { headingLeft: R(h.getBoundingClientRect().left), card0: items[0] ? rb(items[0]) : null, card1w: items[1] ? R(items[1].getBoundingClientRect().width) : null };
    };
    return {
      vw: window.innerWidth,
      highlights: measure(pick(/Explore what.?s new/i)),
      appsGallery: measure(pick(/Apple Intelligence in apps/i)) || measure(pick(/Helpful in all/i)),
      spatial: measure(pick(/Spatial experiences/i)),
    };
  });
  out.push(m);
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
