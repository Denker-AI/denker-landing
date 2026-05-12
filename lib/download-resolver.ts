/**
 * Shared helpers for OS/device detection and Mac binary resolution.
 * Used by both CtaGateDialog (interactive CTA) and the /download page
 * (auto-resolve on mount for newsletter CTAs).
 */

export type Device = "mac-desktop" | "mobile" | "other-desktop";

/**
 * Detect the user's device category.
 * Must be called client-side only (navigator / document access).
 */
export function detectDevice(): Device {
  if (typeof navigator === "undefined") return "other-desktop";
  const platform = navigator.platform || "";
  const ua = navigator.userAgent || "";

  /* Phone / tablet: iPhone, iPad, iPod, Android, or any UA with "Mobile". */
  const isIOS = /iPhone|iPad|iPod/.test(platform) || /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isTouchMobile = isIOS || isAndroid || /Mobile/.test(ua);
  if (isTouchMobile) return "mobile";

  /* True macOS desktop. iPad-on-iPadOS-13+ with "Request Desktop Site" reports
   * as platform "MacIntel" with no "iPad" in the UA — disambiguate using
   * navigator.maxTouchPoints, which is 0 on real Macs and >1 on touch iPads. */
  const looksLikeMac = /Mac/.test(platform) || /Mac OS X/.test(ua);
  if (looksLikeMac) {
    const touchPoints = typeof navigator !== "undefined" ? navigator.maxTouchPoints ?? 0 : 0;
    if (touchPoints > 1) return "mobile";
    return "mac-desktop";
  }

  return "other-desktop";
}

/**
 * Returning-user detection — reads the `denker_user` cookie set by the auth
 * backend on `.denker.ai`. Present = signed in (or has been recently). Cookie
 * does NOT carry session data — it's a UX-only hint to re-rank our CTAs.
 */
export function detectReturningUser(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)denker_user=1(?:;|$)/.test(document.cookie);
}

/**
 * Pick the release channel for first-time downloads.
 *   - Default: "prod"  → reads updates.denker.ai/latest.json (production .dmg)
 *   - Override via `?channel=preview` in the URL → reads the preview manifest.
 *     Used for internal QA of the preview build before merging to main.
 *
 * Newsletter and public links should use the bare `/download` URL so the
 * audience always lands on the production channel.
 */
export function getChannel(search?: string): "prod" | "preview" {
  const query = search ?? (typeof window !== "undefined" ? window.location.search : "");
  return new URLSearchParams(query).get("channel") === "preview" ? "preview" : "prod";
}

function manifestUrlForChannel(channel: "prod" | "preview"): string {
  return channel === "preview"
    ? "https://updates.denker.ai/preview/latest.json"
    : "https://updates.denker.ai/latest.json";
}

/**
 * Resolve the right Mac binary URL from the Tauri auto-updater manifest.
 * The manifest exposes the `.app.tar.gz` URL (the in-place updater payload);
 * the matching `.dmg` is published at the same path by the release workflow,
 * so we swap the suffix to give first-time installers the proper drag-to-
 * Applications experience.
 *
 * Returns null if the manifest is empty (no public build yet) or unreachable —
 * caller falls back to the sign-up flow.
 */
export async function fetchMacDownloadUrl(): Promise<string | null> {
  try {
    const res = await fetch(manifestUrlForChannel(getChannel()), { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      platforms?: Record<string, { url?: string }>;
      version?: string;
    };
    const platforms = data.platforms ?? {};
    /* Apple Silicon is the modern default; fall back to Intel if only that exists. */
    const updaterUrl =
      platforms["darwin-aarch64"]?.url ?? platforms["darwin-x86_64"]?.url;
    if (!updaterUrl) return null;
    /* Swap auto-updater tarball → installer DMG (same filename root, same dir). */
    return updaterUrl.replace(/\.app\.tar\.gz$/, ".dmg");
  } catch {
    return null;
  }
}

/**
 * Resolve the Mac binary URL and append any UTM params present in the
 * given search string (e.g. window.location.search). Uses URL + searchParams
 * — no string concatenation.
 */
export async function fetchMacDownloadUrlWithUtm(search: string): Promise<string | null> {
  const base = await fetchMacDownloadUrl();
  if (!base) return null;

  const sourceParams = new URLSearchParams(search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const hasUtm = utmKeys.some((k) => sourceParams.has(k));
  if (!hasUtm) return base;

  const url = new URL(base);
  for (const key of utmKeys) {
    const value = sourceParams.get(key);
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

export const SIGNUP_DESKTOP_FALLBACK =
  "https://space.denker.ai/auth/register?intent=desktop";
