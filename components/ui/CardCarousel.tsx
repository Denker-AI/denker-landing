"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/cn";

// Each card's copy is provided per-section by the caller (BuiltForFounders,
// WhyDenkerAI, …) so the two carousels can show distinct content. `widthPx` is
// the desktop width of the card's frame (defaults to the 880px design max);
// the tablet/mobile widths are derived from it (see cardWidthVars). `image`
// is optional — cards without one fall back to the plain primary-50 frame.
export type CarouselCard = {
  title: string;
  body: string;
  widthPx?: number;
  image?: string;
};

// Card frame heights per breakpoint — fixed values (not fluid scaling), same
// for every card. Defined again here (mirroring globals.css) only to derive
// each card's proportional width below; the actual height comes from the
// .carousel-card-height CSS class.
const DESKTOP_HEIGHT = 495;
const TABLET_HEIGHT = 360;
const MOBILE_HEIGHT = 192;
const DEFAULT_WIDTH = 880;

// Per-card responsive width, expressed as CSS custom properties consumed by
// the .carousel-card-width class (see globals.css). Tablet/mobile widths are
// derived from the given desktop width using the same height ratio, so each
// card keeps its own aspect ratio at every breakpoint instead of distorting.
function cardWidthVars(desktopWidth = DEFAULT_WIDTH) {
  const tabletWidth = Math.round((desktopWidth * TABLET_HEIGHT) / DESKTOP_HEIGHT);
  const mobileWidth = Math.round((desktopWidth * MOBILE_HEIGHT) / DESKTOP_HEIGHT);
  return {
    "--card-w-desktop": `${desktopWidth}px`,
    "--card-w-tablet": `${tabletWidth}px`,
    "--card-w-mobile": `${mobileWidth}px`,
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
}: {
  heading: string;
  cards: CarouselCard[];
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
      className="flex w-full flex-col items-center bg-white px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-theme="light"
    >
      <Container className="flex flex-col items-start gap-14">
        <BlurText
          as="h2"
          className="font-heading text-3xl font-bold text-grey-950 md:text-[40px] md:leading-[48px]"
          text={heading}
        />

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
              "flex w-max cursor-grab gap-2 select-none active:cursor-grabbing",
              !dragging && "transition-transform duration-500 ease-out"
            )}
            style={{ transform: `translateX(${-offset}px)` }}
          >
            {cards.map((card) => (
              <div
                key={card.title}
                style={cardWidthVars(card.widthPx)}
                className="carousel-card-width flex shrink-0 flex-col gap-5 select-none"
              >
                <div className="carousel-card-height w-full shrink-0 overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[32px] bg-primary-50">
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
                  <p className="font-heading text-2xl font-bold text-grey-950 md:text-[32px] md:leading-[40px]">
                    {card.title}
                  </p>
                  <p className="font-heading text-lg font-medium leading-7 text-grey-500">
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </FadeIn>

        <div className="flex w-full items-center justify-end gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => step(-1)}
            disabled={active === 0}
            className="flex h-10 w-[52px] items-center justify-center rounded-full border border-grey-150 bg-white text-primary-600 transition-colors hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <CaretLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => step(1)}
            disabled={active === cards.length - 1}
            className="flex h-10 w-[52px] items-center justify-center rounded-full border border-grey-150 bg-white text-primary-600 transition-colors hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <CaretRight className="size-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
