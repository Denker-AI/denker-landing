import { chromium } from "playwright-core";
const vh = Number(process.argv[2] || 900);
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: vh } });
await page.goto("http://localhost:3000/?box", { waitUntil: "networkidle" });
await page.addStyleTag({
  content: `.hero-production-stage-final{animation-delay:-22990ms !important;animation-play-state:paused !important;opacity:1 !important;}`,
});
await page.waitForTimeout(600);
const data = await page.evaluate(() => {
  const canvas = document.querySelector(".hero-motion-canvas");
  const layout = document.querySelector(".hero-production-final-layout");
  const kids = [...document.querySelectorAll(".hero-production-final-layout > *")];
  const r = (el) => { const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top), bottom: Math.round(b.bottom) }; };
  return {
    canvas: r(canvas),
    layout: r(layout),
    kids: kids.map((k) => ({ cls: k.className.split(" ").find((c) => c.startsWith("hero-production-final-")), ...r(k) })),
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
