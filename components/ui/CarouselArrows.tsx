"use client";

import { cn } from "@/lib/cn";

// Apple-style circular carousel control: a solid light-grey disc with a thin
// chevron, darkening on hover and fading when disabled. Shared by every
// horizontal carousel (Testimonials, CardCarousel, …) so the navigation looks
// identical everywhere.
function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-4", direction === "left" && "rotate-180")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

type CarouselArrowsProps = {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  theme?: "light" | "dark";
  className?: string;
};

export function CarouselArrows({
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  theme = "light",
  className,
}: CarouselArrowsProps) {
  const base =
    "flex size-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const tone =
    theme === "dark"
      ? "bg-white/10 text-white hover:bg-white/20 disabled:hover:bg-white/10"
      : "bg-grey-100 text-grey-700 hover:bg-grey-200 disabled:hover:bg-grey-100";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev}
        disabled={prevDisabled}
        className={cn(base, tone)}
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(base, tone)}
      >
        <Chevron direction="right" />
      </button>
    </div>
  );
}
