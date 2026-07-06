import { CardCarousel, type CarouselCard } from "@/components/ui/CardCarousel";
import { NotionDoc, ScreenBrowser } from "@/components/WhyDenkerAI/foregrounds";

// "Why Denker AI?" — the differentiation row. Per-row hue system: motion reads
// blue, founders green, this row YELLOW. Cards 1–2 recreate the UI window in
// code (like the founders foregrounds) floated over a yellow texture backdrop;
// card 3 is the real desktop screenshot (already yellow-toned), shown full-bleed
// so it keeps height and crops width as the screen narrows. `widthPx` varies per
// card for the visionOS gallery rhythm.
const BG = "/images/what-denker-can-do/backgrounds";

const cards: CarouselCard[] = [
  {
    title: "It sees what you see.",
    body: "Ask about anything on your screen — no copy-pasting context into a chat window.",
    widthPx: 780,
    background: `${BG}/yellow-ink-fluid.jpg`,
    backgroundPosition: "center 45%",
    foreground: <ScreenBrowser />,
  },
  {
    title: "One AI across all your tools.",
    body: "Denker moves work between your apps — sheets to docs to email — instead of living in one tab.",
    widthPx: 720,
    background: `${BG}/yellow-motion-wave.jpg`,
    backgroundPosition: "center center",
    foreground: <NotionDoc />,
  },
  {
    title: "Answers become interfaces.",
    body: "Your workspace fills with live frames — boards, reports, timers — not walls of text.",
    widthPx: 820,
    background: "/images/hero/denker-desktop-screenshot.jpg",
    backgroundPosition: "center center",
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
