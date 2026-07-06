**Source Visual Truth**
- Production application screenshot: `/Users/juanzhang/Downloads/screenshot/Screenshot 2026-07-01 at 20.28.43.png`
- Previous landing crop used for composition alignment: `/Users/juanzhang/Desktop/Denker/ClaudeCode/denker-landing-standalone/.codex-reference-left.png`

**Implementation Evidence**
- Local URL: `http://127.0.0.1:3004`
- Implementation screenshot: `/Users/juanzhang/Desktop/Denker/ClaudeCode/denker-landing-standalone/.codex-hero-shot.png`
- Mobile/static implementation screenshot: `/Users/juanzhang/Desktop/Denker/ClaudeCode/denker-landing-standalone/.codex-hero-mobile-shot.png`
- Full-view comparison: `/Users/juanzhang/Desktop/Denker/ClaudeCode/denker-landing-standalone/.codex-hero-comparison.png`
- Viewports: `980x998` desktop final state, `390x844` small-screen static state
- State: desktop hero flat-lay after the intro animation completes; small-screen hero flat-lay immediately after page load

**Findings**
- No P0/P1/P2 issues remain for the requested final fit-view correction.

**Required Fidelity Surfaces**
- Fonts and typography: landing hero copy remains SF-style and matches the reference hierarchy. Production frame typography now uses the compact AppKit token scale instead of the previous light marketing panel treatment.
- Spacing and layout rhythm: final flat-lay is simplified to the requested component set: left rail, compact space switcher, taskboard, agent list, voice indicator, Denker cursor bubble, and one larger content/takeaway frame. Frame rotations were removed so the view reads as an organized fit-view layout.
- Colors and visual tokens: production component surfaces now use dark Denker glass tokens: dark readable text, dark cursor bubble set, dark switcher bubble, transparent frame stroke, and production-style frame shadow. Cursor and voice sizing now use production-scale cursor dimensions rather than oversized marketing dimensions.
- Image quality and asset fidelity: no new screenshot cutouts were introduced. The previous custom report/HTML frame was replaced by a larger takeaway-style content frame based on the production screenshot composition.
- Copy and content: hero and frame copy are unchanged from the current landing content because the user said the content was mostly correct.

**Open Questions**
- The production app screenshot uses transparent dark glass over a macOS wallpaper. The landing hero sits on pure black, so the components now use bounded backplate shadows behind the real frames to restore liquid-glass contrast without adding a decorative wallpaper layer.

**Patches Made Since QA**
- Switched the hero voice control from oversized light `VoiceListeningGlass` to compact dark production mode and froze its reflection animation in the final flat-lay state.
- Replaced light/white landing-only frame overrides with dark production glass tokens in `app/globals.css`.
- Changed the space switcher, agent dock, cursor bubble, and voice capsule to dark production styling.
- Added a production-style left rail.
- Replaced the full space switcher plus agent dock with a single compact Denker-logo bubble.
- Replaced the fake CSS book drawing with a real crop from the supplied production screenshot: `/public/images/hero/deep-work-cover-production.png`.
- Forced production mini-frame text and takeaway content to align left so it does not inherit the hero section's centered text.
- Removed the welcome/checklist/report spread from the final flat-lay.
- Replaced tilted frames with straight fit-view placement.
- Added a small-screen static flat-lay path that skips the staged intro and shows readable hero copy immediately.
- Reworked the taskboard to match the production screenshot structure: mostly empty lanes with only the right-side Done lane populated.
- Added bounded backing layers behind the taskboard, agent list, and Deep Work frame so the glass reads against black.
- Reduced the left rail width and icon scale.
- Enlarged the Deep Work frame into the center-right position and brightened its inner card surface.
- Moved the Denker cursor bubble into the taskboard/content gap so it no longer covers content.
- Fixed a build-blocking local icon import by replacing unavailable `Github` with the installed `GitBranch` lucide icon in `WhatDenkerCanDo`.

**Implementation Checklist**
- Keep current dark production token mapping.
- Keep the old white landing glass removed.
- Keep the simplified final component set unless the production screenshot changes.
- Optional follow-up: add an actual desktop/wallpaper visual layer behind the flat-lay if higher contrast is required while retaining production-dark components.

**Follow-up Polish**
- P3: The dark production panels are less legible on pure black than on the real desktop wallpaper. A subtle real-image backdrop would make the app windows read closer to the production screenshot.

final result: passed
