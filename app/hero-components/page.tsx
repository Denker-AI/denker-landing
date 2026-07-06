import type { ReactNode } from "react";
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";
import { HeroMacBook } from "@/components/Hero/HeroMacBook";
import { HeroMacBookFront } from "@/components/Hero/HeroMacBookFront";
import {
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
// - "macbook" (HeroMacBook): carries its own intrinsic sizing
//   (`aspect-ratio: 2040 / 1919`) and renders without a wrapper aspect ratio.
// - "logo" (OnboardingDenkerIntro) and "voice" (HeroVoiceListeningIndicator)
//   also carry their own intrinsic sizing (fixed clamp() square and
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
  {
    id: "cursor-bubble",
    beatWidth: "10%",
    node: (
      // the production class is animation-driven and absolute; pin it static
      // for the review cell
      <div style={{ position: "relative", height: 130 }}>
        <DenkerCursorBubble className="!static !translate-x-0 !animate-none">
          Done, task is complete
        </DenkerCursorBubble>
      </div>
    ),
  },
  { id: "macbook-front-solo", beatWidth: "36%", node: <HeroMacBookFront /> },
  { id: "macbook-topdown-finale", beatWidth: "36%", node: <HeroMacBook /> },
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
