/**
 * DiceBear agent avatar style registry.
 *
 * Maps style keys to their DiceBear style objects, provides SVG generation,
 * and extracts dominant fill colors from generated SVGs.
 */

import { createAvatar } from "@dicebear/core";
import * as glass from "@dicebear/glass";
import * as icons from "@dicebear/icons";

export type AgentAvatarStyleKey = "glass" | "icons";

const STYLE_MAP: Record<AgentAvatarStyleKey, object> = {
  glass: glass,
  icons: icons,
};

// Order matters — the style picker UI lists these top-to-bottom and
// `AGENT_AVATAR_STYLES[0]` is treated as the default. Glass is first
// because it's the default for all users (backend default + every
// frontend `??` fallback resolves to "glass").
export const AGENT_AVATAR_STYLES: {
  key: AgentAvatarStyleKey;
  label: string;
  description: string;
}[] = [
  { key: "glass", label: "Glass", description: "Geometric shapes" },
  { key: "icons", label: "Icons", description: "Bootstrap icons" },
];

/** Preview seeds — deterministic, visually diverse. */
export const STYLE_PREVIEW_SEEDS = ["preview-alpha", "preview-beta", "preview-gamma"];

/**
 * Generate an SVG data URI for an agent avatar.
 */
export function generateAgentAvatar(
  styleKey: AgentAvatarStyleKey,
  seed: string,
): string {
  const style = STYLE_MAP[styleKey];
  if (!style) return "";
  const avatar = createAvatar(style as Parameters<typeof createAvatar>[0], { seed });
  return avatar.toDataUri();
}

/**
 * Generate raw SVG string for an agent avatar (used for color extraction).
 */
export function generateAgentAvatarSvg(
  styleKey: AgentAvatarStyleKey,
  seed: string,
): string {
  const style = STYLE_MAP[styleKey];
  if (!style) return "";
  const avatar = createAvatar(style as Parameters<typeof createAvatar>[0], { seed });
  return avatar.toString();
}

/** Colors to ignore when extracting the dominant fill. */
const IGNORED_COLORS = new Set([
  "#ffffff", "#FFFFFF", "#000000", "#fff", "#FFF", "#000",
]);

/**
 * Extract the most frequently occurring fill color from an SVG string,
 * ignoring black/white. Falls back to #30D158 (accent green).
 */
export function extractDominantColor(svgString: string): string {
  const fills = [...svgString.matchAll(/fill="(#[0-9a-fA-F]{3,6})"/g)]
    .map((m) => m[1]!)
    .filter((c) => !IGNORED_COLORS.has(c));

  if (fills.length === 0) return "#30D158";

  const counts = new Map<string, number>();
  for (const f of fills) {
    counts.set(f, (counts.get(f) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]![0];
}

/**
 * Generate random seeds for avatar picker grid.
 */
export function generateSeeds(count: number): string[] {
  return Array.from({ length: count }, () =>
    Math.random().toString(36).substring(2, 10),
  );
}

/**
 * Generate random seeds that produce visually unique avatars.
 * Generates extra candidates and deduplicates by SVG content.
 */
export function generateUniqueSeeds(
  count: number,
  styleKey?: AgentAvatarStyleKey,
): string[] {
  if (!styleKey) {
    // No dedup needed without a style to compare
    return Array.from({ length: count }, () =>
      Math.random().toString(36).substring(2, 10),
    );
  }

  const seenSvgs = new Set<string>();
  const result: string[] = [];
  let attempts = 0;
  const maxAttempts = count * 5;

  while (result.length < count && attempts < maxAttempts) {
    const seed = Math.random().toString(36).substring(2, 10);
    const svg = generateAgentAvatarSvg(styleKey, seed);
    if (!seenSvgs.has(svg)) {
      seenSvgs.add(svg);
      result.push(seed);
    }
    attempts++;
  }

  // Fill remaining with random seeds if we couldn't find enough unique ones
  while (result.length < count) {
    result.push(Math.random().toString(36).substring(2, 14));
  }

  return result;
}
