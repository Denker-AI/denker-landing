"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BlurText } from "@/components/ui/BlurText";
import { CarouselArrows } from "@/components/ui/CarouselArrows";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/cn";

// Each card's copy is provided per-section by the caller (BuiltForFounders,
// WhyDenkerAI, …) so the two carousels can show distinct content.
//
// Two composition modes share this component:
//   • legacy  — a single baked `image` (or plain frame) sized by per-card
//     `widthPx`. Still used by Built for Founders until its own pass.
//   • gallery — the Apple visionOS "spatial experiences" pattern: uniform
//     tiles layering a `background` environment photo (cover-cropped) under a
//     rebuilt `foreground` UI still, with a quiet caption below. Selected via
//     `variant="gallery"` on the carousel.
export type CarouselCard = {
  title: string;
  body: string;
  /** legacy: desktop width of the card frame */
  widthPx?: number;
  /** legacy: single baked asset */
  image?: string;
  /** gallery: environment photo, object-fit cover */
  background?: string;
  /** gallery: self-made CSS background (gradient/texture) — used instead of a
   *  photo so a whole row shares one coherent, on-brand tone. Rendered behind
   *  the foreground; takes precedence over `background`. */
  backgroundCss?: string;
  /** gallery: UI still rebuilt as JSX/CSS, floated over the background */
  foreground?: ReactNode;
  /** gallery: per-card background focal point, e.g. "center 40%" */
  backgroundPosition?: string;
  /** gallery: mobile-only foreground nudge (px). Negative x shifts the
   *  foreground left so a right-side region (e.g. an agent bubble) stays in
   *  view instead of cropping. Consumed via --gallery-mob-tx/ty in globals.css. */
  mobileNudgeX?: number;
  mobileNudgeY?: number;
};

// Legacy card frame heights per breakpoint — fixed values (not fluid scaling),
// same for every card. Defined again here (mirroring globals.css) only to
// derive each card's proportional width below.
const DESKTOP_HEIGHT = 495;
const TABLET_HEIGHT = 360;
const MOBILE_HEIGHT = 192;
const DEFAULT_WIDTH = 880;

// Per-card responsive width (legacy), expressed as CSS custom properties
// consumed by the .carousel-card-width class (see globals.css).
function cardWidthVars(desktopWidth = DEFAULT_WIDTH) {
  const tabletWidth = Math.round((desktopWidth * TABLET_HEIGHT) / DESKTOP_HEIGHT);
  const mobileWidth = Math.round((desktopWidth * MOBILE_HEIGHT) / DESKTOP_HEIGHT);
  return {
    "--card-w-desktop": `${desktopWidth}px`,
    "--card-w-tablet": `${tabletWidth}px`,
    "--card-w-mobile": `${mobileWidth}px`,
  } as React.CSSProperties;
}

// Gallery tiles share one HEIGHT per breakpoint but each card sets its own
// WIDTH (the Apple unequal-width rhythm). Desktop width is the card's
// `widthPx`; tablet/mobile widths shrink in proportion to the fixed gallery
// tile-height ladder (452 → 416 → 316). Consumed by the .gallery-card width
// rules in globals.css. Mobile is capped to the viewport so a wide desktop
// tile never overflows a phone.
const GALLERY_DESKTOP_HEIGHT = 452;
const GALLERY_TABLET_HEIGHT = 416;
const GALLERY_MOBILE_HEIGHT = 316;
const GALLERY_DEFAULT_WIDTH = 696;

function galleryWidthVars(desktopWidth = GALLERY_DEFAULT_WIDTH) {
  const tabletWidth = Math.round((desktopWidth * GALLERY_TABLET_HEIGHT) / GALLERY_DESKTOP_HEIGHT);
  const mobileWidth = Math.round((desktopWidth * GALLERY_MOBILE_HEIGHT) / GALLERY_DESKTOP_HEIGHT);
  return {
    "--gcard-w-desktop": `${desktopWidth}px`,
    "--gcard-w-tablet": `${tabletWidth}px`,
    "--gcard-w-mobile": `min(${mobileWidth}px, calc(100vw - 72px))`,
  } as React.CSSProperties;
}

// Per-card measured layout — variable widths mean we can't assume a single
// uniform stride, so we record every card's left offset and width.
type Geometry = { offsets: number[]; widths: number[]; wrapperWidth: number };

// First card docks flush to the wrapper's left edge (aligned with the heading
// above); last card docks flush right; middle cards center with a peek of their
// neighbors on both sides.
function targetOffsetFor(index: number, geo: Geometry | null) {
  if (!geo) return 0;
  const { offsets, widths, wrapperWidth } = geo;
  if (index <= 0) return offsets[0] ?? 0;
  if (index >= offsets.length - 1) {
    return offsets[index] + widths[index] - wrapperWidth;
  }
  return offsets[index] - (wrapperWidth - widths[index]) / 2;
}

export function CardCarousel({
  heading,
  cards,
  theme = "light",
  variant = "legacy",
  eyebrow,
  intro,
}: {
  heading: string;
  cards: CarouselCard[];
  theme?: "light" | "dark" | "tint";
  /** "gallery" enables the layered visionOS tile + Tier-B header lockup */
  variant?: "legacy" | "gallery";
  /** Tier-B eyebrow (gallery only) */
  eyebrow?: string;
  /** Tier-B intro paragraph (gallery only) */
  intro?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [active, setActive] = useState(0);
  // The settled offset is fully derived from active+geo; dragOffset is a
  // temporary override that's only non-null while actively dragging.
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const dragRef = useRef({ startX: 0, startOffset: 0 });

  const settledOffset = targetOffsetFor(active, geo);
  const offset = dragOffset ?? settledOffset;
  const dragging = dragOffset !== null;
  const isDark = theme === "dark";
  const isGallery = variant === "gallery";
  // Gallery uses a full-width gutter shell (Apple's shared content edge);
  // legacy keeps the centered max-w-1280 Container. The gutter is applied
  // inline (not via a class) so it's immune to Tailwind purge / stale CSS.
  const Shell: React.ElementType = isGallery ? "div" : Container;
  const galleryGutter = "max(6.25vw, calc((100vw - 1260px) / 2))";
  const shellStyle = isGallery
    ? { paddingLeft: galleryGutter, paddingRight: galleryGutter }
    : undefined;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const deck = deckRef.current;
    if (!wrapper || !deck) return;

    const measure = () => {
      const children = Array.from(deck.children) as HTMLElement[];
      if (children.length === 0) return;
      setGeo({
        offsets: children.map((c) => c.offsetLeft),
        widths: children.map((c) => c.offsetWidth),
        wrapperWidth: wrapper.clientWidth,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const step = (dir: 1 | -1) => {
    setActive((prev) => Math.min(Math.max(prev + dir, 0), cards.length - 1));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startOffset: settledOffset };
    setDragOffset(settledOffset);
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore — pointer capture isn't essential to the drag itself
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragOffset === null) return;
    const dx = e.clientX - dragRef.current.startX;
    setDragOffset(dragRef.current.startOffset - dx);
  };

  const onPointerUp = () => {
    if (dragOffset === null) return;
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const dist = Math.abs(targetOffsetFor(i, geo) - dragOffset);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    setDragOffset(null);
    setActive(nearest);
  };

  return (
    <section
      className={cn(
        "flex w-full flex-col items-center",
        isGallery
          ? "py-14 md:pt-20 md:pb-28"
          : "px-6 py-16 sm:px-10 md:px-20 md:py-20",
        isDark ? "bg-grey-900" : theme === "tint" ? "section-tint" : "bg-white"
      )}
      data-theme={isDark ? "dark" : "light"}
    >
      {/* Gallery docks to Apple's shared content gutter (max((100vw−1260)/2,
          6.25vw)) and lets cards bleed right; legacy keeps the max-w-1280
          container. */}
      <Shell
        style={shellStyle}
        className={cn(
          "flex flex-col items-start",
          isGallery ? "w-full gap-12" : "gap-14"
        )}
      >
        {isGallery ? (
          // Tier-B lockup (measured off apple.com/os/visionos): eyebrow 21/21
          // semibold → 12px → riff 48/52 semibold, tracking −0.144px → 24px →
          // intro 21/29 in muted grey. Apple flows this text to an 840px measure
          // (not ~640), so lines run longer before wrapping.
          <div className="flex w-full max-w-[840px] flex-col">
            {eyebrow && (
              <FadeIn
                as="p"
                className={cn(
                  "apple-section-heading text-[19px] font-semibold leading-[1.1] md:text-[21px]",
                  isDark ? "text-grey-300" : "text-grey-500"
                )}
              >
                {eyebrow}
              </FadeIn>
            )}
            <BlurText
              as="h2"
              className={cn(
                "t-display mt-3",
                isDark ? "text-white" : "text-grey-950"
              )}
              text={heading}
            />
            {intro && (
              <FadeIn
                as="p"
                delay={0.12}
                className={cn(
                  "apple-section-heading mt-5 text-[18px] font-medium leading-[1.4] md:text-[21px] md:leading-[29px]",
                  isDark ? "text-grey-400" : "text-grey-500"
                )}
              >
                {intro}
              </FadeIn>
            )}
          </div>
        ) : (
          <BlurText
            as="h2"
            className={cn(
              "t-display",
              isDark ? "text-white" : "text-grey-950"
            )}
            text={heading}
          />
        )}

        {/* No overflow clipping anywhere in this chain — neighboring cards
            render at full size and bleed past the 1280px container into the
            page's outer margins instead of being cut off. */}
        <FadeIn delay={0.15} className="w-full">
          <div ref={wrapperRef} className="relative w-full">
            <div
              ref={deckRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className={cn(
                "flex w-max cursor-grab select-none active:cursor-grabbing",
                isGallery ? "gap-5" : "gap-2",
                !dragging && "transition-transform duration-500 ease-out"
              )}
              style={{ transform: `translateX(${-offset}px)` }}
            >
              {cards.map((card) =>
                isGallery ? (
                  <div
                    key={card.title}
                    style={{
                      ...galleryWidthVars(card.widthPx),
                      ...(card.mobileNudgeX != null
                        ? { "--gallery-mob-tx": `${card.mobileNudgeX}px` }
                        : {}),
                      ...(card.mobileNudgeY != null
                        ? { "--gallery-mob-ty": `${card.mobileNudgeY}px` }
                        : {}),
                    } as React.CSSProperties}
                    className="gallery-card flex shrink-0 flex-col gap-4 select-none"
                  >
                    <div className="gallery-card-tile relative shrink-0 overflow-hidden radius-card">
                      {card.backgroundCss ? (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{ background: card.backgroundCss }}
                        />
                      ) : (
                        card.background && (
                          <img
                            src={card.background}
                            alt=""
                            draggable={false}
                            className="pointer-events-none absolute inset-0 size-full object-cover"
                            style={{ objectPosition: card.backgroundPosition ?? "center 45%" }}
                          />
                        )
                      )}
                      <div aria-hidden="true" className="gallery-card-vignette" />
                      {card.foreground && (
                        <div className="gallery-card-foreground" aria-hidden="true">
                          {card.foreground}
                        </div>
                      )}
                    </div>
                    <div className="flex max-w-[380px] flex-col gap-1.5 px-0.5">
                      <p
                        className={cn(
                          "apple-section-heading text-[17px] font-semibold leading-[21px]",
                          isDark ? "text-white" : "text-grey-950"
                        )}
                      >
                        {card.title}
                      </p>
                      <p
                        className={cn(
                          "apple-section-heading text-[17px] font-medium leading-[21px]",
                          isDark ? "text-grey-300" : "text-grey-500"
                        )}
                      >
                        {card.body}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={card.title}
                    style={cardWidthVars(card.widthPx)}
                    className="carousel-card-width flex shrink-0 flex-col gap-5 select-none"
                  >
                    <div className="carousel-card-height w-full shrink-0 overflow-hidden radius-card bg-primary-50">
                      {card.image && (
                        <img
                          src={card.image}
                          alt=""
                          draggable={false}
                          className="size-full object-cover"
                          // Falls back to the plain primary-50 frame if the file
                          // hasn't been dropped into the folder yet. A native
                          // listener (not React's onError) is needed because a
                          // cached 404 can fire before React finishes binding.
                          ref={(img) => {
                            if (!img) return;
                            const hide = () => {
                              img.style.display = "none";
                            };
                            img.addEventListener("error", hide);
                            return () => img.removeEventListener("error", hide);
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p
                        className={cn(
                          "font-marketing text-2xl font-semibold md:text-[32px] md:leading-[40px]",
                          isDark ? "text-white" : "text-grey-950"
                        )}
                      >
                        {card.title}
                      </p>
                      <p
                        className={cn(
                          "font-marketing text-lg font-medium leading-7",
                          isDark ? "text-grey-300" : "text-grey-500"
                        )}
                      >
                        {card.body}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </FadeIn>

        <div className="flex w-full justify-end">
          <CarouselArrows
            theme={isDark ? "dark" : "light"}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            prevDisabled={active === 0}
            nextDisabled={active === cards.length - 1}
          />
        </div>
      </Shell>
    </section>
  );
}
