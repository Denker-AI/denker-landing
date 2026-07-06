"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Icons } from "@/components/production/ui/icons";
import { surfaceRoleAttributes } from "@/components/production/ui/surface-contract";
import { cn } from "@/lib/cn";
import { cursorTextShadow } from "./agent-cursor-glass";
import { ensureVoiceGlassKeyframes } from "./voice-glass-keyframes";

export type VoiceListeningStatus = "listening" | "processing" | "error";
export type VoiceHandoffState =
  | "listening"
  | "speaking"
  | "sending"
  | "queued"
  | "error";

function clampVoiceLevel(value: number) {
  return Math.max(0, Math.min(1, value));
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function modeVars(status: VoiceListeningStatus, color: string) {
  if (status === "processing") {
    return {
      "--voice-glass-a": "rgba(48,209,88,0.88)",
      "--voice-glass-b": "rgba(120,255,174,0.62)",
      "--voice-glass-c": "rgba(22,163,74,0.5)",
      "--voice-glass-icon": "var(--color-readable-overlay-secondary)",
      "--voice-glass-speed": "2.7s",
    };
  }

  if (status === "error") {
    return {
      "--voice-glass-a": "rgba(248,113,113,0.9)",
      "--voice-glass-b": "rgba(251,146,60,0.54)",
      "--voice-glass-c": "rgba(244,63,94,0.62)",
      "--voice-glass-icon": "var(--color-readable-overlay-secondary)",
      "--voice-glass-speed": "3.1s",
    };
  }

  return {
    "--voice-glass-a": color,
    "--voice-glass-b": "rgba(56,189,248,0.58)",
    "--voice-glass-c": "rgba(244,114,182,0.62)",
    "--voice-glass-icon": "var(--color-readable-overlay-secondary)",
    "--voice-glass-speed": "4.8s",
  };
}

function capsuleWidth({
  camera,
  isHandoff,
  isLarge,
  showAgentName,
}: {
  camera: boolean;
  isHandoff: boolean;
  isLarge: boolean;
  showAgentName: boolean;
}) {
  if (isHandoff) {
    if (camera) return isLarge ? "190px" : "132px";
    return isLarge ? "150px" : "108px";
  }
  if (showAgentName) {
    if (camera) return isLarge ? "232px" : "140px";
    return isLarge ? "172px" : "104px";
  }
  if (camera) return isLarge ? "176px" : "84px";
  return isLarge ? "112px" : "44px";
}

type VoiceListeningGlassProps = {
  color: string;
  volume?: number;
  status?: VoiceListeningStatus;
  camera?: boolean;
  agentName?: string;
  showAgentName?: boolean;
  handoffState?: VoiceHandoffState;
  handoffCount?: number;
  className?: string;
  size?: "compact" | "large";
  surface?: "dark" | "light";
  testId?: string;
};

export function VoiceListeningGlass({
  color,
  volume = 0,
  status = "listening",
  camera = false,
  agentName = "Denker",
  showAgentName = false,
  handoffState,
  handoffCount = 0,
  className,
  size = "compact",
  surface = "dark",
  testId = "voice-glass",
}: VoiceListeningGlassProps) {
  useEffect(() => {
    ensureVoiceGlassKeyframes();
  }, []);

  const level = clampVoiceLevel(volume);
  const isLarge = size === "large";
  const isLight = surface === "light";
  const isHandoff = Boolean(handoffState);
  const reducedMotion = usePrefersReducedMotion();
  const width = capsuleWidth({ camera, isHandoff, isLarge, showAgentName });
  const height = isLarge ? "96px" : "34px";
  const reflectionIntensity = (
    status === "listening" ? 0.38 + level * 0.48 : 0.78
  ).toFixed(2);
  const voiceActive = status !== "listening" || level > 0.01;
  const motionSpeed =
    status === "listening" ? (6.6 - level * 4.2).toFixed(2) : undefined;
  const motionTravel = `${Math.round(12 + level * 18)}%`;
  const agentTextShadow = cursorTextShadow(color);
  const modeStyle = modeVars(status, color);

  return (
    <div
      data-testid={testId}
      data-agent-name={agentName}
      data-agent-color={color}
      data-status={status}
      data-camera={camera ? "true" : undefined}
      data-handoff={isHandoff ? "true" : undefined}
      data-handoff-state={handoffState}
      data-surface={surface}
      data-motion={voiceActive ? "active" : "idle"}
      aria-hidden="true"
      {...surfaceRoleAttributes("rail", {
        nativeLevel: "island",
        nativeGroup: "voice-indicator",
      })}
      className={cn(
        "relative isolate flex items-center justify-center overflow-hidden bg-transparent shadow-none transition-[width,border-radius,filter] duration-200 ease-out motion-reduce:transition-none",
        isLight
          ? "text-[rgba(17,24,39,0.92)]"
          : "text-[var(--color-readable-overlay-primary)]",
        className,
      )}
      style={
        {
          width,
          height,
          borderRadius: isLarge ? "34px" : "17px",
          "--voice-glass-volume": reflectionIntensity,
          ...modeStyle,
          "--voice-glass-speed": motionSpeed
            ? `${motionSpeed}s`
            : modeStyle["--voice-glass-speed"],
          "--voice-glass-travel": motionTravel,
        } as CSSProperties
      }
    >
      <span
        data-testid="voice-glass-reflection"
        className="pointer-events-none absolute -inset-x-12 -inset-y-8"
        style={{
          opacity: "var(--voice-glass-volume)",
          background:
            "linear-gradient(108deg, transparent 0%, var(--voice-glass-b) 24%, rgba(255,255,255,0.68) 43%, var(--voice-glass-a) 55%, var(--voice-glass-c) 70%, transparent 92%)",
          animation:
            "denker-voice-glass-reflect var(--voice-glass-speed) ease-in-out infinite",
        }}
      />
      <div
        className={cn(
          "relative z-10 flex items-center justify-center",
          isHandoff
            ? "w-full"
            : showAgentName
              ? "w-full px-3"
              : camera
                ? "gap-2.5"
                : "gap-0",
        )}
      >
        {isHandoff ? (
          <div
            data-testid="voice-handoff-layout"
            className="flex w-full items-center px-3"
            style={
              reducedMotion
                ? undefined
                : {
                    animation:
                      "denker-voice-handoff-layout-in 240ms cubic-bezier(.2,.8,.2,1)",
                  }
            }
          >
            <span
              data-testid="voice-control-group"
              className={cn(
                "flex shrink-0 items-center",
                isLarge ? "gap-3" : "gap-1",
              )}
              style={
                reducedMotion
                  ? undefined
                  : {
                      animation:
                        "denker-voice-handoff-controls-in 240ms cubic-bezier(.2,.8,.2,1)",
                    }
              }
            >
              <IconSlot size={isLarge ? "large" : "compact"}>
                <GlassIcon
                  icon="mic"
                  size={isLarge ? "large" : "compact"}
                  status={status}
                />
              </IconSlot>
              {camera && (
                <IconSlot size={isLarge ? "large" : "compact"}>
                  <GlassIcon
                    icon="camera"
                    size={isLarge ? "large" : "compact"}
                    status={status}
                  />
                </IconSlot>
              )}
            </span>
            <span
              data-testid="voice-handoff-state"
              className={cn(
                "min-w-0 flex-1 pl-2 text-right font-semibold leading-none",
                isLarge ? "text-lg" : "text-[11px]",
              )}
              style={{
                textShadow: isLight ? undefined : agentTextShadow,
                ...(reducedMotion
                  ? {}
                  : {
                      animation:
                        "denker-voice-handoff-state-in 260ms cubic-bezier(.2,.8,.2,1) 40ms both",
                    }),
              }}
            >
              <HandoffStateGlyph
                state={handoffState ?? "listening"}
                count={handoffCount}
                level={level}
                isLarge={isLarge}
              />
            </span>
          </div>
        ) : showAgentName ? (
          <>
            <span
              data-testid="voice-agent-name"
              className={cn(
                "min-w-0 flex-1 truncate pr-2 text-left font-semibold leading-none",
                isLarge ? "text-lg" : "text-appkit-caption",
              )}
              style={{ textShadow: isLight ? undefined : agentTextShadow }}
            >
              {agentName}
            </span>
            <span
              data-testid="voice-control-group"
              className={cn(
                "flex shrink-0 items-center",
                isLarge ? "gap-3" : "gap-1.5",
              )}
            >
              <IconSlot size={isLarge ? "large" : "compact"}>
                <GlassIcon
                  icon="mic"
                  size={isLarge ? "large" : "compact"}
                  status={status}
                />
              </IconSlot>
              {camera && (
                <IconSlot size={isLarge ? "large" : "compact"}>
                  <GlassIcon
                    icon="camera"
                    size={isLarge ? "large" : "compact"}
                    status={status}
                  />
                </IconSlot>
              )}
            </span>
          </>
        ) : (
          <>
            <GlassIcon
              icon="mic"
              size={isLarge ? "large" : "compact"}
              status={status}
            />
            {camera && (
              <>
                <span
                  className={cn(
                    "h-5 w-px bg-white/16",
                    isLight && "bg-black/10",
                    isLarge && "h-9",
                  )}
                />
                <GlassIcon
                  icon="camera"
                  size={isLarge ? "large" : "compact"}
                  status={status}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function HandoffStateGlyph({
  state,
  count,
  level,
  isLarge,
}: {
  state: VoiceHandoffState;
  count: number;
  level: number;
  isLarge: boolean;
}) {
  if (state === "sending") {
    return (
      <span
        data-testid="voice-handoff-send"
        className="inline-flex items-center justify-end"
      >
        <Icons.ArrowUp
          className={cn(isLarge ? "h-5 w-5" : "h-3.5 w-3.5")}
          strokeWidth={3.5}
        />
      </span>
    );
  }

  if (state === "speaking") {
    return (
      <span
        data-testid="voice-handoff-speaking"
        className="inline-flex items-center justify-end"
      >
        <Icons.MessageCircle
          className={cn(isLarge ? "h-5 w-5" : "h-3.5 w-3.5")}
          strokeWidth={3.5}
        />
      </span>
    );
  }

  if (state === "queued") {
    return (
      <span
        data-testid="voice-handoff-queue"
        className="inline-flex min-w-6 justify-end tabular-nums"
      >
        Q{Math.max(1, count)}
      </span>
    );
  }

  if (state === "error") {
    return (
      <span
        data-testid="voice-handoff-error"
        className="inline-flex items-center justify-end"
      >
        <Icons.AlertTriangle
          className={cn(isLarge ? "h-5 w-5" : "h-3.5 w-3.5")}
          strokeWidth={2.3}
        />
      </span>
    );
  }

  const minHeights = isLarge ? [9, 11, 10] : [6, 7, 6];
  const liftHeights = isLarge ? [14, 17, 15] : [8, 11, 9];
  const heights = minHeights.map((height, index) =>
    Math.round(height + (liftHeights[index] ?? 0) * level),
  );

  return (
    <span
      data-testid="voice-handoff-listening-bars"
      className={cn(
        "inline-flex items-center justify-end",
        isLarge ? "gap-1.5" : "gap-1",
      )}
    >
      {heights.map((height, index) => (
        <span
          key={index}
          className={cn(
            "inline-block self-center rounded-full bg-current opacity-90",
            isLarge ? "w-[3px]" : "w-[2px]",
          )}
          style={{ height }}
        />
      ))}
    </span>
  );
}

function IconSlot({
  children,
  size,
}: {
  children: ReactNode;
  size: "compact" | "large";
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center",
        size === "large" ? "h-12 w-12" : "h-6 w-6",
      )}
    >
      {children}
    </span>
  );
}

function GlassIcon({
  icon,
  size,
  status,
}: {
  icon: "mic" | "camera";
  size: "compact" | "large";
  status: VoiceListeningStatus;
}) {
  const Icon = icon === "mic" ? Icons.Mic : Icons.Camera;
  const large = size === "large";

  return (
    <Icon
      data-testid={icon === "mic" ? "voice-mic-icon" : "voice-camera-icon"}
      className={cn(
        "drop-shadow-[0_1px_1px_rgba(0,0,0,0.34)]",
        status === "error" ? "text-red-100/85" : "text-secondary",
        large ? "h-10 w-10" : "h-5 w-5",
      )}
      style={{
        color: "var(--voice-glass-icon)",
      }}
    />
  );
}
