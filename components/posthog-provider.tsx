"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { loadPostHog, capturePageview, getDistinctId } from "@/lib/posthog";

const APP_ORIGIN = "space.denker.ai";
const PH_PARAM = "ph";

const COOKIE_KEY = "denker-cookie-consent";

function getConsent(): "accepted" | "declined" | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(COOKIE_KEY) as "accepted" | "declined" | null;
  } catch {
    return null;
  }
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    // Auto-capture is disabled in init so we can register `app: "landing"`
    // before the first pageview. Capture every pageview manually — initial
    // mount and subsequent client-side route changes.
    capturePageview();
  }, [pathname, searchParams]);

  return null;
}

/**
 * Loads PostHog on mount. Always captures anonymous pageviews — users who
 * previously accepted cookies get upgraded to identified mode. GDPR-safe:
 * no cookies are written until the user clicks Accept.
 */
export function PostHogProvider() {
  useEffect(() => {
    const consent = getConsent();
    // Respect prior "declined" — don't load PostHog for those users.
    // Null (never interacted) and "accepted" both get tracking.
    if (consent === "declined") return;
    loadPostHog(consent === "accepted" ? "identified" : "anonymous");
  }, []);

  // Stitch the anonymous landing session to the app session by appending
  // ?ph=<distinct_id> to outbound links pointing at space.denker.ai. Runs on
  // mousedown so normal, middle-, and cmd-clicks all see the rewritten href.
  useEffect(() => {
    function rewriteAppLinks(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.hostname !== APP_ORIGIN) return;
      if (url.searchParams.has(PH_PARAM)) return;
      const id = getDistinctId();
      if (!id) return;
      url.searchParams.set(PH_PARAM, id);
      anchor.href = url.toString();
    }
    document.addEventListener("mousedown", rewriteAppLinks, { capture: true });
    return () => document.removeEventListener("mousedown", rewriteAppLinks, { capture: true });
  }, []);

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
