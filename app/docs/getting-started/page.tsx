import type { Metadata } from "next";
import Link from "next/link";
import { DocsNav } from "@/components/docs-sidebar";
import { DocsImage } from "@/components/docs-lightbox";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { webAppAuthUrls } from "@/lib/web-app-auth";

export const metadata: Metadata = {
  title: "Getting Started",
  description: "Set up Denker and send your first prompt in under 5 minutes.",
  alternates: { canonical: "/docs/getting-started" },
  openGraph: {
    title: "Getting Started — Denker",
    description: "Set up Denker and send your first prompt in under 5 minutes.",
    url: "https://www.denker.ai/docs/getting-started",
    type: "article",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function GettingStartedPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-32 pt-32 sm:px-6">
      <DocsNav />

      <div className="mb-32 pt-8 sm:pt-12">
        <h1
          className="mb-6 font-satoshi text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl"
          data-testid="getting-started-heading"
        >
          Up and running in <span className="text-accent">5 minutes</span>
        </h1>

        <p className="text-lg leading-relaxed text-secondary">
        From sign-up to your first AI-powered task on the canvas.
        You&apos;ll need one of these AI CLI subscriptions — Denker
        uses your own subscription for AI, which is much cheaper than
        platform pricing.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://claude.ai/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Claude Code &rarr;
          </a>
          <a
            href="https://openai.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Codex &rarr;
          </a>
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            OpenCode &rarr;
          </a>
        </div>
      </div>

      {/* Step 1 */}
      <section className="mb-28">
        <p className="text-section-label mb-3 text-accent">Step 1</p>
        <h2 className="mb-5 font-satoshi text-2xl font-bold text-primary sm:text-3xl">
          Create your workspace
        </h2>
        <p className="mb-8 text-base leading-relaxed text-secondary">
          Sign up at{" "}
          <a
            href={webAppAuthUrls.desktopRegister}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/80"
          >
            space.denker.ai
          </a>
          . You&apos;ll land on your canvas with a welcome guide, an intro
          video, and your agent team already set up.
        </p>
        <DocsImage
          src="/docs/onboarding-canvas.png"
          alt="Denker onboarding canvas with welcome guide, intro video, and agent team"
          width={1400}
          height={900}
          testId="img-onboarding-canvas"
        />
      </section>

      {/* Step 2 */}
      <section className="mb-28">
        <p className="text-section-label mb-3 text-accent">Step 2</p>
        <h2 className="mb-5 font-satoshi text-2xl font-bold text-primary sm:text-3xl">
          Connect the Companion
        </h2>
        <p className="mb-8 text-base leading-relaxed text-secondary">
          The Companion connects your AI CLI (Claude Code, Codex, or OpenCode)
          on your machine to your Denker workspace. A setup wizard guides
          you — copy the install command and paste it into your terminal.
        </p>
        <DocsImage
          src="/docs/companion-install.png"
          alt="Companion install wizard"
          width={1400}
          height={900}
          testId="img-companion-install"
        />
        <div className="mt-6" />
        <DocsImage
          src="/docs/companion-terminal.png"
          alt="Terminal showing the Companion running"
          width={1200}
          height={750}
          testId="img-companion-terminal"
        />
        <p className="mt-8 text-base text-secondary">
          Once installed, it runs in the background and starts on login.
          A <span className="inline-block h-2 w-2 translate-y-[-1px] rounded-full bg-accent align-middle" /> green
          dot appears when connected.
        </p>
      </section>

      {/* Step 3 */}
      <section className="mb-28">
        <p className="text-section-label mb-3 text-accent">Step 3</p>
        <h2 className="mb-5 font-satoshi text-2xl font-bold text-primary sm:text-3xl">
          Ask Denker your first question
        </h2>
        <p className="text-base leading-relaxed text-secondary">
          Type a task in the input bar —{" "}
          <em className="text-primary">
            &quot;Research the latest trends in AI agents&quot;
          </em>
          . Your agent picks it up and frames appear on the canvas as it works.
        </p>
      </section>

      {/* Q&A */}
      <section className="mb-28">
        <h2 className="mb-10 font-satoshi text-2xl font-bold text-primary sm:text-3xl">
          Common questions
        </h2>

        <div className="space-y-12">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-primary">
              Which AI CLIs are supported?
            </h3>
            <p className="text-base leading-relaxed text-secondary">
              Denker provides the workspace — your AI CLI provides the
              intelligence. We currently support{" "}
              <strong className="text-primary">Claude Code</strong>,{" "}
              <strong className="text-primary">Codex</strong> (OpenAI), and{" "}
              <strong className="text-primary">OpenCode</strong>. Pick the best
              model for each agent, or mix and match. Your own subscription
              covers token costs — much cheaper than paying per-token.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-primary">Claude Code</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href="https://docs.anthropic.com/en/docs/claude-code/getting-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/80"
                  >
                    Install guide &rarr;
                  </a>
                  <a
                    href="https://claude.ai/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/80"
                  >
                    Get subscription &rarr;
                  </a>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-primary">Codex (OpenAI)</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href="https://github.com/openai/codex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/80"
                  >
                    Install guide &rarr;
                  </a>
                  <a
                    href="https://openai.com/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/80"
                  >
                    Get subscription &rarr;
                  </a>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-primary">OpenCode</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href="https://github.com/nichochar/opencode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/80"
                  >
                    Install guide &rarr;
                  </a>
                  <a
                    href="https://openrouter.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/80"
                  >
                    Get API key &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-primary">
              What is the Companion?
            </h3>
            <p className="text-base leading-relaxed text-secondary">
              A lightweight local process that bridges your AI CLI to Denker.
              When you send a prompt, it spawns a session and streams results to
              your canvas in real time. It auto-detects which CLIs you have
              installed.
            </p>
          </div>
        </div>
      </section>

      {/* Next */}
      <div className="flex items-center justify-between border-t border-glass-stroke-subtle pt-10">
        <span />
        <Link
          href="/docs/how-denker-works"
          className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
        >
          Next: How Denker Works &rarr;
        </Link>
      </div>
    </main>
  );
}
