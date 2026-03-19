import { LandingNav } from "@/components/landing-nav";
import { ScrollButton } from "@/components/scroll-button";
import { LandingHero } from "@/components/landing-hero";
import { LandingManifesto } from "@/components/landing-manifesto";

import { LandingFeatures } from "@/components/landing-features";
import { LandingPricing } from "@/components/landing-pricing";
import { LandingCta } from "@/components/landing-cta";
import { LandingFinalCta } from "@/components/landing-final-cta";
import { LandingFooter } from "@/components/landing-footer";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-canvas"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 70% 60% at 20% 15%, rgba(58,248,140,0.09) 0%, transparent 70%),
          radial-gradient(ellipse 60% 50% at 80% 50%, rgba(96,165,250,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 50% 45% at 65% 5%,  rgba(167,139,250,0.06) 0%, transparent 65%),
          radial-gradient(ellipse 55% 40% at 35% 85%, rgba(244,114,182,0.04) 0%, transparent 65%),
          radial-gradient(circle, var(--color-canvas-dot) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 24px 24px",
        backgroundAttachment: "fixed, fixed, fixed, fixed, scroll",
      }}
    >
      <LandingNav />
      <main>
      <LandingHero />
      <LandingManifesto />

      {/* Features anchor + heading */}
      <section id="features" className="flex min-h-screen flex-col items-center justify-center px-5 text-center sm:px-6 lg:px-12">
        <span className="badge-section mb-6">Features</span>
        <h2 className="text-section-heading mx-auto max-w-3xl">
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
