"use client";

import {
  EnvelopeSimple,
  LinkedinLogo,
  TiktokLogo,
  WhatsappLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

// Filled round buttons — each brand's colour fills the circle with a white
// glyph on top, so the row is one uniform, rounded, on-brand set. Shared with
// the Footer. Update `href` per entry.
const socialLinks: { label: string; Icon: typeof LinkedinLogo; href: string; color: string }[] = [
  { label: "WhatsApp", Icon: WhatsappLogo, href: "https://bit.ly/denkerai", color: "#25D366" },
  { label: "LinkedIn", Icon: LinkedinLogo, href: "https://www.linkedin.com/company/denkerai/", color: "#0A66C2" },
  { label: "X", Icon: XLogo, href: "https://x.com/Denker_AI", color: "#000000" },
  { label: "YouTube", Icon: YoutubeLogo, href: "https://www.youtube.com/@DenkerAI", color: "#FF0000" },
  { label: "TikTok", Icon: TiktokLogo, href: "https://www.tiktok.com/@denkerai", color: "#000000" },
  { label: "Email", Icon: EnvelopeSimple, href: "mailto:jane@denker.ai", color: "#6E6E73" },
];

export function ReachOut() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: no backend/email service is wired up yet — hook this up to the
    // client's newsletter provider (Mailchimp, ConvertKit, etc.) when ready.
    setSubmitted(true);
  };

  return (
    <section
      id="reach-out"
      className="flex w-full scroll-mt-28 flex-col items-center bg-white px-6 pt-16 pb-4 sm:px-10 md:px-20 md:pt-20 md:pb-4"
      data-name="Section - Reach Out"
      data-theme="light"
    >
      <Container>
        {/* Same card shell as the CTA below (grey-50, radius, padding,
            min-height, centered) so the two read as one matched pair. */}
        <div className="flex w-full flex-col items-center justify-center gap-8 rounded-[20px] bg-grey-50 px-8 py-14 text-center sm:rounded-[24px] sm:px-10 sm:py-16 md:min-h-[408px] md:rounded-[32px] md:px-16 md:py-20">
          <div className="flex max-w-[600px] flex-col items-center gap-2">
            <BlurText
              as="h2"
              className="font-heading text-3xl font-bold text-grey-950 md:text-[40px] md:leading-[48px]"
              text="Reach Out"
            />
            <FadeIn as="p" delay={0.1} className="font-heading text-lg font-medium leading-7 text-grey-500 sm:text-xl">
              Find Denker across the platforms where founders and product
              builders connect — or subscribe for practical founder tips.
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="flex flex-wrap justify-center gap-3">
            {socialLinks.map(({ label, Icon, href, color }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: color }}
                className="flex size-11 items-center justify-center rounded-full text-white transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md"
              >
                <Icon weight="fill" className="size-5" />
              </a>
            ))}
          </FadeIn>

          <FadeIn delay={0.3} className="w-full max-w-[440px]">
            {submitted ? (
              <p className="font-body text-base text-grey-950">
                Thanks for subscribing — check your inbox to confirm.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-12 w-full min-w-0 rounded-full border border-grey-200 bg-white px-5 font-body text-base text-grey-950 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-950 sm:flex-1"
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-full bg-grey-950 px-6 font-body text-base font-medium text-white transition-colors hover:bg-grey-800"
                >
                  Join
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
