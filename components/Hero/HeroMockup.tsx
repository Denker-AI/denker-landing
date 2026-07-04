"use client";

import { Pause, Play, SpeakerHigh, SpeakerX } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const HERO_VIDEO_SRC = "/videos/Denker-Hero-Video.mp4";

const START_ANGLE = 35; // 2.5D backward tilt at rest
const HEADER_OFFSET = 96; // px from the viewport top where the mockup pins
const TILT_RANGE = 360; // px of scroll over which it flattens (1st animation)
const TRACK_HEIGHT = 1400; // px the in-flow track adds — drives the pinned scale
const DESKTOP_MIN_WIDTH = 1024; // scroll animation runs at/above this width only

/**
 * Hero dashboard mockup.
 *
 * Desktop: sits in the hero at rest (visible immediately, tilted 2.5D). A
 * fixed "stage" tracks an in-flow track element so it looks in place; on
 * scroll it flattens (1st animation), pins below the header, then scales up to
 * fill the screen and shrinks back to 0 exactly as the next section arrives
 * (2nd animation). Driven purely by scroll position, so it fully reverses.
 *
 * Tablet / mobile (and reduced motion): no scroll animation — just a static,
 * flat video mockup in the hero.
 *
 * The video is always visible and playing (muted, looping) with mute/unmute
 * and play/pause controls — it never reveals on scroll.
 */
export function HeroMockup() {
  const reduceMotion = useReducedMotion();
  const [animate, setAnimate] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // Only run the pinned scroll animation on desktop with motion allowed.
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const update = () => setAnimate(mq.matches && !reduceMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduceMotion]);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const loop = () => {
      const el = trackRef.current;
      const stage = stageRef.current;
      if (el && stage) {
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const elTop = rect.top;
        const elH = el.offsetHeight; // TRACK_HEIGHT
        const w = rect.width;
        const h = w * (9 / 16);
        const pinTop = HEADER_OFFSET;

        // The stage follows the track's top until it reaches the pin line,
        // then pins there.
        const top = Math.max(pinTop, elTop);

        // 1st animation — tilt flattens as the track approaches the pin line.
        const tilt =
          elTop > pinTop ? START_ANGLE * Math.min(1, (elTop - pinTop) / TILT_RANGE) : 0;

        // 2nd animation — pin progress runs 0 (track top at pin line) to 1
        // (track bottom at pin line, i.e. the next section reaches the top).
        // Scale hits 0 right at q = 1, so there is no empty gap afterwards.
        const q = Math.min(1, Math.max(0, (pinTop - elTop) / elH));
        // Expand to the viewport width exactly — never wider (no side crop).
        const FULL = vw / w;
        let scale = 1;
        if (q > 0) {
          if (q <= 0.32) scale = 1 + (FULL - 1) * (q / 0.32);
          else if (q <= 0.42) scale = FULL;
          else scale = FULL * (1 - (q - 0.42) / 0.58);
        }
        scale = Math.max(0, scale);

        // Fade out over the final stretch so it dissolves away at the end
        // instead of simply popping out of existence.
        const FADE_START = 0.78;
        const opacity = elTop > vh ? 0 : q >= FADE_START ? Math.max(0, 1 - (q - FADE_START) / (1 - FADE_START)) : 1;

        stage.style.top = `${top}px`;
        stage.style.left = `${rect.left}px`;
        stage.style.width = `${w}px`;
        stage.style.height = `${h}px`;
        stage.style.transformOrigin = "center top";
        stage.style.transform = `perspective(1200px) scale(${scale}) rotateX(${tilt}deg)`;
        // Keep a constant visual 32px radius despite the scale.
        stage.style.borderRadius = `${scale > 0.01 ? 32 / scale : 32}px`;
        stage.style.opacity = String(opacity);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  // Play only while the hero is in view, pause when it scrolls away, so its
  // audio never overlaps the walkthrough video further down the page.
  useEffect(() => {
    const video = videoRef.current;
    const host = animate ? trackRef.current : staticRef.current;
    if (!video || !host) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, [animate]);

  // Keep the play/pause icon in sync with the video's actual state.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    setPlaying(!video.paused);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [animate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const mockup = (
    <>
      <video
        ref={videoRef}
        src={HERO_VIDEO_SRC}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 size-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/70 to-transparent p-4 pb-9 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          {muted ? <SpeakerX className="size-4" /> : <SpeakerHigh className="size-4" />}
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          {playing ? (
            <Pause weight="fill" className="size-4" />
          ) : (
            <Play weight="fill" className="ml-0.5 size-4" />
          )}
        </button>
      </div>
    </>
  );

  // Static mockup for tablet / mobile / reduced motion — no scroll animation.
  if (!animate) {
    return (
      <div ref={staticRef} className="group relative mx-auto aspect-video w-full max-w-[1000px] overflow-hidden rounded-[32px] border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950">
        {mockup}
      </div>
    );
  }

  return (
    <>
      {/* In-flow track: reserves the mockup's resting slot and provides the
          scroll distance the pinned scale phase runs over. */}
      <div ref={trackRef} aria-hidden className="mx-auto w-full max-w-[1000px]" style={{ height: `${TRACK_HEIGHT}px` }} />

      {/* Fixed stage that tracks the slot, then pins and scales. The video is
          always visible and playing inside it. */}
      <div
        ref={stageRef}
        className="group fixed z-30 overflow-hidden border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950 shadow-[0_0_120px_rgba(74,191,115,0.08)]"
        style={{ top: 0, left: 0, borderRadius: 32 }}
      >
        {mockup}
      </div>
    </>
  );
}
