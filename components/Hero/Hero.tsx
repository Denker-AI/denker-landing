import { HeroMockup } from "@/components/Hero/HeroMockup";
import { BlurText } from "@/components/ui/BlurText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { DOWNLOAD_URL, LOGIN_URL } from "@/lib/links";

export function Hero() {
  return (
    <section
      className="relative flex w-full flex-col items-center overflow-hidden bg-grey-950 px-6 pt-32 pb-[100px] sm:px-10 sm:pt-40 md:px-20"
      data-name="Section - Hero"
      data-theme="dark"
    >
      <Container className="flex flex-col items-center gap-14">
        <div className="relative z-10 mx-auto flex w-full max-w-[880px] flex-col items-center gap-2 text-center">
          <FadeIn as="p" className="font-body text-base font-medium text-primary-400">
            Built for Founders &amp; Product Builders
          </FadeIn>
          <BlurText
            as="h1"
            className="font-heading text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-[56px] md:leading-[60px]"
            text="Never again follow every AI conversation manually, let your AI coworker follow where you work"
          />
        </div>

        <FadeIn
          delay={0.15}
          className="relative z-10 flex w-full flex-col items-stretch justify-center gap-2 pb-20 sm:flex-row sm:items-start"
        >
          <Button variant="primary" href={LOGIN_URL} className="w-full sm:w-auto">
            Get Started
          </Button>
          <Button variant="secondary" href={DOWNLOAD_URL} download className="w-full sm:w-auto">
            Download Denker
          </Button>
        </FadeIn>

        <HeroMockup />
      </Container>
    </section>
  );
}
