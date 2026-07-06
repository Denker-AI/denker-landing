import { chromium } from "playwright-core";

// args: <beat: final|logo|voice|html|desktop|agent-reveal> <outfile> <vh>
const beat = process.argv[2] || "final";
const out = process.argv[3] || "/tmp/freeze.png";
const vh = Number(process.argv[4] || 900);

const stageClass = {
  final: "hero-production-stage-final",
  logo: "hero-production-stage-logo",
  voice: "hero-production-stage-voice",
  html: "hero-production-stage-html",
  desktop: "hero-production-stage-desktop",
  agent: "hero-production-stage-agent-reveal",
}[beat];

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: vh }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/?box", { waitUntil: "networkidle" });

// Freeze the whole hero animation at this beat's rest state (100% keyframe),
// and hide the other stages so only the target beat is visible.
await page.addStyleTag({
  content: `
    .hero-production-stage-logo,
    .hero-production-stage-agent-reveal,
    .hero-production-stage-voice,
    .hero-production-stage-html,
    .hero-production-stage-desktop,
    .hero-production-stage-final {
      animation-delay: -22990ms !important;
      animation-play-state: paused !important;
    }
    .${stageClass} { opacity: 1 !important; }
  `,
});
await page.waitForTimeout(700);
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out, beat, vh);
