"use client";

import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

// Update `href` for each entry with the real destination — YouTube channel,
// mailto: link, X/Twitter profile, WhatsApp invite, LinkedIn page, TikTok
// profile, etc.
const socialLinks: { handle: string; icon?: string; href: string }[] = [
  { handle: "@Denker AI", icon: "/logos/YouTube.svg", href: "https://www.youtube.com/@DenkerAI" },
  { handle: "@supprt@denker.ai", icon: "/logos/gmail.svg", href: "mailto:jane@denker.ai" },
  { handle: "@denker_ai", icon: "/logos/x.svg", href: "https://x.com/Denker_AI" },
  { handle: "@Join our community", icon: "/logos/WhatsApp.svg", href: "https://bit.ly/denkerai" },
  { handle: "@Denker AI", icon: "/logos/LinkedIn.svg", href: "https://www.linkedin.com/company/denkerai/" },
  { handle: "@denker_ai", icon: "/logos/TikTok.svg", href: "https://www.tiktok.com/@denkerai?is_from_webapp=1&sender_device=pc" },
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
      className="flex w-full scroll-mt-28 flex-col items-center bg-grey-950 px-6 pt-16 pb-24 sm:px-10 md:px-20 md:pt-20 md:pb-32"
      data-name="Section - Reach Out"
      data-theme="dark"
    >
      <Container className="flex flex-col items-start gap-14">
        <BlurText
          as="h2"
          className="font-heading text-3xl font-bold text-white md:text-[40px] md:leading-[48px]"
          text="Reach Out"
        />

        <FadeIn delay={0.1} className="reach-out-layout flex w-full gap-14">
          <div className="grid flex-1 grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4"
              >
                {link.icon ? (
                  <img src={link.icon} alt="" className="size-10 shrink-0 rounded-[10px]" />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-600">
                    <Sparkle weight="fill" className="size-4 text-white" />
                  </span>
                )}
                <span className="font-body text-base text-white">{link.handle}</span>
              </a>
            ))}
          </div>

          <div className="reach-out-newsletter flex flex-col">
            <div className="flex flex-col gap-2">
              <p className="font-heading text-2xl font-bold text-white">Newsletter</p>
              <p className="font-body text-base leading-6 text-grey-500">
                Get practical examples for saving time, directing agents, and
                growing output as a founder.
              </p>
            </div>

            {submitted ? (
              <p className="font-body text-base text-primary-400">
                Thanks for subscribing — check your inbox to confirm.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-12 flex-1 min-w-0 rounded-full border border-grey-700 bg-grey-900 px-6 font-body text-lg text-white placeholder:text-grey-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-full bg-primary-600 px-6 font-body text-lg font-medium text-white transition-[background-color,box-shadow] hover:bg-primary-700 hover:shadow-btn-hover"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
