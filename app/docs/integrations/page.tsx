import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DocsNav } from "@/components/docs-sidebar";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Connect Gmail, Slack, GitHub, Notion, and 1,000+ more apps via Composio.",
  alternates: { canonical: "/docs/integrations" },
  openGraph: {
    title: "Integrations — Denker",
    description: "Connect Gmail, Slack, GitHub, Notion, and 1,000+ more apps via Composio.",
    url: "https://www.denker.ai/docs/integrations",
    type: "article",
    images: [DEFAULT_OG_IMAGE],
  },
};

const INTEGRATIONS = [
  { name: "Gmail", description: "Send and draft emails" },
  { name: "Slack", description: "Post messages to channels" },
  { name: "GitHub", description: "Create issues and PRs" },
  { name: "Notion", description: "Create and update pages" },
  { name: "Google Calendar", description: "Schedule events" },
  { name: "LinkedIn", description: "Post and manage outreach" },
];

const FRAME_TYPES = [
  { name: "Email", description: "Draft and send emails from the canvas", color: "bg-frame-email" },
  { name: "Search", description: "Web research with sources", color: "bg-frame-search" },
  { name: "Code", description: "Syntax-highlighted code blocks", color: "bg-frame-code" },
  { name: "Markdown", description: "Reports, summaries, articles", color: "bg-accent" },
  { name: "Workflow", description: "Multi-step automated processes", color: "bg-frame-workflow" },
  { name: "Memory", description: "Knowledge graph visualization", color: "bg-accent" },
  { name: "Newsletter", description: "Email templates with recipients", color: "bg-frame-email" },
  { name: "Image", description: "Galleries and diagrams", color: "bg-frame-code" },
  { name: "Connection", description: "One-click OAuth for new services", color: "bg-frame-search" },
];

export default function IntegrationsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-32 pt-32 sm:px-6">
      <DocsNav />

      <div className="mb-32 pt-8 sm:pt-12">
        <h1
          className="mb-6 font-satoshi text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl"
          data-testid="integrations-heading"
        >
          Connect to <span className="text-accent">1,000+ apps</span>
        </h1>

        <p className="text-lg leading-relaxed text-secondary">
          Your agents connect to the tools you already use — powered by{" "}
          <a
            href="https://composio.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/80"
          >
            Composio
          </a>
          .
        </p>
      </div>

      {/* How it works */}
      <section className="mb-28">
        <h2 className="mb-5 font-satoshi text-2xl font-bold text-primary sm:text-3xl">
          How connecting works
        </h2>
        <p className="mb-8 text-base leading-relaxed text-secondary">
          When an agent needs a service, a Connection frame appears on your
          canvas. One click to authorize, and the agent continues where it left
          off. You can also connect apps ahead of time in Settings.
        </p>
        <div className="flex justify-center">
          <div className="w-[180px] overflow-hidden rounded-xl">
            <Image
              src="/docs/connect-gmail.png"
              alt="Connect Gmail frame"
              width={180}
              height={200}
              className="w-full"
              data-testid="img-connect-gmail"
            />
          </div>
        </div>
      </section>

      {/* Popular integrations */}
      <section className="mb-28">
        <h2 className="mb-8 font-satoshi text-2xl font-bold text-primary sm:text-3xl">
          Popular integrations
        </h2>
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {INTEGRATIONS.map((app) => (
            <div key={app.name}>
              <span className="text-base font-semibold text-primary">
                {app.name}
              </span>
              <p className="text-sm text-secondary">{app.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frame types */}
      <section className="mb-28">
        <h2 className="mb-5 font-satoshi text-2xl font-bold text-primary sm:text-3xl">
          What agents produce
        </h2>
        <p className="mb-8 text-base leading-relaxed text-secondary">
          Every piece of work renders as a frame on your canvas.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FRAME_TYPES.map((frame) => (
            <div key={frame.name} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${frame.color}`} />
              <div>
                <p className="text-sm font-medium text-primary">
                  {frame.name}
                </p>
                <p className="text-xs leading-relaxed text-muted">
                  {frame.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-glass-stroke-subtle pt-10">
        <Link
          href="/docs/how-denker-works"
          className="text-sm text-secondary transition-colors hover:text-primary"
        >
          &larr; How Denker Works
        </Link>
        <Link
          href="/docs/getting-started"
          className="text-sm text-secondary transition-colors hover:text-primary"
        >
          Getting Started &rarr;
        </Link>
      </div>
    </main>
  );
}
