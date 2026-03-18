import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";

const PLANS = [
  {
    name: "Starter",
    price: "19",
    period: "/mo",
    description: "For individuals who want AI agents with lasting memory and organized workspaces.",
    features: [
      { text: "Unlimited canvas workspaces", included: true },
      { text: "Up to 3 concurrent agents", included: true },
      { text: "Memory graph — 10 000 entities", included: true },
      { text: "5 GB file storage", included: true },
      { text: "5 tool connections (Gmail, Slack, etc.)", included: true },
      { text: "Basic workflow automation", included: true },
      { text: "Community support", included: true },
    ],
    highlighted: false,
    cta: "Join Waitlist",
  },
  {
    name: "Pro",
    price: "69",
    period: "/mo",
    description: "For power users and small teams who need cloud execution, advanced workflows, and unlimited scale.",
    features: [
      { text: "Everything in Starter, plus:", included: true },
      { text: "Unlimited concurrent agents", included: true },
      { text: "Memory graph — unlimited entities", included: true },
      { text: "50 GB file storage", included: true },
      { text: "Unlimited tool connections", included: true },
      { text: "Cloud execution — agents run 24/7", included: true },
      { text: "Scheduled workflows & triggers", included: true },
      { text: "Team workspaces (coming soon)", included: true },
      { text: "Priority support", included: true },
    ],
    highlighted: true,
    cta: "Join Waitlist",
  },
] as const;

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted,
  cta,
}: (typeof PLANS)[number]) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-8",
        highlighted
          ? "border-accent/40 bg-accent/5 shadow-glow-accent"
          : "border-glass-stroke bg-glass-fill backdrop-blur-glass",
      )}
      data-testid={`pricing-${name.toLowerCase()}`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-white shadow-glow-accent-sm">
          Most Popular
        </div>
      )}
      <h3 className="mb-1 text-xl font-semibold text-primary">{name}</h3>
      <p className="mb-6 text-sm text-secondary">{description}</p>
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-primary">&euro;{price}</span>
        <span className="text-sm text-muted">{period}</span>
      </div>
      <a
        href="#waitlist"
        className={cn(
          "mb-8 flex h-12 items-center justify-center rounded-xl text-sm font-semibold transition-all hover:brightness-110",
          highlighted
            ? "bg-accent text-white shadow-glow-accent"
            : "border border-glass-stroke bg-glass-fill-heavy text-primary backdrop-blur-glass hover:border-glass-stroke-light",
        )}
        data-testid={`pricing-${name.toLowerCase()}-cta`}
      >
        {cta}
      </a>
      <ul className="flex flex-col gap-3">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5">
            <Icons.Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span className="text-sm text-secondary">{f.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CostBreakdown() {
  return (
    <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-glass-stroke bg-glass-fill p-8 backdrop-blur-glass" data-testid="cost-breakdown">
      <h3 className="mb-4 text-center text-lg font-semibold text-primary">
        Where the costs come from
      </h3>
      <p className="mb-6 text-center text-sm text-secondary">
        Denker charges for the workspace layer — not the AI. Your Claude subscription powers the intelligence.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2 rounded-xl bg-glass-fill-heavy p-4">
          <Icons.Brain className="h-5 w-5 text-purple-400" />
          <span className="text-xs font-medium text-primary">Memory &amp; Storage</span>
          <span className="text-center text-[10px] text-secondary">
            Knowledge graph, pgvector embeddings, file storage
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl bg-glass-fill-heavy p-4">
          <Icons.Cloud className="h-5 w-5 text-blue-400" />
          <span className="text-xs font-medium text-primary">Cloud Execution</span>
          <span className="text-center text-[10px] text-secondary">
            Always-on agents, scheduled workflows, background tasks
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl bg-glass-fill-heavy p-4">
          <Icons.Plug className="h-5 w-5 text-pink-400" />
          <span className="text-xs font-medium text-primary">Tool Connections</span>
          <span className="text-center text-[10px] text-secondary">
            OAuth management, API relaying, webhook infrastructure
          </span>
        </div>
      </div>
    </div>
  );
}

export function LandingPricing() {
  return (
    <section id="pricing" className="relative bg-canvas px-6 py-24 lg:px-12" data-testid="landing-pricing">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-stroke bg-glass-fill px-3 py-1 backdrop-blur-glass">
          <Icons.CreditCard className="h-3 w-3 text-accent" />
          <span className="text-xs text-secondary">Simple pricing</span>
        </div>
        <h2
          className="mb-4 text-3xl font-bold tracking-tight text-primary lg:text-4xl"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
          data-testid="pricing-heading"
        >
          Pay for the workspace,{" "}
          <span className="text-accent">not the AI</span>
        </h2>
        <p className="text-base text-secondary">
          Your Claude subscription powers the intelligence. Denker provides the canvas, memory, workflows, and connections.
        </p>
      </div>
      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>
      <CostBreakdown />
    </section>
  );
}
