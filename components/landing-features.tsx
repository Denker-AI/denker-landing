import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";

const FEATURES = [
  {
    icon: Icons.Layers,
    title: "Visual Canvas Workspace",
    description:
      "Everything lives on an infinite canvas — research, code, emails, workflows, data charts. Drag, resize, and arrange frames spatially instead of switching tabs.",
    accent: "text-accent",
    glow: "#30D158",
  },
  {
    icon: Icons.Bot,
    title: "AI Agents as First-Class Members",
    description:
      "Agents have names, avatars, and visible cursors. Watch them research, write, and code in real time. Invite multiple agents to work in parallel.",
    accent: "text-blue-400",
    glow: "#60A5FA",
  },
  {
    icon: Icons.Brain,
    title: "Memory That Actually Works",
    description:
      "Structured knowledge graph, not flat-file RAG. Agents build and query memory as they work — entities, relationships, and provenance, all stored in PostgreSQL with pgvector.",
    accent: "text-purple-400",
    glow: "#A78BFA",
  },
  {
    icon: Icons.Zap,
    title: "Workflow Automation",
    description:
      "Describe workflows in natural language. Agents plan and execute multi-step pipelines with approvals, conditionals, and parallel branches — no JSON configs.",
    accent: "text-amber-400",
    glow: "#FBBF24",
  },
  {
    icon: Icons.Plug,
    title: "One-Click Tool Connections",
    description:
      "Connect Gmail, Slack, LinkedIn, GitHub, and more with OAuth. Agents use your tools on your behalf — no code, no API keys, no page-jumping.",
    accent: "text-pink-400",
    glow: "#F472B6",
  },
  {
    icon: Icons.Eye,
    title: "Full Transparency",
    description:
      "Every agent sub-step is visible: thinking, text generation, tool calls, results. No black boxes. Review, approve, or redirect at any point.",
    accent: "text-cyan-400",
    glow: "#22D3EE",
  },
] as const;

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
  glow,
}: (typeof FEATURES)[number]) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-glass-stroke bg-glass-fill p-6",
        "backdrop-blur-glass transition-all hover:border-glass-stroke-light hover:shadow-glass",
      )}
      data-testid={`feature-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className="pointer-events-none absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ background: glow }}
        aria-hidden="true"
      />
      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-glass-fill-heavy", accent)}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-secondary">{description}</p>
    </div>
  );
}

export function LandingFeatures() {
  return (
    <section id="features" className="relative bg-canvas px-6 py-24 lg:px-12" data-testid="landing-features">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-stroke bg-glass-fill px-3 py-1 backdrop-blur-glass">
          <Icons.Zap className="h-3 w-3 text-accent" />
          <span className="text-xs text-secondary">Capabilities</span>
        </div>
        <h2
          className="mb-4 text-3xl font-bold tracking-tight text-primary lg:text-4xl"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
          data-testid="features-heading"
        >
          Everything agents need,{" "}
          <span className="text-accent">made visible</span>
        </h2>
        <p className="text-base text-secondary" data-testid="features-subheading">
          Stop staring at spinners. Denker makes every step of agent work transparent,
          controllable, and collaborative.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
