import { WaitlistForm } from "@/components/waitlist-form";

export function LandingCta() {
  return (
    <section id="waitlist" className="relative bg-canvas px-6 py-24 lg:px-12" data-testid="landing-cta">
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="mb-4 text-3xl font-bold tracking-tight text-primary lg:text-4xl"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
          data-testid="cta-heading"
        >
          Ready to work <span className="text-accent">with agents</span>?
        </h2>
        <p className="mb-8 text-base text-secondary">
          Join the waitlist for early access. Be among the first to experience
          the future of human-AI collaboration.
        </p>
        <div className="flex justify-center">
          <WaitlistForm />
        </div>
        <p className="mt-4 text-xs text-muted">
          We&apos;ll notify you when your spot is ready. No spam, ever.
        </p>
      </div>
    </section>
  );
}
