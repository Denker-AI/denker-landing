import type { Metadata } from "next";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Everything you need to get started with Denker — guides, concepts, and reference.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Documentation — Denker",
    description: "Everything you need to get started with Denker — guides, concepts, and reference.",
    url: "https://www.denker.ai/docs",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const DOCS_CARDS = [
  {
    href: "/docs/getting-started",
    icon: Icons.Zap,
    title: "Getting Started",
    description:
      "Set up Denker and send your first prompt in under 5 minutes.",
    accent: "text-accent",
    bg: "bg-accent/10",
  },
  {
    href: "/docs/how-denker-works",
    icon: Icons.Layers,
    title: "How Denker Works",
    description:
      "Understand the canvas, frames, agents, and what makes Denker different.",
    accent: "text-frame-workflow",
    bg: "bg-[rgba(255,149,0,0.1)]",
  },
  {
    href: "/docs/integrations",
    icon: Icons.Plug,
    title: "Integrations",
    description: "Connect apps and see how agents render results as different frame types.",
    accent: "text-frame-search",
    bg: "bg-[rgba(191,90,242,0.1)]",
  },
  {
    href: "#",
    icon: Icons.GitBranch,
    title: "Workflows",
    description: "Automate multi-step processes with scheduled agents.",
    accent: "text-frame-code",
    bg: "bg-[rgba(10,132,255,0.1)]",
    comingSoon: true,
  },
];

export default function DocsHubPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-32 pt-32 sm:px-6">
      <div className="mb-14 text-center">
        <span className="badge-section mb-4 inline-flex">Docs</span>
        <h1 className="text-section-heading mb-4" data-testid="docs-heading">
          Documentation
        </h1>
        <p className="mx-auto max-w-xl text-base text-secondary sm:text-lg">
          Everything you need to get started with Denker.
        </p>
      </div>

      <div
        className="grid gap-5 sm:grid-cols-2"
        data-testid="docs-card-grid"
      >
        {DOCS_CARDS.map((card) => {
          const Icon = card.icon;
          const sharedClassName = `group relative rounded-2xl border border-glass-stroke bg-glass-fill p-7 backdrop-blur-glass transition-all ${
            card.comingSoon
              ? "cursor-default opacity-50"
              : "hover:border-glass-stroke-light hover:shadow-glass"
          }`;
          const testId = `docs-card-${card.title.toLowerCase().replace(/\s+/g, "-")}`;

          const content = (
            <>
              {card.comingSoon && (
                <span className="absolute right-4 top-4 rounded-full bg-glass-fill-heavy px-2.5 py-0.5 text-xs font-medium text-muted">
                  Coming soon
                </span>
              )}
              <div
                className={cn(
                  "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
                  card.bg
                )}
              >
                <Icon className={cn("h-5 w-5", card.accent)} />
              </div>
              <h2 className="mb-1.5 font-satoshi text-lg font-bold text-primary">
                {card.title}
              </h2>
              <p className="text-sm leading-relaxed text-secondary">
                {card.description}
              </p>
            </>
          );

          if (card.comingSoon) {
            return (
              <div key={card.title} className={sharedClassName} data-testid={testId}>
                {content}
              </div>
            );
          }

          return (
            <Link key={card.title} href={card.href} className={sharedClassName} data-testid={testId}>
              {content}
            </Link>
          );
        })}
      </div>
    </main>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
