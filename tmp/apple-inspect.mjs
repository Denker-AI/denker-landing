import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
async function inspect(W, H) {
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await p.goto("https://www.apple.com/os/visionos/", { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(2500);
  const data = await p.evaluate((vw) => {
    // find the hero: the first big media element (video/canvas/img) in the top of the page
    const vids = [...document.querySelectorAll("video, canvas")].map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height), natW: el.videoWidth||el.width, natH: el.videoHeight||el.height };
    }).filter(v => v.h > 100);
    // headline: find an h1 near top
    const h1 = document.querySelector("h1");
    const h1r = h1 ? h1.getBoundingClientRect() : null;
    // first section
    const firstSection = document.querySelector("section");
    const secr = firstSection ? firstSection.getBoundingClientRect() : null;
    return {
      viewport: { w: window.innerWidth, h: window.innerHeight },
      h1: h1r ? { text: h1.textContent.trim().slice(0,30), top: Math.round(h1r.top), bottom: Math.round(h1r.bottom) } : null,
      firstSectionH: secr ? Math.round(secr.height) : null,
      media: vids.slice(0, 4),
    };
  }, W);
  await p.close();
  return data;
}
console.log("=== 1440x900 ==="); console.log(JSON.stringify(await inspect(1440, 900), null, 1));
console.log("=== 1024x900 ==="); console.log(JSON.stringify(await inspect(1024, 900), null, 1));
console.log("=== 1920x1080 ==="); console.log(JSON.stringify(await inspect(1920, 1080), null, 1));
await b.close();
