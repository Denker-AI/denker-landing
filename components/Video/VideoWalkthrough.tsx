"use client";

import {
  Pause,
  Play,
  SpeakerHigh,
  SpeakerX,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

// NOTE: Figma shows an empty placeholder card for this section — no real
// video asset was provided. Using a public domain sample video as a stand-in
// until the client supplies the actual walkthrough recording.
const DUMMY_VIDEO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export function VideoWalkthrough() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // Autoplay whenever the section scrolls into view, pause when it leaves —
  // this also covers "play automatically on page load" for whoever lands
  // with the section already in view.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // autoplay can still be blocked in some browsers; user can hit play manually
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section
      className="flex w-full flex-col items-center bg-grey-950 px-6 py-10 sm:px-10 md:px-20 md:py-20"
      data-name="Section - Product walkthrough Video"
      data-theme="dark"
    >
      <Container>
        <FadeIn className="w-full">
        <div
          ref={wrapperRef}
          className="group relative aspect-video w-full overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[32px] bg-grey-900"
        >
          <video
            ref={videoRef}
            src={DUMMY_VIDEO_SRC}
            muted
            loop
            playsInline
            className="size-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/70 to-transparent p-4 pb-9 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              {muted ? (
                <SpeakerX className="size-4" />
              ) : (
                <SpeakerHigh className="size-4" />
              )}
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
        </div>
        </FadeIn>
      </Container>
    </section>
  );
}
