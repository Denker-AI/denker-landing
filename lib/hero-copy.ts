/**
 * Hero copy variants — single source of truth.
 * Consumed by `components/landing-hero.tsx` (live A/B test).
 *
 * Each variant exposes plain strings (`headingPrefix` + `headingAccent` for the
 * two-tone hero title). The hero component composes them into JSX with the
 * accent colour applied via Tailwind class.
 */

export const HERO_COPY = {
  control: {
    headingPrefix: "Wear every hat?",
    headingAccent: "Bring a team to your cursor.",
    subheading:
      "AI agents that research, write, code and ship — in parallel, right where you work.",
    cta: "Start Now",
  },
  "variant-b": {
    headingPrefix: "Stop juggling tabs.",
    headingAccent: "Direct a team.",
    subheading:
      "Specialist agents work in parallel on one canvas, on your desktop, around your cursor.",
    cta: "Start Now",
  },
  "variant-c": {
    headingPrefix: "Stop wearing every hat.",
    headingAccent: "Start delegating it.",
    subheading:
      "A team of AI specialists on your desktop. You direct. They ship — in parallel.",
    cta: "Start Now",
  },
} as const;

export type HeroVariant = keyof typeof HERO_COPY;
