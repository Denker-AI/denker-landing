"use client";

import { useEffect } from "react";

/**
 * Makes every page load / refresh start on the hero at the top, instead of the
 * browser restoring the previous scroll position. Clicking the in-page nav
 * links still scrolls to their sections (that's a user action after load); this
 * only governs the initial position on (re)load.
 */
export function StartAtTop() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Run after the browser's own scroll attempts (restoration / hash jump)
    // so we reliably win and land at the top.
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  return null;
}
