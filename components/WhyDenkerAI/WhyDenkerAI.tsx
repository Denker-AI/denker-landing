import { CardCarousel, type CarouselCard } from "@/components/ui/CardCarousel";

// Distinct copy per card — edit these to change the "Why Denker AI?" carousel
// content. Exactly 5 cards. `image` paths point at
// frontend/public/images/why-denker-ai/webp/ — drop the matching file in
// there and it renders automatically.
const cards: CarouselCard[] = [
  {
    title: "Understands Your Screen",
    body: "Denker understands what's on your screen, giving it the context needed to help without constant explanations.",
    widthPx: 780,
    image: "/images/why-denker-ai/webp/why-denker-ai-1.webp",
  },
  {
    title: "Works Across Your Workflow",
    body: "From research and planning to documentation and execution, Denker works across the tools you already use.",
    widthPx: 780,
    image: "/images/why-denker-ai/webp/why-denker-ai-2.webp",
  },
  {
    title: "Remembers Your Context",
    body: "Conversations, ongoing tasks, and workflows stay connected, so you don't have to repeat yourself.",
    widthPx: 880,
    image: "/images/why-denker-ai/webp/why-denker-ai-3.webp",
  },
  {
    title: "Dynamic AI Interfaces",
    body: "Denker generates interactive interfaces tailored to your task instead of limiting you to plain text responses.",
    widthPx: 880,
    image: "/images/why-denker-ai/webp/why-denker-ai-4.webp",
  },
  {
    title: "Knowledge Graph",
    body: "Denker builds a living knowledge graph that remembers your conversations, tasks, and context, so you never have to start from scratch.",
    widthPx: 720,
    image: "/images/why-denker-ai/webp/why-denker-ai-5.webp",
  },
];

export function WhyDenkerAI() {
  return (
    <div data-name="Section - Why Denker AI?">
      <CardCarousel heading="Why Denker AI?" cards={cards} />
    </div>
  );
}
