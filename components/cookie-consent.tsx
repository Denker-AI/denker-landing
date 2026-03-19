"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";

const COOKIE_KEY = "denker-cookie-consent";

type Consent = "accepted" | "declined" | null;

function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_KEY) as Consent;
}

/**
 * Load PostHog analytics via CDN — only after cookie consent.
 * Env vars: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
 *
 * Uses the official PostHog snippet pattern: create a stub object first,
 * then load the async script which replaces the stubs with real methods.
 */
function loadPostHog() {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
  if (!key || document.getElementById("ph-script")) return;

  // Create stub (official PostHog pattern)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ph: Record<string, any> = {};
  ph._i = [];
  ph.init = function (token: string, config: Record<string, unknown>) {
    ph._i.push([token, config]);
  };
  const methods = [
    "capture", "identify", "alias", "people.set", "people.set_once",
    "set_config", "register", "register_once", "unregister",
    "opt_out_capturing", "has_opted_out_capturing", "opt_in_capturing",
    "reset", "isFeatureEnabled", "onFeatureFlags", "getFeatureFlag",
    "reloadFeatureFlags", "group", "onSessionId",
  ];
  for (const m of methods) {
    const parts = m.split(".");
    let target = ph as Record<string, unknown>;
    if (parts.length === 2) {
      if (!target[parts[0]]) target[parts[0]] = {};
      target = target[parts[0]] as Record<string, unknown>;
    }
    const name = parts[parts.length - 1];
    target[name] = function (...args: unknown[]) {
      (ph._i as unknown[]).push([name, ...args]);
    };
  }
  (window as unknown as Record<string, unknown>).posthog = ph;

  // Init with config
  ph.init(key, {
    api_host: host,
    ui_host: "https://eu.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    cookie_domain: ".denker.ai",
  });

  // Load async script
  const script = document.createElement("script");
  script.id = "ph-script";
  script.async = true;
  script.src = `${host}/static/array.js`;
  document.head.appendChild(script);
}

function removePostHog() {
  if (typeof window === "undefined") return;
  const ph = (window as unknown as Record<string, unknown>).posthog as Record<string, unknown> | undefined;
  if (ph?.opt_out_capturing) {
    (ph.opt_out_capturing as () => void)();
  }
  const script = document.getElementById("ph-script");
  if (script) script.remove();
}

/** Reset consent — call from footer "Cookies" link to re-show the banner. */
export function resetCookieConsent() {
  localStorage.removeItem(COOKIE_KEY);
  window.location.reload();
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === "accepted") {
      loadPostHog();
    } else if (consent === null) {
      setVisible(true);
    }
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
    loadPostHog();
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
    removePostHog();
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
