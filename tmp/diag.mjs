import { chromium } from "playwright-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
for (let y = 0; y < 6000; y += 450) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(100); }
const d = await page.evaluate(() => {
  const shell = document.querySelector(".gallery-shell");
  const card = document.querySelector(".gallery-card");
  const cs = shell ? getComputedStyle(shell) : null;
  return {
    shellExists: !!shell,
    shellClass: shell ? shell.className : null,
    shellPadLeft: cs ? cs.paddingLeft : null,
    shellLeft: shell ? Math.round(shell.getBoundingClientRect().left) : null,
    shellWidth: shell ? Math.round(shell.getBoundingClientRect().width) : null,
    cardLeft: card ? Math.round(card.getBoundingClientRect().left) : null,
  };
});
console.log(JSON.stringify(d, null, 1));
await browser.close();
