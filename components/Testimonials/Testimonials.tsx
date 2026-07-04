"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";
import { useDeckCarousel } from "@/lib/useDeckCarousel";
import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

const testimonials = [
  {
    name: "Amir Mirmehrkar",
    avatar: "/images/testimonials/amir-mirmehrkar.jpg",
    text: "I am more visual, it hits home.I had chaneges in repeating context.\nOver and over. Across tools. Across teammates.\nEvery new doc. Every new sprint.\nRe-explaining the same product assumptions, goals, constraints.",
    autoHeight: true,
  },
  {
    name: "Adefisan Emmanuel",
    avatar: "/images/testimonials/adefisan-emmanuel.jpg",
    text: "The double-control shortcut for screen captures sounds incredibly smooth, Juan! It completely removes the friction of explaining context to AI agents.",
  },
  {
    name: "Ahmed Ali",
    avatar: "/images/testimonials/ahmed-ali.jpg",
    text: "Demo > explanation, always. Tools like this make it easier to show real value instead of just describing it",
  },
  {
    name: "Manas Rohilla",
    avatar: "/images/testimonials/manas-rohilla.jpg",
    text: "This is some crazy product you\ngot 🫡",
  },
  {
    name: "Joey Zhu",
    avatar: "/images/testimonials/joey-zhu.jpg",
    text: "UI is so good, like an artpiece.",
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
    name: "Alex Carter",
    avatar: "/images/testimonials/alex-carter.png",
    text: "Denker has become part of my daily workflow. Instead of jumping between tools, I can research competitors, summarize content, and move ideas forward from one place.",
  },
  {
    name: "Sophie Laurent",
    avatar: "/images/testimonials/sophie-laurent.png",
    text: "The ability to understand what's on my screen and provide context-aware assistance saves me a surprising amount of time every day. It feels less like a chatbot and more like a teammate.",
  },
  {
    name: "Daniel Müller",
    avatar: "/images/testimonials/daniel-muller.png",
    text: "From research and documentation to coordinating tasks across the team, Denker helps us stay focused on building instead of managing repetitive work.",
  },
];

export function Testimonials() {
  const { wrapperRef, deckRef, offset, dragging, step, isFirst, isLast, pointerHandlers } =
    useDeckCarousel(testimonials.length);

  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - Testimonials"
      data-theme="light"
    >
      <Container className="flex flex-col items-start gap-14">
        <BlurText
          as="h2"
          className="font-heading text-3xl font-bold text-grey-950 md:text-[40px] md:leading-[48px]"
          text="Loved by Builders"
        />

        {/* No overflow clipping anywhere in this chain — neighboring cards
            render at full size and bleed past the 1280px container into the
            page's outer margins instead of being cut off. Same deck
            mechanics as CardCarousel (see useDeckCarousel). */}
        <FadeIn delay={0.15} className="w-full">
        <div ref={wrapperRef} className="relative w-full">
          <div
            ref={deckRef}
            {...pointerHandlers}
            className={cn(
              "flex w-max cursor-grab gap-2 select-none active:cursor-grabbing",
              !dragging && "transition-transform duration-500 ease-out"
            )}
            style={{ transform: `translateX(${-offset}px)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex h-auto w-[280px] shrink-0 select-none flex-col justify-between gap-8 rounded-2xl border border-grey-150 bg-grey-50 p-6 sm:w-[380px] md:w-[435px]"
              >
                <p className="whitespace-pre-line font-heading text-lg font-medium leading-7 text-grey-700 sm:text-xl sm:leading-8 md:text-2xl md:leading-[32px]">
                  {testimonial.text}
                </p>
                <div className="flex shrink-0 items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    draggable={false}
                    className="size-10 shrink-0 rounded-lg object-cover sm:size-11 md:size-12"
                  />
                  <p className="font-heading text-base font-medium text-grey-950 sm:text-lg md:text-xl">
                    {testimonial.name}
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
            disabled={isFirst}
            className="flex h-10 w-[52px] items-center justify-center rounded-full border border-grey-150 bg-white text-primary-600 transition-colors hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <CaretLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => step(1)}
            disabled={isLast}
            className="flex h-10 w-[52px] items-center justify-center rounded-full border border-grey-150 bg-white text-primary-600 transition-colors hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <CaretRight className="size-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
