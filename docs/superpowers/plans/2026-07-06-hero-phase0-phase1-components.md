# Hero Redesign — Phase 0 Sweep + Phase 1 Component Quality Gate

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove verified-dead hero code, then bring each of the six hero components to approved static quality — the gate before any motion work.

**Architecture:** Phase 0 deletes the dead space-switcher cluster and dead choreography CSS while keeping the current hero fully working. Phase 1 adds a dev-only gallery route rendering each component statically at its beat size; components are fixed and user-approved one at a time (MacBook first). Phase 2 (Motion timeline) is a separate plan, written only after the gate passes, per spec.

**Tech Stack:** Next.js (App Router), Tailwind + custom CSS in `app/globals.css`, existing components under `components/Hero/` and `components/production/`. `framer-motion` is already installed — Phase 2 will use it; this plan does not.

**Spec:** `docs/superpowers/specs/2026-07-06-hero-animation-redesign-design.md`

## Global Constraints

- Hard phase order: sweep → component gate → motion. No motion work in this plan.
- Phase 0 must not change any rendered pixel of the current site.
- Each Phase 1 component requires explicit user approval of a screenshot before its task is marked complete.
- Component quality criteria (from spec): proportions measured from the production app, readable at beat size and final-slot size, dark glass token consistency, no CSS-drawn approximations where a real asset exists.
- Verification commands: `npm run build` (type + build check); dev server via `npm run dev`.
- Never delete: `agent-dock.tsx`, `agent-avatar-preview.tsx`, `use-auth.ts`, `dicebear-styles.ts`, `desktop-mode-store.ts`, `project-store.ts`, `ColorBends.tsx` (all in use elsewhere).
- Commit after every task with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Delete the dead space-switcher cluster

**Files:**
- Delete: `components/production/canvas/space-switcher.tsx`
- Delete: `components/production/canvas/space-switcher-glass.ts`
- Delete: `components/production/canvas/space-switcher-compact-initial.tsx`
- Delete: `components/production/canvas/space-switcher-compact-anchor.ts`
- Delete: `components/production/canvas/use-space-switcher-hover-expansion.ts`
- Delete: `components/production/ui/context-menu.tsx`
- Delete: `components/production/ui/project-avatar.tsx`
- Delete: `components/production/lib/home-project-colors.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing — later tasks rely only on these files being gone.

- [ ] **Step 1: Re-verify each file is only imported by files in the deletion set**

Run for each basename:
```bash
cd /Users/juanzhang/Desktop/Denker/ClaudeCode/denker-landing-standalone
for n in space-switcher space-switcher-glass space-switcher-compact-initial space-switcher-compact-anchor use-space-switcher-hover-expansion context-menu project-avatar home-project-colors; do
  echo "--- $n"; grep -rln "$n" app components lib --include="*.ts" --include="*.tsx" | grep -v -E "space-switcher|context-menu|project-avatar|home-project-colors"
done
```
Expected: every `--- name` section prints no file paths. If any path prints, STOP — that file is not dead; remove it from the deletion list and update the spec.

- [ ] **Step 2: Delete the eight files**

```bash
git rm components/production/canvas/space-switcher.tsx \
  components/production/canvas/space-switcher-glass.ts \
  components/production/canvas/space-switcher-compact-initial.tsx \
  components/production/canvas/space-switcher-compact-anchor.ts \
  components/production/canvas/use-space-switcher-hover-expansion.ts \
  components/production/ui/context-menu.tsx \
  components/production/ui/project-avatar.tsx \
  components/production/lib/home-project-colors.ts
```

- [ ] **Step 3: Verify the build is green**

Run: `npm run build`
Expected: build completes with no type errors and no "module not found".

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove dead space-switcher component cluster

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Delete dead choreography CSS (keep the live hero working)

**Files:**
- Modify: `app/globals.css` (dead keyframes ~lines 6404–6491, 6677–6730, 6786–7001; dead selector bindings ~lines 7064–7462; media-query blocks referencing deleted classes)

**Interfaces:**
- Consumes: nothing.
- Produces: a globals.css where every remaining `hero-production-*` rule is referenced by rendered TSX. Phase 2's full choreography removal builds on this.

The current hero must keep animating identically after this task. Only rules whose class names appear in **zero** TSX files are removed.

- [ ] **Step 1: Build the dead-class list mechanically**

```bash
cd /Users/juanzhang/Desktop/Denker/ClaudeCode/denker-landing-standalone
grep -o 'hero-production-[a-z-]*' app/globals.css | sort -u > /tmp/css-names.txt
while read n; do
  grep -rq "$n" app components --include="*.tsx" || echo "DEAD: $n"
done < /tmp/css-names.txt
```
Expected DEAD list includes at least: `hero-production-stage-switcher`, `hero-production-stage-agent` (exact match only — NOT `stage-agent-reveal`, which is live), `hero-production-stage-team`, `hero-production-stage-taskboard`, `hero-production-stage-bubble`, `hero-production-flatlay`, `hero-production-device-stage`, `hero-production-taskboard`, `hero-production-welcome`, `hero-production-checklist`, `hero-production-toolbar`, `hero-production-agents`, `hero-production-cursor`, `hero-production-macbook` (the OLD macbook class — verify; the live one is `hero-production-desktop-macbook`).
Caution: grep matches substrings — `hero-production-stage-agent` appears inside `hero-production-stage-agent-reveal`. Use word-boundary checks (`grep -rE "hero-production-stage-agent[\"' ]"`) before declaring a prefix-name dead.

- [ ] **Step 2: Delete each dead rule block and its keyframes**

For every confirmed-dead name: delete its selector blocks, its `@keyframes` (including all `*-cinematic` keyframes: `hero-production-flatlay-cinematic`, `hero-production-device-stage-cinematic`, `hero-production-macbook-cinematic`, `hero-production-html-cinematic`, `hero-production-agents-cinematic`, `hero-production-voice-cinematic`, `hero-production-cursor-cinematic`), and any lines inside `@media` blocks or `prefers-reduced-motion` lists that reference it (e.g. the selector list at globals.css:3939–3947 names several dead stages — remove just those selectors from the list, keep the block).

- [ ] **Step 3: Verify no dangling references remain**

```bash
grep -o 'hero-production-[a-z-]*' app/globals.css | sort -u | while read n; do
  grep -rq "$n" app components --include="*.tsx" || echo "STILL DEAD: $n"
done
```
Expected: no output (every remaining name is used in TSX).

- [ ] **Step 4: Visual regression check**

Run: `npm run dev`, open the homepage, watch one full 23s hero cycle.
Expected: animation identical to before (same stages, same timings). Also run `npm run build` — green.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "chore: remove dead hero choreography CSS

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Component gallery route (the Phase 1 review harness)

**Files:**
- Modify: `components/Hero/HeroMockup.tsx` (add `export` to `ProductionAgentFrame`, `ProductionHtmlFrame`, `HeroVoiceListeningIndicator`, `OnboardingDenkerIntro`, `HeroFinalTopDownMacBook`, `HeroDesktopFocusDisplay`)
- Create: `app/hero-components/page.tsx`

**Interfaces:**
- Consumes: the six components above, exported from `components/Hero/HeroMockup.tsx`.
- Produces: dev route `/hero-components` rendering each component in a labeled cell at its beat width (percentage of a 1440px stage: logo 23%, team 24%, voice 18%, cursor 10%, macbook 36%, book 30%). Tasks 4–8 screenshot cells from this route.

- [ ] **Step 1: Export the six components from HeroMockup.tsx**

Change `function ProductionAgentFrame(` → `export function ProductionAgentFrame(`, and likewise for `ProductionHtmlFrame`, `HeroVoiceListeningIndicator`, `OnboardingDenkerIntro`, `HeroFinalTopDownMacBook`, `HeroDesktopFocusDisplay`.

- [ ] **Step 2: Create the gallery page**

```tsx
// app/hero-components/page.tsx
import {
  HeroDesktopFocusDisplay,
  HeroFinalTopDownMacBook,
  HeroVoiceListeningIndicator,
  OnboardingDenkerIntro,
  ProductionAgentFrame,
  ProductionHtmlFrame,
} from "@/components/Hero/HeroMockup";

const CELLS: { id: string; beatWidth: string; node: React.ReactNode }[] = [
  { id: "logo", beatWidth: "23%", node: <OnboardingDenkerIntro /> },
  { id: "team", beatWidth: "24%", node: <ProductionAgentFrame /> },
  { id: "voice", beatWidth: "18%", node: <HeroVoiceListeningIndicator staticMode /> },
  // cursor bubble cell added in Task 7 when the component exists
  { id: "macbook-current", beatWidth: "36%", node: <HeroDesktopFocusDisplay /> },
  { id: "macbook-topdown", beatWidth: "36%", node: <HeroFinalTopDownMacBook /> },
  { id: "book", beatWidth: "30%", node: <ProductionHtmlFrame /> },
];

export default function HeroComponentsGallery() {
  return (
    <main style={{ background: "#000", minHeight: "100svh", padding: 48 }}>
      {CELLS.map((cell) => (
        <section key={cell.id} data-cell={cell.id} style={{ marginBottom: 64 }}>
          <h2 style={{ color: "#9a9a9a", font: "600 13px/1.4 system-ui", marginBottom: 12 }}>
            {cell.id} — beat width {cell.beatWidth}
          </h2>
          <div style={{ width: cell.beatWidth, minWidth: 120, position: "relative" }}>
            {cell.node}
          </div>
        </section>
      ))}
    </main>
  );
}
```
Note: this page is a dev review harness; it is deleted (or gated) at the end of Phase 1 (Task 8). If a component needs a fixed height wrapper to render (the frames use `h-full`), add an inline `aspectRatio` on the wrapper div matching its natural proportions — record the value used.

- [ ] **Step 3: Verify the route renders every cell**

Run: `npm run dev`, open `http://localhost:3000/hero-components`.
Expected: six labeled cells, each component visible on black, no console errors.

- [ ] **Step 4: Commit**

```bash
git add app/hero-components/page.tsx components/Hero/HeroMockup.tsx
git commit -m "feat: dev gallery route for hero component review

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: MacBook component redesign (USER GATE)

**Files:**
- Create: `components/Hero/HeroMacBook.tsx`
- Modify: `components/Hero/HeroMockup.tsx` (solo desktop stage uses `HeroMacBook`; delete `HeroDesktopFocusDisplay`)
- Modify: `app/hero-components/page.tsx` (replace both macbook cells with one `HeroMacBook` cell)
- Assets: `public/images/hero/denker-macbook-physical-tight-opaque.png` (device), `public/images/hero/denker-desktop-screenshot.jpg` (screen content)

**Interfaces:**
- Consumes: gallery route from Task 3.
- Produces: `export function HeroMacBook({ className }: { className?: string })` — the single MacBook used by BOTH the solo beat and the finale (Apple pattern: one object throughout). `HeroDesktopFocusDisplay` no longer exists.

- [ ] **Step 1: Build HeroMacBook from the physical asset**

```tsx
// components/Hero/HeroMacBook.tsx
import Image from "next/image";
import { cn } from "@/lib/cn";

// Screen inset within denker-macbook-physical-tight-opaque.png, measured in
// percentages of the asset's natural box. MEASURE these against the actual
// PNG before committing (open it, note the screen corners) — the values
// below are the starting estimate to correct.
const SCREEN = { left: "11.4%", top: "5.2%", width: "77.2%", height: "47.8%" };

export function HeroMacBook({ className }: { className?: string }) {
  return (
    <div className={cn("hero-macbook", className)}>
      <Image
        src="/images/hero/denker-macbook-physical-tight-opaque.png"
        alt=""
        fill
        sizes="(max-width: 767px) 82vw, 44vw"
        className="hero-macbook-device"
        priority
      />
      <div className="hero-macbook-screen" style={SCREEN} aria-hidden="true">
        <Image
          src="/images/hero/denker-desktop-screenshot.jpg"
          alt=""
          fill
          sizes="40vw"
          className="hero-macbook-screen-image"
        />
      </div>
    </div>
  );
}
```
Add to `app/globals.css` (in the hero component styling section):
```css
.hero-macbook {
  position: relative;
  aspect-ratio: 2040 / 1919; /* verify against the PNG's real dimensions */
}
.hero-macbook-device { object-fit: contain; }
.hero-macbook-screen {
  position: absolute;
  overflow: hidden;
  border-radius: 1.2% / 2%;
}
.hero-macbook-screen-image { object-fit: cover; object-position: center top; }
```

- [ ] **Step 2: Wire into HeroMockup and the gallery; delete the CSS-drawn shell**

In `HeroMockup.tsx`: `hero-production-stage-desktop` renders `<HeroMacBook />`; remove `HeroDesktopFocusDisplay` and its CSS (`hero-production-desktop-macbook*`, `hero-production-desktop-screen*`) if no longer referenced. Final layout's `HeroFinalTopDownMacBook` is also replaced by `HeroMacBook` (one component, per Produces above) — delete `HeroFinalTopDownMacBook`.

- [ ] **Step 3: Verify + screenshot**

Run: `npm run build` (green), then dev server; screenshot the `macbook` gallery cell at 1440px viewport.

- [ ] **Step 4: USER GATE — send screenshot, wait for approval**

Send the screenshot to the user. Iterate on their feedback (screen alignment, crop, shadow). Do not proceed to Task 5 until approved.

- [ ] **Step 5: Commit**

```bash
git add components/Hero/HeroMacBook.tsx components/Hero/HeroMockup.tsx app/hero-components/page.tsx app/globals.css
git commit -m "feat: asset-based HeroMacBook replaces CSS-drawn shell

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Team frame proportions (USER GATE)

**Files:**
- Modify: `app/globals.css` (`hero-production-agent-*` sizing rules)
- Modify: `components/Hero/HeroMockup.tsx` (agent list content only if row count/data must change)
- Reference: production screenshot `/Users/juanzhang/Downloads/screenshot/Screenshot 2026-07-01 at 20.28.43.png` (from design-qa.md; ask the user for a fresh one if missing)

**Interfaces:**
- Consumes: gallery route.
- Produces: approved `ProductionAgentFrame` at 24% beat width; its approved aspect ratio recorded in the plan-notes comment at the top of the gallery page (Phase 2 needs it for slot math).

- [ ] **Step 1: Measure the production app's team panel**

Open the reference screenshot; measure: frame width:height ratio, row height / frame width, avatar diameter / row height, name & model font sizes relative to row, header height, list padding. Write the measured ratios as a comment block above `ProductionAgentFrame`.

- [ ] **Step 2: Apply measurements to the CSS**

Adjust `.hero-production-agent-row` height, `.hero-production-agent-avatar` size, `.hero-production-agent-name` / `.hero-production-agent-model` type scale, and frame padding so the beat-width render matches the measured ratios. Show 10 rows only if production shows 10; otherwise trim the `agentRows` data to what production shows.

- [ ] **Step 3: Screenshot the `team` cell; USER GATE**

Send screenshot beside a crop of the production panel. Iterate until approved.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css components/Hero/HeroMockup.tsx app/hero-components/page.tsx
git commit -m "fix: team frame proportions measured from production

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Book Notes frame corrections (USER GATE)

**Files:**
- Modify: `components/Hero/HeroMockup.tsx` (`ProductionHtmlFrame`, `bookTakeaways` if content layout changes)
- Modify: `app/globals.css` (`hero-production-html-*`, `hero-production-book-*`, `hero-production-takeaway-*` rules)

**Interfaces:**
- Consumes: gallery route.
- Produces: approved `ProductionHtmlFrame` at 30% beat width; approved aspect ratio recorded alongside Task 5's.

- [ ] **Step 1: Collect the user's specific objections**

Ask the user what "not quite right" means concretely before touching CSS: cover size? row density? typography scale? header/footer weight? Record answers as acceptance criteria in the gallery page comment.

- [ ] **Step 2: Apply fixes per the recorded criteria**

Adjust the named CSS rules; keep the three-book structure unless the user says otherwise.

- [ ] **Step 3: Screenshot the `book` cell; USER GATE**

Iterate until approved.

- [ ] **Step 4: Commit**

```bash
git add components/Hero/HeroMockup.tsx app/globals.css app/hero-components/page.tsx
git commit -m "fix: book notes frame layout per review

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Cursor bubble component + logo/voice review (USER GATE)

**Files:**
- Create: `components/Hero/HeroCursorBubble.tsx`
- Modify: `app/hero-components/page.tsx` (add `cursor` cell at 10% beat width)

**Interfaces:**
- Consumes: `AgentCursorArrow` from `components/production/cursors/agent-cursor-arrow.tsx`.
- Produces: `export function HeroCursorBubble({ className }: { className?: string })` — the new small beat: Denker cursor + compact glass chat bubble with a short static line ("Scheduling your debrief…"). Phase 2 animates typing dots; this task ships the static approved look.

- [ ] **Step 1: Build the static cursor bubble**

```tsx
// components/Hero/HeroCursorBubble.tsx
import { AgentCursorArrow } from "@/components/production/cursors/agent-cursor-arrow";
import { cn } from "@/lib/cn";

const DENKER_GREEN = "#30D158";

export function HeroCursorBubble({ className }: { className?: string }) {
  return (
    <div className={cn("hero-cursor-bubble", className)}>
      <AgentCursorArrow
        color={DENKER_GREEN}
        mode="glass"
        shape="soft"
        liquidLevel={0.36}
        width={15}
        height={19}
        position="absolute"
      />
      <div className="hero-cursor-bubble-chip">
        <span className="hero-cursor-bubble-name">Denker</span>
        <span className="hero-cursor-bubble-text">Scheduling your debrief…</span>
      </div>
    </div>
  );
}
```
Style `.hero-cursor-bubble*` in globals.css using the dark glass tokens already applied to the voice capsule (reuse the same background/stroke variables — check `.hero-production-voice-glass` for the token names and copy the pattern, not new values).

- [ ] **Step 2: Screenshot `cursor`, `logo`, `voice` cells; USER GATE**

All three go to the user together (logo and voice are expected passes; fix if rejected). Iterate until all three approved.

- [ ] **Step 3: Commit**

```bash
git add components/Hero/HeroCursorBubble.tsx app/hero-components/page.tsx app/globals.css
git commit -m "feat: cursor bubble small-beat component; logo/voice review pass

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Final flat-lay composition + asset/harness cleanup (USER GATE)

**Files:**
- Modify: `app/hero-components/page.tsx` (add full-width `flatlay` cell composing all six approved components in the final-layout positions)
- Modify: `components/Hero/HeroMockup.tsx` (final layout uses the approved components; remove any now-unused pieces)
- Delete: orphaned assets in `public/images/hero/` (audit) and the gallery route

**Interfaces:**
- Consumes: all approved components from Tasks 4–7.
- Produces: the approved final-frame composition — the exact layout Phase 2's timeline settles into (slot positions recorded as CSS custom properties or a `FINAL_SLOTS` const exported from `components/Hero/HeroMockup.tsx`).

- [ ] **Step 1: Compose the flat-lay cell**

Full-width cell, ~2.6:1 aspect (Apple's 2500×950): MacBook left (~44% width), Team frame center (~22%), Book Notes right (~30%), voice capsule bottom-center, cursor bubble in the gap — matching the current final layout's slots but built from the approved components. Record each slot as `{ top, left, width }` in a `FINAL_SLOTS` exported const.

- [ ] **Step 2: Screenshot; USER GATE**

Compare side-by-side with `tmp/applevision-frames/apple-hero-contact-sheet.png` bottom rows for compositional balance. Iterate until approved.

- [ ] **Step 3: Audit and delete orphaned hero assets**

```bash
cd /Users/juanzhang/Desktop/Denker/ClaudeCode/denker-landing-standalone
for f in public/images/hero/*; do
  n=$(basename "$f"); grep -rq "$n" app components || echo "ORPHAN: $n"
done
```
Delete each ORPHAN with `git rm`. Expected orphans after Task 4: `denker-macbook-physical.png`, `denker-macbook-physical-tight.png`, `denker-macbook-screen.png` if unreferenced — trust the grep, not this list.

- [ ] **Step 4: Remove or gate the gallery route**

Delete `app/hero-components/page.tsx` (the approved states now live in the real hero; `FINAL_SLOTS` moved to `HeroMockup.tsx`). Keep it only if the user asks to retain it for Phase 2 review.

- [ ] **Step 5: Build green + commit**

Run: `npm run build`. Expected: green.
```bash
git add -A
git commit -m "feat: approved hero final flat-lay; sweep orphaned assets and review harness

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## After this plan

Phase 1 gate is passed (all six components + flat-lay approved). Write the Phase 2 plan (Motion timeline per the spec's beat sheet) with superpowers:writing-plans — it consumes `HeroMacBook`, `HeroCursorBubble`, `FINAL_SLOTS`, and the recorded aspect ratios from Tasks 5–6.
