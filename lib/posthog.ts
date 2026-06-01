/**
 * PostHog loader — supports anonymous (pre-consent) and identified (post-consent) modes.
 *
 * Flow:
 * 1. On page load, PostHogProvider calls `loadPostHog('anonymous')` — memory-only
 *    persistence, no cookies, captures $pageview immediately. GDPR-safe.
 * 2. When user accepts cookies, CookieConsent calls `upgradePostHogConsent()` —
 *    switches to localStorage+cookie so the same session persists across visits.
 * 3. When user declines, CookieConsent calls `optOutPostHog()` — disables capture.
 */

const COOKIE_DOMAIN = ".denker.ai";
const SCRIPT_ID = "ph-script";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PostHog = Record<string, any>;

function getPostHog(): PostHog | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as Record<string, unknown>).posthog as PostHog | undefined;
}

/** Create the PostHog stub object (official snippet pattern). */
function createStub(): PostHog {
  const ph: PostHog = {};
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
  return ph;
}

export type ConsentMode = "anonymous" | "identified";

/**
 * Load PostHog. Safe to call multiple times — will no-op if already loaded.
 * Returns true if loaded (or already loaded), false if misconfigured.
 */
export function loadPostHog(mode: ConsentMode): boolean {
  if (typeof window === "undefined") return false;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
  if (!key) return false;

  // Already loaded? Just ensure the mode is correct.
  if (document.getElementById(SCRIPT_ID)) {
    if (mode === "identified") upgradePostHogConsent();
    return true;
  }

  const ph = createStub();
  (window as unknown as Record<string, unknown>).posthog = ph;

  const persistence = mode === "identified" ? "localStorage+cookie" : "memory";

  ph.init(key, {
    api_host: host,
    ui_host: "https://eu.posthog.com",
    person_profiles: "identified_only",
    persistence,
    // Suppress the automatic init-time pageview so we can register the
    // `app: "landing"` super-property BEFORE the first pageview fires.
    // The provider's PageviewTracker captures it manually on mount.
    capture_pageview: false,
    capture_pageleave: mode === "identified",
    cookie_domain: COOKIE_DOMAIN,
    loaded: (posthog: {
      register: (props: Record<string, string>) => void;
    }) => {
      posthog.register({ app: "landing" });
    },
  });

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `${host}/static/array.js`;
  document.head.appendChild(script);
  return true;
}

/**
 * Upgrade an already-loaded anonymous PostHog to identified mode.
 * Called when the user clicks "Accept" on the cookie banner.
 */
export function upgradePostHogConsent(): void {
  const ph = getPostHog();
  if (!ph?.set_config) return;
  ph.set_config({
    persistence: "localStorage+cookie",
    capture_pageleave: true,
  });
  if (ph.opt_in_capturing) ph.opt_in_capturing();
}

/**
 * Opt out of capture entirely. Called when user clicks "Decline".
 * Anonymous memory-only captures already in flight remain in PostHog (they
 * were anonymous anyway) — future events are suppressed.
 */
export function optOutPostHog(): void {
  const ph = getPostHog();
  if (ph?.opt_out_capturing) ph.opt_out_capturing();
}

/** Capture a pageview manually — used by the provider on client-side route changes. */
export function capturePageview(): void {
  const ph = getPostHog();
  if (ph?.capture) ph.capture("$pageview");
}

function getReferringDomain(): string | null {
  if (typeof document === "undefined" || !document.referrer) return null;
  try {
    return new URL(document.referrer).hostname;
  } catch {
    return null;
  }
}

export function getAttributionProperties(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const referrer = typeof document === "undefined" ? null : document.referrer || null;
  const referringDomain = getReferringDomain();
  const utmSource = params.get("utm_source");

  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
    referrer,
    referring_domain: referringDomain,
    acquisition_channel: utmSource || referringDomain || "direct",
    utm_source: utmSource,
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
    gclid: params.get("gclid"),
    fbclid: params.get("fbclid"),
    li_fat_id: params.get("li_fat_id"),
  };
}

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>,
): void {
  const ph = getPostHog();
  if (ph?.capture) ph.capture(event, properties);
}

/** Get a feature flag value synchronously. Returns undefined if PostHog isn't ready. */
export function getFeatureFlag(key: string): string | boolean | undefined {
  const ph = getPostHog();
  if (!ph?.getFeatureFlag) return undefined;
  try {
    return ph.getFeatureFlag(key) as string | boolean | undefined;
  } catch {
    return undefined;
  }
}

/** Register a callback that fires once PostHog has loaded feature flags. */
export function onFeatureFlags(callback: () => void): void {
  const ph = getPostHog();
  if (ph?.onFeatureFlags) ph.onFeatureFlags(callback);
}

/** Return the current PostHog distinct_id, or null if PostHog isn't ready. */
export function getDistinctId(): string | null {
  const ph = getPostHog();
  if (!ph?.get_distinct_id) return null;
  try {
    const id = ph.get_distinct_id() as string | undefined;
    return id ?? null;
  } catch {
    return null;
  }
}
