# Explore / Built for Founders / Why Denker — Content & Layout Redesign

**Date:** 2026-07-06
**Status:** Approved design, pending implementation plan
**Sections touched:** `WhatDenkerCanDo`, `BuiltForFounders`, `WhyDenkerAI`, `CardCarousel`

## 1. Problems being solved

1. **Duplicated messaging.** 10 of the current 15 cards across the three sections restate
   "sees your screen / works across apps / remembers context." The sections answer the
   same question three times instead of three different questions.
2. **Baked static assets break responsively.** Every current card image bakes wallpaper +
   UI window into one webp. When the card narrows the UI shrinks to illegibility; when it
   widens the image stretches. The Apple visionOS reference keeps the foreground component
   at a stable size while only the background expands/crops.
3. **Missing headline capabilities.** The motion section does not yet show parallel agents
   (as its own message) or the memory graph.

## 2. Section architecture (the visionOS pattern)

Each section answers a distinct question in a distinct register:

| Section | Question | Register | Media |
|---|---|---|---|
| Explore what Denker can do | *What can it do?* | Verb-led capability demos | Motion carousel, 5 slides |
| Built for Founders & Product Builders | *When does it help me?* | Scenario/outcome copy | Static cards, 5 |
| Why Denker AI? | *Why is this different from a chatbot tab?* | Architecture/differentiation claims | Static cards, 3 |

A capability may appear in two sections only if the register differs (e.g. memory as a
motion demo vs. memory as the "discussion → delegated tasks" founder scenario).

## 3. Section 1 — motion carousel "Explore what Denker can do." (5 slides)

All motion is JSX + CSS/SVG (no video), matching the existing GitHub/Gmail/summary demos.

| # | Copy overlay | Motion | Build status |
|---|---|---|---|
| 1 | Give Denker a task. It opens apps, clicks, and types — like you would. | Existing GitHub-opening demo | Copy edit only |
| 2 | Results land right where you're working. Not in another tab. | Existing article → summary-frame demo | Copy edit only |
| 3 | Denker writes straight into the input of any app. | Existing Gmail reply demo | Copy edit only |
| 4 | A team of agents, working in parallel — each on its own task. | Existing taskboard demo. Polish: 2–3 colored agent cursor chips moving cards in different columns simultaneously to make "parallel" visible. | Copy edit + small motion polish |
| 5 | Everything remembered — in a memory graph you can actually see. | **New.** Node-graph animation modeled on the retired `why-denker-ai-5.webp`: glass label chips as nodes, SVG lines between them. Nodes fade/scale in as work is "saved"; lines draw via `stroke-dashoffset`; a Denker cursor hovers one node revealing a small detail card showing exactly what was stored. | New motion build (CSS/SVG) |

Slide order note: the current slide 4 ("Build a team of AI specialists", background-only)
is removed; its message folds into the new slide 4 copy. The taskboard demo moves from
slide 5 to slide 4. Slide 5 becomes the memory graph.

## 4. Section 2 — static "Built for Founders & Product Builders" (5 cards)

Scenario angle: moments in a founder's week, outcome-first. Copy references features only
as the mechanism visible in the image.

| Card | Foreground component (rebuilt in code) | Reference (current webp) | Title | Body |
|---|---|---|---|---|
| 1 | Report frame: "Website Visitor Impact" stats + bar chart + key insights | `built-for-founders-5.webp` | Your metrics, turned into an investor-ready report. | Ask a question, get a shareable report built from your real numbers. |
| 2 | Google-Sheets-style window with Denker cursor bubble adding a Total column | `built-for-founders-3.webp` | Spreadsheet chores, done for you. | Denker works inside your sheet — filling, totaling, cleaning — while you watch. |
| 3 | Voice-picker panel + Denker input bar + command⌥ key caps | `built-for-founders-2.webp` | Talk it through. Denker takes it from there. | Brainstorm out loud, assign tasks, and reply by voice. |
| 4 | Chat window with Denker bubble "Sending message to Louis…" and drafted reply in input | `built-for-founders-1.webp` | Messages sent, follow-ups handled. | Denker drafts and sends replies across your chat tools, in your voice. |
| 5 | Team-workspace chat with Denker bubble assigning tasks from a prior discussion | `why-denker-ai-3.webp` | From discussion to delegated tasks. | Denker remembers what you agreed on and turns it into assigned work for your team. |

## 5. Section 3 — static "Why Denker AI?" (3 cards)

Differentiation angle: one architecture-level claim per card.

| Card | Foreground component (rebuilt in code) | Reference (current webp) | Title | Body |
|---|---|---|---|---|
| 1 | Browser window playing a video with a screenshot-question input bar over it | `why-denker-ai-1.webp` | It sees what you see. | Ask about anything on your screen — no copy-pasting context into a chat window. |
| 2 | Notion-style window with Denker bubble "Fetching contacts from Sheets and creating a doc…" | `why-denker-ai-2.webp` | One AI across all your tools. | Denker moves work between your apps — sheets to docs to email — instead of living in one tab. |
| 3 | Denker canvas: taskboard, agent list, takeaway frames floating as a workspace | `why-denker-ai-4.webp` | Answers become interfaces. | Your workspace fills with live frames — boards, reports, timers — not walls of text. |

Coverage check of required themes: voice → S2C3; screen understanding → S3C1;
integrations → S3C2; generative UI → S3C3; parallel agents → S1#4; memory graph → S1#5.

**Retired assets:** `built-for-founders-4.webp` (duplicates motion slide 3's Gmail demo);
`why-denker-ai-5.webp` (promoted to motion slide 5 as design reference).

## 6. Layered static cards (the responsive fix)

`CardCarousel`'s card becomes a two-layer composition:

1. **Background layer** — wallpaper/environment photo, `object-fit: cover`, fills the card
   at every width; crops instead of distorting.
2. **Foreground layer** — the UI component rebuilt as JSX + CSS (same approach as the
   motion section's GitHub/Gmail surfaces), rendered inside the card:
   - Designed at a fixed design width per component (≈600px inside the 696px tile).
   - Scaled to the card via `transform: scale()` driven by the tile size per breakpoint,
     so proportions and text stay identical across breakpoints — only the visible
     background area changes.
   - Real drop shadow + existing vignette treatment for the floating-panel spatial look.
3. **API change** — `CarouselCard` gains `background: string` and
   `foreground?: ReactNode`; the current single `image` field remains supported during
   migration. The per-card `widthPx` variable-width system retires in favor of uniform
   tiles (see §7).

These are stills: no animation inside section 2/3 foregrounds (matches Apple's static
sections; motion lives only in section 1).

### 6a. Background color coherence

The current baked assets span purple, gold/bronze, orange, and blue wallpapers — the
page reads as unrelated screenshots. New rule: **one hue family, varied brightness and
texture.**

- All card backgrounds (motion + both static sections) come from the cool
  blue → teal → cyan spectrum (hue ≈ 190°–250°) that the motion section and hero
  already use. No purple, gold, or orange backdrops anywhere in the three sections.
- Backgrounds differ per card by brightness, texture, and composition — not by hue.
  Source from the existing library in `public/images/what-denker-can-do/backgrounds/`
  (11 blue/teal images: shoreline, lakes, marble, architecture lines, fluid renders),
  which already fits the rule. Exact per-card assignment tuned at build QA.
- Denker green (`#3AF88C`) remains the only accent color, carried by agent cursors,
  bubbles, and highlights in the foreground components.
- Section surface rhythm mirrors Apple's three-surface system (§7): dark hero →
  dark motion/founders sections → light "Why Denker" section, with the same blue-teal
  wallpaper family inside cards on both surface types.

## 7. Measured Apple visionOS specs → Denker adaptation

Measured live on apple.com/os/visionos at 1440 / 1068 / 390 viewports (2026-07-06).

### Section rhythm

| Property | Apple (measured) | Denker adaptation |
|---|---|---|
| Section vertical padding | 144px top / 144–216px bottom | Raise our sections from ~80px to 144px top / 144px bottom (desktop) |
| Section height | ~950–1170px per section | Falls out of card size + header lockup + padding |
| Surface colors | Only 3 on the whole page: `#000`, `#1d1d1f`, `#f5f5f7` | Hero + motion + Founders on dark (`grey-950`/`grey-900`), Why Denker on light `#f5f5f7`-equivalent |

### Section header lockups

Apple uses two tiers:

- **Tier A** (hero, motion section): single H2, 48px/52 semibold, letter-spacing −0.144px.
  Ladder 48 → 40 → 32px (desktop/tablet/mobile).
- **Tier B** (static gallery sections): three-part lockup — eyebrow 21px/21 semibold
  (12px below) + riff headline 48px/52 semibold (24px below) + intro paragraph 21px/29
  semibold in grey `#6e6e73`. Riff ladder 48 → 40 → 32px.

Denker adaptation: motion section keeps Tier A (bump max size 42 → 48px ladder).
Both static sections upgrade from single heading to the Tier B lockup:

- Built for Founders: eyebrow "Built for founders" · riff (proposed) "Run your week,
  not your inbox." · intro one-liner about delegating real work.
- Why Denker AI: eyebrow "Why Denker AI" · riff (proposed) "Not another chatbot tab." ·
  intro one-liner about desktop-level, cross-app AI.

Riff/intro copy is a proposal — finalize at implementation review.

### Motion carousel (Apple "highlights")

| Property | Apple | Denker adaptation |
|---|---|---|
| Tile size (desktop 1440) | 1245×680 (~87vw, 1.83:1), radius 28px | Keep our ~1260px tile; standardize radius 28px |
| Slide gap | 20px | Change ours from 16px to 20px |
| Caption overlay | Pinned top-center, 28px/32 semibold, white 92%; ladder 28 → 24 → 17px | Bump ours from 22px to the 28/24/17 ladder |
| Mobile tile | **Portrait 306×480 (~0.64:1)** — not a shrunken landscape | Adopt: below ~734px the motion card switches to portrait; background crops via cover, foreground rescales/re-stacks |
| Controls | Play/pause 56×56 circle; dots pill 216×56, radius 28 | Ours already match (size-14 = 56px) — keep |

### Static gallery (Apple "Spatial experiences" pattern)

| Property | Apple | Denker adaptation |
|---|---|---|
| Tile (desktop) | Uniform 696×452 (1.54:1), radius 28px, overflow hidden | Replace variable 620–880px widths with uniform 696×452 tiles |
| Tile (tablet 1068) | 644×416 | Adopt |
| Tile (mobile 390) | **260×316 portrait-ish (0.82:1)** | Adopt — replaces our 192px-tall letterbox cards, which is where legibility currently dies |
| Item gap | 20px | Change ours from 8px to 20px |
| Caption placement | Below the tile, never overlaid | Ours already below — keep |
| Caption type | Title 17px/21 semibold dark; body 17px/21 semibold grey `#6e6e73`, ~14px below title; mobile title 14px | Shrink ours from 32px title / 18px body to the 17px quiet-caption scale (dark sections: white title, `grey-300` body) |
| Prev/next buttons | 36×36 circles, `rgba(210,210,215,0.64)`, right-aligned | Replace our 40×52 pills with 36px circles |

Rationale for the quiet captions: Apple lets the tile carry the message and keeps text
as a caption, which is what makes five-card sections scannable. Our current 32px
per-card titles compete with the section headline.

## 8. Spatial language (shared rules)

- One consistent "space": every card = environment photo → floating glass panel(s) →
  small foreground accent (cursor bubble, voice capsule, key caps).
- Layered scale per card (background scene / mid app window / small foreground element)
  to force depth even in stills.
- Reuse the `what-denker-photo-vignette` treatment and existing glass tokens everywhere.

## 9. Build scope summary

- **Copy edits:** motion slides 1–4 overlays; all card titles/bodies replaced;
  `WhyDenkerAI` goes 5 → 3 cards; both static sections gain the eyebrow + riff + intro
  header lockup (§7).
- **New motion build:** memory-graph slide (CSS/SVG), parallel-agent polish on taskboard.
- **Component builds:** 8 static foreground components (JSX + CSS stills).
- **Carousel changes:** layered card support; uniform 696×452 tiles (644×416 tablet,
  260×316 portrait mobile); 20px gaps; 17px caption scale; 36px circular paddles;
  144px section padding.
- **No new image production**; backgrounds reuse the existing blue/teal wallpaper
  library under the single-hue-family rule (§6a).
