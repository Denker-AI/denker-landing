import Image from "next/image";
import {
  EnvelopeSimple,
  LinkedinLogo,
  TiktokLogo,
  WhatsappLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";

const pageLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "https://www.denker.ai/docs" },
  { label: "Blog", href: "https://www.denker.ai/blog" },
  { label: "Traction", href: "https://www.denker.ai/traction" },
  { label: "Community", href: "#reach-out" },
].map((link) => ({ ...link, external: link.href.startsWith("http") }));
const infoLinks = [
  { label: "Contact", href: "#" },
  { label: "Privacy", href: "https://www.denker.ai/privacy" },
  { label: "Terms of use", href: "https://www.denker.ai/terms" },
  { label: "Cookies", href: "#" },
];

// Social links — filled brand-colour round buttons, mirroring the Reach Out
// section (same platforms, order, and destinations).
const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/denkerai/", Icon: LinkedinLogo, color: "#0A66C2" },
  { label: "X", href: "https://x.com/Denker_AI", Icon: XLogo, color: "#000000" },
  { label: "YouTube", href: "https://www.youtube.com/@DenkerAI", Icon: YoutubeLogo, color: "#FF0000" },
  { label: "TikTok", href: "https://www.tiktok.com/@denkerai", Icon: TiktokLogo, color: "#000000" },
  { label: "WhatsApp", href: "https://bit.ly/denkerai", Icon: WhatsappLogo, color: "#25D366" },
  { label: "Email", href: "mailto:jane@denker.ai", Icon: EnvelopeSimple, color: "#6E6E73" },
];

export function Footer() {
  return (
    <footer
      className="section-tint flex w-full flex-col items-center border-t border-[#E8E8ED] px-6 pt-8 pb-0 sm:px-10 md:px-20"
      data-name="Section - Footer"
      data-theme="light"
    >
      <Container className="@container flex flex-col items-start gap-6">
        <div className="flex w-full flex-col items-start justify-between gap-10 md:flex-row">
          <div className="flex w-full max-w-[480px] flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <Image src="/images/brand/brand-icon.svg" alt="" width={24} height={24} />
              <Image
                src="/images/brand/brand-text-dark.svg"
                alt="Denker"
                width={64}
                height={16}
              />
            </div>
            <p className="t-body text-grey-500">
              Work smarter with an AI coworker that researches, analyzes, and
              executes tasks across your favorite tools. Built for founders
              and product builders who want to get more done with less
              effort.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {socialLinks.map(({ label, href, Icon, color }) => {
                const external = href.startsWith("http");
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    style={{ backgroundColor: color }}
                    className="flex size-10 items-center justify-center rounded-full text-white transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Icon weight="fill" className="size-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex w-full gap-16 sm:w-auto sm:gap-24">
            <div className="flex w-[200px] flex-col items-start gap-4">
              <p className="t-title text-grey-950">Pages</p>
              <div className="flex flex-col items-start gap-3">
                {pageLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="t-body text-grey-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex w-[200px] flex-col items-start gap-4">
              <p className="t-title text-grey-950">
                Information
              </p>
              <div className="flex flex-col items-start gap-3">
                {infoLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="t-body text-grey-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-grey-100" />

        <p className="t-caption w-full text-center text-grey-500">
          © 2026 Denker AI. All rights reserved.
        </p>

        {/* Decorative watermark — set as text (not the Figma export image) so
            it stays crisp at any size and doesn't need an asset file.

            Font-size is in cqw (% of the @container above) instead of fixed
            per-breakpoint px, so "Denker" always spans exactly the full
            container width — width and height scale together (proportionally)
            since both derive from the same font-size, at every viewport
            width, not just 3 fixed snap points. h-[0.7em] + overflow-hidden
            crops the box to 70% of that font-size, showing only the top 70%
            of the glyphs. */}
        <p
          aria-hidden
          className="h-[0.7em] w-full overflow-hidden text-center font-heading text-[29.83cqw] leading-none font-bold whitespace-nowrap text-white select-none"
        >
          Denker
        </p>
      </Container>
    </footer>
  );
}
