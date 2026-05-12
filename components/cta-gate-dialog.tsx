"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* ── OS / device detection ───────────────────────────────────────── */

type Device = "mac-desktop" | "mobile" | "other-desktop";

function detectDevice(): Device {
  if (typeof navigator === "undefined") return "other-desktop";
  const platform = navigator.platform || "";
  const ua = navigator.userAgent || "";

  /* Phone / tablet: iPhone, iPad, iPod, Android, or any UA with "Mobile". */
  const isIOS = /iPhone|iPad|iPod/.test(platform) || /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isTouchMobile = isIOS || isAndroid || /Mobile/.test(ua);
  if (isTouchMobile) return "mobile";

  /* True macOS desktop. iPad-on-iPadOS-13+ reports as "MacIntel" but is mobile,
   * caught above by the iPad UA check (modern iPadOS includes "iPad" only via
   * userAgent if requestDesktopSite is off — for the requestDesktopSite case,
   * we accept the false positive; user can still click "Open in browser"). */
  if (/Mac/.test(platform) || /Mac OS X/.test(ua)) return "mac-desktop";

  return "other-desktop";
}

/* Returning-user detection — reads the `denker_user` cookie set by the auth
 * backend on `.denker.ai`. Present = signed in (or has been recently). Cookie
 * does NOT carry session data — it's a UX-only hint to re-rank our CTAs. */
function detectReturningUser(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)denker_user=1(?:;|$)/.test(document.cookie);
}

/* Resolve the right Mac binary URL from the Tauri auto-updater manifest.
 * Returns null if the manifest is empty (no public build yet) or unreachable —
 * caller falls back to the sign-up flow. */
async function fetchMacDownloadUrl(): Promise<string | null> {
  try {
    const res = await fetch("https://updates.denker.ai/latest.json", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      platforms?: Record<string, { url?: string }>;
    };
    const platforms = data.platforms ?? {};
    /* Apple Silicon is the modern default; fall back to Intel if only that exists. */
    return (
      platforms["darwin-aarch64"]?.url ??
      platforms["darwin-x86_64"]?.url ??
      null
    );
  } catch {
    return null;
  }
}

const SIGNUP_DESKTOP_FALLBACK = "https://space.denker.ai/auth/register?intent=desktop";

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
    fetchMacDownloadUrl().then((url) => {
      if (!cancelled) setMacDownloadUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [open, isMac, macDownloadUrl]);

  const handleMacDownload = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      /* If we already resolved a binary URL, the <a> href is set — let it through. */
      if (macDownloadUrl) return;
      /* Otherwise, try one more time at click time. If still nothing, the <a>
       * already points at the sign-up fallback so the click works either way. */
      e.preventDefault();
      fetchMacDownloadUrl().then((url) => {
        window.location.href = url ?? SIGNUP_DESKTOP_FALLBACK;
      });
    },
    [macDownloadUrl],
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
                : "Start Denker"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isReturning
              ? "Sign in to pick up where you left off."
              : isMobile
                ? "Denker runs on your Mac. Create your account now — we'll set it up when you're back on desktop."
                : "Pick how you want to start."}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {isReturning ? (
              <>
                {isMac && (
                  <a
                    href={macDownloadUrl ?? "https://space.denker.ai/auth/login?intent=desktop"}
                    onClick={handleMacDownload}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-glass-stroke bg-glass-fill text-sm font-semibold text-primary transition-colors hover:border-glass-stroke-light"
                    data-testid="cta-gate-download-mac"
                  >
                    {macDownloadUrl ? "Download for Mac" : "Get Denker for Mac"}
                  </a>
                )}
                <a
                  href="https://space.denker.ai/auth/login"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-canvas transition-opacity hover:opacity-80"
                  data-testid="cta-gate-signin-primary"
                >
                  Sign in
                </a>
              </>
            ) : isMobile ? (
              <>
                <a
                  href="https://space.denker.ai/auth/register?platform=mobile&intent=desktop-handoff"
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
                  href={macDownloadUrl ?? SIGNUP_DESKTOP_FALLBACK}
                  onClick={handleMacDownload}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-canvas transition-opacity hover:opacity-80"
                  data-testid="cta-gate-download-mac"
                >
                  {macDownloadUrl ? "Download for Mac" : "Get Denker for Mac"}
                </a>
                <a
                  href="https://space.denker.ai/auth/register"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-glass-stroke bg-glass-fill text-sm font-semibold text-primary transition-colors hover:border-glass-stroke-light"
                  data-testid="cta-gate-open-browser"
                >
                  Open in browser
                </a>
              </>
            ) : (
              <>
                <a
                  href="https://space.denker.ai/auth/register"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-canvas transition-opacity hover:opacity-80"
                  data-testid="cta-gate-open-browser"
                >
                  Open in browser
                </a>
                <p className="text-center text-xs text-muted">
                  macOS desktop app available · Windows &amp; Linux coming soon
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
                    ? "https://space.denker.ai/auth/register"
                    : "https://space.denker.ai/auth/login"
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
