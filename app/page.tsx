import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { LandingNav } from "@/components/landing-nav";
import { ScrollButton } from "@/components/scroll-button";
import { LandingHero } from "@/components/landing-hero";
import { LandingManifesto } from "@/components/landing-manifesto";
import { FeaturesGrid } from "@/components/features-grid";

import { LandingFeatures } from "@/components/landing-features";
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
        backgroundAttachment: "fixed, fixed, fixed",
      }}
    >
      <LandingNav />
      <main>
      <LandingHero />
      <LandingManifesto />

      {/* Features anchor + heading */}
      <section id="features" className="relative flex min-h-screen flex-col items-center justify-center px-5 text-center sm:px-6 lg:px-12">
        <FeaturesGrid />
        <span className="relative badge-section mb-6">Features</span>
        <h2 className="relative text-section-heading mx-auto max-w-3xl">
          One canvas. Multiple agents.
          <br />
          <span className="text-accent">Everything runs in parallel.</span>
        </h2>
      </section>

      <LandingFeatures />
      <LandingPricing />
      <LandingCta />
      <LandingFinalCta />
      </main>
      <LandingFooter />
      <ScrollButton />
    </div>
  );
}
