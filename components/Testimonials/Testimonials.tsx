"use client";

import { useCallback, useEffect, useRef } from "react";
import { BlurText } from "@/components/ui/BlurText";
import { CarouselArrows } from "@/components/ui/CarouselArrows";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

// Order matters: the grid fills column-by-column into two rows (top row = even
// indices, bottom row = odd), so this list is interleaved long/short on purpose.
// It keeps every short quote diagonally isolated — no two short quotes ever sit
// beside each other (same row) or stacked (same column), which avoids sparse,
// empty-looking patches.
const testimonials = [
  {
    name: "Amir Mirmehrkar",
    avatar: "/images/testimonials/amir-mirmehrkar.jpg",
    text: "I am more visual, it hits home.I had chaneges in repeating context.\nOver and over. Across tools. Across teammates.\nEvery new doc. Every new sprint.\nRe-explaining the same product assumptions, goals, constraints.",
  },
  {
    name: "Joey Zhu",
    avatar: "/images/testimonials/joey-zhu.jpg",
    text: "UI is so good, like an artpiece.",
  },
  {
    name: "Manas Rohilla",
    avatar: "/images/testimonials/manas-rohilla.jpg",
    text: "This is some crazy product you\ngot 🫡",
  },
  {
    name: "Adefisan Emmanuel",
    avatar: "/images/testimonials/adefisan-emmanuel.jpg",
    text: "The double-control shortcut for screen captures sounds incredibly smooth, Juan! It completely removes the friction of explaining context to AI agents.",
  },
  {
    name: "Sophie Laurent",
    avatar: "/images/testimonials/sophie-laurent.png",
    text: "The ability to understand what's on my screen and provide context-aware assistance saves me a surprising amount of time every day. It feels less like a chatbot and more like a teammate.",
  },
  {
    name: "Mohammad Ashad",
    avatar: "/images/testimonials/mohammad-ashad.jpg",
    text: "It hits home.",
  },
  {
    name: "Leon Roth",
    avatar: "/images/testimonials/leon-roth.jpg",
    text: "soo powerful!!",
  },
  {
    name: "Daniel Müller",
    avatar: "/images/testimonials/daniel-muller.png",
    text: "From research and documentation to coordinating tasks across the team, Denker helps us stay focused on building instead of managing repetitive work.",
  },
  {
    name: "Alex Carter",
    avatar: "/images/testimonials/alex-carter.png",
    text: "Denker has become part of my daily workflow. Instead of jumping between tools, I can research competitors, summarize content, and move ideas forward from one place.",
  },
  {
    name: "Ahmed Ali",
    avatar: "/images/testimonials/ahmed-ali.jpg",
    text: "Demo > explanation, always. Tools like this make it easier to show real value instead of just describing it",
  },
];

// The strip renders three identical copies of the testimonial grid back-to-back
// inside a native overflow-x container. We keep the scroll position parked in the
// middle copy: whenever it drifts more than half a copy-width away, we snap it back
// by exactly one copy-width (an identical position, so the jump is invisible). That
// makes the arrows — and trackpad / drag — scroll rightward forever with no end.
const COPIES = 3;

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const rafRef = useRef<number | undefined>(undefined);
  const drag = useRef({ startX: 0, startScroll: 0, active: false });

  // Animate scrollLeft ourselves with rAF instead of native `scrollTo({behavior:
  // "smooth"})` — the page's global scroll controller swallows smooth scrolls on
  // nested containers, but direct scrollLeft writes (what we tween here) work.
  const animateTo = useCallback((track: HTMLDivElement, to: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = track.scrollLeft;
    const distance = to - from;
    if (Math.abs(distance) < 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = to;
      return;
    }
    const duration = 460;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      track.scrollLeft = from + distance * ease(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Distance between the start of one copy and the next (grid width + gap).
  const getWrap = useCallback(() => {
    const row = rowRef.current;
    if (!row || row.children.length < 2) return 0;
    const a = row.children[0].getBoundingClientRect();
    const b = row.children[1].getBoundingClientRect();
    return b.left - a.left;
  }, []);

  // Keep scrollLeft parked within [0.5, 1.5] copy-widths of the middle copy.
  const settle = useCallback(() => {
    const track = trackRef.current;
    const wrap = getWrap();
    if (!track || wrap <= 0) return;
    let s = track.scrollLeft;
    while (s < wrap * 0.5) s += wrap;
    while (s > wrap * 1.5) s -= wrap;
    if (Math.abs(s - track.scrollLeft) > 0.5) track.scrollLeft = s;
  }, [getWrap]);

  // Center on the middle copy on mount and whenever the track resizes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = () => {
      const wrap = getWrap();
      if (wrap > 0) track.scrollLeft = wrap;
    };
    const ro = new ResizeObserver(center);
    ro.observe(track);
    return () => ro.disconnect();
  }, [getWrap]);

  useEffect(
    () => () => {
      window.clearTimeout(settleTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const onScroll = useCallback(() => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settle, 120);
  }, [settle]);

  const scrollByPage = useCallback(
    (dir: number) => {
      const track = trackRef.current;
      const wrap = getWrap();
      if (!track || wrap <= 0) return;
      // Columns are evenly spaced across the whole track (the inter-copy gap
      // equals the column gap), so one column stride is exactly wrap / columns.
      const columns = Math.ceil(testimonials.length / 2);
      const stride = wrap / columns;
      // Re-park to the middle copy instantly first, so repeated clicks always
      // start from center and never march into a hard scroll edge.
      let s = track.scrollLeft;
      while (s < wrap * 0.5) s += wrap;
      while (s > wrap * 1.5) s -= wrap;
      if (Math.abs(s - track.scrollLeft) > 0.5) track.scrollLeft = s;
      // Advance by however many whole columns are visible and land exactly on a
      // column boundary — never a half-cut card.
      const perView = Math.max(1, Math.floor(track.clientWidth / stride));
      const currentColumn = Math.round(track.scrollLeft / stride);
      const target = (currentColumn + dir * perView) * stride;
      animateTo(track, target);
    },
    [getWrap, animateTo]
  );

  // Click-drag for mouse users; touch and trackpad use native scrolling.
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    drag.current = { startX: e.clientX, startScroll: track.scrollLeft, active: true };
    track.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  }, []);

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      const track = trackRef.current;
      if (track?.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      settle();
    },
    [settle]
  );

  return (
    <section
      className="section-tint flex w-full flex-col items-center px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - Testimonials"
      data-theme="light"
    >
      <Container className="flex flex-col items-start gap-14">
        <BlurText
          as="h2"
          className="font-heading text-3xl font-bold text-grey-950 md:text-[40px] md:leading-[48px]"
          text="Loved by Builders"
        />

        {/* Two-row grid that fills column-by-column, scrolling horizontally with a
            seamless infinite wrap (see COPIES note above). No card chrome — items
            sit directly on the white section, Apple "And so much more" style. */}
        <FadeIn delay={0.15} className="w-full">
          <div
            ref={trackRef}
            onScroll={onScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="w-full cursor-grab overflow-x-auto select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div ref={rowRef} className="flex w-max gap-x-10">
              {Array.from({ length: COPIES }).map((_, copy) => (
                <div
                  key={copy}
                  aria-hidden={copy !== 1}
                  className="grid grid-flow-col grid-rows-[auto_auto] items-start gap-x-10 gap-y-12 auto-cols-[248px] sm:auto-cols-[320px] md:auto-cols-[360px]"
                >
                  {testimonials.map((testimonial) => (
                    <figure key={testimonial.name} className="flex w-full flex-col gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        draggable={false}
                        className="size-9 shrink-0 rounded-full object-cover md:size-10"
                      />
                      <figcaption className="flex flex-col gap-1">
                        <span className="font-heading text-base font-semibold text-grey-950 md:text-lg">
                          {testimonial.name}
                        </span>
                        <p className="whitespace-pre-line font-heading text-sm leading-6 text-grey-600 md:text-[15px] md:leading-7">
                          {testimonial.text}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="flex w-full justify-end">
          <CarouselArrows onPrev={() => scrollByPage(-1)} onNext={() => scrollByPage(1)} />
        </div>
      </Container>
    </section>
  );
}
