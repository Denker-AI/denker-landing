"use client";

import { CtaGateDialog, useCtaGate } from "@/components/cta-gate-dialog";

export function LandingFinalCta() {
  const { open, openGate, closeGate } = useCtaGate();

  return (
    <section className="px-5 py-28 sm:px-6 lg:px-12" data-testid="landing-final-cta">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-section-heading mb-4">
          Your team.<br />
          <span className="text-accent">One signup away.</span>
        </h2>
        <p className="mb-10 text-base text-secondary">
          Free to start. Works on Mac, Windows, and Linux. No credit card.
        </p>
        <button
          type="button"
          onClick={openGate}
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-bold text-canvas transition-opacity hover:opacity-80"
          data-testid="final-cta-button"
        >
          Start Now
        </button>
      </div>
      <CtaGateDialog open={open} onClose={closeGate} />
    </section>
  );
}
