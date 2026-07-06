# Explore / Founders / Why Sections Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved spec `docs/superpowers/specs/2026-07-06-explore-sections-content-design.md`: new copy + memory-graph motion slide + parallel-agent taskboard polish in `WhatDenkerCanDo`; Apple-measured layout for `CardCarousel` with layered background/foreground cards; 5 founder-scenario cards and 3 why-cards with code-rebuilt foregrounds.

**Architecture:** `CardCarousel` becomes an Apple-spec gallery (uniform 696×452 tiles, eyebrow/riff/intro header lockup, quiet 17px captions, 36px paddles) whose cards render a cover-cropped wallpaper background plus a code-built foreground still scaled by a per-breakpoint `--tile-scale`. All motion stays JSX + CSS/SVG. Foreground stills live one-per-file in `components/carousel-cards/`, reusing the shared Denker cursor bubble extracted from `WhatDenkerCanDo`.

**Tech Stack:** Next.js 16 / React 19, Tailwind 4 + `app/globals.css` custom classes, playwright-core + local Chrome for visual QA (pattern from `scripts/export-hero-video.mjs`).

## Global Constraints

- **No unit-test runner exists in this repo.** The test cycle for every task is: `npm run lint`, `npm run build`, then a screenshot via `scripts/shot-section.mjs` (created in Task 1) visually compared against the stated expectations and, where given, the reference webp.
- Dev server for QA: `npm run dev -- --port 3004` (matches prior QA convention). Screenshots go to `tmp/qa/`.
- **Color rule (spec §6a):** card backgrounds only from the blue→teal→cyan wallpapers in `public/images/what-denker-can-do/backgrounds/`; Denker green `#3AF88C` is the only accent, carried by foreground elements. No purple/gold/orange backdrops.
- **Layout constants (spec §7):** tile radius 28px (20px on mobile), card gap 20px, static tiles 696×452 / 644×416 / 260×316 (desktop ≥1280 / ≥640 / mobile), section padding 144px desktop, captions 17px (14px mobile), paddles 36px circles, riff/heading ladder 48→40→32px, motion caption ladder 28→24→17px.
- **Copy is exact:** use the strings in this plan verbatim (they come from the approved spec).
- No videos, no new raster images. Foregrounds are JSX + CSS.
- Per user CLAUDE.md: after edits, no duplicated or unused functions; retired code/assets are deleted in Task 9, not left behind.
- Commit after every task (messages given per task).

---

### Task 1: CardCarousel Apple-spec upgrade + layered cards + QA script

**Files:**
- Create: `scripts/shot-section.mjs`
- Modify: `components/ui/CardCarousel.tsx`
- Modify: `app/globals.css` (replace `.carousel-card-width` / `.carousel-card-height` block, lines ~532–563)
- Modify: `components/BuiltForFounders/BuiltForFounders.tsx` (header props only)
- Modify: `components/WhyDenkerAI/WhyDenkerAI.tsx` (header props only)

**Interfaces:**
- Consumes: existing `BlurText`, `Container`, `FadeIn`, `cn`.
- Produces (later tasks rely on these exact names):
  - `export type CarouselCard = { title: string; body: string; background?: string; foreground?: React.ReactNode; image?: string }` (`widthPx` deleted).
  - `export function CardCarousel({ eyebrow, riff, intro, cards, theme }: { eyebrow: string; riff: string; intro: string; cards: CarouselCard[]; theme?: "light" | "dark" })`.
  - CSS classes `.carousel-tile` (positions/sizes the tile, sets `--tile-scale`) and `.carousel-tile-foreground` (600px design-width wrapper, centered, scaled).
  - QA command: `node scripts/shot-section.mjs --url=http://localhost:3004 --selector='[data-name="Section - Built for Founders & Product Builders"]' --out=tmp/qa/founders.png --width=1440`.

- [ ] **Step 1: Create the screenshot QA script**

```js
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
```

- [ ] **Step 2: Replace the carousel sizing CSS in `app/globals.css`**

Delete the whole `.carousel-card-width` / `.carousel-card-height` block (the comment
"CardCarousel card sizing — discrete per-breakpoint values…" through the closing brace
of the 495px media query) and insert:

```css
/* CardCarousel tiles — Apple visionOS gallery spec. Uniform tile per
   breakpoint (696×452 / 644×416 / portrait 260×316), radius 28 (20 mobile).
   --tile-scale drives the code-built foreground still (designed at 600px
   wide) so its proportions and text are identical at every width; only the
   cover-cropped background gains or loses visible area. */
.carousel-tile {
  position: relative;
  width: 260px;
  height: 316px;
  overflow: hidden;
  border-radius: 20px;
  --tile-scale: 0.42;
}
@media (min-width: 640px) {
  .carousel-tile {
    width: 644px;
    height: 416px;
    border-radius: 28px;
    --tile-scale: 0.925;
  }
}
@media (min-width: 1280px) {
  .carousel-tile {
    width: 696px;
    height: 452px;
    --tile-scale: 1;
  }
}

.carousel-tile-background {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.carousel-tile-foreground {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 5;
  width: 600px;
  transform: translate(-50%, -50%) scale(var(--tile-scale));
}
```

- [ ] **Step 3: Rewrite `components/ui/CardCarousel.tsx`**

Keep the drag/geometry logic; change type, header, card markup, captions, paddles,
padding. Full replacement for the changed regions:

Type + props (replaces `CarouselCard`, `cardWidthVars`, and the component signature —
delete `cardWidthVars`, `DESKTOP_HEIGHT`, `TABLET_HEIGHT`, `MOBILE_HEIGHT`,
`DEFAULT_WIDTH` entirely):

```tsx
// Each card is a layered composition: a cover-cropped wallpaper `background`
// plus a code-built `foreground` still (designed at 600px wide, scaled by
// --tile-scale). `image` is the legacy single-webp path kept only while
// sections migrate; it renders exactly as before.
export type CarouselCard = {
  title: string;
  body: string;
  background?: string;
  foreground?: React.ReactNode;
  image?: string;
};

export function CardCarousel({
  eyebrow,
  riff,
  intro,
  cards,
  theme = "light",
}: {
  eyebrow: string;
  riff: string;
  intro: string;
  cards: CarouselCard[];
  theme?: "light" | "dark";
}) {
```

Geometry note: `targetOffsetFor` and the measure effect already read real DOM offsets,
so uniform tiles need no logic change.

Section + header lockup (replaces the current `<section>` opener and single
`BlurText` heading):

```tsx
  return (
    <section
      className={cn(
        "flex w-full flex-col items-center px-6 py-24 sm:px-10 md:px-20 md:py-[144px]",
        isDark ? "bg-grey-900" : "bg-[#f5f5f7]"
      )}
      data-theme={theme}
    >
      <Container className="flex flex-col items-start gap-14">
        <div className="flex max-w-[720px] flex-col items-start">
          <BlurText
            as="h2"
            className={cn(
              "text-[21px] leading-[21px] font-semibold",
              isDark ? "text-white" : "text-grey-950"
            )}
            text={eyebrow}
          />
          <BlurText
            as="p"
            className={cn(
              "mt-3 text-[32px] leading-[36px] font-semibold sm:text-[40px] sm:leading-[44px] min-[1181px]:text-[48px] min-[1181px]:leading-[52px]",
              isDark ? "text-white" : "text-grey-950"
            )}
            text={riff}
          />
          <p
            className={cn(
              "mt-6 text-[17px] leading-[25px] font-semibold sm:text-[21px] sm:leading-[29px]",
              isDark ? "text-grey-300" : "text-[#6e6e73]"
            )}
          >
            {intro}
          </p>
        </div>
```

Deck gap: on the deck div change `gap-2` → `gap-5`.

Card markup (replaces the current per-card `<div style={cardWidthVars(...)}>` block):

```tsx
            {cards.map((card) => (
              <div
                key={card.title}
                className="flex shrink-0 flex-col gap-3.5 select-none"
              >
                <div className="carousel-tile bg-primary-50">
                  {card.background && (
                    <img
                      src={card.background}
                      alt=""
                      draggable={false}
                      className="carousel-tile-background"
                    />
                  )}
                  {card.foreground && (
                    <div className="carousel-tile-foreground">{card.foreground}</div>
                  )}
                  {card.image && (
                    <img
                      src={card.image}
                      alt=""
                      draggable={false}
                      className="carousel-tile-background"
                      ref={(img) => {
                        if (!img) return;
                        const hide = () => {
                          img.style.display = "none";
                        };
                        img.addEventListener("error", hide);
                        return () => img.removeEventListener("error", hide);
                      }}
                    />
                  )}
                </div>
                <div className="flex max-w-[560px] flex-col gap-1 px-1">
                  <p
                    className={cn(
                      "text-[14px] leading-[18px] font-semibold sm:text-[17px] sm:leading-[21px]",
                      isDark ? "text-white" : "text-grey-950"
                    )}
                  >
                    {card.title}
                  </p>
                  <p
                    className={cn(
                      "text-[14px] leading-[18px] font-semibold sm:text-[17px] sm:leading-[21px]",
                      isDark ? "text-grey-300" : "text-[#6e6e73]"
                    )}
                  >
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
```

Paddles (replace both button `className` bodies; keep handlers/disabled logic):

```tsx
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              isDark
                ? "bg-white/12 text-white hover:bg-white/18 disabled:hover:bg-white/12"
                : "bg-[rgba(210,210,215,0.64)] text-grey-950 hover:bg-[rgba(210,210,215,0.85)] disabled:hover:bg-[rgba(210,210,215,0.64)]"
            )}
```

and change each caret icon to `className="size-4"`.

- [ ] **Step 4: Update both callers' header props (data untouched)**

In `BuiltForFounders.tsx` replace `heading="Built for Founders & Product Builders"` with:

```tsx
      <CardCarousel
        eyebrow="Built for founders"
        riff="Run your week, not your inbox."
        intro="Denker takes real work off your plate — reports, research, replies, and follow-through — so you stay on product."
        cards={cards}
        theme="dark"
      />
```

In `WhyDenkerAI.tsx` replace `heading="Why Denker AI?"` with:

```tsx
      <CardCarousel
        eyebrow="Why Denker AI"
        riff="Not another chatbot tab."
        intro="Denker lives on your desktop, sees what you see, and works across every app you already use."
        cards={cards}
      />
```

Also delete every `widthPx:` line from both `cards` arrays (the field no longer exists;
the old `image:` fields stay for now).

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass; no `widthPx` / `cardWidthVars` references remain (`grep -rn "widthPx\|cardWidthVars" components/ app/` returns nothing).

- [ ] **Step 6: Visual QA**

Run: `npm run dev -- --port 3004` (background), then:
```bash
node scripts/shot-section.mjs --selector='[data-name="Section - Built for Founders & Product Builders"]' --out=tmp/qa/t1-founders-1440.png --width=1440
node scripts/shot-section.mjs --selector='[data-name="Section - Built for Founders & Product Builders"]' --out=tmp/qa/t1-founders-390.png --width=390 --height=844
```
Expected at 1440: eyebrow + large riff + grey intro lockup; uniform 696×452 tiles with
28px radius, 20px gaps; quiet 17px captions below tiles; two 36px circular paddles
bottom-right. Expected at 390: portrait 260×316 tiles, 14px captions. (Old baked webps
inside the tiles will crop oddly — acceptable interim state until Tasks 6–8.)

- [ ] **Step 7: Commit**

```bash
git add scripts/shot-section.mjs components/ui/CardCarousel.tsx app/globals.css components/BuiltForFounders/BuiltForFounders.tsx components/WhyDenkerAI/WhyDenkerAI.tsx
git commit -m "feat(carousel): Apple-spec tiles, header lockup, layered card API"
```

---

### Task 2: Extract the Denker cursor bubble into a shared component

**Files:**
- Create: `components/production/cursors/denker-cursor-bubble.tsx`
- Modify: `components/WhatDenkerCanDo/WhatDenkerCanDo.tsx` (delete local `DenkerAgentCursorBubble`, import shared one)

**Interfaces:**
- Produces: `export function DenkerCursorBubble({ children, className, name = "Denker", color = "#3AF88C", maxWidthPx = 340 }: { children: string; className?: string; name?: string; color?: string; maxWidthPx?: number })` — used by Tasks 4, 5, 6, 7, 8.

- [ ] **Step 1: Create the shared component**

```tsx
// components/production/cursors/denker-cursor-bubble.tsx
import { AgentCursorArrow } from "@/components/production/cursors/agent-cursor-arrow";
import {
  cursorGlassStyle,
  cursorTextShadow,
} from "@/components/production/cursors/agent-cursor-glass";
import { cn } from "@/lib/cn";

// Agent cursor + glass speech bubble. Callers position it via `className`
// (e.g. the motion sections' animated bubble classes, or static offsets in
// carousel card stills). `name`/`color` support non-Denker agents.
export function DenkerCursorBubble({
  children,
  className,
  name = "Denker",
  color = "#3AF88C",
  maxWidthPx = 340,
}: {
  children: string;
  className?: string;
  name?: string;
  color?: string;
  maxWidthPx?: number;
}) {
  const agentTextShadow = cursorTextShadow(color);
  return (
    <div className={cn("what-denker-motion-bubble", className)}>
      <AgentCursorArrow
        color={color}
        mode="glass"
        shape="soft"
        liquidLevel={0.3}
        width={17}
        height={22}
        position="relative"
      />
      <div
        className={cn(
          "denker-agent-cursor-bubble pointer-events-auto absolute left-3 top-3",
          "flex w-max shrink-0 flex-col items-start gap-1",
          "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
          "border px-3 py-2 text-appkit-caption font-medium leading-snug"
        )}
        style={{ ...cursorGlassStyle(color), maxWidth: maxWidthPx }}
        data-cursor-tone="normal"
        data-testid="agent-cursor-bubble"
      >
        <span
          className="text-appkit-mini font-semibold leading-none text-[var(--agent-cursor-name-color)]"
          style={{ textShadow: agentTextShadow }}
          data-testid="agent-cursor-name"
        >
          {name}
        </span>
        <div className="flex w-full min-w-0 items-start gap-1">
          <div className="min-w-0 flex-1" data-testid="agent-cursor-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Swap `WhatDenkerCanDo.tsx` to the shared component**

Delete the local `DenkerAgentCursorBubble` function (and its now-unused imports:
`AgentCursorArrow`, `cursorGlassStyle`, `cursorTextShadow` — keep `DENKER_GREEN` only
if still referenced elsewhere in the file; it is, by the dock chip styles, so keep it).
Add `import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";`
and rename all `<DenkerAgentCursorBubble` usages to `<DenkerCursorBubble`.

- [ ] **Step 3: Lint + build; confirm no duplicate remains**

Run: `npm run lint && npm run build && grep -rn "DenkerAgentCursorBubble" components/`
Expected: lint/build pass; grep returns nothing.

- [ ] **Step 4: Visual QA**

```bash
node scripts/shot-section.mjs --selector='#features' --out=tmp/qa/t2-motion.png --width=1440 --settle=6000
```
Expected: motion section renders identically to before (green Denker bubble visible on
the active slide).

- [ ] **Step 5: Commit**

```bash
git add components/production/cursors/denker-cursor-bubble.tsx components/WhatDenkerCanDo/WhatDenkerCanDo.tsx
git commit -m "refactor: extract shared DenkerCursorBubble"
```

---

### Task 3: Motion carousel restructure — copy, slide order, Apple type/gaps

**Files:**
- Modify: `components/WhatDenkerCanDo/WhatDenkerCanDo.tsx`
- Modify: `app/globals.css` (motion caption ladder + mobile portrait card size)

**Interfaces:**
- Consumes: nothing new.
- Produces: final `slides` array (ids 0–4 below) that Task 4 wires the graph motion into; taskboard renders on `slide.id === 3`.

- [ ] **Step 1: Replace the `slides` array**

```tsx
const slides = [
  {
    id: 0,
    background: "/images/what-denker-can-do/backgrounds/downloaded-patrick-teal-architecture.jpg",
    copy: "Give Denker a task. It opens apps,\nclicks, and types — like you would.",
  },
  {
    id: 1,
    background: "/images/what-denker-can-do/backgrounds/downloaded-blue-ink-marble.jpg",
    copy: "Results land right where you're working.\nNot in another tab.",
  },
  {
    id: 2,
    background: "/images/what-denker-can-do/backgrounds/downloaded-teal-motion-lines.jpg",
    copy: "Denker writes straight into\nthe input of any app.",
  },
  {
    id: 3,
    background: "/images/what-denker-can-do/backgrounds/downloaded-cyan-architecture-lines.jpg",
    copy: "A team of agents, working in parallel —\neach on its own task.",
  },
  {
    id: 4,
    background: "/images/what-denker-can-do/backgrounds/downloaded-cyan-black-fluid.jpg",
    copy: "Everything remembered — in a memory\ngraph you can actually see.",
  },
];
```

- [ ] **Step 2: Move the taskboard to slide 3**

In the card render, change `{slide.id === 4 && <ProductionTaskboardSurface active={isActive} />}`
to `{slide.id === 3 && <ProductionTaskboardSurface active={isActive} />}`. Slide 4 renders
background-only until Task 4.

Autoplay guard: in the interval effect change `active < 3` to `active !== 3 && active !== 4`
(slides 0–2 advance via their demo timers; 3 and 4 use the interval until Task 4 gives
slide 4 its own timing).

- [ ] **Step 3: Heading + caption + gap sizes**

- Heading `BlurText` classes: append `min-[1181px]:text-[48px] min-[1181px]:leading-[52px]`
  after the existing `min-[1181px]:text-[42px] min-[1181px]:leading-[44px]` — replace those
  two utilities rather than stacking (final ladder …36/38/48).
- Slide copy `<p>` classes: change `text-[18px] leading-[23px] … md:text-[22px] md:leading-[27px]`
  to `text-[17px] leading-[22px] sm:text-[24px] sm:leading-[28px] md:text-[28px] md:leading-[32px]`.
- Deck gap: `gap-4` → `gap-5`.

- [ ] **Step 4: Mobile portrait motion tile (globals.css)**

In the `#features` block, change the mobile default:

```css
#features {
  --what-denker-feature-card-width: min(calc(100vw - 48px), 340px);
  --what-denker-feature-frame-height: clamp(440px, 64svh, 500px);
}
```

(The ≥640px media overrides later in the file already restore the landscape clamps —
leave them untouched.)

- [ ] **Step 5: Lint + build + visual QA**

Run: `npm run lint && npm run build`, then:
```bash
node scripts/shot-section.mjs --selector='#features' --out=tmp/qa/t3-motion-1440.png --width=1440 --settle=6000
node scripts/shot-section.mjs --selector='#features' --out=tmp/qa/t3-motion-390.png --width=390 --height=844
```
Expected at 1440: new copy on slide 1 at 28px; heading 48px. At 390: portrait card
(~340×480), 17px caption. Click through dots manually if needed: slide 4 = taskboard
with parallel-agents copy, slide 5 = background-only with memory copy.

- [ ] **Step 6: Commit**

```bash
git add components/WhatDenkerCanDo/WhatDenkerCanDo.tsx app/globals.css
git commit -m "feat(motion): new slide copy/order, Apple type ladder, portrait mobile"
```

---

### Task 4: Memory-graph motion slide

**Files:**
- Create: `components/WhatDenkerCanDo/MemoryGraphMotion.tsx`
- Modify: `components/WhatDenkerCanDo/WhatDenkerCanDo.tsx` (wire slide 4 states/timing)
- Modify: `app/globals.css` (graph keyframes)

**Interfaces:**
- Consumes: `DenkerCursorBubble` (Task 2), motion-layer CSS conventions
  (`.what-denker-motion-layer`, `--motion-play-state`, `data-motion-state`).
- Produces: `export function MemoryGraphMotion({ state }: { state: "hidden" | "playing" | "final" })`.

- [ ] **Step 1: Create the component**

Node layout mirrors the retired `why-denker-ai-5.webp` reference. Percent coordinates
place chips; one absolute SVG draws the edges.

```tsx
// components/WhatDenkerCanDo/MemoryGraphMotion.tsx
"use client";

import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

// Node positions are % of the slide frame; edges reference node ids. The
// center node is the workspace; leaves appear in save-order, matching the
// staggered reveal delays in globals.css (.memory-graph-node[data-order]).
const nodes = [
  { id: "denker", label: "Denker AI", x: 48, y: 52, order: 0 },
  { id: "workspace", label: "Context-aware AI workspace", x: 27, y: 32, order: 1 },
  { id: "positioning", label: "Why/How/What positioning", x: 66, y: 20, order: 2 },
  { id: "bottlenecks", label: "Reduce doing-everything-yourself bottlenecks", x: 76, y: 38, order: 3 },
  { id: "founders", label: "Founders, solo builders, and small teams", x: 24, y: 70, order: 4 },
  { id: "jane", label: "jane", x: 50, y: 84, order: 5 },
  { id: "onboarding", label: "Onboarding context saved", x: 76, y: 76, order: 6 },
] as const;

const edges: Array<[string, string]> = [
  ["denker", "workspace"],
  ["denker", "positioning"],
  ["denker", "bottlenecks"],
  ["denker", "founders"],
  ["denker", "jane"],
  ["positioning", "bottlenecks"],
];

const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

export function MemoryGraphMotion({
  state,
}: {
  state: "hidden" | "playing" | "final";
}) {
  return (
    <div
      aria-hidden="true"
      className="what-denker-motion-layer what-denker-graph-motion"
      data-active={state !== "hidden" ? "true" : undefined}
      data-motion-state={state}
    >
      <svg
        className="memory-graph-edges"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodeById[a].x}
            y1={nodeById[a].y}
            x2={nodeById[b].x}
            y2={nodeById[b].y}
            pathLength={1}
          />
        ))}
      </svg>
      {nodes.map((node) => (
        <span
          key={node.id}
          className="memory-graph-node"
          data-order={node.order}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <i />
          {node.label}
        </span>
      ))}
      <div className="memory-graph-detail">
        <strong>Onboarding context saved</strong>
        <span>Positioning doc — saved from chat</span>
        <span>Investor update draft — Frame</span>
        <span>Taskboard DEN-126 — shipped</span>
      </div>
      <DenkerCursorBubble className="what-denker-graph-bubble">
        Saved to memory. Hover any node to see exactly what Denker keeps.
      </DenkerCursorBubble>
    </div>
  );
}
```

- [ ] **Step 2: Add graph CSS to `app/globals.css`** (after the existing
`.what-denker-motion-*` blocks)

```css
/* Memory-graph motion slide. Same play-state convention as the other
   demos: keyframes are paused until the layer enters "playing", and the
   "final" state pins everything to its end values via animation-fill-mode
   plus the [data-motion-state="final"] overrides below. */
.what-denker-graph-motion {
  --graph-cycle: 4.6s;
}

.memory-graph-edges {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.memory-graph-edges line {
  stroke: rgba(214, 197, 255, 0.55);
  stroke-width: 0.22;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: memory-edge-draw 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 1.4s;
  animation-play-state: var(--motion-play-state);
}

.memory-graph-node {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border-radius: 999px;
  transform: translate(-50%, -50%) scale(0.6);
  background: rgba(10, 22, 30, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  animation: memory-node-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.35s + var(--node-order, 0) * 0.28s);
  animation-play-state: var(--motion-play-state);
}

.memory-graph-node[data-order="0"] { --node-order: 0; }
.memory-graph-node[data-order="1"] { --node-order: 1; }
.memory-graph-node[data-order="2"] { --node-order: 2; }
.memory-graph-node[data-order="3"] { --node-order: 3; }
.memory-graph-node[data-order="4"] { --node-order: 4; }
.memory-graph-node[data-order="5"] { --node-order: 5; }
.memory-graph-node[data-order="6"] { --node-order: 6; }

.memory-graph-node i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #3af88c;
}

.memory-graph-detail {
  position: absolute;
  right: 7%;
  bottom: 30%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(8, 18, 26, 0.78);
  border: 1px solid rgba(58, 248, 140, 0.35);
  color: rgba(255, 255, 255, 0.88);
  font-size: 12.5px;
  opacity: 0;
  transform: translateY(8px);
  animation: memory-detail-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 3.3s;
  animation-play-state: var(--motion-play-state);
}

.memory-graph-detail strong {
  font-size: 13.5px;
  color: #3af88c;
}

.what-denker-graph-bubble {
  position: absolute;
  left: 12%;
  bottom: 16%;
  opacity: 0;
  animation: memory-detail-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 3.7s;
  animation-play-state: var(--motion-play-state);
}

.what-denker-graph-motion[data-motion-state="final"] .memory-graph-edges line,
.what-denker-graph-motion[data-motion-state="final"] .memory-graph-node,
.what-denker-graph-motion[data-motion-state="final"] .memory-graph-detail,
.what-denker-graph-motion[data-motion-state="final"] .what-denker-graph-bubble {
  animation-duration: 0s;
  animation-delay: 0s;
}

@keyframes memory-node-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes memory-edge-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes memory-detail-in {
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 3: Wire timing into `WhatDenkerCanDo.tsx`**

Add constants + state alongside the existing demo ones:

```tsx
const GRAPH_DEMO_MOTION_MS = 4600;
// state:
const [graphDemoCompleted, setGraphDemoCompleted] = useState(false);
```

Extend `restartDemoForSlide`:

```tsx
    } else if (index === 4) {
      setGraphDemoCompleted(false);
    }
```

Add the timing effect (mirrors the gmail one; wraps back to slide 0):

```tsx
  useEffect(() => {
    if (!playing || active !== 4 || dragging) return;
    const completeId = window.setTimeout(() => {
      setGraphDemoCompleted(true);
    }, GRAPH_DEMO_MOTION_MS);
    const advanceId = window.setTimeout(() => {
      setFirstDemoStarted(true);
      setFirstDemoCompleted(false);
      setActive(0);
    }, GRAPH_DEMO_MOTION_MS + DEMO_FINAL_HOLD_MS);
    return () => {
      window.clearTimeout(completeId);
      window.clearTimeout(advanceId);
    };
  }, [active, dragging, playing]);
```

Change the interval-autoplay guard from `active !== 3 && active !== 4` to
`active === 3` (only the taskboard slide still uses the generic interval).

Render on slide 4 (import `MemoryGraphMotion` at top):

```tsx
                      {slide.id === 4 && (
                        <MemoryGraphMotion
                          state={
                            !isActive
                              ? "hidden"
                              : graphDemoCompleted
                                ? "final"
                                : playing
                                  ? "playing"
                                  : "hidden"
                          }
                        />
                      )}
```

- [ ] **Step 4: Lint + build + visual QA**

Run: `npm run lint && npm run build`, then with the dev server running use the
Claude Preview/playwright browser to click the 5th dot and watch the cycle. Then:
```bash
node scripts/shot-section.mjs --selector='#features' --out=tmp/qa/t4-graph.png --width=1440 --settle=9000
```
Expected: nodes pop in order 0→6, lines draw after ~1.4s, green-bordered detail card +
Denker bubble appear near the end; slide advances back to slide 1 afterwards; "final"
state (pause playback) shows the completed graph, no replay flicker.

- [ ] **Step 5: Commit**

```bash
git add components/WhatDenkerCanDo/MemoryGraphMotion.tsx components/WhatDenkerCanDo/WhatDenkerCanDo.tsx app/globals.css
git commit -m "feat(motion): memory-graph slide (CSS/SVG)"
```

---

### Task 5: Parallel-agent polish on the taskboard slide

**Files:**
- Modify: `components/WhatDenkerCanDo/WhatDenkerCanDo.tsx` (`ProductionTaskboardSurface`)
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `DenkerCursorBubble` with `name`/`color` props (Task 2).
- Produces: nothing consumed later.

- [ ] **Step 1: Add two extra agent cursors inside `ProductionTaskboardSurface`**

Inside the root `.what-denker-taskboard-shell` div (after the toast), add:

```tsx
      <DenkerCursorBubble
        className="taskboard-agent-cursor taskboard-agent-cursor-runtime"
        name="Runtime"
        color="#5AC8FA"
        maxWidthPx={230}
      >
        Moving DEN-118 to In Progress
      </DenkerCursorBubble>
      <DenkerCursorBubble
        className="taskboard-agent-cursor taskboard-agent-cursor-research"
        name="Research"
        color="#B7A6FF"
        maxWidthPx={230}
      >
        Drafting competitor notes for DEN-101
      </DenkerCursorBubble>
```

(`#5AC8FA` cyan and `#B7A6FF` soft violet stay inside the cool blue-family palette;
Denker green remains the primary accent on the existing toast/cards.)

- [ ] **Step 2: CSS — drifting cursor paths, active only while the slide is shown**

```css
/* Parallel-agent cursors on the taskboard slide: two extra agents drift
   between columns while the existing Denker toast/card motion plays, making
   "working in parallel" literal. Animation only runs while the taskboard
   shell is active (same data-active flag the shell already uses). */
.taskboard-agent-cursor {
  position: absolute;
  z-index: 30;
  opacity: 0;
}

.what-denker-taskboard-shell[data-active="true"] .taskboard-agent-cursor {
  animation-duration: 6s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.45, 0, 0.25, 1);
}

.what-denker-taskboard-shell[data-active="true"] .taskboard-agent-cursor-runtime {
  animation-name: taskboard-cursor-runtime;
}

.what-denker-taskboard-shell[data-active="true"] .taskboard-agent-cursor-research {
  animation-name: taskboard-cursor-research;
}

@keyframes taskboard-cursor-runtime {
  0% { opacity: 0; left: 24%; top: 46%; }
  12% { opacity: 1; }
  48% { left: 38%; top: 52%; }
  82% { opacity: 1; left: 41%; top: 40%; }
  100% { opacity: 0; left: 41%; top: 40%; }
}

@keyframes taskboard-cursor-research {
  0% { opacity: 0; left: 10%; top: 66%; }
  16% { opacity: 1; }
  55% { left: 16%; top: 50%; }
  86% { opacity: 1; left: 13%; top: 58%; }
  100% { opacity: 0; left: 13%; top: 58%; }
}
```

- [ ] **Step 3: Lint + build + visual QA**

Run: `npm run lint && npm run build`, then:
```bash
node scripts/shot-section.mjs --selector='#features' --out=tmp/qa/t5-taskboard.png --width=1440 --settle=16000
```
(16s settle lands on slide 4 mid-cycle.) Expected: taskboard slide shows three agents at
once — green Denker toast plus cyan "Runtime" and violet "Research" cursors drifting over
different columns.

- [ ] **Step 4: Commit**

```bash
git add components/WhatDenkerCanDo/WhatDenkerCanDo.tsx app/globals.css
git commit -m "feat(motion): parallel agent cursors on taskboard slide"
```

---

### Task 6: Built for Founders — section data + Report & Sheets stills

**Files:**
- Create: `components/carousel-cards/ReportCard.tsx`
- Create: `components/carousel-cards/SheetsCard.tsx`
- Create: `components/carousel-cards/index.ts`
- Modify: `components/BuiltForFounders/BuiltForFounders.tsx`

**Interfaces:**
- Consumes: `CarouselCard` layered fields (Task 1), `DenkerCursorBubble` (Task 2).
- Produces: `export function ReportCard()`, `export function SheetsCard()`; barrel
  `components/carousel-cards/index.ts` re-exporting every still (Tasks 7–8 append to it).
  All stills are presentational-only (no props), designed at 600px width.

- [ ] **Step 1: ReportCard** (reference: `public/images/built-for-founders/webp/built-for-founders-5.webp` — same content, Denker-green highlight instead of purple)

```tsx
// components/carousel-cards/ReportCard.tsx
// Still: generated "Website Visitor Impact" report frame (Founders card 1).
const stats = [
  { value: "1,200", note: "+3x vs pre-launch", label: "Total unique visitors" },
  { value: "~120", note: "peak day", label: "Max daily visitors" },
  { value: "160", note: "downloads tracked", label: "Mac app downloads" },
  { value: "~70", note: "vs ~30 pre-launch", label: "Avg daily (launch week)" },
];
const bars = [34, 46, 30, 26, 33, 38, 41, 36, 44, 52, 47, 100];

export function ReportCard() {
  return (
    <div className="flex w-[430px] flex-col gap-3 rounded-2xl bg-white/92 p-5 shadow-[0_24px_60px_rgba(0,10,20,0.35)] backdrop-blur-md">
      <span className="w-max rounded-full bg-[#3AF88C]/18 px-2.5 py-1 text-[9px] font-bold tracking-[0.08em] text-[#0B7A43]">
        PEERLIST LAUNCH — JUNE 24
      </span>
      <div>
        <h4 className="text-[19px] font-bold text-grey-950">Website Visitor Impact</h4>
        <p className="text-[10.5px] text-grey-500">April 2 → July 1 · Founder Daily Metrics</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-grey-150 p-2">
            <strong className="text-[15px] font-bold text-grey-950">{s.value}</strong>
            <p className="text-[8px] font-semibold text-[#0B7A43]">↗ {s.note}</p>
            <p className="text-[8.5px] leading-[11px] text-grey-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-grey-150 p-3">
        <p className="mb-2 text-[8.5px] font-bold tracking-[0.06em] text-grey-500">
          DAILY VISITORS — WEEKLY AVERAGES
        </p>
        <div className="flex h-[64px] items-end gap-[5px]">
          {bars.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={
                i === bars.length - 1
                  ? "flex-1 rounded-t-sm bg-[#3AF88C]"
                  : "flex-1 rounded-t-sm bg-grey-800"
              }
            />
          ))}
        </div>
      </div>
      <div className="rounded-lg bg-grey-50 px-3 py-2 text-[9.5px] leading-[14px] text-grey-600">
        <strong className="text-grey-950">Launch spike:</strong> Peerlist drove the highest
        sustained weekly traffic since launch — peaks of ~120 visitors/day, up from ~30.
      </div>
    </div>
  );
}
```

- [ ] **Step 2: SheetsCard** (reference: `built-for-founders-3.webp`)

```tsx
// components/carousel-cards/SheetsCard.tsx
// Still: Denker filling a Total column inside a spreadsheet (Founders card 2).
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

const rows = [
  ["Q1 2025", "2,895", "1,075", "1,820", "8,491"],
  ["Q2 2025", "3,020", "1,120", "1,900", "8,867"],
  ["Q3 2025", "3,185", "1,180", "2,005", "9,363"],
  ["Q4 2025", "3,340", "1,235", "2,105", "9,829"],
];

export function SheetsCard() {
  return (
    <div className="relative w-[560px]">
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_rgba(0,10,20,0.35)]">
        <div className="flex items-center gap-2 border-b border-grey-150 bg-grey-50 px-3 py-2">
          <span className="size-2 rounded-full bg-[#34a853]" />
          <span className="text-[11px] font-semibold text-grey-800">Gross Revenue Sheet</span>
        </div>
        <table className="w-full text-[10.5px] text-grey-800">
          <thead>
            <tr className="border-b border-grey-150 bg-grey-50 text-left text-grey-500">
              {["Quarter", "Revenue", "COGS", "Gross Profit", "Total"].map((h) => (
                <th key={h} className="px-3 py-1.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-grey-100">
                {r.map((cell, i) => (
                  <td
                    key={i}
                    className={
                      i === 4
                        ? "bg-[#3AF88C]/14 px-3 py-1.5 font-semibold text-grey-950"
                        : "px-3 py-1.5"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DenkerCursorBubble
        className="absolute -right-2 top-6"
        maxWidthPx={220}
      >
        Adding Total for every quarter profit.
      </DenkerCursorBubble>
    </div>
  );
}
```

- [ ] **Step 3: Barrel**

```ts
// components/carousel-cards/index.ts
export { ReportCard } from "./ReportCard";
export { SheetsCard } from "./SheetsCard";
```

- [ ] **Step 4: Rewrite `BuiltForFounders.tsx` cards 1–2 as layered, keep 3–5 legacy for now**

```tsx
import { CardCarousel, type CarouselCard } from "@/components/ui/CardCarousel";
import { ReportCard, SheetsCard } from "@/components/carousel-cards";

const BG = "/images/what-denker-can-do/backgrounds";

// Founder-scenario cards (spec §4). Cards migrate from baked webps to
// layered background+foreground as each still lands.
const cards: CarouselCard[] = [
  {
    title: "Your metrics, turned into an investor-ready report.",
    body: "Ask a question, get a shareable report built from your real numbers.",
    background: `${BG}/swiss-blue-lake.jpg`,
    foreground: <ReportCard />,
  },
  {
    title: "Spreadsheet chores, done for you.",
    body: "Denker works inside your sheet — filling, totaling, cleaning — while you watch.",
    background: `${BG}/clear-blue-shoreline.jpg`,
    foreground: <SheetsCard />,
  },
  {
    title: "Talk it through. Denker takes it from there.",
    body: "Brainstorm out loud, assign tasks, and reply by voice.",
    image: "/images/built-for-founders/webp/built-for-founders-2.webp",
  },
  {
    title: "Messages sent, follow-ups handled.",
    body: "Denker drafts and sends replies across your chat tools, in your voice.",
    image: "/images/built-for-founders/webp/built-for-founders-1.webp",
  },
  {
    title: "From discussion to delegated tasks.",
    body: "Denker remembers what you agreed on and turns it into assigned work for your team.",
    image: "/images/why-denker-ai/webp/why-denker-ai-3.webp",
  },
];

export function BuiltForFounders() {
  return (
    <div data-name="Section - Built for Founders & Product Builders">
      <CardCarousel
        eyebrow="Built for founders"
        riff="Run your week, not your inbox."
        intro="Denker takes real work off your plate — reports, research, replies, and follow-through — so you stay on product."
        cards={cards}
        theme="dark"
      />
    </div>
  );
}
```

- [ ] **Step 5: Lint + build + visual QA against references**

Run: `npm run lint && npm run build`, then:
```bash
node scripts/shot-section.mjs --selector='[data-name="Section - Built for Founders & Product Builders"]' --out=tmp/qa/t6-founders.png --width=1440
node scripts/shot-section.mjs --selector='[data-name="Section - Built for Founders & Product Builders"]' --out=tmp/qa/t6-founders-390.png --width=390 --height=844
```
Read `tmp/qa/t6-founders.png` next to the reference webps: card 1 shows the report frame
floating on the lake wallpaper with a green highlight bar; card 2 shows the sheet +
Denker bubble on the shoreline wallpaper; both crisply centered, drop shadows visible;
mobile shot shows the same stills smaller but proportionally identical inside portrait
tiles. Iterate on still spacing/scale until it reads like the reference composition.

- [ ] **Step 6: Commit**

```bash
git add components/carousel-cards components/BuiltForFounders/BuiltForFounders.tsx
git commit -m "feat(founders): layered report + sheets cards, scenario copy"
```

---

### Task 7: Built for Founders — Voice, ChatSend, TeamTasks stills

**Files:**
- Create: `components/carousel-cards/VoiceCard.tsx`
- Create: `components/carousel-cards/ChatSendCard.tsx`
- Create: `components/carousel-cards/TeamTasksCard.tsx`
- Modify: `components/carousel-cards/index.ts`
- Modify: `components/BuiltForFounders/BuiltForFounders.tsx` (cards 3–5 → layered)

**Interfaces:**
- Consumes: Task 1 API, Task 2 bubble, Task 6 barrel.
- Produces: `VoiceCard`, `ChatSendCard`, `TeamTasksCard` exports.

- [ ] **Step 1: VoiceCard** (reference: `built-for-founders-2.webp`)

```tsx
// components/carousel-cards/VoiceCard.tsx
// Still: agent-voice picker + voice input bar + shortcut keycaps (Founders card 3).
import { Icons } from "@/components/production/ui/icons";

const voices = [
  { name: "Fenrir", desc: "Bright, lively", tone: "bg-[#3AF88C]", selected: true },
  { name: "Puck", desc: "Warm, grounded", tone: "bg-[#39E6C3]", selected: false },
  { name: "Jessica", desc: "Clear, natural", tone: "bg-[#9AD8FF]", selected: false },
  { name: "Sky", desc: "Soft, calm", tone: "bg-[#5AC8FA]", selected: false },
];

export function VoiceCard() {
  return (
    <div className="flex w-[440px] flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-white/16 bg-white/10 p-5 shadow-[0_24px_60px_rgba(0,10,20,0.4)] backdrop-blur-xl">
        <h4 className="text-[18px] font-semibold text-white">Choose your agent voice.</h4>
        <p className="text-[11px] text-white/65">Pick one voice for agent replies.</p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {voices.map((v) => (
            <div key={v.name} className="flex flex-col items-center gap-1.5">
              <span className={`relative size-11 rounded-full ${v.tone}`}>
                {v.selected && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-white text-[9px] text-grey-950">
                    ✓
                  </span>
                )}
              </span>
              <strong className="text-[11px] font-semibold text-white">{v.name}</strong>
              <span className="text-[8.5px] text-white/60">{v.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-[300px] items-center gap-2 rounded-full border border-white/16 bg-white/12 px-4 py-2.5 backdrop-blur-xl">
        <span className="text-[13px] font-semibold text-white">Denker</span>
        <span className="ml-auto flex items-center gap-2 text-white/85">
          <Icons.Mic className="h-4 w-4" />
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-white/85">
        <span className="rounded-md bg-black/55 px-2.5 py-1.5 text-[10px] font-semibold">⌘ command</span>
        <span className="text-[11px]">+</span>
        <span className="rounded-md bg-black/55 px-2.5 py-1.5 text-[10px] font-semibold">⌥ option</span>
      </div>
    </div>
  );
}
```

(If `Icons.Mic` does not exist in `components/production/ui/icons`, use
`import { Microphone } from "@phosphor-icons/react/dist/ssr"` with `<Microphone className="h-4 w-4" />` instead — check the Icons map first.)

- [ ] **Step 2: ChatSendCard** (reference: `built-for-founders-1.webp`)

```tsx
// components/carousel-cards/ChatSendCard.tsx
// Still: Denker sending a chat reply for you (Founders card 4).
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

export function ChatSendCard() {
  return (
    <div className="relative w-[480px] rounded-2xl bg-white/85 p-4 shadow-[0_24px_60px_rgba(0,10,20,0.35)] backdrop-blur-md">
      <div className="flex flex-col gap-2.5">
        <div className="max-w-[75%] rounded-xl bg-white px-3 py-2 text-[11px] leading-[15px] text-grey-800 shadow-sm">
          Would you be free for a meeting tonight at 8 PM?
          <span className="mt-0.5 block text-[8.5px] text-grey-400">Louis · 3h ago</span>
        </div>
        <div className="ml-auto max-w-[80%] rounded-xl bg-[#eef9f2] px-3 py-2 text-[11px] leading-[15px] text-grey-800 shadow-sm">
          Hi Louis, I&apos;ve been reviewing our Q3 pipeline. Shifting focus to mid-market
          accounts could significantly boost this quarter.
        </div>
      </div>
      <div className="mt-3 flex items-center rounded-full border border-grey-150 bg-white px-3 py-2 text-[11px] text-grey-800">
        See you at 8 PM in office for discussing sales strategy
        <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-grey-950 text-[10px] text-white">↑</span>
      </div>
      <DenkerCursorBubble className="absolute -right-3 bottom-14" maxWidthPx={220}>
        Sending message to Louis, for meeting at 8PM in office.
      </DenkerCursorBubble>
    </div>
  );
}
```

- [ ] **Step 3: TeamTasksCard** (reference: `why-denker-ai-3.webp`)

```tsx
// components/carousel-cards/TeamTasksCard.tsx
// Still: Denker turning a team discussion into assigned tasks (Founders card 5).
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

const members = ["Julien Moreau", "Pierre Dubois", "Thomas Bernard"];

export function TeamTasksCard() {
  return (
    <div className="relative w-[520px] overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_rgba(0,10,20,0.35)]">
      <div className="flex">
        <aside className="w-[150px] shrink-0 border-r border-grey-100 bg-grey-50 p-3">
          <p className="text-[10px] font-bold text-grey-950">Lucas Martin&apos;s Workspace</p>
          <p className="mt-3 text-[8.5px] font-semibold tracking-[0.05em] text-grey-400">DIRECT MESSAGES</p>
          <ul className="mt-1.5 flex flex-col gap-1.5 text-[10px] text-grey-700">
            {members.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 p-3.5">
          <p className="text-[10px] font-bold text-grey-950">Lucas Martin <span className="ml-1 font-normal text-grey-400">12:48 PM</span></p>
          <p className="mt-1 max-w-[95%] rounded-lg bg-grey-50 px-2.5 py-2 text-[10.5px] leading-[15px] text-grey-800">
            Hey! Send the weekly sprint report for marketing urgently.
          </p>
          <div className="mt-8 rounded-full border border-grey-150 px-3 py-2 text-[10px] text-grey-400">
            Write to Lucas Martin…
          </div>
        </main>
      </div>
      <DenkerCursorBubble className="absolute right-4 bottom-10" maxWidthPx={250}>
        Assigning tasks from the 3-month marketing strategy we discussed.
      </DenkerCursorBubble>
    </div>
  );
}
```

- [ ] **Step 4: Update barrel + section data**

Append to `components/carousel-cards/index.ts`:

```ts
export { VoiceCard } from "./VoiceCard";
export { ChatSendCard } from "./ChatSendCard";
export { TeamTasksCard } from "./TeamTasksCard";
```

In `BuiltForFounders.tsx` replace cards 3–5 with layered versions (import the three new
stills; delete the `image:` fields):

```tsx
  {
    title: "Talk it through. Denker takes it from there.",
    body: "Brainstorm out loud, assign tasks, and reply by voice.",
    background: `${BG}/downloaded-indigo-fluid.jpg`,
    foreground: <VoiceCard />,
  },
  {
    title: "Messages sent, follow-ups handled.",
    body: "Denker drafts and sends replies across your chat tools, in your voice.",
    background: `${BG}/clear-forest-lake.jpg`,
    foreground: <ChatSendCard />,
  },
  {
    title: "From discussion to delegated tasks.",
    body: "Denker remembers what you agreed on and turns it into assigned work for your team.",
    background: `${BG}/turquoise-rocky-pines.jpg`,
    foreground: <TeamTasksCard />,
  },
```

- [ ] **Step 5: Lint + build + visual QA**

Run: `npm run lint && npm run build`, then re-run both Task 6 screenshot commands
(outputs `tmp/qa/t7-founders*.png`). Expected: all five cards layered — no baked webps
left in this section; each still reads against its wallpaper like its reference webp;
backgrounds are all blue/teal family. Iterate scale/offsets as needed.

- [ ] **Step 6: Commit**

```bash
git add components/carousel-cards components/BuiltForFounders/BuiltForFounders.tsx
git commit -m "feat(founders): voice, chat-send, team-tasks stills — section fully layered"
```

---

### Task 8: Why Denker AI — 3 differentiator cards

**Files:**
- Create: `components/carousel-cards/ScreenSightCard.tsx`
- Create: `components/carousel-cards/CrossAppCard.tsx`
- Create: `components/carousel-cards/CanvasCard.tsx`
- Modify: `components/carousel-cards/index.ts`
- Modify: `components/WhyDenkerAI/WhyDenkerAI.tsx` (full rewrite, 5 → 3 cards)

**Interfaces:**
- Consumes: Task 1 API, Task 2 bubble.
- Produces: `ScreenSightCard`, `CrossAppCard`, `CanvasCard` exports.

- [ ] **Step 1: ScreenSightCard** (reference: `why-denker-ai-1.webp`)

```tsx
// components/carousel-cards/ScreenSightCard.tsx
// Still: asking Denker about what's on screen (Why card 1).
export function ScreenSightCard() {
  return (
    <div className="w-[520px] overflow-hidden rounded-xl bg-[#101418] shadow-[0_24px_60px_rgba(0,10,20,0.45)]">
      <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-[9.5px] text-white/50">
          youtube.com — Europe&apos;s AI Standouts · Bloomberg Tech
        </span>
      </div>
      <div className="flex gap-2 p-3">
        <div className="flex-1 rounded-md bg-black p-2.5">
          <p className="text-[10px] font-bold text-white">Europe&apos;s AI Standouts</p>
          <table className="mt-1.5 w-full text-[8.5px] leading-[13px] text-white/75">
            <tbody>
              {[
                ["Mistral", "AI models", "$14B"],
                ["Nebius", "Cloud", "$19B deal"],
                ["Lovable", "AI coding", "$4B"],
                ["DeepL", "Translation", "$2B"],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-white/10">
                  <td className="py-1 font-semibold text-white/90">{r[0]}</td>
                  <td>{r[1]}</td>
                  <td className="text-right">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-[180px] rounded-md bg-[#12325c] p-2.5">
          <span className="text-[8px] font-bold tracking-wide text-white/70">Bloomberg Tech</span>
          <div className="mt-2 h-[72px] rounded bg-white/12" />
        </div>
      </div>
      <div className="mx-3 mb-3 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0e3f2c] to-[#134e38] px-3 py-2">
        <span className="size-4 rounded-full bg-[#3AF88C]" />
        <span className="text-[10.5px] text-white/92">
          Tell me what Europe&apos;s AI Standouts means for us?
        </span>
        <span className="ml-auto text-[10px] text-white/70">📷 ↑</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: CrossAppCard** (reference: `why-denker-ai-2.webp`)

```tsx
// components/carousel-cards/CrossAppCard.tsx
// Still: Denker moving work between apps — Sheets → Notion (Why card 2).
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

const recents = [
  "User Retention Report",
  "Daily AI Work Submissions",
  "Simple AI work tracking",
];

export function CrossAppCard() {
  return (
    <div className="relative w-[520px] overflow-hidden rounded-xl bg-[#191919] shadow-[0_24px_60px_rgba(0,10,20,0.45)]">
      <div className="flex">
        <aside className="w-[150px] shrink-0 border-r border-white/8 bg-[#202020] p-3">
          <p className="text-[10px] font-semibold text-white/85">daksh&apos;s Workspace</p>
          <p className="mt-3 text-[8.5px] font-semibold tracking-[0.05em] text-white/40">RECENTS</p>
          <ul className="mt-1.5 flex flex-col gap-1.5 text-[9.5px] text-white/65">
            {recents.map((r) => (
              <li key={r} className={r === recents[0] ? "text-white/90" : undefined}>
                📄 {r}
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 p-5">
          <h4 className="text-[20px] font-bold text-white">User Retention Report</h4>
          <p className="mt-1 text-[9.5px] text-white/40">
            Press &apos;space&apos; for AI, &apos;/&apos; for commands
          </p>
          <div className="mt-10 h-[70px]" />
        </main>
      </div>
      <DenkerCursorBubble className="absolute left-[190px] top-[86px]" maxWidthPx={260}>
        Fetching contacts from Google Sheets and creating a doc in Notion…
      </DenkerCursorBubble>
    </div>
  );
}
```

- [ ] **Step 3: CanvasCard** (reference: `why-denker-ai-4.webp`)

```tsx
// components/carousel-cards/CanvasCard.tsx
// Still: the Denker canvas — answers as live frames, not text (Why card 3).
const agents = [
  { name: "Denker", color: "#3AF88C" },
  { name: "Designer", color: "#B7A6FF" },
  { name: "Researcher", color: "#5AC8FA" },
];

export function CanvasCard() {
  return (
    <div className="grid w-[560px] grid-cols-[1.4fr_1fr_0.8fr] gap-3">
      <div className="rounded-xl border border-white/14 bg-white/10 p-3 backdrop-blur-xl">
        <p className="text-[10px] font-semibold text-white/90">Task Board</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {["Todo", "In Progress", "Done"].map((col) => (
            <div key={col} className="rounded-md bg-white/8 p-1.5">
              <p className="text-[7.5px] font-semibold text-white/60">{col}</p>
              <div className="mt-1 h-6 rounded bg-white/14" />
              {col !== "Done" && <div className="mt-1 h-6 rounded bg-white/10" />}
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-[9px] font-semibold text-white/85">Team Agents</p>
        <ul className="mt-1 flex flex-col gap-1">
          {agents.map((a) => (
            <li key={a.name} className="flex items-center gap-1.5 text-[8.5px] text-white/75">
              <span className="size-2 rounded-full" style={{ backgroundColor: a.color }} />
              {a.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-white/14 bg-white/10 p-3 backdrop-blur-xl">
        <p className="text-[10px] font-semibold text-white/90">Book Takeaway</p>
        <div className="mt-2 rounded-md bg-white p-2">
          <p className="text-[9px] font-bold text-grey-950">Getting Things Done</p>
          <p className="mt-0.5 text-[7.5px] leading-[10px] text-grey-500">
            Capture everything into a trusted system outside your head.
          </p>
        </div>
        <p className="mt-2 text-[8px] text-white/60">Key insights · 4.8/5</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-white/14 bg-white/10 p-3 text-center backdrop-blur-xl">
          <p className="text-[8px] font-semibold text-white/60">60-second countdown</p>
          <p className="mt-1 text-[22px] font-bold tracking-tight text-white">01:00</p>
        </div>
        <div className="rounded-xl border border-white/14 bg-white/10 p-3 backdrop-blur-xl">
          <p className="text-[8px] font-semibold text-white/60">Make Time takeaway</p>
          <div className="mt-1.5 h-10 rounded bg-[#ffd60a]/85" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Barrel + section rewrite**

Append to the barrel:

```ts
export { ScreenSightCard } from "./ScreenSightCard";
export { CrossAppCard } from "./CrossAppCard";
export { CanvasCard } from "./CanvasCard";
```

Full new `components/WhyDenkerAI/WhyDenkerAI.tsx`:

```tsx
import { CardCarousel, type CarouselCard } from "@/components/ui/CardCarousel";
import {
  CanvasCard,
  CrossAppCard,
  ScreenSightCard,
} from "@/components/carousel-cards";

const BG = "/images/what-denker-can-do/backgrounds";

// Differentiator cards (spec §5): one architecture-level claim per card.
const cards: CarouselCard[] = [
  {
    title: "It sees what you see.",
    body: "Ask about anything on your screen — no copy-pasting context into a chat window.",
    background: `${BG}/downloaded-blue-ink-marble.jpg`,
    foreground: <ScreenSightCard />,
  },
  {
    title: "One AI across all your tools.",
    body: "Denker moves work between your apps — sheets to docs to email — instead of living in one tab.",
    background: `${BG}/clear-green-hills-lake.jpg`,
    foreground: <CrossAppCard />,
  },
  {
    title: "Answers become interfaces.",
    body: "Your workspace fills with live frames — boards, reports, timers — not walls of text.",
    background: `${BG}/downloaded-teal-motion-lines.jpg`,
    foreground: <CanvasCard />,
  },
];

export function WhyDenkerAI() {
  return (
    <div data-name="Section - Why Denker AI?">
      <CardCarousel
        eyebrow="Why Denker AI"
        riff="Not another chatbot tab."
        intro="Denker lives on your desktop, sees what you see, and works across every app you already use."
        cards={cards}
      />
    </div>
  );
}
```

- [ ] **Step 5: Lint + build + visual QA**

Run: `npm run lint && npm run build`, then:
```bash
node scripts/shot-section.mjs --selector='[data-name="Section - Why Denker AI?"]' --out=tmp/qa/t8-why.png --width=1440
node scripts/shot-section.mjs --selector='[data-name="Section - Why Denker AI?"]' --out=tmp/qa/t8-why-390.png --width=390 --height=844
```
Expected: light `#f5f5f7` section, exactly 3 cards, stills matching their reference
webps' composition on blue/teal wallpapers; lockup header present.

- [ ] **Step 6: Commit**

```bash
git add components/carousel-cards components/WhyDenkerAI/WhyDenkerAI.tsx
git commit -m "feat(why): 3 differentiator cards with code-built stills"
```

---

### Task 9: Cleanup, retired assets, full-page QA

**Files:**
- Delete: `public/images/built-for-founders/webp/` (all 5 files), `public/images/why-denker-ai/webp/` (all 5 files)
- Modify: `components/ui/CardCarousel.tsx` (remove legacy `image` field + render branch)

**Interfaces:** none produced; this task finalizes.

- [ ] **Step 1: Remove the legacy `image` migration path**

In `CardCarousel.tsx` delete `image?: string;` from `CarouselCard` and the
`{card.image && (…)}` render branch (with its error-hiding ref). Confirm no caller
passes `image`: `grep -rn "image:" components/BuiltForFounders components/WhyDenkerAI`
returns nothing.

- [ ] **Step 2: Delete retired webps**

```bash
git rm -r public/images/built-for-founders/webp public/images/why-denker-ai/webp
```
Then confirm nothing references them:
`grep -rn "built-for-founders/webp\|why-denker-ai/webp" app/ components/` returns nothing.

- [ ] **Step 3: Duplicate/unused sweep (per user CLAUDE.md)**

Run: `npm run lint && npm run build`, plus
`grep -rn "cardWidthVars\|carousel-card-width\|carousel-card-height\|DenkerAgentCursorBubble\|widthPx" components/ app/`
Expected: all return nothing; build passes.

- [ ] **Step 4: Full-page QA at three viewports**

```bash
node scripts/shot-section.mjs --full=true --out=tmp/qa/t9-full-1440.png --width=1440 --height=1000 --settle=6000
node scripts/shot-section.mjs --full=true --out=tmp/qa/t9-full-1068.png --width=1068 --height=900 --settle=6000
node scripts/shot-section.mjs --full=true --out=tmp/qa/t9-full-390.png --width=390 --height=844 --settle=6000
```
Read all three. Checklist:
- Three sections answer distinct questions (capability demos / founder scenarios / differentiators) with no repeated framing.
- All card backgrounds blue→teal→cyan; green accents only in foregrounds.
- Surface rhythm: dark hero → dark motion → dark Founders → light Why Denker.
- 390px: portrait tiles everywhere, no letterboxed cards, captions legible.
- Section padding visibly airier (144px scale).
Fix anything failing, re-shoot, then:

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: retire baked card webps, drop legacy image path, final QA"
```

---

## Self-Review Notes

- **Spec coverage:** §3 slides 1–5 → Tasks 3/4/5; §4 five cards → Tasks 6/7; §5 three cards → Task 8; §6 layered cards + §6a palette → Tasks 1/6/7/8; §7 measured specs (padding, lockup, tiles, captions, paddles, ladders, portrait mobile) → Tasks 1/3; §8 spatial language → still shadows/vignette handled in Tasks 1/6–8; retired assets → Task 9.
- **Type consistency:** `CarouselCard` fields (`background`/`foreground`/`image`) defined Task 1, consumed Tasks 6–8, `image` removed Task 9. `DenkerCursorBubble` signature (Task 2) matches all uses (`name`, `color`, `maxWidthPx`, string child).
- **Known QA-tuning latitude:** still inner sizes, cursor-bubble offsets, wallpaper assignment, and mobile `--tile-scale` (0.42) are explicitly iterate-at-screenshot values; everything else is fixed by spec.
