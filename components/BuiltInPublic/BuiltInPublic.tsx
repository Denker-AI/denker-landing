import type { ElementType, ReactNode } from "react";
import Image from "next/image";
import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/cn";

type BuiltInPublicCard = {
  label: string;
  href?: string;
  icon: string;
  content: ReactNode;
};

const cards: BuiltInPublicCard[] = [
  {
    label: "Peerlist",
    href: "https://peerlist.io/company/denker_ai",
    icon: "/images/built-in-public/peerlist-icon.svg",
    content: (
      <Image
        src="/images/built-in-public/peerlist-badge.png"
        alt="#1 Project of the Week on Peerlist"
        fill
        className="object-contain p-8"
      />
    ),
  },
  {
    label: "Product Hunt",
    href: "https://www.producthunt.com/products/denker?launch=denker",
    icon: "/images/built-in-public/producthunt-icon.svg",
    content: (
      <Image
        src="/images/built-in-public/producthunt-badge.png"
        alt="Find us on Product Hunt"
        width={250}
        height={54}
        className="w-full max-w-[220px] object-contain"
      />
    ),
  },
  {
    label: "Betalist",
    icon: "/images/built-in-public/betalist-icon.svg",
    content: (
      <Image
        src="/images/built-in-public/betalist-screenshot-1.png"
        alt="Denker product screenshot"
        fill
        className="object-cover object-top"
      />
    ),
  },
];

export function BuiltInPublic() {
  return (
    <section
      className="flex w-full flex-col items-center gap-14 bg-grey-950 px-6 pt-24 pb-24 sm:px-10 md:px-20 md:pt-32 md:pb-40"
      data-name="Section - Built in Public. Trusted by Builders."
      data-theme="dark"
    >
      <Container className="flex flex-col items-center gap-14">
        <div className="flex w-full flex-col items-start gap-2 text-white">
          <BlurText
            as="h2"
            className="font-heading text-3xl font-bold leading-tight md:text-[40px] md:leading-[48px]"
            text="Built in Public. Trusted by Builders."
          />
          <FadeIn as="p" delay={0.1} className="max-w-[720px] font-body text-lg leading-7 text-grey-300">
            Explore Denker across the platforms where founders and product
            builders discover, collaborate, and contribute.
          </FadeIn>
        </div>

        {/* Mobile: all 3 stacked full-width. Tablet: Peerlist + Product Hunt
            side by side, Betalist spans both columns below them. Desktop: all
            3 in a single row. */}
        <FadeIn delay={0.2} className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Wrapper: ElementType = card.href ? "a" : "div";
            return (
            <Wrapper
              key={card.label}
              {...(card.href
                ? { href: card.href, target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={cn(
                "flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-grey-900 sm:rounded-[24px] md:rounded-[32px]",
                card.label === "Betalist" && "md:col-span-2 lg:col-span-1",
                card.href && "transition-colors hover:border-white/25"
              )}
            >
              {/* aspect-ratio (not a fixed px height) so the image area
                  scales with the card's actual width at every breakpoint —
                  a fixed height here made the fill/object-cover Betalist
                  screenshot crop badly once the grid dropped to 1 column
                  and the card went full-width but stayed a fixed height. */}
              <div className="relative flex aspect-[16/9] items-center justify-center">
                {card.content}
              </div>
              <div className="flex shrink-0 items-center gap-6 border-t border-white/10 p-6">
                <Image
                  src={card.icon}
                  alt=""
                  width={80}
                  height={80}
                  className="size-12 shrink-0 rounded-[24px] sm:size-16 md:size-20"
                />
                <p className="font-heading text-xl font-medium text-white">
                  {card.label}
                </p>
              </div>
            </Wrapper>
            );
          })}
        </FadeIn>
      </Container>
    </section>
  );
}
