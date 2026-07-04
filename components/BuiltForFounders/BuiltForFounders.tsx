import { CardCarousel, type CarouselCard } from "@/components/ui/CardCarousel";

// Distinct copy per card — edit these to change the "Built for Founders &
// Product Builders" carousel content. Exactly 5 cards. `image` paths point at
// frontend/public/images/built-for-founders/webp/ — drop the matching file in
// there and it renders automatically.
const cards: CarouselCard[] = [
  {
    title: "Don't Write Everything Yourself.",
    body: "Let Denker write, refine, summarize, and even send messages while you stay focused on building.",
    widthPx: 880,
    image: "/images/built-for-founders/webp/built-for-founders-1.webp",
  },
  {
    title: "Don't Just Type. Talk.",
    body: "Use your voice to brainstorm ideas, assign tasks, and collaborate naturally with your AI coworker.",
    widthPx: 620,
    image: "/images/built-for-founders/webp/built-for-founders-2.webp",
  },
  {
    title: "AI That Works Where You Work.",
    body: "Denker understands your screen and helps you without making you switch between apps or copy context.",
    widthPx: 880,
    image: "/images/built-for-founders/webp/built-for-founders-3.webp",
  },
  {
    title: "Stop Explaining Yourself.",
    body: "Denker remembers your context and ongoing work, so every conversation picks up exactly where you left off.",
    widthPx: 700,
    image: "/images/built-for-founders/webp/built-for-founders-4.webp",
  },
  {
    title: "Keep Track of Everything.",
    body: "Denker remembers your ongoing work, conversations, and tasks, so you never lose context.",
    widthPx: 620,
    image: "/images/built-for-founders/webp/built-for-founders-5.webp",
  },
];

export function BuiltForFounders() {
  return (
    <div data-name="Section - Built for Founders & Product Builders">
      <CardCarousel heading="Built for Founders & Product Builders" cards={cards} />
    </div>
  );
}
