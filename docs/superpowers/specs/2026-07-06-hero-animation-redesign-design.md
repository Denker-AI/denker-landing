# Hero Animation Redesign — Design Spec

Date: 2026-07-06
Status: Approved approach (Option B — JS timeline), pending spec review

## Goal

Replace the current 23s CSS-keyframe hero choreography with a 14s Motion-driven
timeline that matches the motion quality of Apple's visionOS hero video
(https://www.apple.com/os/visionos/), while keeping all existing presentational
components. The old choreography system is removed entirely — no legacy
keyframes coexist with the new system.

## Reference data (measured from Apple's hero video)

Source: `tmp/applevision-frames/apple-hero-xlarge.mp4` (2500×950, 30fps, 13.6s),
frame sheets in the same directory.

- 6 solo beats + finale in 13.6s. Each solo beat ≈ 1.4–1.5s:
  enter ~0.3–0.4s, hold ~1s, exit ~0.3s overlapping the next entry.
- All solo beats share one optical center (x = 50%, y ≈ 55% of frame height).
- Entries: fade in ~8% small, ease up to rest with slight upward settle.
- Exits: slide down + fade at near-full scale (never shrink to a point).
- Holds: screen content keeps animating; continuous micro-zoom.
- Finale: the iPhone (beat-2 device) re-enters center at 10.0s as the anchor
  and never exits again — it travels continuously into its ensemble slot while
  MacBook (left), iPad (right), Watch and Vision Pro (bottom) fly in around it.
  Peak motion 10.4–10.6s, exponential settle to rest by 13.0s, reflections fade
  in during the settle, final still holds forever.
- Device sizes stay true to relative scale (Watch 9% of frame width,
  iPhone 21%, iPad 24%, MacBook 36%; finale spans ~85%).

## Component mapping (kept components → Apple roles)

| Ours (kept as-is)                | Apple counterpart        | Role |
|----------------------------------|--------------------------|------|
| Denker liquid-glass logo bubble  | Siri glow                | Brand/AI opener |
| Team frame (`ProductionAgentFrame`) | iPhone                | First product surface AND finale anchor (appears twice by design) |
| Voice indicator (`HeroVoiceListeningIndicator`) | Vision Pro passthrough | Ambient AI presence |
| Denker cursor bubble (from `components/production/cursors/`) | Watch | Quick small-object beat (new beat) |
| MacBook desktop                  | MacBook                  | Big productivity surface |
| Book Notes frame (`ProductionHtmlFrame`) | iPad             | AI-produced content surface |
| Final flat-lay                   | Finale ensemble          | Family shot |

## Beat sheet (14.0s)

All solo beats share one optical center: x = 50%, y = 55% of the stage.
Entries overlap the previous exit by ~0.15–0.2s.

| # | Beat          | Enter    | Hold until | Exit      | Width (≈ stage) | Life during hold |
|---|---------------|----------|------------|-----------|-----------------|------------------|
| 1 | Logo bubble   | 0.0–0.5  | 1.8        | 1.8–2.2   | 23%             | breathing (existing ambient loop) |
| 2 | Team frame    | 2.0–2.4  | 3.6        | 3.6–4.0   | 24%             | one agent row highlights; status dot pulses |
| 3 | Voice         | 3.9–4.3  | 5.4        | 5.4–5.8   | 18%             | waveform (existing) |
| 4 | Cursor bubble | 5.7–6.0  | 6.9        | 6.9–7.2   | ~10% (true scale) | typing dots resolve to a short line |
| 5 | MacBook       | 7.1–7.5  | 8.9        | 8.9–9.3   | 36%             | screen content swaps once mid-hold |
| 6 | Book Notes    | 9.2–9.6  | 10.4       | 10.4–10.7 | 30%             | highlight sweep over one takeaway |
| 7 | Finale        | 10.5–13.5 settle, still 13.5–14.0 → `ended` state | | | ~85% | |

Book Notes exits like every other solo beat (slide down + fade, 10.4–10.7),
then re-enters from the right edge at 11.1s into its final slot — mirroring
Apple, where the iPad leaves and returns during the assembly.

Finale choreography: at 10.5s the Team frame re-enters center large (anchor,
its second appearance). From 10.7s it travels/scales continuously into its
final center slot (FLIP, 2.2s expo-out, no opacity dip). Staggered fly-ins:
MacBook from left edge at 10.9s, Book Notes from right at 11.1s, voice rises
from bottom at 11.3s, cursor bubble settles last at 11.5s (each 1.2–1.6s,
expo-out, staggered 0.2s). Stage pull-back scale 1.06 → 1.0. Reflections fade
in during the settle. Rest by 13.5s.

## Motion rules

- Entries: opacity 0→1 in 0.25s; scale 0.92→1.0 over 0.6s expo-out; upward
  settle +12px→0. Overshoot never exceeds 3%.
- Holds: continuous micro-zoom 1.0→1.015 linear. Nothing fully stops.
- Exits: slide down ~40px + fade over 0.3s at scale ≥ 0.97. No shrink-to-dot,
  no brightness crush.
- Easing: exponential-out (springs where they read better), per element.

## Architecture — clean rebuild

Decision: keep presentational components; delete the entire current
choreography system; rebuild the stage from scratch.

**Removed entirely**
- Stage-div wrappers and orchestration in `HereMedia`
  (`components/Hero/HeroMockup.tsx`): `hero-production-stage-*` divs,
  `HERO_SEQUENCE_MS` / `HERO_INTRO_SEQUENCE_MS` and the `setTimeout` playback
  hack, the duplicated final-layout copies of Team/Book/voice.
- All `hero-production-stage-*` classes and every choreography keyframe in
  `app/globals.css` — both live ones and the dead set (`stage-switcher`,
  `stage-agent`, `stage-team`, `stage-taskboard`, `stage-bubble`, all
  `*-cinematic`, `agent-reveal-*`, flat-lay variants). Presentational rules
  (glass surfaces, frame internals, agent rows, voice anchor styling, ambient
  infinite loops) are kept.

**Kept unchanged**
- `ProductionAgentFrame`, `ProductionHtmlFrame`, `HeroVoiceListeningIndicator`,
  `OnboardingDenkerIntro` (logo bubble), `IntroGlassBubble`, MacBook visuals,
  book data, cursor components under `components/production/`.

**New**
- `components/Hero/HeroStage.tsx`: one stage container; each of the six
  components mounted exactly once in a single coordinate system; final-slot
  layout defined here (data attributes / refs for FLIP measurement).
- `components/Hero/heroTimeline.ts`: builds one Motion timeline
  (`motion` npm package, ~6kb core) with named beats implementing the beat
  sheet and motion rules. Exposes play/pause/seek/onComplete.
- `HereMedia` becomes a thin shell: mounts `HeroStage`, wires the play/stop
  button to `timeline.pause()/play()`, sets `ended` from the timeline's
  completion callback, keeps the IntersectionObserver visibility gate.
- Voice-volume rAF driver reads the timeline clock so it pauses/scrubs/exports
  in sync.

Single-instance principle: the Team frame used in beat 2 is the same DOM node
that anchors the finale. No component is rendered twice.

## Export to mp4

- Dev/export-only hook `window.__heroSeek(ms)` sets `timeline.time`.
- `scripts/export-hero-video.mjs` replaces its negative-`animation-delay` CSS
  hack with per-frame `__heroSeek` calls before each Playwright screenshot.
  Output format unchanged (default 2500×950 @ 30fps via ffmpeg); duration env
  default updates 23 → 14.
- Deterministic: every render of frame N is pixel-identical, including the
  voice indicator.

## Fallbacks

- Small screens: keep the current static flat-lay path; the timeline never
  mounts.
- `prefers-reduced-motion`: render the final still immediately.
- SSR: stage server-renders in final-layout state; the timeline takes over on
  hydration (no flash; crawlers see the finished hero).

## Testing / verification

- Visual: run locally, screenshot at beat boundaries (0.5s grid) and compare
  rhythm against `tmp/applevision-frames/apple-hero-contact-sheet.png`.
- Deterministic export: run the updated export script twice; frame checksums
  must match.
- Interaction: play/stop button toggles; `ended` state shows the settled
  flat-lay; reduced-motion and small-screen paths show the static flat-lay.
- Cleanliness: grep proves no `hero-production-stage-*` selectors or
  choreography keyframes remain; no duplicated component instances.

## Out of scope

- Shipping a pre-rendered mp4 as the production hero (possible later via the
  export path; decision deferred).
- Copy/content changes inside the frames.
- Sections below the hero.
