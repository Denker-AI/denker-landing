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
        <div className="relative flex w-full flex-col items-center justify-center gap-10 overflow-hidden rounded-[20px] bg-grey-50 px-8 py-14 sm:rounded-[24px] sm:px-10 sm:py-16 md:min-h-[408px] md:rounded-[32px] md:px-16 md:py-20">
          <div className="relative z-20 flex max-w-[600px] flex-col items-center gap-2 text-center text-grey-950">
            <BlurText
              as="h2"
              className="font-heading text-3xl font-bold md:text-[40px] md:leading-[48px]"
              text="Built in Public. Trusted by Builders."
            />
            <FadeIn as="p" delay={0.1} className="font-heading text-lg font-medium leading-7 text-grey-500 sm:text-xl">
              Explore Denker across the platforms where founders and product
              builders discover, collaborate, and contribute.
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="relative z-20 flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button variant="primary" href={LOGIN_URL} className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button
              variant="secondary"
              href={DOWNLOAD_URL}
              download
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
