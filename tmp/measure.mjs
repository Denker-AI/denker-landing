import { chromium } from "playwright-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = process.env.OUT;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Scroll through to trigger IntersectionObserver reveals, then settle.
for (let y = 0; y < 6000; y += 450) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(120);
}
await page.waitForTimeout(800);

const data = await page.evaluate(() => {
  const round = (n) => Math.round(n);
  const h2s = [...document.querySelectorAll("h2")].map((h) => ({
    t: h.textContent.trim().slice(0, 34),
    left: round(h.getBoundingClientRect().left),
  }));
  const motionCard = document.querySelector("[data-denker-feature-card]");
  const galleryCard = document.querySelector(".gallery-card");
  const eyebrow = [...document.querySelectorAll("p")].find((p) => /Built for founders/i.test(p.textContent || ""));
  return {
    h2s,
    motionCardLeft: motionCard ? round(motionCard.getBoundingClientRect().left) : null,
    galleryCardLeft: galleryCard ? round(galleryCard.getBoundingClientRect().left) : null,
    galleryCardTop: galleryCard ? round(galleryCard.getBoundingClientRect().top) : null,
    galleryCardHeight: galleryCard ? round(galleryCard.querySelector(".gallery-card-tile")?.getBoundingClientRect().height) : null,
    eyebrowLeft: eyebrow ? round(eyebrow.getBoundingClientRect().left) : null,
    vw: window.innerWidth,
  };
});
console.log(JSON.stringify(data, null, 2));

// Screenshot the BFF section boundary (scroll it into view)
const bff = await page.$("[data-name='Section - Built for Founders & Product Builders']");
if (bff) {
  await bff.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/live-bff.png` });
}
await browser.close();
