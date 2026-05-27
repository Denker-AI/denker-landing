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
    headingPrefix: "Turn scattered AI sessions",
    headingAccent: "into business progress.",
    subheading:
      "Denker gives founders one AI agent team and one canvas to direct work, review outputs, and move priorities forward.",
    cta: "Start Now",
  },
  "variant-b": {
    headingPrefix: "Turn scattered AI sessions",
    headingAccent: "into business progress.",
    subheading:
      "Denker gives founders one AI agent team and one canvas to direct work, review outputs, and move priorities forward.",
    cta: "Start Now",
  },
  "variant-c": {
    headingPrefix: "Turn scattered AI sessions",
    headingAccent: "into business progress.",
    subheading:
      "Denker gives founders one AI agent team and one canvas to direct work, review outputs, and move priorities forward.",
    cta: "Start Now",
  },
} as const;

export type HeroVariant = keyof typeof HERO_COPY;
