"use client";

import { Icons } from "@/components/icons";
import { DenkerLogo } from "@/components/denker-logo";
import { resetCookieConsent } from "@/components/cookie-consent";

export function LandingFooter() {
  return (
    <footer className="px-4 pb-8 pt-4 sm:px-6 lg:px-12" data-testid="landing-footer">
      <div className="mx-auto max-w-5xl">
        {/* Main card */}
        <div className="liquid-glass rounded-2xl border border-glass-stroke p-10">
          <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">

            {/* Left — brand */}
            <div className="flex flex-col gap-5">
              <DenkerLogo variant="wordmark" height={22} />
              <p className="max-w-[220px] text-sm leading-relaxed text-secondary">
                Turn scattered AI sessions into business progress.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://linkedin.com/company/denkerai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary transition-opacity hover:opacity-70"
                  data-testid="footer-linkedin"
                >
                  <Icons.Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="mailto:team@denker.ai"
                  aria-label="Email"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary transition-opacity hover:opacity-70"
                  data-testid="footer-email"
                >
                  <Icons.Mail className="h-4 w-4" />
                </a>
                <a
                  href="#community"
                  aria-label="Community"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary transition-opacity hover:opacity-70"
                  data-testid="footer-community"
                >
                  <Icons.MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Pages */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">Pages</span>
              <nav className="flex flex-col gap-3">
                <a href="/" className="text-sm text-secondary transition-colors hover:text-primary">Home</a>
                <a href="/#features" className="text-sm text-secondary transition-colors hover:text-primary">Features</a>
                <a href="/#pricing" className="text-sm text-secondary transition-colors hover:text-primary">Pricing</a>
                <a href="/docs" className="text-sm text-secondary transition-colors hover:text-primary">Docs</a>
                <a href="/blog" className="text-sm text-secondary transition-colors hover:text-primary">Blog</a>
                <a href="/traction" className="text-sm text-secondary transition-colors hover:text-primary">Traction</a>
                <a href="/#community" className="text-sm text-secondary transition-colors hover:text-primary">Community</a>
              </nav>
            </div>

            {/* Information */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">Information</span>
              <nav className="flex flex-col gap-3">
                <a href="mailto:team@denker.ai" className="text-sm text-secondary transition-colors hover:text-primary">Contact</a>
                <a href="/privacy" className="text-sm text-secondary transition-colors hover:text-primary">Privacy</a>
                <a href="/terms" className="text-sm text-secondary transition-colors hover:text-primary">Terms of use</a>
                <button
                  onClick={resetCookieConsent}
                  className="text-left text-sm text-secondary transition-colors hover:text-primary"
                  data-testid="footer-cookies"
                >
                  Cookies
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Copyright below card */}
        <p className="mt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Denker AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
