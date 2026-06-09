"use client";

import { useState } from "react";
import { DenkerLogo } from "@/components/denker-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CtaGateDialog, useCtaGate } from "@/components/cta-gate-dialog";
import { LandingGlassSurface } from "@/components/landing-glass-surface";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/#features", label: "Features", testId: "nav-features" },
  { href: "/#pricing", label: "Pricing", testId: "nav-pricing" },
  { href: "/docs", label: "Docs", testId: "nav-docs" },
  { href: "/blog", label: "Blog", testId: "nav-blog" },
  { href: "/#community", label: "Community", testId: "nav-community" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const { open: gateOpen, openGate, closeGate } = useCtaGate();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5" data-testid="landing-nav">
      {/* Desktop nav */}
      <LandingGlassSurface
        borderRadius={999}
        className="landing-liquid-panel hidden md:block"
        data-testid="landing-nav-desktop-shell"
      >
        <nav className="flex items-center gap-1 px-3 py-2">
          <a href="/" className="flex items-center px-2 pr-5" data-testid="nav-logo">
            <DenkerLogo variant="wordmark" height={18} />
          </a>

          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-secondary transition-colors hover:bg-white/10 hover:text-primary"
              data-testid={link.testId}
            >
              {link.label}
            </a>
          ))}

          <div className="mx-2 h-4 w-px bg-white/[0.18]" />
          <ThemeToggle />
          <button
            type="button"
            onClick={openGate}
            className="landing-liquid-button ml-1 inline-flex h-8 items-center rounded-full bg-white/[0.92] px-5 text-sm font-semibold text-[#120814] transition-opacity hover:opacity-85"
            data-testid="nav-cta"
          >
            Start Now
          </button>
        </nav>
      </LandingGlassSurface>

      {/* Mobile nav */}
      <nav className="flex w-full flex-col md:hidden">
        <LandingGlassSurface
          borderRadius={999}
          className="landing-liquid-panel"
          data-testid="landing-nav-mobile-shell"
        >
          <div className="flex items-center justify-between px-4 py-2.5">
            <a href="/" data-testid="nav-logo-mobile">
              <DenkerLogo variant="wordmark" height={16} />
            </a>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setOpen(!open)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-white/10 hover:text-primary"
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
        </LandingGlassSurface>

        {/* Mobile dropdown */}
        <LandingGlassSurface
          borderRadius={22}
          className={cn(
            "landing-liquid-panel mt-2 transition-all duration-200",
            open
              ? "max-h-80 opacity-100"
              : "pointer-events-none max-h-0 opacity-0",
          )}
          aria-hidden={!open}
          inert={!open || undefined}
          data-testid="landing-nav-mobile-menu"
        >
          <div className="flex flex-col gap-1 p-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-secondary transition-colors hover:bg-white/10 hover:text-primary"
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
              className="landing-liquid-button mt-1 flex h-11 items-center justify-center rounded-full bg-white/[0.92] text-sm font-semibold text-[#120814] transition-opacity hover:opacity-85"
              data-testid="nav-cta-mobile"
            >
              Start Now
            </button>
          </div>
        </LandingGlassSurface>
      </nav>
      <CtaGateDialog open={gateOpen} onClose={closeGate} />
    </header>
  );
}
