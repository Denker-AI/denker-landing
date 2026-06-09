"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

interface LandingGlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  mixBlendMode?: CSSProperties["mixBlendMode"];
}

function supportsSVGBackdropFilter(filterId: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const isWebkit =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  if (isWebkit || isFirefox) return false;

  const probe = document.createElement("div");
  probe.style.backdropFilter = `url(#${filterId})`;
  return probe.style.backdropFilter !== "";
}

export function LandingGlassSurface({
  children,
  className,
  style,
  borderRadius = 24,
  borderWidth = 0.07,
  brightness = 58,
  opacity = 0.9,
  blur = 10,
  displace = 0.7,
  backgroundOpacity = 0.016,
  saturation = 1.75,
  distortionScale = -150,
  mixBlendMode = "screen",
  ...rootProps
}: LandingGlassSurfaceProps) {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `landing-glass-filter-${uniqueId}`;
  const redGradientId = `landing-glass-red-${uniqueId}`;
  const blueGradientId = `landing-glass-blue-${uniqueId}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const [svgSupported, setSvgSupported] = useState(false);

  useEffect(() => {
    setSvgSupported(supportsSVGBackdropFilter(filterId));
  }, [filterId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDisplacementMap = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width || 420;
      const height = rect.height || 160;
      const edgeSize = Math.min(width, height) * (borderWidth * 0.5);
      const map = `
        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${redGradientId}" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="${blueGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="${width}" height="${height}" fill="black"/>
          <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${redGradientId})"/>
          <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${blueGradientId})" style="mix-blend-mode:${mixBlendMode}"/>
          <rect x="${edgeSize}" y="${edgeSize}" width="${width - edgeSize * 2}" height="${height - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/>
        </svg>
      `;
      feImageRef.current?.setAttribute(
        "href",
        `data:image/svg+xml,${encodeURIComponent(map)}`,
      );
    };

    const updateChannels = () => {
      redChannelRef.current?.setAttribute("scale", String(distortionScale));
      greenChannelRef.current?.setAttribute("scale", String(distortionScale + 10));
      blueChannelRef.current?.setAttribute("scale", String(distortionScale + 20));
      gaussianBlurRef.current?.setAttribute("stdDeviation", String(displace));
    };

    updateDisplacementMap();
    updateChannels();

    const observer = new ResizeObserver(() => {
      window.setTimeout(updateDisplacementMap, 0);
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [
    blur,
    borderRadius,
    borderWidth,
    brightness,
    displace,
    distortionScale,
    mixBlendMode,
    opacity,
    redGradientId,
    blueGradientId,
  ]);

  const surfaceStyle = {
    ...style,
    borderRadius,
    "--landing-glass-frost": backgroundOpacity,
    "--landing-glass-saturation": saturation,
    "--landing-glass-filter": `url(#${filterId})`,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={cn(
        "landing-glass-surface",
        svgSupported
          ? "landing-glass-surface--svg"
          : "landing-glass-surface--fallback",
        className,
      )}
      style={surfaceStyle}
      {...rootProps}
    >
      <svg
        className="landing-glass-surface__filter"
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
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap
              ref={blueChannelRef}
              in="SourceGraphic"
              in2="map"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur
              ref={gaussianBlurRef}
              in="output"
              result="final"
            />
            <feComposite in="final" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
      </svg>
      <div className="landing-glass-surface__content">{children}</div>
    </div>
  );
}
