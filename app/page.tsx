import { LandingNav } from "@/components/landing-nav";
import { ScrollButton } from "@/components/scroll-button";
import { LandingHero } from "@/components/landing-hero";
import { LandingManifesto } from "@/components/landing-manifesto";
import { LandingDemo } from "@/components/landing-demo";
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
          radial-gradient(ellipse 60% 50% at 15% 20%, rgba(21,128,61,0.13) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 85% 55%, rgba(10,132,255,0.11) 0%, transparent 70%),
          radial-gradient(ellipse 40% 35% at 70% 8%,  rgba(167,139,250,0.09) 0%, transparent 65%),
          radial-gradient(circle, var(--color-canvas-dot) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 24px 24px",
        backgroundAttachment: "fixed, fixed, fixed, scroll",
      }}
    >
      <LandingNav />
      <main>
      <LandingHero />
      <LandingManifesto />

      {/* Features anchor + heading */}
      <section id="features" className="flex min-h-screen flex-col items-center justify-center px-5 text-center sm:px-6 lg:px-12">
        <span className="badge-section mb-6">Features</span>
        <h2
          className="text-section-heading mx-auto max-w-3xl"
        >
          One canvas. Multiple agents.
          <br />
          <span className="text-accent">Everything runs in parallel.</span>
        </h2>
      </section>

      <LandingDemo />
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
