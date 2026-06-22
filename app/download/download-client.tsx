"use client";

/**
 * /download — Auto-resolve Mac binary and trigger download on page load.
 * Designed as a newsletter CTA landing page: Mac users get an immediate
 * download with zero clicks; all other devices see the appropriate fallback.
 */

import { useEffect, useState } from "react";
import { DenkerLogo } from "@/components/denker-logo";
import { cn } from "@/lib/cn";
import {
  detectDevice,
  fetchMacDownloadUrlWithUtm,
  getChannel,
  type Device,
} from "@/lib/download-resolver";
import { captureEvent, getAttributionProperties } from "@/lib/posthog";
import { webAppAuthUrls } from "@/lib/web-app-auth";
import { NewsletterForm } from "@/components/newsletter-form";

function triggerDownload(url: string): void {
  window.location.assign(url);
}

/* ── Page state ─────────────────────────────────────────────── */

type PageState =
  | { kind: "detecting" }
  | { kind: "mac-downloading"; url: string }
  | { kind: "mac-failed" }
  | { kind: "other-desktop" }
  | { kind: "mobile" };

/* ── Derived copy per state ──────────────────────────────────── */

function getStatusLine(state: PageState): string {
  switch (state.kind) {
    case "detecting":
      return "Detecting your device…";
    case "mac-downloading":
      return "Your download should start automatically. If it doesn't, click Download again.";
    case "mac-failed":
      return "Couldn't reach our servers. Try again?";
    case "other-desktop":
      return "Denker for macOS is ready. Windows and Linux are next — subscribe and we'll email you the moment it's ready.";
    case "mobile":
      return "Denker runs on your Mac. Subscribe and we'll send you a reminder for when you're back on desktop.";
  }
}

/* ── Main page ───────────────────────────────────────────────── */

export function DownloadClient() {
  const [state, setState] = useState<PageState>({ kind: "detecting" });

  /* On mount: detect device, fetch manifest, auto-trigger download on Mac. */
  useEffect(() => {
    const device: Device = detectDevice();
    const channel = getChannel();
    const baseProps = {
      ...getAttributionProperties(),
      device,
      download_channel: channel,
      source: "download_page",
    };

    captureEvent("download_page_viewed", baseProps);

    if (device !== "mac-desktop") {
      setState({ kind: device === "mobile" ? "mobile" : "other-desktop" });
      return;
    }

    let cancelled = false;

    fetchMacDownloadUrlWithUtm(window.location.search).then((url) => {
      if (cancelled) return;
      if (!url) {
        setState({ kind: "mac-failed" });
        captureEvent("mac_download_failed", {
          ...baseProps,
          reason: "manifest_unreachable",
        });
        return;
      }
      setState({ kind: "mac-downloading", url });
      triggerDownload(url);
      captureEvent("mac_download_started", {
        ...baseProps,
        resolved_url_host: new URL(url).hostname,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = () => {
    setState({ kind: "detecting" });
    const channel = getChannel();
    const props = {
      ...getAttributionProperties(),
      device: detectDevice(),
      download_channel: channel,
      manual: true,
      source: "download_page",
    };

    fetchMacDownloadUrlWithUtm(window.location.search).then((url) => {
      if (!url) {
        setState({ kind: "mac-failed" });
        captureEvent("mac_download_failed", {
          ...props,
          reason: "manifest_unreachable_retry",
        });
        return;
      }
      setState({ kind: "mac-downloading", url });
      triggerDownload(url);
      captureEvent("mac_download_started", {
        ...props,
        resolved_url_host: new URL(url).hostname,
      });
    });
  };

  const isDetecting = state.kind === "detecting";
  const isMacDownloading = state.kind === "mac-downloading";
  const isMacFailed = state.kind === "mac-failed";
  const isNonMacDesktop = state.kind === "other-desktop";
  const isMobile = state.kind === "mobile";

  /* Primary button props — non-Mac devices get the newsletter form instead. */
  const primaryButton = (() => {
    if (isDetecting) {
      return { label: "Download for Mac", disabled: true, href: undefined, onClick: undefined };
    }
    if (isMacDownloading) {
      return {
        label: "Download again",
        disabled: false,
        href: (state as { kind: "mac-downloading"; url: string }).url,
        onClick: () => {
          captureEvent("mac_download_started", {
            ...getAttributionProperties(),
            device: detectDevice(),
            download_channel: getChannel(),
            manual: true,
            source: "download_page",
          });
        },
      };
    }
    if (isMacFailed) {
      return { label: "Try again", disabled: false, href: undefined, onClick: handleRetry };
    }
    /* other-desktop or mobile */
    return null;
  })();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5 py-16">
      {/* Logo */}
      <a href="/" aria-label="Denker home" className="mb-10">
        <DenkerLogo variant="wordmark" height={26} />
      </a>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-glass-stroke bg-glass-fill-dense p-8 shadow-glass backdrop-blur-glass text-center">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-primary">
          Denker for macOS
        </h1>

        {/* Status line */}
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed",
            isMacFailed ? "text-danger" : "text-secondary",
          )}
          data-testid="download-status"
        >
          {getStatusLine(state)}
        </p>

        {/* Primary action — Mac states get a button, other devices the newsletter form */}
        <div className="mt-6">
          {!primaryButton ? (
            <NewsletterForm />
          ) : primaryButton.href ? (
            <a
              href={primaryButton.href}
              onClick={() => primaryButton.onClick?.()}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-bold text-canvas transition-opacity hover:opacity-80"
              data-testid="download-primary-btn"
            >
              {primaryButton.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={primaryButton.onClick}
              disabled={primaryButton.disabled}
              className={cn(
                "inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-bold transition-opacity",
                primaryButton.disabled
                  ? "cursor-not-allowed bg-glass-fill-heavy text-muted opacity-50"
                  : "bg-accent text-canvas hover:opacity-80",
              )}
              data-testid="download-primary-btn"
            >
              {primaryButton.label}
            </button>
          )}
        </div>

        {isMacDownloading && (
          <div className="mt-3">
            <a
              href={webAppAuthUrls.desktopRegister}
              className="inline-flex h-11 w-full items-center justify-center rounded-full border border-glass-stroke bg-glass-fill text-sm font-semibold text-primary transition-colors hover:border-glass-stroke-light"
              data-testid="download-create-account-link"
            >
              Create account
            </a>
          </div>
        )}

        {/* Tertiary link — extra escape hatch back to the marketing site */}
        {(isNonMacDesktop || isMobile || isMacFailed) && (
          <div className="mt-4">
            <a
              href="/"
              className="text-xs text-muted underline-offset-4 hover:text-secondary hover:underline"
              data-testid="download-back-home-link"
            >
              Back to home
            </a>
          </div>
        )}
      </div>

      {/* Footnote — always visible */}
      <p className="mt-6 text-xs text-muted" data-testid="download-footnote">
        Windows is coming. Linux too.
      </p>
    </div>
  );
}
