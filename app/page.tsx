import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhatDenkerCanDo } from "@/components/WhatDenkerCanDo";
import { BuiltForFounders } from "@/components/BuiltForFounders";
import { WhyDenkerAI } from "@/components/WhyDenkerAI";
import { TrustBadges } from "@/components/TrustBadges";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { ReachOut } from "@/components/ReachOut";
import { FAQ } from "@/components/FAQ";
import { CTABanner, Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <WhatDenkerCanDo />
        <BuiltForFounders />
        <WhyDenkerAI />
        <TrustBadges />
        <Testimonials />
        <Pricing />
        <FAQ />
        <ReachOut />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
