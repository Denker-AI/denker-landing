import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { LandingLiquidBackground } from "@/components/landing-liquid-background";
import { LandingNav } from "@/components/landing-nav";
import { ScrollButton } from "@/components/scroll-button";
import { LandingHero } from "@/components/landing-hero";
import { LandingManifesto } from "@/components/landing-manifesto";
import { LandingTeamIntro } from "@/components/landing-team-intro";

import { LandingFeatures } from "@/components/landing-features";
import { LandingFounderVoices } from "@/components/landing-founder-voices";
import { LandingPricing } from "@/components/landing-pricing";
import { LandingCta } from "@/components/landing-cta";
import { LandingFinalCta } from "@/components/landing-final-cta";
import { LandingFooter } from "@/components/landing-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://www.denker.ai/",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <main className="relative z-10">
        <div className="landing-liquid-shell relative overflow-hidden">
          <LandingLiquidBackground />
          <LandingNav />
          <LandingHero />
        </div>
        <LandingManifesto />

        <LandingTeamIntro />

        <LandingFeatures />
        <LandingFounderVoices />
        <LandingPricing />
        <LandingCta />
        <LandingFinalCta />
      </main>
      <div className="relative z-10">
        <LandingFooter />
        <ScrollButton />
      </div>
    </div>
  );
}
