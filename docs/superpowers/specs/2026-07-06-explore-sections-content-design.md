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
   at every width; crops instead of distorting. Source from the existing wallpaper
   library (`public/images/what-denker-can-do/backgrounds/` plus the macOS-style
   wallpapers already used in the baked webps). Each card gets a distinct background;
   exact assignment tuned at build QA for section-level color rhythm.
2. **Foreground layer** — the UI component rebuilt as JSX + CSS (same approach as the
   motion section's GitHub/Gmail surfaces), rendered inside the card:
   - Designed at a fixed design width per component (≈640–760px).
   - Scaled to the card via `transform: scale()` driven by the card height ratio
     (desktop 495 / tablet 360 / mobile 192), so proportions and text stay identical
     across breakpoints — only the visible background area changes.
   - Real drop shadow + existing vignette treatment for the floating-panel spatial look.
3. **API change** — `CarouselCard` gains `background: string` and
   `foreground?: ReactNode` (+ optional `foregroundWidth`); the current single `image`
   field remains supported during migration.

These are stills: no animation inside section 2/3 foregrounds (matches Apple's static
sections; motion lives only in section 1).

## 7. Spatial language (shared rules)

- One consistent "space": every card = environment photo → floating glass panel(s) →
  small foreground accent (cursor bubble, voice capsule, key caps).
- Layered scale per card (background scene / mid app window / small foreground element)
  to force depth even in stills.
- Reuse the `what-denker-photo-vignette` treatment and existing glass tokens everywhere.

## 8. Build scope summary

- **Copy edits:** motion slides 1–4 overlays; section 2/3 headings unchanged, all card
  titles/bodies replaced; `WhyDenkerAI` goes 5 → 3 cards.
- **New motion build:** memory-graph slide (CSS/SVG), parallel-agent polish on taskboard.
- **Component builds:** 8 static foreground components (JSX + CSS stills).
- **Carousel change:** layered card support in `CardCarousel`.
- **No new image production**; backgrounds reuse the existing wallpaper library.
