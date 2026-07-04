"use client";

import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/cn";

// NOTE: Figma has real background graphics for all 5 cards now — replace the
// placeholder copy below with the client's real copy once it's provided.
const slides = [
  {
    id: 0,
    image: "/images/what-denker-can-do/webp/what-denker-image-1.webp",
    copy: "Browse any website with Denker and instantly understand what matters. Get concise summaries, key insights, and actionable information without reading every page.",
  },
  {
    id: 1,
    image: "/images/what-denker-can-do/webp/what-denker-image-2.webp",
    copy: "Transform lengthy articles, research, and complex information into clear, structured reports. Denker extracts key insights and organizes them into actionable summaries, so you can understand more in less time.",
  },
  {
    id: 2,
    image: "/images/what-denker-can-do/webp/what-denker-image-3.webp",
    copy: "Draft thoughtful emails, messages, and replies in seconds. Denker understands the context of your conversation and writes clear, professional responses tailored to your intent.",
  },
  {
    id: 3,
    image: "/images/what-denker-can-do/webp/what-denker-image-4.webp",
    copy: "Build your own team of AI specialists for every workflow. Assign research, design, marketing, and other tasks to dedicated agents that collaborate to help you get work done faster.",
  },
  {
    id: 4,
    image: "/images/what-denker-can-do/webp/what-denker-image-5.webp",
    copy: "Coordinate multiple AI agents and workflows from a single workspace. Track progress, manage priorities, and keep every task moving seamlessly from planning to completion.",
  },
];

type Geometry = { cardWidth: number; stride: number; wrapperWidth: number };

// First card docks flush to the wrapper's left edge (aligned with the
// heading above); last card docks flush right; middle cards center with a
// peek of their neighbors on both sides.
function targetOffsetFor(index: number, geo: Geometry | null) {
  if (!geo) return 0;
  const { cardWidth, stride, wrapperWidth } = geo;
  if (index === 0) return 0;
  if (index === slides.length - 1) {
    return index * stride - (wrapperWidth - cardWidth);
  }
  return index * stride - (wrapperWidth - cardWidth) / 2;
}

export function WhatDenkerCanDo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [active, setActive] = useState(0);
  // Autoplay starts off; it's turned on once the section's fade-in completes.
  const [playing, setPlaying] = useState(false);
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
      const card0 = deck.children[0] as HTMLElement | undefined;
      const card1 = deck.children[1] as HTMLElement | undefined;
      if (!card0 || !card1) return;
      setGeo({
        cardWidth: card0.offsetWidth,
        stride: card1.offsetLeft - card0.offsetLeft,
        wrapperWidth: wrapper.clientWidth,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || dragging) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [playing, dragging]);

  const onPointerDown = (e: React.PointerEvent) => {
    setPlaying(false);
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
    for (let i = 0; i < slides.length; i++) {
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
      id="features"
      className="flex w-full scroll-mt-28 flex-col items-center gap-14 bg-grey-950 px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - What denker can do?"
      data-theme="dark"
    >
      <Container className="flex flex-col items-center gap-14">
        <div className="w-full">
          <BlurText
            as="h2"
            className="font-heading text-3xl font-bold text-white md:text-[40px] md:leading-[48px]"
            text="What denker can do?"
          />
        </div>

        {/* No overflow clipping anywhere in this chain — neighboring cards
            render at full size and bleed past the 1280px container into the
            page's outer margins instead of being cut off. */}
        <FadeIn delay={0.15} className="w-full" onComplete={() => setPlaying(true)}>
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
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex w-[85vw] max-w-[880px] shrink-0 flex-col gap-5 sm:w-[70vw] md:w-[880px]"
              >
                <div className="relative aspect-[880/495] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[32px] bg-grey-900">
                  {slide.image && (
                    <img
                      src={slide.image}
                      alt=""
                      draggable={false}
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                </div>
                <p className="font-heading text-xl font-medium leading-7 text-white">
                  {slide.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
        </FadeIn>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-grey-900 px-5 py-3.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-white" : "w-1.5 bg-grey-500"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label={playing ? "Pause carousel" : "Play carousel"}
            onClick={() => setPlaying((p) => !p)}
            className="flex size-[34px] items-center justify-center rounded-full bg-grey-900 text-white transition-colors hover:bg-grey-800"
          >
            {playing ? (
              <Pause weight="fill" className="size-4" />
            ) : (
              <Play weight="fill" className="ml-0.5 size-4" />
            )}
          </button>
        </div>
      </Container>
    </section>
  );
}
