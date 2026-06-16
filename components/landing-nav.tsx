"use client";

import { useState } from "react";
import { DenkerLogo } from "@/components/denker-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CtaGateDialog, useCtaGate } from "@/components/cta-gate-dialog";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/#features", label: "Features", testId: "nav-features" },
  { href: "/#pricing", label: "Pricing", testId: "nav-pricing" },
  { href: "/docs", label: "Docs", testId: "nav-docs" },
  { href: "/blog", label: "Blog", testId: "nav-blog" },
  { href: "/#community", label: "Community", testId: "nav-community" },
];

const PEERLIST_BADGE_SRC =
  "https://peerlist.io/api/v1/projects/embed/PRJHDNDLJMEEPR78PI7MLDNMJQMOED?showUpvote=true&theme=light";
const PEERLIST_BADGE_FALLBACK_SRC =
  "/blog/assets/denker-peerlist-launch/peerlist-launch-badge.png";

function PeerlistBadge({
  className = "",
  testId,
}: {
  className?: string;
  testId: string;
}) {
  const [src, setSrc] = useState(PEERLIST_BADGE_SRC);

  return (
    <a
      href="https://peerlist.io/denker/project/denker"
      target="_blank"
      rel="noreferrer"
      className={cn(
        "liquid-glass inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-85",
        className,
      )}
      aria-label="Denker on Peerlist"
      data-testid={testId}
    >
      <img
        src={src}
        alt="Denker on Peerlist"
        className="h-full w-full object-contain"
        onError={() => setSrc(PEERLIST_BADGE_FALLBACK_SRC)}
      />
    </a>
  );
}

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const { open: gateOpen, openGate, closeGate } = useCtaGate();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5" data-testid="landing-nav">
      {/* Desktop nav */}
      <div className="hidden items-center gap-3 lg:flex">
        <nav className="liquid-glass flex items-center gap-1 rounded-full border border-glass-stroke px-3 py-2">
          <a href="/" className="flex items-center px-2 pr-5" data-testid="nav-logo">
            <DenkerLogo variant="wordmark" height={18} />
          </a>

          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-secondary transition-colors hover:bg-glass-fill-heavy hover:text-primary"
              data-testid={link.testId}
            >
              {link.label}
            </a>
          ))}

          <div className="mx-2 h-4 w-px bg-glass-stroke" />
          <ThemeToggle />
          <button
            type="button"
            onClick={openGate}
            className="ml-1 inline-flex h-8 items-center rounded-full bg-primary px-5 text-sm font-semibold text-canvas transition-opacity hover:opacity-80"
            data-testid="nav-cta"
          >
            Start Now
          </button>
        </nav>
        <PeerlistBadge
          className="h-[50px] w-[230px] px-3"
          testId="nav-peerlist"
        />
      </div>

      {/* Mobile nav */}
      <nav className="flex w-full flex-col lg:hidden">
        <div className="liquid-glass flex items-center justify-between rounded-full border border-glass-stroke px-4 py-2.5">
          <a href="/" data-testid="nav-logo-mobile">
            <DenkerLogo variant="wordmark" height={16} />
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-glass-fill-heavy"
              aria-label={open ? "Close menu" : "Open menu"}
              data-testid="nav-mobile-toggle"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {open ? (
                  <>
                    <line x1="4" y1="4" x2="14" y2="14" />
                    <line x1="14" y1="4" x2="4" y2="14" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="5" x2="15" y2="5" />
                    <line x1="3" y1="9" x2="15" y2="9" />
                    <line x1="3" y1="13" x2="15" y2="13" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="mt-2 flex flex-col gap-1 overflow-hidden rounded-2xl border border-glass-stroke bg-glass-fill-dense p-3 shadow-glass backdrop-blur-glass">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-secondary transition-colors hover:bg-glass-fill-heavy hover:text-primary"
                data-testid={`${link.testId}-mobile`}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openGate();
              }}
              className="mt-1 flex h-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-canvas transition-opacity hover:opacity-80"
              data-testid="nav-cta-mobile"
            >
              Start Now
            </button>
            <PeerlistBadge className="mt-2 h-12 w-[264px] self-center px-3" testId="nav-peerlist-mobile" />
          </div>
        )}
      </nav>
      <CtaGateDialog open={gateOpen} onClose={closeGate} />
    </header>
  );
}
