// scripts/shot-section.mjs
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright-core";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => a.replace(/^--/, "").split("="))
);
const url = args.url || "http://localhost:3004";
const width = Number(args.width || 1440);
const height = Number(args.height || 900);
const out = resolve(args.out || "tmp/qa/shot.png");
const settle = Number(args.settle || 2500);

await mkdir(dirname(out), { recursive: true });
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url, { waitUntil: "networkidle" });
if (args.selector) {
  const el = page.locator(args.selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(settle);
  await el.screenshot({ path: out });
} else {
  await page.waitForTimeout(settle);
  await page.screenshot({ path: out, fullPage: args.full === "true" });
}
await browser.close();
console.log(out);
