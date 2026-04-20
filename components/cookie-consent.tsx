"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { upgradePostHogConsent, optOutPostHog } from "@/lib/posthog";
import { loadLinkedIn } from "@/lib/linkedin";
import { COOKIE_KEY, getConsent } from "@/lib/consent";

/** Reset consent — call from footer "Cookies" link to re-show the banner. */
export function resetCookieConsent() {
  localStorage.removeItem(COOKIE_KEY);
  window.location.reload();
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === null) setVisible(true);
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
    upgradePostHogConsent();
    loadLinkedIn();
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
    optOutPostHog();
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-72",
        "rounded-xl border border-glass-stroke bg-glass-fill-dense p-4 shadow-glass backdrop-blur-glass",
      )}
      data-testid="cookie-consent"
    >
      <p className="mb-3 text-xs leading-relaxed text-secondary">
        We use cookies to analyze site usage.{" "}
        <a href="/privacy" className="text-accent underline underline-offset-2 hover:text-primary">
          Privacy policy
        </a>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={accept}
          className="h-7 rounded-full bg-accent px-4 text-[11px] font-semibold text-[#0F1115] transition-all hover:brightness-110"
          data-testid="cookie-accept"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="h-7 rounded-full border border-glass-stroke px-4 text-[11px] font-semibold text-secondary transition-colors hover:text-primary"
          data-testid="cookie-decline"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
