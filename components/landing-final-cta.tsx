export function LandingFinalCta() {
  return (
    <section className="px-5 py-28 sm:px-6 lg:px-12" data-testid="landing-final-cta">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-section-heading mb-4">
          Ready to get started
        </h2>
        <p className="mb-10 text-base text-secondary">
          Try Denker for free. No credit card required.
        </p>
        <a
          href="https://space.denker.ai"
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-bold text-canvas transition-opacity hover:opacity-80"
          data-testid="final-cta-button"
        >
          Get Started →
        </a>
      </div>
    </section>
  );
}
