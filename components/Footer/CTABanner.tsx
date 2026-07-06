import { BlurText } from "@/components/ui/BlurText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { DOWNLOAD_URL, LOGIN_URL } from "@/lib/links";

export function CTABanner() {
  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 pt-4 pb-[100px] sm:px-10 md:px-20"
      data-name="Section - CTA"
      data-theme="light"
    >
      <Container>
        <div className="relative flex w-full flex-col items-center justify-center gap-copy-media overflow-hidden radius-card bg-grey-50 px-8 py-14 sm:px-10 sm:py-16 md:min-h-[408px] md:px-16 md:py-20">
          <div className="relative z-20 flex max-w-[600px] flex-col items-center gap-title-lead text-center text-grey-950">
            <BlurText
              as="h2"
              className="t-display"
              text="Your AI coworker is ready when you are."
            />
            <FadeIn as="p" delay={0.1} className="t-lead text-grey-500">
              Download Denker and hand off the research, analysis, and busywork —
              right across the tools you already use.
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="relative z-20 flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button variant="primary" href={LOGIN_URL} className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button
              variant="secondary"
              href={DOWNLOAD_URL}
              className="w-full border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50 sm:w-auto"
            >
              Download Denker
            </Button>
          </FadeIn>

        </div>
      </Container>
    </section>
  );
}
