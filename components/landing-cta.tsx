"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      if (!res.ok) throw new Error("Something went wrong");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-3">
        <Icons.CheckCircle className="h-4 w-4 shrink-0 text-accent" />
        <p className="text-sm text-primary">You&apos;re subscribed!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row" data-testid="newsletter-form">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
        className="h-10 w-full rounded-full border border-glass-stroke bg-glass-fill px-4 text-sm text-primary placeholder:text-muted backdrop-blur-glass transition-all focus:border-accent focus:outline-none sm:flex-1"
        data-testid="newsletter-email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-10 shrink-0 rounded-full bg-primary px-5 text-xs font-semibold text-canvas transition-all hover:opacity-80 disabled:opacity-40"
        data-testid="newsletter-submit"
      >
        {status === "loading" ? "..." : "Submit"}
      </button>
    </form>
  );
}

export function LandingCta() {
  return (
    <section id="community" className="relative px-5 py-24 sm:px-6 lg:px-12" data-testid="landing-cta">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="badge-section mb-3">Community</span>
          <h2
            className="text-section-heading"
            data-testid="cta-heading"
          >
            Follow the shift
          </h2>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {/* LinkedIn */}
          <div
            className="liquid-glass flex flex-col rounded-2xl border border-glass-stroke p-6 sm:p-10"
            data-testid="community-linkedin"
          >
            {/* LinkedIn brand icon */}
            <div className="mb-6 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#0A66C2]">
              <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-primary">LinkedIn</h3>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-secondary">
              See how founders direct AI agents from one canvas and move more work forward.
            </p>
            <a
              href="https://linkedin.com/company/denkerai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-fit items-center justify-center rounded-full border border-glass-stroke bg-glass-fill-heavy px-6 text-xs font-semibold text-primary transition-colors hover:border-glass-stroke-light"
              data-testid="community-linkedin-cta"
            >
              Follow us
            </a>
          </div>

          {/* Newsletter */}
          <div
            className="liquid-glass flex flex-col rounded-2xl border border-glass-stroke p-6 sm:p-10"
            data-testid="community-newsletter"
          >
            {/* Denker symbol */}
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3AF88C] p-2.5">
              <img src="/logo/symbol-dark-green.svg" alt="Denker" className="h-full w-full" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-primary">Newsletter</h3>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-secondary">
              Get practical examples for saving time, directing agents, and growing output as a founder.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
