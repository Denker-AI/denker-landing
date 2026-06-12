"use client";

import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";
import { useExperiment } from "@/hooks/use-experiment";
import { CtaGateDialog, useCtaGate } from "@/components/cta-gate-dialog";
import { HERO_COPY, type HeroVariant } from "@/lib/hero-copy";

/* Variant-b's accent phrase is short — keep it on one line. */
const HEADING_ACCENT_CLASS: Record<HeroVariant, string> = {
  control: "text-accent",
  "variant-b": "text-accent whitespace-nowrap",
  "variant-c": "text-accent",
};

/* ── Floating frame (background decoration) ──────────────────── */

function FloatingFrame({
  title,
  color,
  status,
  style,
  delay,
  children,
}: {
  title: string;
  color: string;
  status: string;
  style: React.CSSProperties;
  delay: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="absolute"
      style={{ ...style, animation: `hero-fade-in 0.8s ease ${delay}s both` }}
    >
      <div style={{ animation: `hero-float 5s ease-in-out ${delay * 0.5}s infinite` }}>
        <div className="liquid-glass flex flex-col overflow-hidden rounded-frame border border-glass-stroke">
          <div className="flex items-center gap-1.5 border-b border-glass-stroke-faint px-2 py-1.5">
            <div className={cn("h-1.5 w-1.5 rounded-full", color)} />
            <span className="truncate text-canvas-sm font-medium text-primary">{title}</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-canvas-2xs text-muted">{status}</span>
            </div>
          </div>
          <div className="p-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CursorLabel({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="flex items-baseline gap-0.5"
      style={{ "--cursor-color": color } as React.CSSProperties}
    >
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
        <path d="M1 1L9 7L4.5 7.8L2.5 13L1 1Z" fill={color} />
      </svg>
      <span className="label-halo text-[11px] font-semibold tracking-wide text-primary dark:text-[color:var(--cursor-color)]">
        {name}
      </span>
    </div>
  );
}

function SkeletonLines({ count, widths }: { count: number; widths?: number[] }) {
  const defaultWidths = [100, 80, 60, 90, 70];
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded bg-glass-fill-heavy"
          style={{ width: `${(widths?.[i] ?? defaultWidths[i % defaultWidths.length])}%` }}
        />
      ))}
    </div>
  );
}

function TaskBoardMini() {
  const columns = [2, 3, 2];
  return (
    <div className="flex gap-1">
      {columns.map((count, i) => (
        <div key={i} className="flex-1 space-y-1">
          <div className="h-1 w-3/4 rounded bg-glass-fill-heavy" />
          {Array.from({ length: count }).map((_, j) => (
            <div key={j} className="h-3 rounded-sm border border-glass-stroke-faint bg-glass-fill-heavy" />
          ))}
        </div>
      ))}
    </div>
  );
}

function CodeLines() {
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full rounded bg-blue-400/30" />
      <div className="h-1.5 w-4/5 rounded bg-green-400/25" />
      <div className="h-1.5 w-3/5 rounded bg-red-400/25" />
      <div className="h-1.5 w-2/3 rounded bg-purple-400/20" />
    </div>
  );
}

function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* ── Market Research + Researcher (all screens) ── */}
      <FloatingFrame title="Market Research" color="bg-frame-search" status="Researcher" style={{ top: "15%", left: "2%", width: 178 }} delay={0.3}>
        <SkeletonLines count={3} widths={[100, 80, 55]} />
      </FloatingFrame>
      <div className="absolute" style={{ top: "22%", left: "10%", animation: "hero-fade-in 0.5s ease 1.6s both" }}>
        <div style={{ animation: "hero-drift-1 9s ease-in-out 0s infinite" }}>
          <CursorLabel name="Researcher" color="#60A5FA" />
        </div>
      </div>

      {/* ── Bug Fixes + Coder (desktop only — collides with Market Research on mobile) ── */}
      <div className="hidden md:block">
        <FloatingFrame title="Bug Fixes" color="bg-frame-code" status="Coder" style={{ top: "13%", right: "4%", width: 170 }} delay={0.5}>
          <CodeLines />
        </FloatingFrame>
      </div>
      <div className="absolute hidden md:block" style={{ top: "26%", right: "13%", animation: "hero-fade-in 0.5s ease 1.9s both" }}>
        <div style={{ animation: "hero-drift-2 8s ease-in-out 0.5s infinite" }}>
          <CursorLabel name="Coder" color="#EF4444" />
        </div>
      </div>

      {/* ── Task Board (all screens) ── */}
      <FloatingFrame title="Task Board" color="bg-frame-workflow" status="3 agents" style={{ bottom: "12%", right: "3%", width: 182 }} delay={0.9}>
        <TaskBoardMini />
      </FloatingFrame>
      <div className="absolute hidden lg:block" style={{ bottom: "24%", left: "18%", animation: "hero-fade-in 0.5s ease 2.2s both" }}>
        <div style={{ animation: "hero-drift-3 10s ease-in-out 1s infinite" }}>
          <CursorLabel name="Writer" color="#A78BFA" />
        </div>
      </div>
    </div>
  );
}

/* ── Hero section ─────────────────────────────────────────────── */

export function LandingHero() {
  const variant = useExperiment("hero-copy-test");
  const heroVariant = (variant as HeroVariant) ?? "control";
  const copy = HERO_COPY[heroVariant] ?? HERO_COPY.control;
  const accentClass = HEADING_ACCENT_CLASS[heroVariant] ?? HEADING_ACCENT_CLASS.control;
  const { open, openGate, closeGate } = useCtaGate();

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      data-testid="landing-hero"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "var(--gradient-page-overlay)" }}
      />

      <HeroCanvas />

      <div className="relative z-10 flex h-screen flex-col items-center px-6 pt-24 text-center">
        {/* Spacer — pushes heading group to ~40% on mobile, centers on desktop */}
        <div className="flex-1 min-h-12 md:min-h-0" />
        <h1
          className="text-section-heading mb-6 max-w-3xl text-balance"
          data-testid="hero-heading"
        >
          {copy.headingPrefix}{" "}
          <span className={accentClass}>{copy.headingAccent}</span>
        </h1>

        <p className="max-w-xl text-base text-secondary text-balance sm:text-lg" data-testid="hero-subheading">
          {copy.subheading}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3" data-testid="hero-cta-group">
          <button
            type="button"
            onClick={openGate}
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-bold text-canvas transition-opacity hover:opacity-80"
            data-testid="hero-cta-button"
          >
            {copy.cta}
          </button>
          <p className="text-xs text-muted" data-testid="hero-cta-note">
            Free · No credit card
          </p>
        </div>

        {/* Spacer — pushes form lower on mobile */}
        <div className="flex-[1.6] min-h-16 md:flex-1 md:min-h-0" />

        <a
          href="#features"
          className="pb-8 flex flex-col items-center gap-2 transition-opacity hover:opacity-100"
          style={{ opacity: 0.75 }}
          aria-label="Scroll to explore"
        >
          <span className="text-xs font-medium text-secondary">Scroll to explore</span>
          <Icons.ChevronDown className="h-5 w-5 animate-bounce text-secondary" />
        </a>
      </div>

      <CtaGateDialog open={open} onClose={closeGate} />
    </section>
  );
}
