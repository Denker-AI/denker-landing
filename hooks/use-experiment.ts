"use client";

import { useEffect, useState } from "react";
import { getFeatureFlag, onFeatureFlags } from "@/lib/posthog";

function getUrlVariant(flagKey: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(flagKey);
}

export function useExperiment(flagKey: string): string {
  const [variant, setVariant] = useState<string>("control");

  useEffect(() => {
    const urlVariant = getUrlVariant(flagKey);
    if (urlVariant) {
      setVariant(urlVariant);
      return;
    }
    onFeatureFlags(() => {
      const value = getFeatureFlag(flagKey);
      if (typeof value === "string") setVariant(value);
    });
  }, [flagKey]);

  return variant;
}
