# Design Token System — Gap Analysis & Plan

> Goal: replace the current one-off, hand-tuned values (type sizes, spacing, radius,
> shadows) with a small, consistent set of **tokens**, benchmarked against Apple's
> visionOS / macOS marketing sites. A "token" = one named value, reused everywhere,
> so the page reads as one coherent system instead of many local decisions.

Method: computed styles were measured live (headless Chromium) from
`apple.com/os/visionos/` and `apple.com/os/macos/` at 1440×900 and 390×844.
Denker values were read from `app/globals.css` and the section components.

---

## 0. The complete taxonomy (why this is bounded, not infinite)

Every design detail — including margins, card size, responsive text, button size,
scrollbar/carousel controls — belongs to **exactly one of three buckets**. This is the
whole surface area; nothing falls outside it.

### Bucket A — Foundations (global tokens, no viewport logic)
Decided once, reused everywhere: **color · typography (families/scale/weights) ·
radius · shadow/elevation · border/stroke · icon sizes · motion/timing.**

### Bucket B — Responsive rules (how foundations react to screen width) — 7 layers
| # | Layer | Answers |
|---|-------|---------|
| 1 | **Breakpoints** | the widths where anything changes (e.g. 375 / 744 / 1024 / 1280 / 1440) |
| 2 | **Container & margins** | max content width; how the side **margin** grows/shrinks with the viewport |
| 3 | **Spacing scale** | base unit + section rhythm (1× / 2×) — *decided* |
| 4 | **Grid & gutters** | columns and the gap between them |
| 5 | **Type responsiveness** | how **text size reacts to width** — stepped (Apple) vs fluid `clamp()` |
| 6 | **Card / component sizing** | **card width rule, cards-per-row per breakpoint, gap, aspect ratio** |
| 7 | **Per-component min/max & height** | panel heights, hero caps, min/max clamps |

### Bucket C — Component recipes (each = a fixed spec built from A + B)
Each component gets: sizes (sm/md/lg) · states · how it reacts to width. This is where
**buttons and controls live**:
| Component | Attributes to lock |
|-----------|--------------------|
| **Button** | heights (sm/md/lg), padding-x, font size, radius, icon gap — per size |
| **Nav / menu bar** | pill height, gap, compact→scroll behavior (already built) |
| **Content card** | radius (28), padding, flat shadow, min/max width |
| **Carousel** | card width, gutter, **peek** amount, **arrow-control size**, **scrollbar/progress bar size**, snap |
| **Custom scrollbar** | track thickness, thumb size/color (the "auto scroll bar") |
| **Chip / badge / eyebrow** | height, padding, font, radius |
| **Accordion (FAQ)** | row padding, divider, open/close motion |
| **Input / control** | height, radius, padding — *authentic, keep* |
| **Product frames (mockups)** | **excluded** — keep authentic radii/fonts/shadows |

> Mapping your questions: "margins vs viewport" → **B2**. "card size / reaction" → **B6**.
> "text size when width changes" → **B5**. "button sizes" → **C/Button**. "auto scroll
> bar & carousel control sizes" → **C/Carousel + C/Scrollbar**. Every future detail slots
> into A, B, or C — that's the systematic guarantee.

### How each value gets filled
1. **Measure Apple across widths** (headless sweep) → read off their real rules for B2/B4/B5/B6.
2. **Audit Denker** at the same widths → find where it breaks.
3. **Write the spec** per layer + component. Then implementation is mechanical.

---

## 1. Apple reference (measured, visionOS — identical system on macOS)

### Typography — one family (SF Pro), one scale
| Role | Size / line-height | Weight | Tracking |
|------|--------------------|--------|----------|
| Display (hero + section H2) | **48 / 52** (1.08) | 600 | −0.14px |
| Title | **28 / 32** (1.14) | 600 | +0.20px |
| Lead paragraph | **21 / 29** (1.38) | 600 | +0.23px |
| Body / eyebrow | **17 / 21** (1.24) | 600 | −0.37px |
| Caption / nav / legal | **12 / 16** (1.33) | 400 | −0.12px |

- **One typeface** (SF Pro, optical Display vs Text swap above/below ~20px).
- Headings are all **600 (semibold)** — never a mix of weights.
- Large display text gets **negative tracking**; small text gets tighter line-height.

### Spacing — one base unit, quantized
- Base: **144px desktop / 112px mobile**. Every gap is **1× or 2×** — nothing else.
- **No forced section heights** (`min-height: 0` everywhere). Section height = content
  + padding. Measured sections ranged 74%–130% of the viewport.

### Radius — one card value
- Content surfaces: **28px**, uniform (27/27 sampled cards).
- Buttons: **8px** (CTA) or fully-rounded pill (nav chips).

### Shadows — none
- **0 of 27** content surfaces had a box-shadow. Depth comes from imagery, background
  tint, and spacing — not drop shadows.

### Buttons
- Height **36px**, padding-x **15px**, font **14px**, CTA radius **8px**, nav = pill.

---

## 2. Denker current state (audit)

| Token area | Current state | Verdict |
|------------|---------------|---------|
| **Font families** | 3: Satoshi (heading), Roboto (body), Geist (sans/mono) | ⚠️ Two is enough for marketing; Geist is fine reserved for the fake-app frames |
| **Type scale** | Ad-hoc `text-[28/32/36/38/40/48px]` with hand-matched `leading-[…]`; no shared scale | ❌ Main inconsistency |
| **Heading weights** | Mixed inline | ❌ Not standardized |
| **Spacing** | Ad-hoc `py-14 / py-16 / py-20 / py-36`, lopsided `pt-14 pb-36` | ❌ No base unit |
| **Card radius** | `rounded-[20]`, `[24]`, `[32]`, `[22]`, `[28]`, `2xl`, `xl` — all mixed | ❌ Should be one token |
| **Shadows** | 10+ distinct inline shadows (`0 30px 70px`, `0 40px 100px`, `0 4px 20px`…) | ❌ Too many; decide flat vs subtle |
| **Colors** | Rich token set already in `:root` (grey 50–950, primary, accent, glass) | ✅ Good; a few near-duplicate greys + some hardcoded hex |
| **Buttons** | One `Button` component, `h-12` pill, `text-lg` | ✅ Consistent (bigger/rounder than Apple — brand choice, keep) |
| **Menu bar** | `liquid-glass` pill nav, already reordered | ✅ Fine |

---

## 2b. Current → Target — THE GAP TABLE

Every token, Denker's current value vs the Apple-measured target, and the action.

| Token | Denker current | Apple target (measured) | Gap / action |
|-------|----------------|-------------------------|--------------|
| **Marketing font** | Satoshi + Roboto + Geist (3 families) | SF Pro (1) | swap marketing type → Inter/system; app frames keep Geist |
| **Display heading** | `text-[28/32/36/38/40/48]` ad-hoc + `leading-[…]` | **32→40→48** @744/1280, w600, lh~1.1 | replace all with stepped scale token |
| **Sub-headline** | inline, mixed | 17→19→21, w600 | tokenize |
| **Body** | inline, mixed | **14→17** @744, lh~1.24 | tokenize (steps once) |
| **Caption / eyebrow** | inline | 12 fixed, w400–500 | tokenize |
| **Heading weight** | mixed inline | 600 | standardize 600 |
| **Card radius** | `rounded-[20] sm:[24] md:[32]` (responsive!) | **28 constant** all widths | one token `28`, drop responsive |
| **Card shadow** | `shadow-[0_4px_20px_…]` + 10 more | **none** | remove on cards; keep float on frames only |
| **Container max-width** | `max-w-[1280px]` | 1260 cap | ~match (set 1260 or keep 1280) |
| **Side margin** | fixed `px-6/10/20` = 24/40/80 stepped | **6.25vw fluid** (23/47/64/80/90) | switch to `width:87.5%` fluid — diverges most at ~1024 |
| **Section vertical** | `py-14/16/20/36` ad-hoc | (Apple = content-height) | Denker choice: `min-h-100svh` panels |
| **Headline→subtitle gap** | `gap-2` (8) | **24 / 14** | increase — too tight today |
| **Copy→cards gap** | `gap-14/20/12` (56/80/48) | **56 / 40** | standardize (Pricing's 80 & carousel's 48 are off) |
| **Buttons** | single `h-12` pill + ad-hoc `h-8` | (Apple 1 size) | add sm/md/lg pill scale |
| **Carousel controls** | 36px disc, hidden scrollbar | 36 disc, hidden + paddles | ✅ already matches |
| **Color tokens** | rich set (grey 50–950, accent, glass) | — | ✅ keep; only merge near-dup greys + kill hardcoded hex |

**Biggest gaps:** type scale (ad-hoc→stepped), card radius (responsive→constant 28),
card shadows (many→none), side margin (stepped px→fluid 6.25vw), headline→subtitle
spacing (8→24). Color and carousel controls already essentially match.

---

## 3. Proposed Denker token system

Denker keeps its own brand (green accent, dark canvas, pill buttons) but adopts
Apple's **discipline**: fixed scales, quantized spacing, one radius, minimal shadow.

### 3a. Type scale — DECIDED: Apple-exact (add to `:root`, replace all marketing `text-[…]`)
| Token | Desktop | Mobile | Weight | Tracking |
|-------|---------|--------|--------|----------|
| `--text-display` | 48 / 52 | 40 / 44 | 600 | −0.003em |
| `--text-h2` | 40 / 44 | 30 / 34 | 600 | −0.003em |
| `--text-h3` | 28 / 32 | 24 / 28 | 600 | +0.007em |
| `--text-lead` | 21 / 29 | 19 / 27 | 400–500 | +0.011em |
| `--text-body` | 17 / 21 | 16 / 22 | 400 | −0.022em |
| `--text-eyebrow` | 12 / 16 | 12 / 16 | 500 | +0.02em (uppercase) |

Weights standardized: **headings 600**, body 400. Applies to **marketing sections only**.

### 3b. Spacing
- `--section-y: 96px` desktop / `64px` mobile. Gaps = **1× or 2×** only.
- **Decision pending (see §4):** full-screen panels vs content-height.

### 3c. Radius — DECIDED: 28px, MARKETING CONTENT CARDS ONLY
- `--radius-card: 28px` — applies to marketing **content tiles only** (integration
  tiles, pricing cards, testimonial cards, CTA/community cards). Replaces the mixed
  `rounded-[20/22/24/28/32]`, `2xl`, `xl` on those surfaces.
- **Verified constant across widths** (375→1440 all measured `28px`). Apple does **not**
  scale radius with screen size — so Denker's current 20→24→32 responsive radius is the
  thing being fixed. `--radius-card` stays 28 at every breakpoint.
- **DO NOT TOUCH component / product-UI radii.** The fake-app frames, liquid-glass
  chrome, controls, and appkit surfaces (`--radius-frame`, `--radius-control`,
  `--radius-control-sm`, `--radius-menu`, `--radius-surface-*`) stay exactly as-is —
  they must remain authentic to the real product UI.

### 3d. Shadows — DECIDED: flat marketing cards, keep float for frames
- Marketing content tiles: **no box-shadow** (Apple-flat). Remove the
  `shadow-[0_4px_20px_rgba(0,0,0,0.05)]` etc. Separation comes from tint + spacing.
- `--shadow-float`: keep the strong shadow **only** for the floating fake-app frames
  (they need to lift off the dark canvas — legitimate depth). Untouched.
- Retire the other 10+ ad-hoc inline marketing shadows.

### 3e. Fonts — DECIDED: split by context
- **Marketing / website type:** switch to an Apple-matching face. Recommended
  **Inter** (self-hosted, near-identical metrics to SF Pro, works cross-platform) or
  the native **system stack** (`-apple-system, BlinkMacSystemFont, …` → renders true
  SF Pro on Apple devices). Replaces Satoshi/Roboto for headings + body copy.
- **App-frame mockups keep their authentic product font** (Geist/appkit) — those
  reproduce the real desktop UI and must not change.

### 3f. Color — keep, tidy
- Merge near-duplicate greys (`grey-300 #a1a1a6` ≈ `grey-400 #98989d`).
- Replace hardcoded hex in components (e.g. Footer border `#E8E8ED`) with a token.
- Confirm every section uses `text-primary/secondary/tertiary`, not inline colors.

---

## 3g. Responsive spec — MEASURED from visionOS sweep (375→1728px)

Raw: `375→margin23/content328` · `744→47/651` · `1024→64/896` · `1280→80/1120` ·
`1440→90/1260` · `1728→234/1260`. Content is **exactly 87.5%** of viewport until cap.

### B1 — Breakpoints
`744` (mobile→tablet) · `1024` (tablet→laptop) · `1280` (laptop→desktop). Content cap
engages ~1440.

### B2 — Container & margins (single rule)
```
.container { width: 87.5%; max-width: 1260px; margin-inline: auto; }
```
Side margin = **6.25% of viewport** below cap, then `(100vw − 1260px) / 2` centered.
(Denker currently uses fixed `px-6 / px-10 / px-20` — replace with this % rule + cap.)

### B4 — Gutter
Grid/column gap: use the spacing scale (e.g. base `--space-3 = 20px`), not a % — Apple's
gutters are small fixed values relative to the fluid container.

### B5 — Type steps — FULLY MEASURED across 375/744/834/1024/1280/1440
Three bands only: **<744 · 744–1279 · ≥1280** (834 & 1024 identical to 744).
All sizes below are measured, not inferred. Note Apple runs almost everything at **w600**.
| Role | <744 | 744–1279 | ≥1280 | line-height | weight |
|------|------|----------|-------|-------------|--------|
| Display (section headline) | **32/36** | **40/44** | **48/52** | ~1.08–1.13 | 600 |
| Sub-headline | 17/21 | 19/23 | 21/24 | ~1.15 | 600 |
| Lead paragraph (large) | 19/27 | 24/28 | 28/32 | ~1.16 | 600 |
| Title (feature/card, H3) | 14/20 | 17/21 | 17/21 | ~1.25 | 600 |
| Body | 14/20 | 17/21 | 17/21 | ~1.24 | 600 |
| Caption / nav / eyebrow | 12/16 | 12/16 | 12/16 | 1.33 | 400 |

- **Display** steps at both 744 and 1280. **Body/Title** step **once** (at 744: 14→17),
  then hold. **Caption** never scales.
- ⚠️ Apple sets body copy at **w600**. For Denker's **longer-form** paragraphs, w400 reads
  better — proposed deliberate divergence (documented, not accidental). Confirm if you want
  literal w600 to match Apple exactly.

### B6 — Card / component sizing (spec'd, not copied — Apple uses a bento here)
Uniform grids (integration tiles, pricing) size from the container:
- Tile min width → `grid-template-columns: repeat(auto-fill, minmax(<min>, 1fr))`.
- Integration tiles: target ~3 cols mobile / 5–6 cols tablet+ ; clamp visible count so
  the grid fills exactly one panel, last cell = "500+ more" (see §4).
- Pricing: 1 col <744, 2 cols ≥744. Cards share equal width via the grid.

### B3b — Intra-block vertical rhythm (spacing WITHIN a section, measured)
The gap *inside* a content lockup — eyebrow→headline, headline→subtitle, text→card.
Measured at 1280 and 375 (ignoring layered/absolute media):
| Space between… | Desktop (1280) | Mobile (375) |
|----------------|---------------:|-------------:|
| eyebrow → headline | 12 | 8 |
| headline → subhead / lead paragraph | 24–26 | 14 |
| lead → body / paragraph → paragraph | 8–18 | 8–14 |
| **copy block → media / card** | **~55** | **~40** |

Maps to a base-4 scale (8 · 12 · 24 · 40 · 56). Proposed semantic tokens (desktop / mobile):
- `--gap-lockup: 12 / 8` — eyebrow ↔ headline (tight)
- `--gap-title-lead: 24 / 14` — headline → subtitle/lead
- `--gap-copy-media: 56 / 40` — text block → cards/media
- `--gap-para: 12 / 8` — paragraph → paragraph

**Denker today:** headline→subtitle is `gap-2` (8px) → **too tight** (target 24).
Copy→cards is `gap-14` (56 ✓) in Trust Badges but `gap-20` (80) in Pricing and `gap-12`
(48) in the carousel → **inconsistent**, standardize to 56/40.

### What actually changes as the screen resizes (measured summary)
| Property | <744 | 744–1279 | ≥1280 | >1440 |
|----------|------|----------|-------|-------|
| Content width | 87.5vw | 87.5vw | 87.5vw | locked 1260px |
| Side margin | ~6.25vw | ~6.25vw | ~6.25vw | grows (centered) |
| Display headline | 32 | 40 | 48 | 48 |
| Body / title | 14 | 17 | 17 | 17 |
| Caption / eyebrow | 12 | 12 | 12 | 12 |
| **Card radius** | **28** | **28** | **28** | **28** |
| Shadows | none | none | none | none |
| Section height | ≥100svh panels (Denker choice — Apple is content-height) |

Everything else (color, radius, shadow, weights) is **width-invariant**. Only container
width, side margin, and the two type steps move — nothing else.

---

## 4. Decisions — RESOLVED

1. **Section height model** — ✅ full-screen panels (`min-h-100svh`, centered, every
   section its own screen, mobile included). Groups sharing one screen:
   *Community + CTA*. Diverges from Apple (content-height) by choice.
2. **Type scale** — ✅ Apple-exact (48 / 28 / 21 / 17 / 12), headings weight 600.
3. **Shadows on marketing cards** — ✅ fully flat (frames keep `--shadow-float`).
4. **Card radius** — ✅ 28px, **content cards only** (component/frame radii untouched).
5. **Fonts** — ✅ marketing → Apple-matching (Inter or system stack); app frames keep
   authentic product font. *(Only sub-choice left: Inter vs system stack.)*

### Integration section (Trust Badges) — specific behavior
- It becomes a full-screen panel. **Clamp the visible integration tiles to the number
  that fills exactly one screen** at each breakpoint; the existing
  "More than 500+ integrations" tile is the last cell (overflow indicator).
- Its tiles also get the radius (→28) + flat-shadow treatment above.

---

## 4c. Component recipes (Bucket C) — current → target

### Button  *(Apple ref: h36 · r8 · padX15 · fs14 · w400)*
- **Current:** one size only — `h-12`(48) pill, `px-6`(24), `text-lg`(18), medium.
  Header overrides to `h-8`(32) ad-hoc → sizes are *not* systematized.
- **Target:** keep the **pill** brand shape, add a size scale:
  | Size | Height | Pad-x | Font | Use |
  |------|--------|-------|------|-----|
  | sm | 36 | 16 | 14 | header, dense |
  | md | 44 | 20 | 16 | in-card CTAs |
  | lg | 48 | 24 | 18 | hero / primary |
  Variants (primary green / secondary dark) unchanged.

### Carousel controls  *(already good — keep, just tokenize)*
- Shared `CarouselArrows`: `size-9`(36) disc, 16px chevron, `gap-3`, light `grey-100` /
  dark `white/10`. Matches Apple's ~36px control. Token: `--control-disc: 36px`.

### Custom scrollbar / progress  *(DECIDED — hidden + paddles, matches Apple)*
- **Verified:** every Apple carousel (`gallery` / `scroll-container` / `scrolling-container`)
  uses `scrollbar-width: none` and navigates via **paddle arrow buttons** (11 on visionOS,
  19 on Vision Pro). No progress bar.
- **Denker already matches this** (`scrollbar-none` + `CarouselArrows`). Keep hidden
  scrollbar + paddle controls; no change needed beyond tokenizing the 36px disc size.

### Chip / eyebrow · Accordion (FAQ) · Inputs
- Chip/eyebrow: height 24–28, pill, 12–13px, +0.02em, uppercase for eyebrows.
- FAQ accordion: consistent row padding + divider from the spacing scale.
- Inputs/controls: **authentic — keep** (product-UI radii/heights untouched).

---

## 5. Implementation phases (after decisions + other session's edits land)

1. **Tokens** — add type/spacing/radius/shadow tokens to `:root`; add Tailwind
   utility classes (`.t-display`, `.t-h2`, …) or `@theme` mappings.
2. **Typography sweep** — replace every marketing `text-[…]/leading-[…]` with a scale token.
3. **Radius sweep** — replace card radii with `--radius-card`.
4. **Shadow sweep** — replace inline shadows with `--shadow-card` / `--shadow-float`.
5. **Spacing + panels** — apply `.section-panel` (already scaffolded in globals.css) +
   the grouping; remove lopsided paddings.
6. **Verify** — screenshot desktop + mobile per section; check rhythm and readability.

> Already scaffolded (safe, in place): `.section-panel` utility in `globals.css`
> and the Features section converted to it. Everything else awaits the decisions above.
