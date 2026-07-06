import type { ReactNode } from "react";
import {
  HeroDesktopFocusDisplay,
  HeroFinalTopDownMacBook,
  HeroVoiceListeningIndicator,
  OnboardingDenkerIntro,
  ProductionAgentFrame,
  ProductionHtmlFrame,
} from "@/components/Hero/HeroMockup";

// Dev-only review harness for Phase 1 hero component work (Task 3).
// Deleted or gated at the end of Phase 1 (Task 8) — do not wire into production nav.
//
// Wrapper aspect-ratio notes:
// - "team" (ProductionAgentFrame): the component renders `h-full` and normally
//   inherits its box from the `.hero-production-stage-agent-reveal` ancestor
//   (--agent-reveal-width/--agent-reveal-height, clamp ~540px / ~620px). That
//   ancestor isn't present here, so the wrapper sets aspectRatio "540 / 620"
//   to reproduce the same proportions.
// - "book" (ProductionHtmlFrame): the inner `.hero-production-html` frame has
//   its own intrinsic size (width: 760px; height: 520px) so no extra wrapper
//   sizing is required — the glass bubble around it sizes to fit.
// - "macbook-topdown" (HeroFinalTopDownMacBook): the component is a bare div
//   with a Next/Image `fill`, normally sized by `.hero-production-final-desktop`
//   or `.hero-production-final-topdown` stage/final-layout ancestors. Standalone
//   it has no intrinsic size, so the wrapper sets aspectRatio "2040 / 1919"
//   (the source image's natural pixel dimensions).
// - "logo" (OnboardingDenkerIntro), "macbook-current" (HeroDesktopFocusDisplay),
//   and "voice" (HeroVoiceListeningIndicator) all carry their own intrinsic
//   sizing (fixed clamp() square, `aspect-ratio: 2040/1919`, and
//   `width: max-content` respectively) and render without a wrapper aspect ratio.

const CELLS: { id: string; beatWidth: string; aspectRatio?: string; node: ReactNode }[] = [
  { id: "logo", beatWidth: "23%", node: <OnboardingDenkerIntro /> },
  {
    id: "team",
    beatWidth: "24%",
    aspectRatio: "540 / 620",
    node: <ProductionAgentFrame />,
  },
  { id: "voice", beatWidth: "18%", node: <HeroVoiceListeningIndicator staticMode /> },
  // cursor bubble cell added in Task 7 when the component exists
  {
    id: "macbook-current",
    beatWidth: "36%",
    node: <HeroDesktopFocusDisplay />,
  },
  {
    id: "macbook-topdown",
    beatWidth: "36%",
    aspectRatio: "2040 / 1919",
    node: <HeroFinalTopDownMacBook />,
  },
  { id: "book", beatWidth: "30%", aspectRatio: "760 / 520", node: <ProductionHtmlFrame /> },
];

export default function HeroComponentsGallery() {
  return (
    <main style={{ background: "#000", minHeight: "100svh", padding: 48 }}>
      {CELLS.map((cell) => (
        <section key={cell.id} data-cell={cell.id} style={{ marginBottom: 64 }}>
          <h2 style={{ color: "#9a9a9a", font: "600 13px/1.4 system-ui", marginBottom: 12 }}>
            {cell.id} — beat width {cell.beatWidth}
          </h2>
          <div
            style={{
              width: cell.beatWidth,
              minWidth: 120,
              position: "relative",
              ...(cell.aspectRatio ? { aspectRatio: cell.aspectRatio } : null),
            }}
          >
            {cell.node}
          </div>
        </section>
      ))}
    </main>
  );
}
