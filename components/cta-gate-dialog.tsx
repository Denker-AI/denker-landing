"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  detectDevice,
  detectReturningUser,
  fetchMacDownloadUrlWithUtm,
  getChannel,
  MAC_DOWNLOAD_PAGE_FALLBACK,
  type Device,
} from "@/lib/download-resolver";
import { captureEvent, getAttributionProperties } from "@/lib/posthog";
import { webAppAuthUrls } from "@/lib/web-app-auth";
import { NewsletterForm } from "@/components/newsletter-form";

/* ── Convenience hook ────────────────────────────────────────────── */

export function useCtaGate() {
  const [open, setOpen] = useState(false);
  const openGate = useCallback(() => setOpen(true), []);
  const closeGate = useCallback(() => setOpen(false), []);
  return { open, openGate, closeGate };
}

/* ── Dialog component ────────────────────────────────────────────── */

export function CtaGateDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [device, setDevice] = useState<Device>("other-desktop");
  const [isReturning, setIsReturning] = useState(false);
  const [macDownloadUrl, setMacDownloadUrl] = useState<string | null>(null);

  const isMac = device === "mac-desktop";
  const isMobile = device === "mobile";

  useEffect(() => {
    setMounted(true);
    setDevice(detectDevice());
    setIsReturning(detectReturningUser());
  }, []);

  /* Pre-fetch the Mac binary URL when the dialog opens so the click is instant. */
  useEffect(() => {
    if (!open || !isMac || macDownloadUrl) return;
    let cancelled = false;
    fetchMacDownloadUrlWithUtm(window.location.search).then((url) => {
      if (!cancelled) setMacDownloadUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [open, isMac, macDownloadUrl]);

  const handleMacDownload = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      /* If we already resolved a binary URL, the <a> href is set — let it through. */
      const props = {
        ...getAttributionProperties(),
        device,
        download_channel: getChannel(),
        returning_user_hint: isReturning,
        source: "cta_gate",
      };
      if (macDownloadUrl) {
        captureEvent("mac_download_started", {
          ...props,
          resolved_url_host: new URL(macDownloadUrl).hostname,
        });
        return;
      }
      /* Otherwise, try one more time at click time. If still nothing, send the
       * user to /download so that page can retry and explain the fallback. */
      e.preventDefault();
      fetchMacDownloadUrlWithUtm(window.location.search).then((url) => {
        if (!url) {
          captureEvent("mac_download_failed", {
            ...props,
            reason: "manifest_unreachable_cta",
          });
          window.location.href = MAC_DOWNLOAD_PAGE_FALLBACK;
          return;
        }
        captureEvent("mac_download_started", {
          ...props,
          resolved_url_host: new URL(url).hostname,
        });
        window.location.href = url;
      });
    },
    [device, isReturning, macDownloadUrl],
  );

  /* Escape to close. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Centered dialog */}
      <div
        className="fixed inset-0 z-[81] grid place-items-center px-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cta-gate-title"
      >
        <div
          className="relative w-full max-w-sm rounded-2xl border border-glass-stroke bg-glass-fill-dense p-7 shadow-glass backdrop-blur-glass"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-glass-fill-heavy hover:text-primary"
            data-testid="cta-gate-close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>

          <h2 id="cta-gate-title" className="text-xl font-semibold text-primary">
            {isReturning
              ? "Welcome back"
              : isMobile
                ? "Save your spot"
                : isMac
                  ? "Start Denker"
                  : "Coming to your desktop"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isReturning
              ? "Sign in to pick up where you left off."
              : isMobile
                ? "Denker runs on your Mac. Create your account now — we'll set it up when you're back on desktop."
                : isMac
                  ? "Pick how you want to start."
                  : "Denker is a macOS app today. Windows and Linux are next — subscribe and we'll email you the moment it's ready."}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {isReturning ? (
              <>
                {isMac && (
                  <a
                    href={macDownloadUrl ?? webAppAuthUrls.desktopLogin}
                    onClick={handleMacDownload}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-glass-stroke bg-glass-fill text-sm font-semibold text-primary transition-colors hover:border-glass-stroke-light"
                    data-testid="cta-gate-download-mac"
                  >
                    {macDownloadUrl ? "Download for Mac" : "Get Denker for Mac"}
                  </a>
                )}
                <a
                  href={isMac ? webAppAuthUrls.desktopLogin : webAppAuthUrls.login}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-canvas transition-opacity hover:opacity-80"
                  data-testid="cta-gate-signin-primary"
                >
                  Sign in
                </a>
              </>
            ) : isMobile ? (
              <>
                <a
                  href={webAppAuthUrls.mobileDesktopRegister}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-canvas transition-opacity hover:opacity-80"
                  data-testid="cta-gate-create-account-mobile"
                >
                  Create account
                </a>
                <p className="text-center text-xs text-muted">
                  Tip: open <span className="font-semibold text-secondary">denker.ai</span> on your Mac to finish setup.
                </p>
              </>
            ) : isMac ? (
              <>
                <a
                  href={macDownloadUrl ?? MAC_DOWNLOAD_PAGE_FALLBACK}
                  onClick={handleMacDownload}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-canvas transition-opacity hover:opacity-80"
                  data-testid="cta-gate-download-mac"
                >
                  {macDownloadUrl ? "Download for Mac" : "Get Denker for Mac"}
                </a>
                <a
                  href={webAppAuthUrls.desktopRegister}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-glass-stroke bg-glass-fill text-sm font-semibold text-primary transition-colors hover:border-glass-stroke-light"
                  data-testid="cta-gate-open-browser"
                >
                  Create account
                </a>
              </>
            ) : (
              <>
                <NewsletterForm />
                <p className="text-center text-xs text-muted">
                  Already on a Mac? Visit <span className="font-semibold text-secondary">denker.ai</span> there to download.
                </p>
              </>
            )}
          </div>

          <div className="mt-6 border-t border-glass-stroke-faint pt-4 text-center">
            <span className="text-xs text-secondary">
              {isReturning ? "Need a new account? " : "Already have an account? "}
              <a
                href={
                  isReturning
                    ? isMac
                      ? webAppAuthUrls.desktopRegister
                      : webAppAuthUrls.register
                    : isMac
                      ? webAppAuthUrls.desktopLogin
                      : webAppAuthUrls.login
                }
                className="text-xs text-secondary underline-offset-4 hover:text-primary hover:underline"
                data-testid={isReturning ? "cta-gate-signup" : "cta-gate-signin"}
              >
                {isReturning ? "Sign up →" : "Sign in →"}
              </a>
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
