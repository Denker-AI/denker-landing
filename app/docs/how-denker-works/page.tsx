import type { Metadata } from "next";
import Link from "next/link";
import { DocsNav } from "@/components/docs-sidebar";
import { DocsImage } from "@/components/docs-lightbox";

export const metadata: Metadata = {
  title: "How Denker Works",
  description:
    "Understand how Denker's Taskboard enables AI agents to work autonomously.",
  alternates: { canonical: "/docs/how-denker-works" },
};

export default function HowDenkerWorksPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-32 pt-32 sm:px-6">
      <DocsNav />

      <div className="mb-32 pt-8 sm:pt-12">
        <h1
          className="mb-6 font-['Satoshi',sans-serif] text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl"
          data-testid="how-denker-works-heading"
        >
          How Denker <span className="text-accent">Works</span>
        </h1>

        <p className="text-lg leading-relaxed text-secondary">
          You give your agents work. They get it done — autonomously, visibly,
          on a shared canvas.
        </p>
      </div>

      {/* The Taskboard */}
      <section className="mb-28">
        <p className="text-section-label mb-3 text-accent">Core concept</p>
        <h2 className="mb-5 font-['Satoshi',sans-serif] text-2xl font-bold text-primary sm:text-3xl">
          The Taskboard
        </h2>
        <p className="mb-6 text-base leading-relaxed text-secondary">
          At the center of every project is a Kanban board on your canvas. Give
          Denker a task and it breaks it into steps:
        </p>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {["Backlog", "Todo", "In Progress", "Blocked", "In Review", "Done"].map(
            (col, i) => (
              <div key={col} className="flex items-center gap-2">
                <span
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    col === "Done"
                      ? "bg-accent/15 text-accent"
                      : "bg-glass-fill-heavy text-secondary"
                  }`}
                >
                  {col}
                </span>
                {i < 5 && <span className="text-muted">&rarr;</span>}
              </div>
            )
          )}
        </div>
        <DocsImage
          src="/docs/workspace-frames.png"
          alt="Denker workspace with Taskboard"
          width={1400}
          height={900}
          testId="img-taskboard"
        />
      </section>

      {/* Autonomous agents */}
      <section className="mb-28">
        <h2 className="mb-5 font-['Satoshi',sans-serif] text-2xl font-bold text-primary sm:text-3xl">
          Agents pick up tasks on their own
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-secondary">
          <p>
            Your agents don&apos;t wait for your next message. They look at the
            Taskboard, pick up the next task, execute it, and move it to Done.
          </p>
          <p>
            While one agent researches, another writes, another codes. Every
            agent has its own cursor on the canvas. Every output is a frame you
            can inspect.
          </p>
          <p>
            You stay in control — redirect agents, reprioritize, or edit their
            work. But you don&apos;t have to babysit.
          </p>
        </div>
      </section>

      {/* Frames */}
      <section className="mb-28">
        <h2 className="mb-5 font-['Satoshi',sans-serif] text-2xl font-bold text-primary sm:text-3xl">
          Everything is a frame
        </h2>
        <p className="text-base leading-relaxed text-secondary">
          Every piece of agent output appears as a frame on your canvas —
          research summaries, code, emails, search results, workflows. Move
          them, resize them, organize them. No hidden state, no buried chat
          history.
        </p>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-glass-stroke-subtle pt-10">
        <Link
          href="/docs/getting-started"
          className="text-sm text-secondary transition-colors hover:text-primary"
        >
          &larr; Getting Started
        </Link>
        <Link
          href="/docs/integrations"
          className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
        >
          Next: Integrations &rarr;
        </Link>
      </div>
    </main>
  );
}
