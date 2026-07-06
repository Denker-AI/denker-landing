import { chromium } from "playwright-core";
const b=await chromium.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:true});
async function measure(W){
  const p=await b.newPage({viewport:{width:W,height:900},deviceScaleFactor:1});
  await p.goto("http://localhost:3000/?box",{waitUntil:"networkidle"});
  const delay=-Math.round(0.28*23000); // team hold
  await p.addStyleTag({content:`.hero-production-stage-agent-reveal,.hero-production-stage-agent-reveal *{animation-delay:${delay}ms !important;animation-play-state:paused !important;}`});
  await p.waitForTimeout(400);
  const r=await p.evaluate(()=>{const box=document.querySelector('.hero-motion-canvas').getBoundingClientRect();const el=document.querySelector('.hero-production-stage-agent-reveal .hero-production-agent-reveal-glass').getBoundingClientRect();return {teamWidthPctOfBox:+((el.width/box.width)*100).toFixed(1)};});
  await p.close();
  return r.teamWidthPctOfBox;
}
console.log("team width as % of box @1440:", await measure(1440));
console.log("team width as % of box @1920:", await measure(1920));
console.log("team width as % of box @2560:", await measure(2560));
await b.close();
