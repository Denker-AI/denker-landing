import { CardCarousel, type CarouselCard } from "@/components/ui/CardCarousel";
import {
  CanvasWorkspaceStill,
  CrossToolStill,
  ScreenUnderstandingStill,
} from "@/components/WhyDenkerAI/foregrounds";

// "Why Denker AI?" — the differentiation section (§5 of the 2026-07-06
// sections redesign). Three architecture-level claims, each a layered visionOS
// tile: a blue/teal environment photo (single-hue-family rule, §6a) under a UI
// still rebuilt in code. Motion lives only in the "Explore" section; these are
// stills. `widthPx` varies gently per card for the Apple gallery rhythm — the
// foreground panel stays a fixed size, so only the revealed background changes.
const cards: CarouselCard[] = [
  {
    title: "It sees what you see.",
    body: "Ask about anything on your screen — no copy-pasting context into a chat window.",
    widthPx: 760,
    background: "/images/what-denker-can-do/backgrounds/clear-blue-shoreline.jpg",
    backgroundPosition: "center 55%",
    foreground: <ScreenUnderstandingStill />,
  },
  {
    title: "One AI across all your tools.",
    body: "Denker moves work between your apps — sheets to docs to email — instead of living in one tab.",
    widthPx: 700,
    background: "/images/what-denker-can-do/backgrounds/downloaded-patrick-teal-architecture.jpg",
    backgroundPosition: "center 40%",
    foreground: <CrossToolStill />,
  },
  {
    title: "Answers become interfaces.",
    body: "Your workspace fills with live frames — boards, reports, timers — not walls of text.",
    widthPx: 820,
    background: "/images/what-denker-can-do/backgrounds/downloaded-blue-ink-marble.jpg",
    backgroundPosition: "center 50%",
    foreground: <CanvasWorkspaceStill />,
  },
];

export function WhyDenkerAI() {
  return (
    <div data-name="Section - Why Denker AI?">
      <CardCarousel
        variant="gallery"
        theme="tint"
        eyebrow="Why Denker AI"
        heading="Not another chatbot tab."
        intro="Desktop-level AI that sees your screen, works across every app, and turns answers into a workspace you can use."
        cards={cards}
      />
    </div>
  );
}
