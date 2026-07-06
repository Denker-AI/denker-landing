"use client";

import { useEffect, useRef, useState } from "react";
import { ColorBends } from "@/components/Hero/ColorBends";
import { LaunchBadges } from "@/components/Hero/LaunchBadges";
import { HereMedia, type HeroPlayback } from "@/components/Hero/HeroMockup";
import { Button } from "@/components/ui/Button";
import { LOGIN_URL } from "@/lib/links";

const DENKER_HERO_BENDS = ["#22ff7a"];

export function Hero() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const [heroPlayback, setHeroPlayback] = useState<HeroPlayback>("playing");
  const [isHeroInView, setIsHeroInView] = useState(true);
  const showHeroActions = heroPlayback === "ended";
  const showHeroOverlay = showHeroActions && isHeroInView;

  useEffect(() => {
    const heroSection = heroSectionRef.current;
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroInView(entry.isIntersecting),
      { threshold: 0.08 }
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroSectionRef}
      className="hero-viewport-section relative flex w-full flex-col items-center overflow-hidden px-6 pt-[136px] pb-8 text-white sm:px-10 md:px-20 md:pt-[138px] md:pb-10"
      data-name="Section - Hero"
      data-theme="dark"
      data-hero-ended={showHeroActions ? "true" : "false"}
    >
      <ColorBends
        className="hero-color-bends-background"
        colors={DENKER_HERO_BENDS}
        rotation={90}
        autoRotate={0}
        speed={0.2}
        scale={1.45}
        frequency={1}
        warpStrength={1}
        offset={[-0.18, 0.16]}
        mouseInfluence={1}
        parallax={0.5}
        noise={0.08}
        iterations={1}
        intensity={0.88}
        bandWidth={18}
        transparent
      />
      <LaunchBadges visible={showHeroActions} />
      <HereMedia onPlaybackChange={setHeroPlayback} />
      <div
        className="hero-actions"
        data-visible={showHeroOverlay ? "true" : "false"}
        aria-hidden={!showHeroOverlay}
      >
        <div className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
          <Button
            variant="primary"
            href={LOGIN_URL}
            tabIndex={showHeroOverlay ? undefined : -1}
            className="h-11 w-full bg-white px-5 text-base font-semibold text-grey-950 shadow-[0_16px_44px_rgba(0,0,0,0.22)] hover:bg-grey-50 sm:w-auto"
          >
            Get Started
          </Button>
          <Button
            variant="secondary"
            href="#features"
            tabIndex={showHeroOverlay ? undefined : -1}
            className="h-11 w-full border-white/45 bg-black/20 px-5 text-base font-semibold text-white shadow-[0_16px_44px_rgba(0,0,0,0.18)] backdrop-blur-[24px] hover:border-white/70 hover:bg-white/10 sm:w-auto"
          >
            Learn More
          </Button>
        </div>
      </div>

      <div className="hero-viewport-content relative z-10 mx-auto flex w-full max-w-[1260px] flex-col items-center text-center">
        <div className="hero-copy-block flex w-full flex-col items-center">
          <p className="hero-overline font-sans text-white">
            For Founders, Builders, and Thinkers.
          </p>
          <h1 className="hero-title mt-3 text-balance font-sans text-white">
            Your AI coworker that follows where you work.
          </h1>
          <p className="hero-subtitle font-sans text-grey-400">
            <span className="block">
              Never again follow every AI conversation manually.
            </span>
            <span className="block">Let your AI co-worker follow you.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
