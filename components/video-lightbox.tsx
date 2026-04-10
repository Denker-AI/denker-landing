"use client";

import { useRef, useCallback } from "react";

interface VideoLightboxProps {
  src: string;
  alt: string;
}

export function VideoLightbox({ src, alt }: VideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const enterFullscreen = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
      (el as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  }, []);

  return (
    <button
      type="button"
      onClick={enterFullscreen}
      className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-glass-stroke-subtle transition-all hover:border-glass-stroke-light hover:shadow-glass-sm"
      aria-label={`View ${alt} fullscreen`}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 17 3 17 5" />
            <polyline points="5 17 3 17 3 15" />
            <polyline points="17 15 17 17 15 17" />
            <polyline points="3 5 3 3 5 3" />
          </svg>
        </div>
      </div>
    </button>
  );
}
