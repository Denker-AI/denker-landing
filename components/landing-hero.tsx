import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";
import { WaitlistForm } from "@/components/waitlist-form";

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
        <div className="flex flex-col overflow-hidden rounded-frame border border-glass-stroke bg-glass-fill shadow-frame backdrop-blur-glass">
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
    <div className="flex items-center gap-1">
      <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
        <path d="M1 1L11 8L5 9L3 15L1 1Z" fill={color} stroke={color} strokeWidth="0.5" />
      </svg>
      <span
        className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
        style={{ backgroundColor: color }}
      >
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
      {/* Left column */}
      <FloatingFrame title="Market Research" color="bg-frame-search" status="Aria" style={{ top: "15%", left: "2%", width: 178 }} delay={0.3}>
        <SkeletonLines count={3} widths={[100, 80, 55]} />
      </FloatingFrame>

      <div className="hidden md:block">
        <FloatingFrame title="Outreach Draft" color="bg-frame-email" status="Mia" style={{ top: "42%", left: "1%", width: 172 }} delay={0.7}>
          <SkeletonLines count={4} widths={[100, 90, 100, 60]} />
        </FloatingFrame>
      </div>

      <FloatingFrame title="Competitor Analysis" color="bg-frame-search" status="Nova" style={{ bottom: "14%", left: "6%", width: 182 }} delay={1.1}>
        <SkeletonLines count={3} widths={[85, 100, 70]} />
      </FloatingFrame>

      {/* Right column */}
      <FloatingFrame title="Feature Build" color="bg-frame-code" status="Kai" style={{ top: "13%", right: "4%", width: 170 }} delay={0.5}>
        <SkeletonLines count={3} widths={[70, 100, 85]} />
      </FloatingFrame>

      <div className="hidden md:block">
        <FloatingFrame title="Newsletter" color="bg-frame-email" status="Mia" style={{ top: "40%", right: "2%", width: 165 }} delay={0.9}>
          <SkeletonLines count={3} widths={[100, 75, 90]} />
        </FloatingFrame>
      </div>

      <FloatingFrame title="Deploy Pipeline" color="bg-frame-workflow" status="running" style={{ bottom: "10%", right: "3%", width: 162 }} delay={1.3}>
        <WorkflowDots />
      </FloatingFrame>

      {/* Agent cursors — 4 agents drifting */}
      <div className="absolute" style={{ top: "30%", left: "19%", animation: "hero-fade-in 0.5s ease 1.6s both" }}>
        <div style={{ animation: "hero-drift-1 9s ease-in-out 0s infinite" }}>
          <CursorLabel name="Aria" color="#A78BFA" />
        </div>
      </div>
      <div className="absolute" style={{ top: "26%", right: "13%", animation: "hero-fade-in 0.5s ease 1.9s both" }}>
        <div style={{ animation: "hero-drift-2 8s ease-in-out 0.5s infinite" }}>
          <CursorLabel name="Kai" color="#60A5FA" />
        </div>
      </div>
      <div className="absolute hidden md:block" style={{ top: "55%", left: "22%", animation: "hero-fade-in 0.5s ease 2.2s both" }}>
        <div style={{ animation: "hero-drift-3 10s ease-in-out 1s infinite" }}>
          <CursorLabel name="Mia" color="#F472B6" />
        </div>
      </div>
      <div className="absolute hidden md:block" style={{ top: "60%", right: "20%", animation: "hero-fade-in 0.5s ease 2.5s both" }}>
        <div style={{ animation: "hero-drift-4 11s ease-in-out 2s infinite" }}>
          <CursorLabel name="Nova" color="#34D399" />
        </div>
      </div>
    </div>
  );
}

/* ── Hero section ─────────────────────────────────────────────── */

export function LandingHero() {
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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-stroke bg-glass-fill px-4 py-1.5 backdrop-blur-glass"
          data-testid="hero-badge"
        >
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span className="text-xs text-secondary">Your agents are standing by</span>
        </div>

        <h1
          className="text-section-heading mb-6 max-w-3xl"
          data-testid="hero-heading"
        >
          Your AI team executes.{" "}
          <span className="text-accent">You decide what&apos;s next.</span>
        </h1>

        <p className="mb-10 max-w-xl text-base text-secondary sm:text-lg" data-testid="hero-subheading">
          Research, writing, code, outreach — your agents run it all in parallel.
          Visible at every step. Yours to direct.
        </p>

        <div className="relative w-full max-w-md">
          <WaitlistForm />
        </div>

        <p className="mt-4 text-xs text-muted" data-testid="hero-note">
          Free early access. No credit card required.
        </p>

        <a
          href="#features"
          className="absolute bottom-8 flex flex-col items-center gap-2 transition-opacity hover:opacity-100"
          style={{ opacity: 0.75 }}
          aria-label="Scroll to explore"
        >
          <span className="text-xs font-medium text-secondary">Scroll to explore</span>
          <Icons.ChevronDown className="h-5 w-5 animate-bounce text-secondary" />
        </a>
      </div>

    </section>
  );
}
