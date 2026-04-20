"use client";

import { useEffect } from "react";
import { loadLinkedIn } from "@/lib/linkedin";
import { getConsent } from "@/lib/consent";

/**
 * Loads the LinkedIn Insight Tag on mount if the user has previously
 * accepted cookies. For new visitors, CookieConsent triggers loadLinkedIn()
 * when they click Accept.
 */
export function LinkedInProvider() {
  useEffect(() => {
    if (getConsent() === "accepted") loadLinkedIn();
  }, []);

  return null;
}
