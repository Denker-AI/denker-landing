import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";
import { DenkerLogo } from "@/components/denker-logo";
import { WaitlistForm } from "@/components/waitlist-form";
import { ThemeToggle } from "@/components/theme-toggle";

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

function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #0A84FF, transparent 70%)" }}
      />

      {/* Top frames — pushed down to clear the nav bar */}
      <FloatingFrame title="Market Research" color="bg-frame-search" status="Aria" style={{ top: "15%", left: "3%", width: 180 }} delay={0.3}>
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded bg-glass-fill-heavy" />
          <div className="h-1.5 w-4/5 rounded bg-glass-fill-heavy" />
          <div className="h-1.5 w-3/5 rounded bg-glass-fill-heavy" />
        </div>
      </FloatingFrame>

      <FloatingFrame title="API Client" color="bg-frame-code" status="Kai" style={{ top: "13%", right: "5%", width: 170 }} delay={0.6}>
        <div className="space-y-0.5 font-mono">
          <p className="text-[8px] text-blue-300">const <span className="text-gray-300">client = </span><span className="text-green-300">new</span></p>
          <p className="text-[8px] text-yellow-200">  DenkerClient<span className="text-gray-300">(key);</span></p>
        </div>
      </FloatingFrame>

      <FloatingFrame title="Newsletter Draft" color="bg-frame-email" status="Mia" style={{ bottom: "15%", left: "8%", width: 180 }} delay={0.9}>
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded bg-glass-fill-heavy" />
          <div className="h-1.5 w-full rounded bg-glass-fill-heavy" />
          <div className="h-1.5 w-2/3 rounded bg-glass-fill-heavy" />
        </div>
      </FloatingFrame>

      <FloatingFrame title="Deploy Pipeline" color="bg-frame-workflow" status="running" style={{ bottom: "10%", right: "3%", width: 160 }} delay={1.2}>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <div className="h-1.5 flex-1 rounded bg-glass-fill-heavy" />
        </div>
      </FloatingFrame>

      <div className="absolute" style={{ top: "28%", left: "18%", animation: "hero-fade-in 0.5s ease 1.8s both" }}>
        <div style={{ animation: "hero-drift-1 8s ease-in-out 0s infinite" }}>
          <CursorLabel name="Aria" color="#A78BFA" />
        </div>
      </div>
      <div className="absolute" style={{ top: "25%", right: "12%", animation: "hero-fade-in 0.5s ease 2.1s both" }}>
        <div style={{ animation: "hero-drift-2 8s ease-in-out 1s infinite" }}>
          <CursorLabel name="Kai" color="#60A5FA" />
        </div>
      </div>
    </div>
  );
}

/* ── Hero section ─────────────────────────────────────────────── */

export function LandingHero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-canvas"
      data-testid="landing-hero"
      style={{
        backgroundImage: "radial-gradient(circle, var(--color-canvas-dot) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "var(--gradient-page-overlay)" }}
      />

      <HeroCanvas />

      <nav className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-12" data-testid="landing-nav">
        <DenkerLogo variant="wordmark" height={28} />
        <div className="flex items-center gap-4">
          <a href="#pricing" className="text-sm text-secondary transition-colors hover:text-primary" data-testid="nav-pricing">
            Pricing
          </a>
          <a href="#features" className="text-sm text-secondary transition-colors hover:text-primary" data-testid="nav-features">
            Features
          </a>
          <a
            href="#waitlist"
            className="inline-flex h-[34px] items-center rounded-lg bg-accent px-3.5 text-xs font-medium text-white shadow-glow-accent transition-all hover:brightness-110"
            data-testid="nav-cta"
          >
            Join Waitlist
          </a>
          <ThemeToggle />
        </div>
      </nav>

      <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-stroke bg-glass-fill px-4 py-1.5 backdrop-blur-glass"
          data-testid="hero-badge"
        >
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span className="text-xs text-secondary">Early access coming soon</span>
        </div>

        <h1
          className="mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-primary lg:text-6xl"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
          data-testid="hero-heading"
        >
          Where humans and AI agents{" "}
          <span className="text-accent">co-work visually</span>
        </h1>

        <p className="mb-10 max-w-xl text-lg text-secondary" data-testid="hero-subheading">
          A limitless canvas workspace where your AI agents research, write, code, and automate
          — all visible in real time. No black boxes. No config hell.
        </p>

        <div className="relative w-full max-w-md">
          <WaitlistForm />
        </div>

        <p className="mt-4 text-xs text-muted" data-testid="hero-note">
          Free early access. No credit card required.
        </p>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-muted">Scroll to explore</span>
          <Icons.ChevronDown className="h-4 w-4 animate-bounce text-muted" />
        </div>
      </div>
    </section>
  );
}
