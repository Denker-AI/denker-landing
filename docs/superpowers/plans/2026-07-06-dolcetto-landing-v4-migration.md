# Dolcetto Landing → Tailwind v4 Migration & Redesign Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the new landing redesign (currently in the standalone `Denker-AI/denker-landing` repo, branch `codex/visionos-layout-pass`) into the canonical `denker-dolcetto/landing` monorepo app, and re-theme every existing landing page — plus the web-app desktop-handoff page — to the new design tokens.

**Architecture:** The redesign is Tailwind v4 (`@theme inline`, no config file) on Next 16; Dolcetto's landing is Tailwind v3 (`tailwind.config.js`) on Next 15 with an older glass/Satoshi token system. The two are **different repos with different build systems** — this is a port + framework upgrade, NOT a `git merge`. We upgrade Dolcetto's landing to the v4/Next-16 baseline FIRST (Plan 1), then port the redesign onto it (Plans 2–3), re-theme the existing pages that the redesign never touched (Plan 4), rewire the newsletter form to the existing Resend API (Plan 5), and finally re-theme the separate web-app handoff page (Plan 6).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), TypeScript 5.8.

## Global Constraints

- **Target framework floor:** Next `16.2.9`, React `19.2.4`, Tailwind `^4`, `@tailwindcss/postcss ^4` — matched to the redesign repo's `package.json`.
- **Canonical target repo:** `github.com/Denker-AI/denker-dolcetto`, app path `landing/`. All Plan 1–5 work lands there.
- **Source of the redesign:** `github.com/Denker-AI/denker-landing`, branch `codex/visionos-layout-pass` (this working tree).
- **Do NOT delete existing Dolcetto landing pages/integrations.** The redesign branch deleted blog, download, 404, docs, privacy, terms, traction, `/api/newsletter`, `/api/broadcast`, cookie-consent, PostHog, LinkedIn, SEO — those all still exist in Dolcetto and must be preserved and re-themed, never dropped.
- **New marketing tokens to preserve verbatim** (from `app/design-tokens.css`): `--font-marketing`, `--radius-card: 28px`, and the `@layer components` typography utilities `.t-display`, `.t-lead`, `.t-title`, `.t-body`, `.t-caption`, plus `.section-tint`, `.radius-card`, `.font-marketing`, and gap utilities `gap-copy-media`, `gap-title-lead`.
- **Shared tokens already in both systems** (do not duplicate/conflict): `--color-canvas`, `--color-surface`, `--color-accent`, `--color-elevated`, `glass-fill/stroke/*`. The redesign's `@theme inline` values win where they differ.
- **Verification model:** framework/CSS work is verified by `next build` succeeding + dev-server render + per-route visual check, not unit tests. Component logic (newsletter submit) is verified by its existing tests.
- **Env vars (already in Dolcetto, keep):** `RESEND_API_KEY`, `RESEND_FULL_ACCESS_API_KEY`, `RESEND_AUDIENCE_ID`, `BROADCAST_SECRET`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.

## Plan Sequence & Dependencies

Each plan below is its own testable deliverable. **Plans 2–6 are dependency-gated** on Plan 1 landing, and each will be expanded into full bite-sized TDD steps at the start of its own execution session (the exact re-theme diffs depend on the upgraded baseline, so writing them now would be speculative). This plan is the master sequencing document plus the fully-detailed Plan 1.

```
Plan 1  Framework upgrade (v3→v4, Next 15→16)      ← prerequisite gate
   ├─ Plan 2  Token unification (design-tokens.css) ← needs 1
   │     └─ Plan 3  Homepage + component port       ← needs 2
   │           ├─ Plan 4  Re-theme existing pages   ← needs 3
   │           └─ Plan 5  Newsletter rewire          ← needs 3
Plan 6  Handoff page (dolcetto/frontend, separate)  ← independent; needs new tokens (Plan 2 values)
```

---

## Plan 1: Framework Upgrade — Dolcetto landing to Tailwind v4 + Next 16

**Goal:** Get `denker-dolcetto/landing` building and rendering identically on Tailwind v4 + Next 16 **before** any redesign content lands, so the upgrade is isolated from the port and independently reviewable/revertible.

**Files:**
- Modify: `denker-dolcetto/landing/package.json` (dep bumps)
- Delete: `denker-dolcetto/landing/tailwind.config.js`, `denker-dolcetto/landing/postcss.config.js`
- Create: `denker-dolcetto/landing/postcss.config.mjs` (v4 plugin)
- Modify: `denker-dolcetto/landing/app/globals.css` (v3 directives → v4 `@import` + `@theme`)
- Reference: `app/globals.css` and `app/design-tokens.css` in THIS repo as the v4 target idiom.

**Interfaces:**
- Produces: a v4/Next-16 landing app whose existing routes (`/`, `/blog`, `/download`, `/docs/*`, `/privacy`, `/terms`, `/traction`, `/not-found`) render visually unchanged. Every downstream plan consumes this baseline.

- [ ] **Step 1: Branch in the Dolcetto repo**

```bash
cd /Users/juanzhang/Desktop/Denker/ClaudeCode/denker-dolcetto
git checkout -b landing/v4-upgrade
```

- [ ] **Step 2: Capture baseline screenshots of every route (visual regression reference)**

Start the current v3 dev server and screenshot each route at desktop + mobile widths, saving to `landing/tmp/baseline/`. These are the "must match after upgrade" reference. Routes: `/`, `/blog`, `/blog/<any-slug>`, `/download`, `/docs`, `/privacy`, `/terms`, `/traction`, plus a forced 404.

- [ ] **Step 3: Bump dependencies to the v4/Next-16 floor**

In `landing/package.json`, set `next` → `16.2.9`, `react`/`react-dom` → `19.2.4`, replace `tailwindcss ^3.4.0` + `autoprefixer` + `postcss` devDeps with `tailwindcss ^4` and add `@tailwindcss/postcss ^4`. Then:

```bash
cd landing && npm install
```

Expected: install succeeds; `@tailwindcss/postcss` present, `autoprefixer` removed.

- [ ] **Step 4: Replace PostCSS config with the v4 plugin**

Delete `postcss.config.js`; create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

- [ ] **Step 5: Convert `globals.css` from v3 directives to v4**

Replace the top three v3 lines:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

with the v4 import, and migrate the existing `:root` / `.dark` custom-property blocks into a v4 `@theme inline` block for anything referenced as a Tailwind color/shadow/radius token (mirroring the pattern in this repo's `app/globals.css`). The `darkMode: "class"` behavior moves to a `@custom-variant dark (&:where(.dark, .dark *))` declaration. Keep every existing CSS variable name and value.

- [ ] **Step 6: Delete `tailwind.config.js`**

```bash
git rm landing/tailwind.config.js
```

The color/shadow/radius/font mappings it defined (`canvas`, `glass-*`, `primary`, `frame-*`, `shadow-glass`, `rounded-glass`, `font-satoshi`, etc.) must now be expressed as `@theme inline` entries in `globals.css` (Step 5). Cross-check the config's `theme.extend` against the new `@theme` block — every mapping must have an equivalent or a custom utility.

- [ ] **Step 7: Build**

```bash
cd landing && npm run build
```

Expected: PASS. Fix v4 breakages as they surface — most common: renamed/removed utilities, `@apply` of a now-undefined token, and the `darkMode` variant. Iterate Step 5–7 until green.

- [ ] **Step 8: Visual-regression check every route against Step-2 baselines**

Run `npm run dev`, screenshot the same routes at the same widths, diff against `tmp/baseline/`. Expected: pixel-parity (or explained, intentional diffs only). Pay special attention to `liquid-glass`, `.text-section-heading`, glass borders, dark-mode toggle, and the cookie banner.

- [ ] **Step 9: Commit**

```bash
cd /Users/juanzhang/Desktop/Denker/ClaudeCode/denker-dolcetto
git add landing/
git commit -m "chore(landing): upgrade to Tailwind v4 + Next 16 (no visual change)"
```

**Acceptance:** `npm run build` passes and all existing routes render identically to the v3 baseline. No redesign content yet.

---

## Plan 2: Token Unification (dependency-gated on Plan 1)

**Deliverable:** `design-tokens.css` from this repo lives in Dolcetto landing and its `@theme`/`@layer components` merge cleanly with Dolcetto's existing tokens, with all conflicts (notably `--color-primary`, `--color-canvas`, `--color-surface`, `--color-accent`) resolved to the redesign's values, and the new marketing utilities (`.t-display`, `.t-lead`, `.t-title`, `.t-body`, `.t-caption`, `.section-tint`, `.radius-card`, gap utilities) available app-wide.

**Files:** `landing/app/design-tokens.css` (new, copied), `landing/app/globals.css` (import it), `landing/app/layout.tsx` (fonts: add Geist/Roboto + Satoshi wiring).

**Acceptance:** existing pages still render (old tokens intact where not intentionally overridden); the new utilities resolve on a scratch test page. To be expanded into bite-sized steps at execution time.

---

## Plan 3: Homepage + Component Port (dependency-gated on Plan 2)

**Deliverable:** the redesigned homepage renders in Dolcetto landing using the new components.

**Files:** copy `components/{Header,Hero,WhatDenkerCanDo,BuiltForFounders,WhyDenkerAI,TrustBadges,Testimonials,Pricing,ReachOut,FAQ,Footer,ui,production}` and `lib/{links,cn,useDragScroll,useDeckCarousel}.ts` from this repo into `landing/`; replace `landing/app/page.tsx` with the redesign's; reconcile the two `Header`/`Footer` implementations so ONE shared header/footer is used site-wide (the new one).

**Acceptance:** `/` matches the redesign; header/footer are the new shared components; `next build` passes. Carry over the already-fixed `DOWNLOAD_URL` (`/download`) and `LOGIN_URL` from `lib/links.ts`. Expanded at execution time.

---

## Plan 4: Re-theme Existing Pages (dependency-gated on Plan 3)

**Deliverable:** every page the redesign never touched adopts the new tokens and the shared new Header/Footer.

**Files (re-theme, do not delete):** `landing/app/blog/page.tsx`, `landing/app/blog/[slug]/page.tsx`, `landing/components/blog-*.tsx`, `landing/app/download/page.tsx` + `download-client.tsx`, `landing/app/not-found.tsx`, `landing/app/docs/*`, `landing/app/privacy/page.tsx`, `landing/app/terms/page.tsx`, `landing/app/traction/page.tsx`.

**Acceptance:** each page uses new tokens (`grey-*`, `primary-*`, `t-*`, `radius-card`, `section-tint`), renders the new Header/Footer, and the "Blog" nav link is internal (`/blog`), not the external `www.denker.ai/blog`. Per-page bite-sized re-theme diffs written at execution time against the upgraded baseline.

---

## Plan 5: Newsletter Rewire (dependency-gated on Plan 3)

**Deliverable:** the redesign's `ReachOut` "Join" form actually subscribes via the existing Resend API.

**Files:** `landing/components/ReachOut/ReachOut.tsx` (replace stub `handleSubmit` with a `POST /api/newsletter` call mirroring the old `components/newsletter-form.tsx` — loading/success/error states); keep `landing/app/api/newsletter/route.ts` as-is.

**Acceptance:** submitting a valid email hits `/api/newsletter`, adds the contact to the Resend audience, and shows success; invalid email and rate-limit paths handled. Verified against a test Resend audience per repo `.env`. Expanded at execution time.

---

## Plan 6: Desktop Handoff Page Re-theme (independent; needs Plan 2 token values)

**Deliverable:** `denker-dolcetto/frontend/src/pages/auth/desktop-handoff-page.tsx` (and `desktop-success-page.tsx`) restyled to match the new landing — home-page background, new card/token/button styling.

**Note:** this is the **web app** (`space.denker.ai`), a separate React SPA with its **own** design system (`frontend/src/index.css`), NOT the Next landing. This plan applies the new landing's visual language (background, card radius `--radius-card`, button styles, accent) into the app's own token/CSS conventions — it does not import the landing's Tailwind setup. Scoped and expanded separately once the new token values are locked in Plan 2.

**Acceptance:** the handoff and success pages visually match the landing's look (background, cards, buttons) while staying within the frontend app's build system.

---

## Self-Review

- **Spec coverage:** newsletter/Resend → Plan 5; footer Docs removal + Cookies wiring → folded into Plan 4 (footer) / Plan 3 (shared footer) — *note: the "remove Docs, wire Cookies" footer fixes and the `DOWNLOAD_URL` fix are already done in the redesign repo and travel with the Plan 3 port*; background residue → resolved by single token system (Plans 1–2); blog re-theme → Plan 4; header consistency → Plan 3; Get Started/Download wiring → already fixed, carried in Plan 3; handoff/download/404 re-theme → Plans 4 & 6. All requirements mapped.
- **Decomposition:** 6 dependency-gated plans, each an independently testable deliverable; Plan 1 fully detailed, Plans 2–6 scoped with files + acceptance and expanded at their own execution start (justified: re-theme specifics depend on the upgraded baseline).
- **Risk flags:** (1) Tailwind v4 removes/renames some v3 utilities — Plan 1 Step 7 iterates until build-green; (2) `--color-primary` means different things in the two systems (green brand vs white text) — Plan 2 must resolve deliberately; (3) two `Header`/`Footer` implementations — Plan 3 must converge on one; (4) reconcile with Dolcetto's existing `.claude/worktrees/landing-redesign` worktree before starting, in case work overlaps.
