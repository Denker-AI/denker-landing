import type { CSSProperties } from "react";
import { colorWithAlpha } from "@/components/production/cursors/agent-cursor-glass";

type CompactProjectTintStyle = CSSProperties & {
  "--space-switcher-project-color": string;
  "--space-switcher-project-tint": string;
  "--space-switcher-project-tint-strong": string;
  "--space-switcher-project-tint-soft": string;
  "--space-switcher-project-tint-glint": string;
};

type CompactSpeakingFillStyle = CSSProperties & {
  "--space-switcher-speaking-fill": string;
  "--space-switcher-speaking-fill-strong": string;
  "--space-switcher-speaking-fill-soft": string;
};

type CompactSpeakingReflectionStyle = CSSProperties & {
  "--voice-glass-a": string;
  "--voice-glass-b": string;
  "--voice-glass-c": string;
  "--voice-glass-speed"?: string;
  "--voice-glass-travel"?: string;
};

function compactProjectTintStyle(color: string): CompactProjectTintStyle {
  return {
    "--space-switcher-project-color": color,
    "--space-switcher-project-tint": colorWithAlpha(color, 0.2),
    "--space-switcher-project-tint-strong": colorWithAlpha(color, 0.34),
    "--space-switcher-project-tint-soft": colorWithAlpha(color, 0.08),
    "--space-switcher-project-tint-glint": "rgba(255,255,255,0.2)",
    background: [
      "radial-gradient(120% 110% at 50% 112%, var(--space-switcher-project-tint-strong) 0%, var(--space-switcher-project-tint) 46%, transparent 72%)",
      "linear-gradient(145deg, var(--space-switcher-project-tint-glint) 0%, transparent 38%, var(--space-switcher-project-tint-soft) 100%)",
      "linear-gradient(180deg, rgba(255,255,255,0.08), transparent 62%)",
    ].join(", "),
    boxShadow: [
      "inset 0 1px 0 rgba(255,255,255,0.2)",
      `inset 0 -5px 11px ${colorWithAlpha(color, 0.16)}`,
    ].join(", "),
  };
}

function compactSpeakingFillStyle(color: string): CompactSpeakingFillStyle {
  return {
    "--space-switcher-speaking-fill": colorWithAlpha(color, 0.18),
    "--space-switcher-speaking-fill-strong": colorWithAlpha(color, 0.3),
    "--space-switcher-speaking-fill-soft": colorWithAlpha(color, 0.08),
    background: [
      "linear-gradient(108deg, transparent 0%, rgba(56,189,248,0.1) 24%, rgba(255,255,255,0.22) 43%, var(--space-switcher-speaking-fill-strong) 55%, rgba(244,114,182,0.12) 70%, transparent 92%)",
      "radial-gradient(140% 120% at 50% 112%, var(--space-switcher-speaking-fill-strong) 0%, var(--space-switcher-speaking-fill) 46%, transparent 72%)",
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.018) 46%, rgba(0,0,0,0.12))",
    ].join(", "),
    boxShadow: [
      "inset 0 1px 0 rgba(255,255,255,0.24)",
      `inset 0 -7px 14px ${colorWithAlpha(color, 0.14)}`,
    ].join(", "),
  };
}

function compactSpeakingReflectionStyle(
  color: string,
  reducedMotion: boolean,
): CompactSpeakingReflectionStyle {
  return {
    "--voice-glass-a": color,
    "--voice-glass-b": "rgba(56,189,248,0.58)",
    "--voice-glass-c": "rgba(244,114,182,0.62)",
    ...(reducedMotion
      ? {}
      : {
          "--voice-glass-speed": "4.8s",
          "--voice-glass-travel": "18%",
          animation:
            "denker-voice-glass-reflect var(--voice-glass-speed) ease-in-out infinite",
        }),
    opacity: 0.46,
    background:
      "linear-gradient(108deg, transparent 0%, var(--voice-glass-b) 24%, rgba(255,255,255,0.68) 43%, var(--voice-glass-a) 55%, var(--voice-glass-c) 70%, transparent 92%)",
  };
}

export {
  compactProjectTintStyle,
  compactSpeakingFillStyle,
  compactSpeakingReflectionStyle,
};
