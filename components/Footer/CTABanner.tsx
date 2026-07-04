import Image from "next/image";
import { BlurText } from "@/components/ui/BlurText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { DOWNLOAD_URL, LOGIN_URL } from "@/lib/links";

export function CTABanner() {
  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 py-[100px] sm:px-10 md:px-20"
      data-name="Section - CTA"
      data-theme="light"
    >
      <Container>
        <div className="cta-radial-glow cta-card-height relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-[20px] px-6 py-16 sm:rounded-[24px] sm:px-10 sm:py-20 md:rounded-[32px] md:py-24">
          <div className="relative z-20 flex max-w-[600px] flex-col items-center gap-2 text-center text-white">
            <BlurText
              as="h2"
              className="font-heading text-3xl font-bold md:text-[40px] md:leading-[48px]"
              text="Built in Public. Trusted by Builders."
            />
            <FadeIn as="p" delay={0.1} className="font-heading text-lg font-medium leading-7 sm:text-xl">
              Explore Denker across the platforms where founders and product
              builders discover, collaborate, and contribute.
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="relative z-20 flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              variant="primary"
              href={LOGIN_URL}
              className="w-full bg-white text-grey-950 hover:bg-grey-50 sm:w-auto"
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              href={DOWNLOAD_URL}
              download
              className="w-full border-white bg-transparent backdrop-blur-[24px] hover:border-grey-100 hover:bg-white/10 sm:w-auto"
            >
              Download Denker
            </Button>
          </FadeIn>

          {/* Decorative "agent at work" bubble composites (Marketer+Designer
              on the left, Denker+Sales on the right) — each pair is already
              combined, rotated, and cursor-annotated in the source image, so
              they're placed as single assets rather than reconstructed with
              CSS. Shown at every breakpoint, sized down for mobile/tablet so
              they still fit alongside the centered heading/buttons. */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <Image
              src="/images/cta/cta-left-side-image.png"
              alt=""
              width={1091}
              height={786}
              className="cta-image-left absolute"
            />
            <Image
              src="/images/cta/cta-right-side-image.png"
              alt=""
              width={1260}
              height={810}
              className="cta-image-right absolute"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
