import type { CSSProperties } from "react";

type CursorGlassVars = CSSProperties & {
  "--agent-cursor-glass-bg-dark": string;
  "--agent-cursor-glass-bg-light": string;
  "--agent-cursor-glass-bg-clear": string;
  "--agent-cursor-glass-stroke-dark": string;
  "--agent-cursor-glass-stroke-light": string;
  "--agent-cursor-glass-stroke-clear": string;
  "--agent-cursor-glass-shadow-dark": string;
  "--agent-cursor-glass-shadow-light": string;
  "--agent-cursor-glass-shadow-clear": string;
  "--agent-cursor-name-bg-dark": string;
  "--agent-cursor-name-bg-light": string;
  "--agent-cursor-name-bg-clear": string;
  "--agent-cursor-name-color-dark": string;
  "--agent-cursor-name-color-light": string;
  "--agent-cursor-name-color-clear": string;
};

interface AgentAuraPalette {
  accent: string;
  light: string;
  deep: string;
  veil: string;
}

function colorToRgb(color: string): { r: number; g: number; b: number } | null {
  const hex = color.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    const expanded =
      hex.length === 3
        ? hex
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : hex;
    return {
      r: Number.parseInt(expanded.slice(0, 2), 16),
      g: Number.parseInt(expanded.slice(2, 4), 16),
      b: Number.parseInt(expanded.slice(4, 6), 16),
    };
  }

  const rgb = color
    .trim()
    .match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (!rgb) return null;
  return {
    r: Math.min(255, Number(rgb[1])),
    g: Math.min(255, Number(rgb[2])),
    b: Math.min(255, Number(rgb[3])),
  };
}

function rgbToCss(rgb: { r: number; g: number; b: number }, alpha = 1): string {
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

function mixChannel(from: number, to: number, amount: number): number {
  return Math.round(from + (to - from) * amount);
}

function mixColor(color: string, target: string, amount: number): string {
  const from = colorToRgb(color);
  const to = colorToRgb(target);
  if (!from || !to) return color;
  return rgbToCss({
    r: mixChannel(from.r, to.r, amount),
    g: mixChannel(from.g, to.g, amount),
    b: mixChannel(from.b, to.b, amount),
  });
}

function colorWithAlpha(color: string, alpha: number): string {
  const rgb = colorToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

function agentAuraPalette(color: string): AgentAuraPalette {
  return {
    accent: color,
    light: mixColor(color, "#FFFFFF", 0.68),
    deep: mixColor(color, "#05070C", 0.42),
    veil: mixColor(color, "#F8FAFC", 0.82),
  };
}

function cursorTextShadow(color: string): string {
  return [
    "0 1px 1px rgba(0,0,0,0.58)",
    `0 0 10px ${colorWithAlpha(color, 0.42)}`,
  ].join(", ");
}

const AURORA_BASE_TOP = "rgba(26,32,41,0.97)";
const AURORA_BASE_BOTTOM = "rgba(16,21,28,0.97)";
const LIGHT_BASE_TOP = "rgba(253,254,255,0.97)";
const LIGHT_BASE_BOTTOM = "rgba(241,245,250,0.97)";
const CLEAR_BASE = "rgba(14,17,24,0.55)";
const CLEAR_SHEEN =
  "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.018) 46%, rgba(0,0,0,0.12))";

/**
 * Aurora surface: emits PAIRED dark/light var sets. The CSS mapping on
 * .denker-agent-cursor-bubble / .denker-agent-cursor-name selects the active
 * set (default dark, html.light flips to light, html.clear flips to clear).
 * All agent overlay surfaces follow the active theme.
 *
 * Dark: opaque dark base with the agent color rising from the bottom edge.
 * Light: frosted-white base with a softer agent color wash.
 * Clear: semi-transparent dark base with white sheen; frosting from CSS fallback filter.
 */
function cursorGlassStyle(color: string): CursorGlassVars {
  const darkBase = `linear-gradient(180deg, ${AURORA_BASE_TOP}, ${AURORA_BASE_BOTTOM})`;
  const lightBase = `linear-gradient(180deg, ${LIGHT_BASE_TOP}, ${LIGHT_BASE_BOTTOM})`;

  return {
    // Dark set (current values verbatim)
    "--agent-cursor-glass-bg-dark": [
      `radial-gradient(150% 130% at 50% 118%, ${colorWithAlpha(color, 0.5)} 0%, ${colorWithAlpha(color, 0.16)} 46%, transparent 70%)`,
      darkBase,
    ].join(", "),
    "--agent-cursor-glass-stroke-dark": "rgba(255,255,255,0.1)",
    "--agent-cursor-glass-shadow-dark": [
      "inset 0 1px 0 rgba(255,255,255,0.1)",
      `inset 0 -1px 0 ${colorWithAlpha(color, 0.4)}`,
      "0 0 0 1px rgba(255,255,255,0.07)",
      "0 8px 24px -10px rgba(0,0,0,0.7)",
      `0 4px 18px -6px ${colorWithAlpha(color, 0.38)}`,
    ].join(", "),
    "--agent-cursor-name-bg-dark": [
      `radial-gradient(140% 150% at 50% 130%, ${colorWithAlpha(color, 0.6)} 0%, ${colorWithAlpha(color, 0.2)} 55%, transparent 78%)`,
      darkBase,
    ].join(", "),
    "--agent-cursor-name-color-dark": mixColor(color, "#FFFFFF", 0.4),

    // Light set (approved frosted-white aurora recipe)
    "--agent-cursor-glass-bg-light": [
      `radial-gradient(150% 130% at 50% 118%, ${colorWithAlpha(color, 0.3)} 0%, ${colorWithAlpha(color, 0.1)} 46%, transparent 70%)`,
      lightBase,
    ].join(", "),
    "--agent-cursor-glass-stroke-light": "rgba(255,255,255,0.85)",
    "--agent-cursor-glass-shadow-light": [
      "inset 0 1px 0 rgba(255,255,255,0.9)",
      `inset 0 -1px 0 ${colorWithAlpha(color, 0.35)}`,
      "0 0 0 1px rgba(20,30,45,0.08)",
      "0 8px 22px -10px rgba(30,40,60,0.35)",
      `0 4px 16px -6px ${colorWithAlpha(color, 0.28)}`,
    ].join(", "),
    "--agent-cursor-name-bg-light": [
      `radial-gradient(140% 150% at 50% 130%, ${colorWithAlpha(color, 0.35)} 0%, ${colorWithAlpha(color, 0.12)} 55%, transparent 78%)`,
      lightBase,
    ].join(", "),
    // mixColor(color, "#0A1018", 0.45) — for #30D158: rgba(31,122,59,1)
    "--agent-cursor-name-color-light": mixColor(color, "#0A1018", 0.45),

    // Clear set (white sheen over semi-transparent dark base; frosting via CSS fallback filter)
    "--agent-cursor-glass-bg-clear": [
      `radial-gradient(150% 130% at 50% 118%, ${colorWithAlpha(color, 0.32)} 0%, ${colorWithAlpha(color, 0.1)} 46%, transparent 70%)`,
      CLEAR_SHEEN,
      CLEAR_BASE,
    ].join(", "),
    "--agent-cursor-glass-stroke-clear": "rgba(255,255,255,0.18)",
    "--agent-cursor-glass-shadow-clear": [
      "inset 0 1px 0 rgba(255,255,255,0.16)",
      `inset 0 -1px 0 ${colorWithAlpha(color, 0.4)}`,
      `0 0 14px ${colorWithAlpha(color, 0.35)}`,
      "0 8px 24px -10px rgba(0,0,0,0.6)",
    ].join(", "),
    "--agent-cursor-name-bg-clear": [
      `radial-gradient(140% 150% at 50% 130%, ${colorWithAlpha(color, 0.4)} 0%, ${colorWithAlpha(color, 0.14)} 55%, transparent 78%)`,
      CLEAR_SHEEN,
      CLEAR_BASE,
    ].join(", "),
    // mixColor(color, "#FFFFFF", 0.4) — same as dark: rgba(131,227,155,1)
    "--agent-cursor-name-color-clear": mixColor(color, "#FFFFFF", 0.4),
  };
}

export { agentAuraPalette, colorWithAlpha, cursorGlassStyle, cursorTextShadow };
