"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";

/* ── Plan data ──────────────────────────────────────────────── */

type Plan = {
  name: string;
  monthly: number | null;
  yearly: number | null;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  creditNote: string | null;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    monthly: null,
    yearly: null,
    description: "Try the canvas and agents. No credit card required.",
    features: [
      "5 projects",
      "5 workflows",
      "Basic memory",
      "Community support",
    ],
    highlighted: false,
    cta: "Get Started",
    creditNote: null,
  },
  {
    name: "Pro",
    monthly: 19,
    yearly: 199,
    description: "Your full AI workspace. Unlimited projects and persistent knowledge graph.",
    features: [
      "Everything in Free, plus",
      "Unlimited projects",
      "Unlimited workflows",
      "Knowledge graph memory — 10 GB",
      "Priority support",
    ],
    highlighted: true,
    cta: "Get Started",
    creditNote: null,
  },
  {
    name: "Max",
    monthly: 99,
    yearly: 999,
    description: "Cloud execution with advanced workflows. Agents run 24/7.",
    features: [
      "Everything in Pro, plus",
      "10,000 credits / mo included",
      "24/7 cloud execution",
      "Unlimited memory",
      "Beta features",
    ],
    highlighted: false,
    cta: "Get Started",
    creditNote: "10,000 credits / mo",
  },
];

/* ── Billing toggle ─────────────────────────────────────────── */

function BillingToggle({
  yearly,
  onChange,
}: {
  yearly: boolean;
  onChange: (yearly: boolean) => void;
}) {
  return (
    <div className="mb-12 flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <button
          className={cn(
            "text-xs font-semibold transition-colors",
            !yearly ? "text-primary" : "text-muted",
          )}
          onClick={() => onChange(false)}
          data-testid="toggle-monthly"
        >
          Monthly
        </button>
        <button
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full border transition-colors",
            yearly
              ? "border-accent/40 bg-accent/20"
              : "border-glass-stroke bg-glass-fill-heavy",
          )}
          onClick={() => onChange(!yearly)}
          aria-label="Toggle billing period"
          data-testid="toggle-switch"
        >
          <span
            className={cn(
              "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all duration-200",
              yearly
                ? "left-[calc(100%-24px)] bg-accent"
                : "left-[3px] bg-muted",
            )}
          />
        </button>
        <button
          className={cn(
            "text-xs font-semibold transition-colors",
            yearly ? "text-primary" : "text-muted",
          )}
          onClick={() => onChange(true)}
          data-testid="toggle-yearly"
        >
          Yearly
        </button>
      </div>
      <span
        className={cn(
          "rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent transition-opacity duration-200",
          yearly ? "opacity-100" : "opacity-0",
        )}
      >
        2 months free
      </span>
    </div>
  );
}

/* ── Pricing card ───────────────────────────────────────────── */

function PricingCard({
  plan,
  yearly,
}: {
  plan: Plan;
  yearly: boolean;
}) {
  const { name, monthly, description, features, highlighted, cta } = plan;
  const price = yearly ? plan.yearly : monthly;
  const isFree = price === null;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-7",
        highlighted
          ? "border-accent/30 bg-accent/[0.06] dark:bg-accent/[0.04]"
          : "border-glass-stroke bg-surface shadow-glass-sm dark:bg-glass-fill",
      )}
      style={highlighted ? { boxShadow: "0 0 48px rgba(21, 128, 61, 0.08), inset 0 1px 0 rgba(21, 128, 61, 0.10)" } : undefined}
      data-testid={`pricing-${name.toLowerCase()}`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold text-[#0F1115] shadow-glow-accent-sm">
          Most Popular
        </div>
      )}

      {/* Tier name */}
      <p className={cn("mb-2 text-sm font-bold", highlighted ? "text-accent" : "text-secondary")}>
        {name}
      </p>

      {/* Price */}
      <div className="mb-1 flex items-baseline gap-1.5">
        {isFree ? (
          <span className="text-4xl font-extrabold tracking-tight text-primary">&euro;0</span>
        ) : (
          <>
            <span className="text-4xl font-extrabold tracking-tight text-primary">
              &euro;{price}
            </span>
            <span className="text-sm text-muted">{yearly ? "/ yr" : "/ mo"}</span>
          </>
        )}
      </div>

      {/* Yearly note */}
      <div className="mb-5 h-4">
        {!isFree && yearly && monthly && (
          <p className="text-[11px] text-muted">
            &asymp; &euro;{Math.round((plan.yearly ?? 0) / 12)} / mo &mdash; 2 months free
          </p>
        )}
        {isFree && <p className="text-[11px] text-secondary">forever</p>}
      </div>

      {/* Description */}
      <p className="mb-6 text-[13px] leading-relaxed text-secondary">{description}</p>

      {/* Divider */}
      <div className={cn("mb-6 h-px", highlighted ? "bg-accent/10" : "bg-glass-stroke")} />

      {/* Features */}
      <ul className="flex flex-1 flex-col gap-3.5">
        {features.map((f) => {
          const isInherit = f.startsWith("Everything in");
          return (
            <li key={f} className="flex items-start gap-2.5">
              <Icons.Check
                className={cn(
                  "mt-0.5 h-3.5 w-3.5 shrink-0",
                  highlighted && !isInherit ? "text-accent" : "text-secondary",
                )}
              />
              <span
                className={cn(
                  "text-sm leading-snug",
                  isInherit ? "font-medium text-secondary" : "text-secondary",
                )}
              >
                {f}
              </span>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <a
        href="https://space.denker.ai"
        className={cn(
          "mt-8 flex h-12 items-center justify-center rounded-full text-sm font-semibold transition-all hover:brightness-110",
          highlighted
            ? "bg-accent text-[#0F1115] shadow-glow-accent"
            : "border border-glass-stroke bg-glass-fill-heavy text-primary hover:border-glass-stroke-light",
        )}
        data-testid={`pricing-${name.toLowerCase()}-cta`}
      >
        {cta}
      </a>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────── */

export function LandingPricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative px-5 py-24 sm:px-6 lg:px-12" data-testid="landing-pricing">
      {/* Heading */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="badge-section mb-4">Simple pricing</span>
        <h2
          className="text-section-heading mb-4"
          data-testid="pricing-heading"
        >
          Less than a hire.
          <br />
          <span className="text-accent">More than a tool.</span>
        </h2>
        <p className="text-base text-secondary">
          Start free. Pay for what your agents actually need.
        </p>
      </div>

      {/* Toggle */}
      <BillingToggle yearly={yearly} onChange={setYearly} />

      {/* Cards */}
      <div className="mx-auto grid max-w-5xl items-stretch gap-5 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard key={plan.name} plan={plan} yearly={yearly} />
        ))}
      </div>

      {/* Supported CLI platforms */}
      <div className="mx-auto mt-10 max-w-xl text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">
          Powered by your CLI subscription
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Claude Code
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-glass-stroke bg-glass-fill px-4 py-1.5 text-xs text-muted">
            Codex
            <span className="text-[10px] opacity-60">soon</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-glass-stroke bg-glass-fill px-4 py-1.5 text-xs text-muted">
            OpenCode
            <span className="text-[10px] opacity-60">soon</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-glass-stroke bg-glass-fill px-4 py-1.5 text-xs text-muted">
            OpenRouter
            <span className="text-[10px] opacity-60">soon</span>
          </span>
        </div>
        <p className="mt-4 text-xs text-muted">
          All plans include the canvas, real-time agent visibility, and tool connections. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
