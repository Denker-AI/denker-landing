"use client";

import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";
import { useExperiment } from "@/hooks/use-experiment";
import { CtaGateDialog, useCtaGate } from "@/components/cta-gate-dialog";
import { LandingGlassSurface } from "@/components/landing-glass-surface";
import { HERO_COPY, type HeroVariant } from "@/lib/hero-copy";

/* Variant-b's accent phrase is short — keep it on one line. */
const HEADING_ACCENT_CLASS: Record<HeroVariant, string> = {
  control: "landing-login-accent",
  "variant-b": "landing-login-accent whitespace-nowrap",
  "variant-c": "landing-login-accent",
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
        <LandingGlassSurface
          borderRadius={13}
          className="landing-liquid-panel"
          data-testid={`hero-floating-frame-${title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <div className="flex flex-col overflow-hidden rounded-[13px]">
            <div className="flex items-center gap-1.5 border-b border-glass-stroke-faint px-2 py-1.5">
              <div className={cn("h-1.5 w-1.5 rounded-full", color)} />
              <span className="truncate text-canvas-sm font-medium text-primary">
                {title}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <span className="text-canvas-2xs text-muted">{status}</span>
              </div>
            </div>
            <div className="p-2">{children}</div>
          </div>
        </LandingGlassSurface>
      </div>
    </div>
  );
}

function CursorLabel({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
        <path d="M1 1L9 7L4.5 7.8L2.5 13L1 1Z" fill={color} />
      </svg>
      <span className="text-[11px] font-semibold tracking-wide" style={{ color }}>
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

function WorkflowDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="h-2 w-2 animate-pulse rounded-full bg-frame-workflow" />
      <div className="h-px w-4 rounded bg-glass-fill-heavy" />
      <div className="h-2 w-2 rounded-full border border-glass-stroke" />
      <div className="h-px w-4 rounded bg-glass-fill-heavy" />
      <div className="h-2 w-2 rounded-full border border-glass-stroke" />
    </div>
  );
}

function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* ── Top: Market Research + Aria (all screens) ── */}
      <FloatingFrame title="Market Research" color="bg-frame-search" status="Researcher" style={{ top: "15%", left: "2%", width: 178 }} delay={0.3}>
        <SkeletonLines count={3} widths={[100, 80, 55]} />
      </FloatingFrame>
      <div className="absolute" style={{ top: "22%", left: "10%", animation: "hero-fade-in 0.5s ease 1.6s both" }}>
        <div style={{ animation: "hero-drift-1 9s ease-in-out 0s infinite" }}>
          <CursorLabel name="Researcher" color="#60A5FA" />
        </div>
      </div>

      {/* ── Bottom: Deploy Pipeline + Kai (mobile only) ── */}
      <div className="md:hidden">
        <FloatingFrame title="Deploy Pipeline" color="bg-frame-workflow" status="running" style={{ bottom: "12%", right: "3%", width: 162 }} delay={0.9}>
          <WorkflowDots />
        </FloatingFrame>
      </div>
      <div className="absolute md:hidden" style={{ bottom: "22%", right: "18%", animation: "hero-fade-in 0.5s ease 1.9s both" }}>
        <div style={{ animation: "hero-drift-2 8s ease-in-out 0.5s infinite" }}>
          <CursorLabel name="Coder" color="#EF4444" />
        </div>
      </div>

      {/* ── Desktop-only frames ── */}
      <div className="hidden md:block">
        <FloatingFrame title="Outreach Draft" color="bg-frame-email" status="Writer" style={{ top: "42%", left: "1%", width: 172 }} delay={0.7}>
          <SkeletonLines count={4} widths={[100, 90, 100, 60]} />
        </FloatingFrame>
      </div>
      <div className="hidden md:block">
        <FloatingFrame title="Competitor Analysis" color="bg-frame-search" status="Analyst" style={{ bottom: "14%", left: "6%", width: 182 }} delay={1.1}>
          <SkeletonLines count={3} widths={[85, 100, 70]} />
        </FloatingFrame>
      </div>
      <div className="hidden md:block">
        <FloatingFrame title="Feature Build" color="bg-frame-code" status="Coder" style={{ top: "13%", right: "4%", width: 170 }} delay={0.5}>
          <SkeletonLines count={3} widths={[70, 100, 85]} />
        </FloatingFrame>
      </div>
      <div className="hidden md:block">
        <FloatingFrame title="Newsletter" color="bg-frame-email" status="Writer" style={{ top: "40%", right: "2%", width: 165 }} delay={0.9}>
          <SkeletonLines count={3} widths={[100, 75, 90]} />
        </FloatingFrame>
      </div>
      <div className="hidden md:block">
        <FloatingFrame title="Deploy Pipeline" color="bg-frame-workflow" status="running" style={{ bottom: "10%", right: "3%", width: 162 }} delay={1.3}>
          <WorkflowDots />
        </FloatingFrame>
      </div>

      {/* ── Desktop-only cursors ── */}
      <div className="absolute hidden md:block" style={{ top: "26%", right: "13%", animation: "hero-fade-in 0.5s ease 1.9s both" }}>
        <div style={{ animation: "hero-drift-2 8s ease-in-out 0.5s infinite" }}>
          <CursorLabel name="Coder" color="#EF4444" />
        </div>
      </div>
      <div className="absolute hidden lg:block" style={{ top: "55%", left: "22%", animation: "hero-fade-in 0.5s ease 2.2s both" }}>
        <div style={{ animation: "hero-drift-3 10s ease-in-out 1s infinite" }}>
          <CursorLabel name="Writer" color="#A78BFA" />
        </div>
      </div>
      <div className="absolute hidden lg:block" style={{ top: "60%", right: "20%", animation: "hero-fade-in 0.5s ease 2.5s both" }}>
        <div style={{ animation: "hero-drift-4 11s ease-in-out 2s infinite" }}>
          <CursorLabel name="Analyst" color="#F59E0B" />
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
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 45% 30% at 50% 38%, rgba(255,255,255,0.1), transparent 72%)",
        }}
      />

      <HeroCanvas />

      <div className="relative z-10 flex h-screen flex-col items-center px-6 pt-24 text-center">
        {/* Spacer — pushes heading group to ~40% on mobile, centers on desktop */}
        <div className="flex-1 min-h-12 md:min-h-0" />
        <h1
          className="landing-readable-text text-section-heading mb-6 max-w-3xl text-balance"
          data-testid="hero-heading"
        >
          {copy.headingPrefix}{" "}
          <span className={accentClass}>{copy.headingAccent}</span>
        </h1>

        <p className="landing-readable-secondary max-w-xl text-base text-balance sm:text-lg" data-testid="hero-subheading">
          {copy.subheading}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3" data-testid="hero-cta-group">
          <button
            type="button"
            onClick={openGate}
            className="landing-liquid-button inline-flex h-12 items-center justify-center rounded-full bg-white/[0.92] px-8 text-sm font-bold text-[#120814] transition-opacity hover:opacity-85"
            data-testid="hero-cta-button"
          >
            {copy.cta}
          </button>
          <p className="landing-readable-secondary text-xs" data-testid="hero-cta-note">
            Free · No credit card
          </p>
        </div>

        {/* Spacer — pushes form lower on mobile */}
        <div className="flex-[1.6] min-h-16 md:flex-1 md:min-h-0" />

        <a
          href="#features"
          className="landing-readable-secondary flex flex-col items-center gap-2 pb-8 transition-opacity hover:opacity-100"
          style={{ opacity: 0.75 }}
          aria-label="Scroll to explore"
          data-testid="hero-scroll-link"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <Icons.ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </div>

      <CtaGateDialog open={open} onClose={closeGate} />
    </section>
  );
}
