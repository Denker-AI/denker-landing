import { chromium } from "playwright-core";

// Freeze the hero at each beat's HOLD moment and measure the visible component
// bounds relative to the motion-canvas box (1440x600 coords).
const BEATS = [
  { id: "logo", pct: 12, stage: "hero-production-stage-logo", el: ".hero-production-stage-logo .hero-production-onboarding-liquid-shell" },
  { id: "team", pct: 28, stage: "hero-production-stage-agent-reveal", el: ".hero-production-stage-agent-reveal .hero-production-agent-reveal-glass" },
  { id: "voice", pct: 40, stage: "hero-production-stage-voice", el: ".hero-production-stage-voice .hero-production-voice-expand-shell" },
  { id: "book", pct: 52, stage: "hero-production-stage-html", el: ".hero-production-stage-html .hero-production-html" },
  { id: "desktop", pct: 66, stage: "hero-production-stage-desktop", el: ".hero-production-stage-desktop .hero-macbook-front" },
];

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/?box", { waitUntil: "networkidle" });

const shotDir = process.argv[2] || "/tmp";
for (const b of BEATS) {
  const delay = -Math.round((b.pct / 100) * 23000);
  await page.evaluate(({ delay }) => {
    let s = document.getElementById("beatfreeze");
    if (!s) { s = document.createElement("style"); s.id = "beatfreeze"; document.head.appendChild(s); }
    s.textContent = `.hero-production-stage-logo,.hero-production-stage-agent-reveal,.hero-production-stage-voice,.hero-production-stage-html,.hero-production-stage-desktop,.hero-production-stage-final{animation-delay:${delay}ms !important;animation-play-state:paused !important;} .hero-production-stage-agent-reveal *,.hero-production-stage-voice *,.hero-production-stage-html *,.hero-production-stage-desktop *{animation-delay:${delay}ms !important;animation-play-state:paused !important;}`;
  }, { delay });
  await page.waitForTimeout(400);
  const m = await page.evaluate((sel) => {
    const canvas = document.querySelector(".hero-motion-canvas").getBoundingClientRect();
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const fit = canvas.width / 1440; // box scale
    return {
      widthPct: +((r.width / canvas.width) * 100).toFixed(1),
      centerXPct: +(((r.left + r.width / 2 - canvas.left) / canvas.width) * 100).toFixed(1),
      centerYPct: +(((r.top + r.height / 2 - canvas.top) / canvas.height) * 100).toFixed(1),
      boxW: Math.round(r.width / fit), boxH: Math.round(r.height / fit),
    };
  }, b.el);
  console.log(b.id.padEnd(8), JSON.stringify(m));
  await page.screenshot({ path: `${shotDir}/beat-${b.id}.png` });
}
await browser.close();
