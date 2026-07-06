"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import { HeroMacBook } from "@/components/Hero/HeroMacBook";
import { HeroMacBookFront } from "@/components/Hero/HeroMacBookFront";
import { Icons } from "@/components/production/ui/icons";
import {
  surfaceRoleAttributes,
  surfaceRoleClassName,
} from "@/components/production/ui/surface-contract";
import { AgentCursorArrow } from "@/components/production/cursors/agent-cursor-arrow";
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";
import { VoiceListeningGlass } from "@/components/production/cursors/voice-listening-glass";
import { FrameFooter } from "@/components/production/shapes/shared/frame-footer";
import { FrameHeader } from "@/components/production/shapes/shared/frame-header";
import { cn } from "@/lib/cn";

const agentRows: readonly {
  name: string;
  model: string;
  avatar: string;
  active?: boolean;
}[] = [
  {
    name: "Denker",
    model: "GPT 5.5",
    avatar: "linear-gradient(135deg, #e2e1ff 0%, #7c7cff 48%, #5648f7 100%)",
    active: true,
  },
  {
    name: "Analyst",
    model: "Claude Opus 4.8",
    avatar: "radial-gradient(circle at 32% 24%, #fff5cf 0%, #ffc95e 45%, #c78232 100%)",
  },
  {
    name: "Assistant",
    model: "Minimax M3",
    avatar: "radial-gradient(circle at 30% 24%, #ffffd6 0%, #fbff48 52%, #c8b92d 100%)",
  },
  {
    name: "Coder",
    model: "Claude Fable 5",
    avatar: "radial-gradient(circle at 30% 25%, #fff9b8 0%, #ecf552 48%, #9fc82e 100%)",
  },
  {
    name: "Designer",
    model: "Claude Sonnet 5",
    avatar: "radial-gradient(circle at 30% 22%, #6cff8e 0%, #37ef72 46%, #96ffd1 100%)",
  },
  {
    name: "HR",
    model: "GPT 5.4 Mini",
    avatar: "radial-gradient(circle at 28% 24%, #ffe1d2 0%, #ff7159 50%, #e94452 100%)",
  },
  {
    name: "Marketer",
    model: "Claude Haiku 5",
    avatar: "radial-gradient(circle at 30% 22%, #e1fbff 0%, #65dcff 50%, #2f8ee6 100%)",
  },
  {
    name: "Researcher",
    model: "Claude Opus 4.8",
    avatar: "radial-gradient(circle at 30% 24%, #ffc4ff 0%, #cf5df3 54%, #8048da 100%)",
  },
  {
    name: "Sales",
    model: "GPT 5.2",
    avatar: "radial-gradient(circle at 30% 24%, #eef7ff 0%, #90beff 54%, #557fe5 100%)",
  },
  {
    name: "Writer",
    model: "Minimax M3",
    avatar: "radial-gradient(circle at 30% 24%, #e8ffff 0%, #75e9f0 52%, #2cb8cf 100%)",
  },
] as const;

const bookTakeaways: readonly {
  title: string;
  eyebrow: string;
  takeaway: string;
  coverSrc: string;
}[] = [
  {
    title: "Getting Things Done",
    eyebrow: "Capture system",
    takeaway:
      "Move every open loop out of your head and into a trusted system, so attention can return to the work instead of remembering the work.",
    coverSrc: "/images/hero/getting-things-done-cover-real.jpg",
  },
  {
    title: "Deep Work",
    eyebrow: "Focus architecture",
    takeaway:
      "Treat concentration as a scheduled resource. Protect the session first, then decide what work deserves it.",
    coverSrc: "/images/hero/deep-work-cover-real.jpg",
  },
  {
    title: "Atomic Habits",
    eyebrow: "System design",
    takeaway:
      "Make the better action easier to start. Small environmental changes compound when the system removes friction before motivation is needed.",
    coverSrc: "/images/hero/atomic-habits-cover-real.jpg",
  },
] as const;

const DENKER_SYMBOL_PATH =
  "M274.645,533.768C280.365,528.034 282.076,519.409 278.98,511.916C275.884,504.424 268.592,499.538 260.503,499.538L150,499.538L150,469.462L300,469.462C316.569,469.462 330,455.996 330,439.385L330,289L360,289L360,399.786C360,407.896 364.873,415.207 372.346,418.311C379.82,421.414 388.422,419.699 394.142,413.964C427.176,380.846 472.279,335.627 472.279,335.627L493.492,356.894C493.492,356.894 448.389,402.114 415.355,435.232C409.635,440.966 407.924,449.591 411.02,457.084C414.116,464.576 421.408,469.462 429.497,469.462L540,469.462L540,499.538L390,499.538C373.431,499.538 360,513.004 360,529.615L360,680L330,680L330,569.214C330,561.104 325.127,553.793 317.654,550.689C310.18,547.586 301.578,549.301 295.858,555.036C262.824,588.154 217.721,633.373 217.721,633.373L196.508,612.106C196.508,612.106 241.611,566.886 274.645,533.768Z";

const DENKER_GREEN = "#30D158";
const HERO_INTRO_SEQUENCE_MS = 18_000;
const HERO_SEQUENCE_MS = 23_000;

/**
 * User-approved final flat-lay slots (Phase 1 gate, 2026-07-06), stated for
 * the canonical 1181-1599px breakpoint of `.hero-production-final-layout`
 * (stage width 1320). Proportions follow Apple's visionOS finale measured
 * against the MacBook width (phone 21%, book/iPad 72%); voice plays the
 * Watch (bottom-left under the book), cursor bubble plays the Vision Pro
 * (bottom-right). Other breakpoints scale these in globals.css - keep the
 * `.hero-production-final-*` media blocks in sync.
 */
/**
 * User-approved solo-beat rest states (Phase 1 gate, 2026-07-06), validated
 * side-by-side against Apple's visionOS hero beats. Each beat is centered at
 * the same optical center (x = 50%) like Apple; `widthPct` is the component's
 * visible width as a share of the stage width. These are the sizes/positions
 * the Phase 2 timeline holds each component at during its solo beat, before
 * the finale assembles everything into FINAL_SLOTS. Order = playback order.
 */
export const SOLO_BEATS = {
  logo: { widthPct: 18, centerXPct: 50, centerYPct: 55, appleRef: "Siri glow 30% @54.5%" },
  teamFrame: { widthPct: 21, centerXPct: 50, centerYPct: 69, appleRef: "iPhone 21% @68.7%" },
  voice: { widthPct: 19, centerXPct: 50, centerYPct: 55, appleRef: "Vision Pro 29% @56.2%" },
  cursorBubble: { widthPct: 11, centerXPct: 50, centerYPct: 58, appleRef: "Watch 9.7% @57.9%" },
  macbookFront: { widthPct: 37, centerXPct: 50, centerYPct: 68, appleRef: "MacBook 36% @67.7%" },
  bookFrame: { widthPct: 25.5, centerXPct: 50, centerYPct: 59, appleRef: "iPad 23.5% @59.3%" },
} as const;

export const FINAL_SLOTS = {
  macbookTopDown: { top: -28, left: 8, width: 720, scale: 0.76 },
  teamFrame: { top: 120, left: 626, width: 312, height: 590, scale: 0.396 },
  bookFrame: { top: -20, left: 898, width: 760, height: 530, scale: 0.518 },
  voice: { top: 288, left: 876, scale: 1.1 },
  cursorBubble: { top: 282, left: 1087, scale: 1.2 },
} as const;
export type HeroPlayback = "playing" | "stopped" | "ended";

export function HereMedia({
  onPlaybackChange,
}: {
  onPlaybackChange?: (playback: HeroPlayback) => void;
}) {
  const cinemaRef = useRef<HTMLDivElement>(null);
  const [playback, setPlayback] = useState<HeroPlayback>("playing");
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [runId, setRunId] = useState(0);
  const isPlaying = playback === "playing";

  useEffect(() => {
    const cinema = cinemaRef.current;
    if (!cinema) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(cinema);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    onPlaybackChange?.(playback);
  }, [onPlaybackChange, playback]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setTimeout(() => {
      setPlayback("ended");
    }, HERO_SEQUENCE_MS);

    return () => window.clearTimeout(timer);
  }, [isPlaying, runId]);

  const togglePlayback = () => {
    if (isPlaying) {
      setPlayback("stopped");
      return;
    }

    setRunId((id) => id + 1);
    setPlayback("playing");
  };

  return (
    <div
      ref={cinemaRef}
      className="hero-production-cinema relative mt-3 w-screen max-w-none overflow-visible bg-transparent sm:mt-4"
      data-hero-playback={playback}
      data-hero-visible={isHeroVisible ? "true" : "false"}
      style={
        {
          "--hero-production-cycle": `${HERO_SEQUENCE_MS}ms`,
          "--hero-production-intro-cycle": `${HERO_INTRO_SEQUENCE_MS}ms`,
        } as CSSProperties
      }
    >
      <div key={runId} aria-hidden="true" inert>
        <div className="hero-production-stage-logo" aria-hidden>
          <OnboardingDenkerIntro />
        </div>

        <div className="hero-production-stage-agent-reveal" aria-hidden>
          <div className="hero-production-agent-reveal-glass">
            <ProductionAgentFrame className="hero-production-agent-reveal-frame" />
          </div>
        </div>

        <div className="hero-production-stage-voice" aria-hidden>
          <HeroVoiceListeningIndicator />
        </div>

        <div className="hero-production-stage-html" aria-hidden>
          <ProductionHtmlFrame />
        </div>

        <div className="hero-production-stage-desktop" aria-hidden>
          <HeroMacBookFront />
        </div>

        <div className="hero-production-stage-final" aria-hidden>
          <div className="hero-production-final-layout">
            <HeroMacBook className="hero-production-final-desktop" />
            <div className="hero-production-final-agent-shell">
              <div className="hero-production-agent-reveal-glass">
                <ProductionAgentFrame className="hero-production-agent-reveal-frame hero-production-final-agent" />
              </div>
            </div>
            <div className="hero-production-final-book">
              <ProductionHtmlFrame />
            </div>
            <div className="hero-production-final-voice">
              <HeroVoiceListeningIndicator staticMode />
            </div>
            <div className="hero-production-final-cursor">
              <DenkerCursorBubble className="hero-production-final-cursor-bubble">
                Done, task is complete
              </DenkerCursorBubble>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={isPlaying ? "Stop hero animation" : "Play hero animation"}
        aria-pressed={isPlaying}
        className="hero-production-playback-control"
        onClick={togglePlayback}
      >
        {isPlaying ? (
          <Icons.Square aria-hidden="true" className="size-4" />
        ) : (
          <Icons.Play aria-hidden="true" className="ml-0.5 size-4" />
        )}
      </button>
    </div>
  );
}

export function HeroVoiceListeningIndicator({
  staticMode = false,
}: {
  staticMode?: boolean;
}) {
  const [volume, setVolume] = useState(staticMode ? 0.46 : 0.38);

  useEffect(() => {
    if (staticMode) return;

    let frame = 0;
    let lastUpdate = 0;
    let smoothedVolume = 0.46;
    const startedAt = performance.now();

    const tick = (now: number) => {
      if (now - lastUpdate > 30) {
        const elapsed = (now - startedAt) / 1000;
        const target =
          0.54 +
          Math.sin(elapsed * 0.72) * 0.2 +
          Math.sin(elapsed * 1.34 + 0.9) * 0.1;
        smoothedVolume += (target - smoothedVolume) * 0.035;
        setVolume(Math.max(0.2, Math.min(0.92, smoothedVolume)));
        lastUpdate = now;
      }

      if (now - startedAt < HERO_SEQUENCE_MS + 800) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [staticMode]);

  const voiceLevel = Math.max(0, Math.min(1, volume));

  return (
    <div
      className="hero-production-voice-anchor"
      style={
        {
          "--hero-voice-level": voiceLevel.toFixed(3),
          "--hero-voice-reflection": (0.42 + voiceLevel * 0.48).toFixed(3),
          "--hero-voice-travel": `${Math.round(5 + voiceLevel * 8)}%`,
          "--hero-voice-green-fill": `rgba(48, 209, 88, ${(0.08 + voiceLevel * 0.22).toFixed(3)})`,
          "--hero-voice-cyan-fill": `rgba(56, 189, 248, ${(0.06 + voiceLevel * 0.18).toFixed(3)})`,
          "--hero-voice-pink-fill": `rgba(244, 114, 182, ${(0.07 + voiceLevel * 0.2).toFixed(3)})`,
          "--hero-voice-glow": `rgba(48, 209, 88, ${(0.14 + voiceLevel * 0.34).toFixed(3)})`,
        } as CSSProperties
      }
    >
      <AgentCursorArrow
        color={DENKER_GREEN}
        className="hero-production-voice-cursor"
        mode="glass"
        shape="soft"
        liquidLevel={0.36}
        width={17}
        height={22}
        position="absolute"
      />
      <div className="hero-production-voice-expand-shell">
        <VoiceListeningGlass
          className="hero-production-voice-indicator hero-production-voice-glass"
          color="rgba(48,209,88,0.88)"
          volume={volume}
          status="listening"
          camera
          agentName="Denker"
          showAgentName
          size="compact"
          surface="dark"
          testId="hero-production-voice-glass"
        />
      </div>
    </div>
  );
}

export function OnboardingDenkerIntro() {
  return (
    <div className="hero-production-onboarding-intro" aria-hidden="true">
      <div className="hero-production-onboarding-field">
        <div className="hero-production-onboarding-liquid-shell">
          <IntroGlassBubble
            className="hero-production-onboarding-liquid"
            glassBackgroundOpacity={0.035}
            glassSaturation={1.36}
            borderWidth={0.22}
            blur={5}
            displace={0.28}
            distortionScale={-340}
            greenOffset={22}
            blueOffset={48}
            initialMapWidth={176}
            initialMapHeight={176}
            initialMapRadius={176}
          />
          <LiquidDenkerMark />
        </div>
      </div>
    </div>
  );
}

function createGlassDisplacementMap({
  width,
  height,
  radius,
  borderWidth,
  brightness,
  opacity,
  blur,
  mixBlendMode,
  redGradId,
  blueGradId,
}: {
  width: number;
  height: number;
  radius: number;
  borderWidth: number;
  brightness: number;
  opacity: number;
  blur: number;
  mixBlendMode: string;
  redGradId: string;
  blueGradId: string;
}) {
  const edgeSize = Math.min(width, height) * (borderWidth * 0.5);
  const svgContent = `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="black"></rect>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" fill="url(#${redGradId})" />
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
      <rect x="${edgeSize}" y="${edgeSize}" width="${width - edgeSize * 2}" height="${height - edgeSize * 2}" rx="${radius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

function IntroGlassBubble({
  children,
  className,
  glassBackgroundOpacity = 0,
  glassSaturation = 1,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0.5,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  mixBlendMode = "difference",
  initialMapWidth = 286,
  initialMapHeight = 286,
  initialMapRadius = 286,
}: {
  children?: ReactNode;
  className?: string;
  glassBackgroundOpacity?: number;
  glassSaturation?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  mixBlendMode?: string;
  initialMapWidth?: number;
  initialMapHeight?: number;
  initialMapRadius?: number;
}) {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `hero-intro-glass-filter-${uniqueId}`;
  const redGradId = `hero-intro-glass-red-${uniqueId}`;
  const blueGradId = `hero-intro-glass-blue-${uniqueId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  const generateDisplacementMap = useCallback(() => {
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    const actualWidth = rect?.width || initialMapWidth;
    const actualHeight = rect?.height || initialMapHeight;
    const computedRadius = container
      ? Number.parseFloat(getComputedStyle(container).borderTopLeftRadius)
      : Number.NaN;
    const borderRadius = Number.isFinite(computedRadius)
      ? computedRadius
      : Math.max(actualWidth, actualHeight);
    return createGlassDisplacementMap({
      width: actualWidth,
      height: actualHeight,
      radius: borderRadius,
      borderWidth,
      brightness,
      opacity,
      blur,
      mixBlendMode,
      redGradId,
      blueGradId,
    });
  }, [
    blueGradId,
    blur,
    borderWidth,
    brightness,
    initialMapHeight,
    initialMapWidth,
    mixBlendMode,
    opacity,
    redGradId,
  ]);

  const updateDisplacementMap = useCallback(() => {
    feImageRef.current?.setAttribute("href", generateDisplacementMap());
  }, [generateDisplacementMap]);

  useLayoutEffect(() => {
    updateDisplacementMap();

    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      ref.current?.setAttribute("scale", (distortionScale + offset).toString());
      ref.current?.setAttribute("xChannelSelector", "R");
      ref.current?.setAttribute("yChannelSelector", "G");
    });

    gaussianBlurRef.current?.setAttribute("stdDeviation", displace.toString());
  }, [
    blueOffset,
    displace,
    distortionScale,
    greenOffset,
    redOffset,
    updateDisplacementMap,
  ]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(updateDisplacementMap);

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [updateDisplacementMap]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "glass-surface",
        className,
        "glass-surface--svg",
      )}
      style={
        {
          "--filter-id": `url(#${filterId})`,
          "--glass-frost": glassBackgroundOpacity,
          "--glass-saturation": glassSaturation,
        } as CSSProperties
      }
    >
      <svg
        className="glass-surface__filter"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              ref={feImageRef}
              href={createGlassDisplacementMap({
                width: initialMapWidth,
                height: initialMapHeight,
                radius: initialMapRadius,
                borderWidth,
                brightness,
                opacity,
                blur,
                mixBlendMode,
                redGradId,
                blueGradId,
              })}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              ref={redChannelRef}
              in="SourceGraphic"
              in2="map"
              scale={distortionScale + redOffset}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              scale={distortionScale + greenOffset}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap
              ref={blueChannelRef}
              in="SourceGraphic"
              in2="map"
              scale={distortionScale + blueOffset}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation={displace} />
          </filter>
        </defs>
      </svg>
      <div className="glass-surface__content">{children}</div>
    </div>
  );
}

function LiquidDenkerMark() {
  return (
    <svg
      className="hero-production-onboarding-mark"
      width="92"
      height="92"
      viewBox="0 0 780 780"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-open-mark-fill" x1="188" y1="310" x2="526" y2="638">
          <stop offset="0" stopColor="rgba(255,255,255,0.98)" stopOpacity="0.96" />
          <stop offset="0.48" stopColor="rgba(255,255,255,0.9)" stopOpacity="0.86" />
          <stop offset="1" stopColor="rgba(238,246,255,0.96)" stopOpacity="0.9" />
        </linearGradient>
        <filter
          id="hero-open-mark-soft-edge"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology in="SourceAlpha" operator="erode" radius="1.8" result="thinAlpha" />
          <feComposite in="SourceGraphic" in2="thinAlpha" operator="in" result="thinMark" />
          <feDropShadow
            in="thinMark"
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.2"
            result="drop"
          />
          <feMerge>
            <feMergeNode in="drop" />
            <feMergeNode in="thinMark" />
          </feMerge>
        </filter>
      </defs>
      <g transform="matrix(1,0,0,1,-2200,0)">
        <g transform="matrix(0.404984,0,0,0.44546,2200,0)">
          <g transform="matrix(4.938462,0,0,4.478261,-740.769231,-1294.217391)">
            <path d={DENKER_SYMBOL_PATH} fill="url(#hero-open-mark-fill)" filter="url(#hero-open-mark-soft-edge)" opacity="0.98" />
          </g>
        </g>
      </g>
    </svg>
  );
}

function ProductionFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        surfaceRoleClassName("frame"),
        "hero-production-object hero-production-window relative flex h-full flex-col overflow-hidden border-glass-stroke",
        className,
      )}
      {...surfaceRoleAttributes("frame", {
        nativeLevel: "root",
        nativeGroup: "landing-preview",
      })}
    >
      {children}
    </div>
  );
}

export function ProductionAgentFrame({ className }: { className?: string }) {
  return (
    <ProductionFrame className={className}>
      <FrameHeader
        title="Your Team"
        icon={Icons.Users}
        accentColor="bg-accent"
        data-testid="landing-production-agent-header"
      />
      <div className="hero-production-agent-list scrollbar-none flex flex-1 flex-col overflow-hidden">
        {agentRows.map((agent) => (
          <div
            key={agent.name}
            className="hero-production-agent-row flex items-center rounded transition-colors hover:bg-glass-fill-heavy"
          >
            <span
              className="hero-production-agent-avatar"
              style={{ background: agent.avatar }}
            />
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="hero-production-agent-name truncate text-secondary">
                {agent.name}
              </span>
              <span className="hero-production-agent-model truncate text-muted">
                {agent.model}
              </span>
            </div>
            <span
              className={cn(
                "hero-production-agent-status",
                agent.active && "hero-production-agent-status-active",
              )}
            />
          </div>
        ))}
      </div>
      <FrameFooter
        onCopy={() => undefined}
        onComment={() => undefined}
        onDelete={() => undefined}
        data-testid="landing-production-agent-footer"
      />
    </ProductionFrame>
  );
}

export function ProductionHtmlFrame() {
  return (
    <IntroGlassBubble
      className="hero-production-html-glass"
      glassBackgroundOpacity={0.02}
      glassSaturation={1.5}
      borderWidth={0.1}
      blur={8}
      displace={0.36}
      distortionScale={-220}
      greenOffset={18}
      blueOffset={38}
      initialMapWidth={900}
      initialMapHeight={520}
      initialMapRadius={28}
    >
      <ProductionFrame className="hero-production-html">
        <FrameHeader
          title="Book Notes"
          icon={Icons.Book}
          accentColor="bg-accent"
          agentName="Denker"
          data-testid="landing-production-html-header"
        />

        <div className="hero-production-html-body">
          <article className="hero-production-takeaway-card">
            <div className="hero-production-book-list">
              {bookTakeaways.map((book, index) => (
                <section className="hero-production-book-row" key={book.title}>
                  <span className="hero-production-book-cover relative" aria-hidden="true">
                    <Image
                      src={book.coverSrc}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 112px, 164px"
                      className="hero-production-book-image"
                      priority={index === 0}
                    />
                  </span>

                  <div className="hero-production-book-takeaway min-w-0">
                    <div className="hero-production-book-heading">
                      <div className="min-w-0">
                        <span className="hero-production-html-kicker text-secondary">
                          {book.eyebrow}
                        </span>
                        <h3 className="hero-production-html-title text-primary">
                          {book.title}
                        </h3>
                      </div>
                    </div>

                    <div className="hero-production-takeaway-copy-block">
                      <span className="hero-production-takeaway-label">
                        Key takeaway
                      </span>
                      <p className="hero-production-html-copy text-secondary">
                        {book.takeaway}
                      </p>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>

        <FrameFooter
          onCopy={() => undefined}
          onComment={() => undefined}
          onDelete={() => undefined}
          data-testid="landing-production-html-footer"
        />
      </ProductionFrame>
    </IntroGlassBubble>
  );
}
