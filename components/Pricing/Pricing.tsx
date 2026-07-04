"use client";

import { Check, Info } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { LOGIN_URL } from "@/lib/links";

const freeFeatures = ["2 projects", "5 spaces", "Basic memory", "Community support"];
const proFeatures = [
  "Everything in Free, plus",
  "Unlimited projects",
  "Unlimited spaces",
  "Knowledge graph memory",
  "Priority support",
];
const maxFeatures = [
  "Everything in Pro, plus",
  "24/7 cloud execution",
  "Unlimited memory",
  "Beta features",
];

const cliChips = [
  { label: "Claude Code", icon: "/logos/claude-logo.svg" },
  { label: "Codex", icon: "/logos/codex-color.svg" },
  { label: "OpenCode", icon: "/logos/opencode.svg" },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="flex w-full scroll-mt-28 flex-col items-center gap-20 bg-grey-950 px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - Pricing"
      data-theme="dark"
    >
      <Container className="flex flex-col items-center gap-20">
      <div className="flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 text-white">
          <BlurText
            as="h2"
            className="font-heading text-3xl font-bold md:text-[40px] md:leading-[48px]"
            text="More progress. One workspace."
          />
          <FadeIn as="p" delay={0.1} className="font-heading text-xl font-medium text-white">
            Start free. Pay for what your agents actually need.
          </FadeIn>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-heading text-xl font-medium text-white">Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((v) => !v)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ease-in-out ${
              yearly ? "bg-primary-600" : "bg-grey-700"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                yearly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="font-heading text-xl font-medium text-white">Yearly</span>
        </div>
      </div>

      <FadeIn delay={0.2} className="pricing-grid w-full">
        {/* Free */}
        <div className="flex flex-col gap-8 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] border border-grey-800 bg-grey-900 p-8">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-heading text-sm font-medium text-grey-500">FREE</p>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-white">€0</span>
                <span className="font-body text-base text-grey-500">/forever</span>
              </div>
            </div>
            <p className="font-body text-base text-grey-500">
              Try the desktop app. No credit card needed.
            </p>
            <div className="h-px w-full bg-grey-800" />
            <ul className="flex flex-col gap-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 font-body text-base text-white">
                  <Check className="size-6 shrink-0 text-primary-400" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 rounded-xl bg-grey-950 p-3">
              <Info className="size-6 shrink-0 text-grey-500" />
              <p className="font-body text-base text-white">
                AI tokens not included — requires your own CLI subscription
                (Claude Code, Codex, or OpenCode)
              </p>
            </div>
          </div>
          <a
            href={LOGIN_URL}
            className="flex h-12 w-full items-center justify-center rounded-full border border-grey-700 bg-grey-900 font-body text-lg font-medium text-white transition-colors hover:bg-grey-800"
          >
            Get Started
          </a>
        </div>

        {/* Pro */}
        <div className="relative flex flex-col gap-8 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-primary-400 via-primary-600 to-primary-600 p-8">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-400 bg-grey-900 px-4 py-2 font-heading text-sm font-medium text-white">
            <span className="align-middle text-[8px]">●</span> Most Popular{" "}
            <span className="align-middle text-[8px]">●</span>
          </span>
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-3 text-white">
              <p className="font-heading text-sm font-medium">PRO</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold">
                    {yearly ? "€199" : "€19"}
                  </span>
                  <span className="font-body text-base">
                    {yearly ? "/ year" : "/ month"}
                  </span>
                </div>
                {yearly && (
                  <span className="font-body text-sm text-white/80">
                    ≈ €17/mo · 2 months free
                  </span>
                )}
              </div>
            </div>
            <p className="font-body text-base text-white">
              Your full team. Unlimited projects. Persistent memory.
            </p>
            <div className="h-px w-full bg-white/30" />
            <ul className="flex flex-col gap-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 font-body text-base text-white">
                  <Check className="size-6 shrink-0 text-white" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={LOGIN_URL}
            className="flex h-12 w-full items-center justify-center rounded-full bg-white font-body text-lg font-medium text-grey-950 transition-colors hover:bg-grey-50"
          >
            Get Started
          </a>
        </div>

        {/* Max */}
        <div className="pricing-max relative flex flex-col gap-8 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] border border-grey-800 bg-grey-900 p-8">
          <span className="absolute right-5 top-5 rounded-full bg-primary-600 px-4 py-2 font-heading text-sm font-medium text-grey-100">
            Coming Soon
          </span>
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-heading text-sm font-medium text-grey-500">MAX</p>
              <span className="font-heading text-4xl font-bold text-white">TBD</span>
            </div>
            <p className="font-body text-base text-grey-500">
              Cloud execution with persistent agents. Coming soon.
            </p>
            <div className="h-px w-full bg-grey-800" />
            <ul className="flex flex-col gap-3">
              {maxFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 font-body text-base text-white">
                  <Check className="size-6 shrink-0 text-primary-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <button
            disabled
            className="h-12 w-full rounded-full border border-grey-700 bg-grey-900 font-body text-lg font-medium text-white opacity-70"
          >
            Coming Soon
          </button>
        </div>
      </FadeIn>

      <div className="flex w-full flex-col items-center gap-6">
        <p className="text-center font-heading text-sm font-medium text-grey-500">
          POWERED BY YOUR CLI SUBSCRIPTION
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {cliChips.map((chip) => (
            <span
              key={chip.label}
              className="flex items-center gap-2 rounded-full bg-grey-900 px-4 py-2 font-heading text-sm font-medium text-white"
            >
              {chip.icon ? (
                <img src={chip.icon} alt="" className="size-5" />
              ) : (
                <span className="size-2 rounded-full bg-primary-400" />
              )}
              {chip.label}
            </span>
          ))}
          <span className="flex items-center gap-2 rounded-full bg-grey-900 px-4 py-2 font-heading text-sm font-medium text-grey-500">
            <img src="/logos/openrouter.svg" alt="" className="size-5 opacity-50" />
            OpenRouter
            <span className="rounded-full bg-primary-800/40 px-2 py-0.5 font-heading text-xs font-medium text-primary-400/70">
              Coming Soon
            </span>
          </span>
        </div>
        <p className="text-center font-heading text-sm font-medium text-grey-500">
          All plans include the canvas, real-time agent visibility, and tool
          connections. Cancel anytime.
        </p>
      </div>
      </Container>
    </section>
  );
}
