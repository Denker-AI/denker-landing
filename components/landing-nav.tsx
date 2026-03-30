"use client";

import { useState } from "react";
import { DenkerLogo } from "@/components/denker-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "#features", label: "Features", testId: "nav-features" },
  { href: "#pricing", label: "Pricing", testId: "nav-pricing" },
  { href: "/blog", label: "Blog", testId: "nav-blog" },
  { href: "#community", label: "Community", testId: "nav-community" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5" data-testid="landing-nav">
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 rounded-full border border-glass-stroke bg-glass-fill px-3 py-2 shadow-glass backdrop-blur-glass md:flex">
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
        <a
          href="https://space.denker.ai"
          className="ml-1 inline-flex h-8 items-center rounded-full bg-primary px-5 text-sm font-semibold text-canvas transition-opacity hover:opacity-80"
          data-testid="nav-cta"
        >
          Get Started
        </a>
      </nav>

      {/* Mobile nav */}
      <nav className="flex w-full flex-col md:hidden">
        <div className="flex items-center justify-between rounded-full border border-glass-stroke bg-glass-fill px-4 py-2.5 shadow-glass backdrop-blur-glass">
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
        <div
          className={cn(
            "mt-2 flex flex-col gap-1 overflow-hidden rounded-2xl border border-glass-stroke bg-glass-fill-dense p-3 shadow-glass backdrop-blur-glass transition-all duration-200",
            open ? "max-h-80 opacity-100" : "max-h-0 border-transparent p-0 opacity-0",
          )}
        >
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
          <a
            href="https://space.denker.ai"
            onClick={() => setOpen(false)}
            className="mt-1 flex h-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-canvas transition-opacity hover:opacity-80"
            data-testid="nav-cta-mobile"
          >
            Get Started
          </a>
        </div>
      </nav>
    </header>
  );
}
