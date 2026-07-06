import { useId } from "react";
import { cn } from "@/lib/cn";
import { agentAuraPalette, colorWithAlpha } from "./agent-cursor-glass";

interface AgentCursorArrowProps {
  color: string;
  className?: string;
  width?: number;
  height?: number;
  liquidLevel?: number;
  mode?: "filled" | "glass";
  position?: "absolute" | "relative";
  shape?: "pointer" | "soft";
  flamePalette?: "colorful" | "mono";
  tipTestId?: string;
}

function gradientId(rawId: string, suffix: string): string {
  return `${rawId.replace(/:/g, "")}-${suffix}`;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function AgentCursorArrow({
  color,
  className,
  width = 17,
  height = 22,
  liquidLevel = 0,
  mode = "filled",
  position = "absolute",
  shape = "pointer",
  flamePalette = "colorful",
  tipTestId,
}: AgentCursorArrowProps) {
  const id = useId();
  const bodyId = gradientId(id, "body");
  const glowId = gradientId(id, "glow");
  const strokeId = gradientId(id, "stroke");
  const rimId = gradientId(id, "rim");
  const bloomId = gradientId(id, "bloom");
  const auroraId = gradientId(id, "aurora");
  const warmPoolId = gradientId(id, "warm-pool");
  const coolPoolId = gradientId(id, "cool-pool");
  const fluidBlurId = gradientId(id, "fluid-blur");
  const clipId = gradientId(id, "clip");
  const level = clamp01(liquidLevel);
  const hasAurora = level > 0;
  const isGlass = mode === "glass";
  const aura = agentAuraPalette(color);
  const isColorfulFlame = flamePalette === "colorful";
  const warmColor = isColorfulFlame ? aura.light : color;
  const coolColor = isColorfulFlame ? aura.deep : color;
  const auroraGlow = 0.35 + level * 0.3;
  const pointerPath =
    shape === "soft"
      ? "M1.91 0.06Q3.08 0.11 3.56 0.4Q4.04 0.69 10.15 6.13Q16.26 11.57 16.52 11.92Q16.79 12.26 16.89 12.58Q17 12.89 17 13.32Q17 13.75 16.87 14.12Q16.73 14.49 16.5 14.78Q16.26 15.07 15.99 15.24Q15.73 15.41 15.54 15.47Q15.35 15.53 12.8 15.53Q10.25 15.53 9.8 15.61Q9.35 15.7 8.87 15.93Q8.39 16.16 7.84 16.67Q7.28 17.19 5.87 19.22Q4.46 21.26 4.25 21.46Q4.04 21.66 3.64 21.83Q3.24 22 2.87 22Q2.5 22 2.1 21.83Q1.7 21.66 1.38 21.28Q1.06 20.91 0.93 20.48Q0.8 20.05 0.42 11.09Q0.05 2.12 0.29 1.55Q0.53 0.97 0.88 0.66Q1.22 0.34 1.57 0.2Z"
      : "M1.66 1.42C1.18 1.1 0.66 1.6 0.88 2.16L5.08 18.68C5.38 19.82 6.82 19.86 7.18 18.74L8.58 14.36C8.76 13.86 9.24 13.58 9.74 13.72L14.04 14.88C15.1 15.16 15.82 13.88 14.98 13.08L1.66 1.42Z";
  const innerPath =
    shape === "soft"
      ? "M3.3 2.9L13.7 12.6L10.8 12.65C9.42 12.72 8.1 13.4 7.26 14.5L4.1 18.72L3.3 2.9Z"
      : "M2.98 3.92L11.36 11.36L8.88 10.92C7.58 10.68 6.3 11.44 5.84 12.72L5.32 14.18L2.98 3.92Z";

  return (
    <svg
      className={cn(
        position === "absolute"
          ? "absolute left-0 top-0 overflow-visible"
          : "relative block overflow-visible",
        className,
      )}
      width={width}
      height={height}
      viewBox="0 0 17 22"
      fill="none"
      data-liquid-level={level.toFixed(2)}
      data-cursor-mode={mode}
      style={{
        opacity: "var(--agent-cursor-opacity, 1)",
        filter: isGlass
          ? `drop-shadow(0 0 5px ${colorWithAlpha(color, auroraGlow)}) var(--agent-cursor-arrow-drop, drop-shadow(0 2px 3px rgba(0,0,0,0.55)))`
          : "drop-shadow(0 7px 12px rgba(0,0,0,0.26)) drop-shadow(0 0 2px rgba(255,255,255,0.28))",
        transform: "scale(var(--agent-cursor-scale, 1))",
        transformOrigin: "top left",
      }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={pointerPath} />
        </clipPath>
        <linearGradient id={bodyId} x1="1.5" y1="1.2" x2="15.5" y2="20">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.96} />
          <stop
            offset="0.3"
            stopColor={color}
            stopOpacity={0.88 - level * 0.14}
          />
          <stop
            offset="0.58"
            stopColor={color}
            stopOpacity={0.62 - level * 0.18}
          />
          <stop offset="0.82" stopColor="#FFFFFF" stopOpacity={0.3} />
          <stop
            offset="1"
            stopColor={color}
            stopOpacity={0.36 - level * 0.1}
          />
        </linearGradient>
        <radialGradient
          id={glowId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(8.5 8 -7 7.4 4.4 3.6)"
        >
          <stop offset="0" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="0.44" stopColor={color} stopOpacity="0.5" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={bloomId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(10.5 5.8 -4.8 8 8 10.2)"
        >
          <stop offset="0" stopColor={color} stopOpacity="0.72" />
          <stop offset="0.56" stopColor={color} stopOpacity="0.26" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <filter id={fluidBlurId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient
          id={auroraId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(12.2 -1.8 2.4 13.2 8.4 10.5)"
        >
          <stop
            offset="0"
            stopColor={warmColor}
            stopOpacity={0.2 + level * 0.28}
          />
          <stop
            offset="0.34"
            stopColor={coolColor}
            stopOpacity={0.18 + level * 0.26}
          />
          <stop
            offset="0.66"
            stopColor={color}
            stopOpacity={0.1 + level * 0.12}
          />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={level * 0.16} />
        </radialGradient>
        <radialGradient
          id={warmPoolId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(5.8 1.8 -2.2 7.2 4.8 6)"
        >
          <stop
            offset="0"
            stopColor={warmColor}
            stopOpacity={0.18 + level * 0.28}
          />
          <stop
            offset="0.58"
            stopColor={warmColor}
            stopOpacity={0.1 + level * 0.14}
          />
          <stop offset="1" stopColor={warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={coolPoolId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(6.2 2.2 -2.6 7.4 10.2 12.2)"
        >
          <stop
            offset="0"
            stopColor={coolColor}
            stopOpacity={0.18 + level * 0.28}
          />
          <stop
            offset="0.58"
            stopColor={coolColor}
            stopOpacity={0.1 + level * 0.14}
          />
          <stop offset="1" stopColor={coolColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={strokeId} x1="0.8" y1="1" x2="16" y2="20">
          <stop offset="0" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="0.44" stopColor={color} stopOpacity="0.78" />
          <stop offset="1" stopColor="rgba(255,255,255,0.36)" />
        </linearGradient>
        <linearGradient id={rimId} x1="2" y1="2.5" x2="11.5" y2="16">
          <stop offset="0" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="0.48" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>
      </defs>
      <path
        data-testid={tipTestId}
        data-agent-cursor-aurora-body={isGlass ? "true" : undefined}
        d={pointerPath}
        fill={isGlass ? undefined : `url(#${bodyId})`}
        style={isGlass ? { fill: "var(--agent-cursor-arrow-body, rgba(20,26,34,0.96))" } : undefined}
        stroke={isGlass ? colorWithAlpha(color, 0.95) : `url(#${strokeId})`}
        strokeWidth={isGlass ? "1.1" : "1.25"}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {!isGlass && (
        <>
          <path d={pointerPath} fill={`url(#${glowId})`} opacity="0.88" />
          <path d={pointerPath} fill={`url(#${bloomId})`} opacity="0.9" />
        </>
      )}
      {isGlass && (
        <path d={innerPath} fill={colorWithAlpha(aura.light, 0.35)} />
      )}
      {!isGlass && hasAurora && (
        <g
          data-agent-cursor-liquid-layer="aurora"
          style={{ opacity: "var(--agent-cursor-liquid-intensity, 1)" }}
        >
          <path
            d={pointerPath}
            fill={`url(#${auroraId})`}
            opacity={0.56 + level * 0.28}
          />
          <g clipPath={`url(#${clipId})`} filter={`url(#${fluidBlurId})`}>
            <ellipse
              cx="8.6"
              cy="11.2"
              rx="7.4"
              ry="9.6"
              fill={color}
              opacity={0}
            />
            <ellipse
              cx="4.6"
              cy="7"
              rx="5.2"
              ry="7.8"
              fill={`url(#${warmPoolId})`}
              opacity={0.28 + level * 0.32}
            />
            <ellipse
              cx="11.2"
              cy="11"
              rx="5.6"
              ry="8"
              fill={`url(#${coolPoolId})`}
              opacity={0.28 + level * 0.32}
            />
          </g>
        </g>
      )}
      {!isGlass && (
        <>
          <path
            d={innerPath}
            fill="none"
            stroke={`url(#${rimId})`}
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.82"
          />
          <path
            d="M3.2 3.45C5.35 5.1 7.65 7.12 10.15 9.2"
            stroke="rgba(255,255,255,0.84)"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="1"
          />
          <path
            d={
              shape === "soft"
                ? "M4.3 18.25C5.34 16.78 6.38 15.34 7.42 13.9"
                : "M5.15 14.25C5.85 12.75 6.45 11.35 7.08 10.02"
            }
            stroke={color}
            strokeOpacity={0.86 + level * 0.12}
            strokeWidth="0.95"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
