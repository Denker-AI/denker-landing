import { LandingHero } from "@/components/landing-hero";
import { LandingDemo } from "@/components/landing-demo";
import { LandingFeatures } from "@/components/landing-features";
import { LandingPricing } from "@/components/landing-pricing";
import { LandingCta } from "@/components/landing-cta";
import { LandingFooter } from "@/components/landing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <LandingHero />
      <LandingDemo />
      <LandingFeatures />
      <LandingPricing />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
