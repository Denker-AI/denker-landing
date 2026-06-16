import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
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
    <div
      className="min-h-screen bg-canvas"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 65% 55% at 15% 20%, rgba(58,248,140,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 55% 45% at 80% 60%, rgba(255,200,50,0.05) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 60% 5%,  rgba(255,180,80,0.04) 0%, transparent 65%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%",
      }}
    >
      <LandingNav />
      <main>
      <LandingHero />
      <LandingManifesto />

      <LandingTeamIntro />

      <LandingFeatures />
      <LandingFounderVoices />
      <LandingPricing />
      <LandingCta />
      <LandingFinalCta />
      </main>
      <LandingFooter />
      <ScrollButton />
    </div>
  );
}
