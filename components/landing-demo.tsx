"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";

/* ── Mini frame — mirrors real FrameHeader + content area ─────────── */

function MiniFrame({
  title,
  accentColor,
  icon: Icon,
  agent,
  streaming,
  floatDelay = 0,
  children,
}: {
  title: string;
  accentColor: string;
  icon: React.ElementType;
  agent: string;
  streaming?: boolean;
  floatDelay?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-glass-stroke bg-glass-fill shadow-glass backdrop-blur-glass"
      style={{ animation: `hero-float 5s ease-in-out ${floatDelay}s infinite` }}
    >
      <div className="flex items-center gap-1.5 border-b border-glass-stroke-faint px-2 py-1.5">
        <span className="h-3 w-0.5 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} />
        <Icon className="h-2.5 w-2.5 shrink-0 text-muted" />
        <span className="flex-1 truncate text-[9px] font-semibold text-secondary">{title}</span>
        <span className="text-[7px] text-muted">{agent}</span>
        {streaming && <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent" />}
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

function SkeletonLines({ count, widths }: { count: number; widths?: number[] }) {
  const dw = [100, 80, 60, 90, 70];
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded bg-glass-fill-heavy"
          style={{ width: `${widths?.[i] ?? dw[i % dw.length]}%` }}
        />
      ))}
    </div>
  );
}

function AgentCursor({ name, color }: { name: string; color: string }) {
  return (
    <div className="pointer-events-none flex items-baseline gap-0.5">
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
        <path d="M1 1L9 7L4.5 7.8L2.5 13L1 1Z" fill={color} />
      </svg>
      <span className="text-[11px] font-semibold tracking-wide" style={{ color }}>
        {name}
      </span>
    </div>
  );
}

/* ── Canvas visual ────────────────────────────────────────────────── */

function FramesCanvas({ triggered }: { triggered: boolean }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        height: "min(560px, 70vh)",
        backgroundColor: "var(--color-glass-fill)",
        border: "1px solid var(--color-glass-stroke)",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 70% 55% at 40% 45%, rgba(167,139,250,0.07) 0%, transparent 70%)" }}
      />

      {/* Frame 1 — Research Brief — top-left */}
      <div
        className="absolute"
        style={{
          top: "7%", left: 28, width: 200,
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.6s ease 0.1s both" : "none",
        }}
      >
        <MiniFrame title="Research Brief" accentColor="#BF5AF2" icon={Icons.Search} agent="Researcher" streaming floatDelay={0}>
          <SkeletonLines count={5} widths={[100, 85, 70, 90, 60]} />
        </MiniFrame>
      </div>

      {/* Frame 2 — Email Draft — top-right */}
      <div
        className="absolute"
        style={{
          top: "20%", right: 24, width: 188,
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.6s ease 0.3s both" : "none",
        }}
      >
        <MiniFrame title="Email Draft" accentColor="#FF375F" icon={Icons.Mail} agent="Writer" floatDelay={1.2}>
          <SkeletonLines count={5} widths={[100, 90, 100, 75, 55]} />
        </MiniFrame>
      </div>

      {/* Frame 3 — Data Analysis — center-left */}
      <div
        className="absolute"
        style={{
          top: "43%", left: 44, width: 184,
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.6s ease 0.5s both" : "none",
        }}
      >
        <MiniFrame title="Data Analysis" accentColor="#FFD60A" icon={Icons.Brain} agent="Analyst" floatDelay={2.1}>
          <div className="space-y-1">
            <div className="flex h-8 items-end gap-0.5">
              {[60, 80, 50, 90, 70, 85, 55, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-yellow-400/30" style={{ height: `${h}%` }} />
              ))}
            </div>
            <SkeletonLines count={2} widths={[80, 60]} />
          </div>
        </MiniFrame>
      </div>

      {/* Frame 4 — Feature Build — center-right */}
      <div
        className="absolute"
        style={{
          top: "55%", right: 32, width: 192,
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.6s ease 0.7s both" : "none",
        }}
      >
        <MiniFrame title="Feature Build" accentColor="#0A84FF" icon={Icons.Code} agent="Coder" floatDelay={0.7}>
          <div className="space-y-0.5">
            <div className="h-1 w-full rounded bg-blue-400/30" />
            <div className="h-1 w-4/5 rounded bg-green-400/20" />
            <div className="h-1 w-3/5 rounded bg-yellow-400/20" />
            <div className="h-1 w-11/12 rounded bg-blue-400/25" />
            <div className="h-1 w-2/3 rounded bg-purple-400/20" />
          </div>
        </MiniFrame>
      </div>

      {/* Frame 5 — LinkedIn Post — bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: "8%", left: 60, width: 188,
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.6s ease 0.9s both" : "none",
        }}
      >
        <MiniFrame title="LinkedIn Post" accentColor="#0A66C2" icon={Icons.Send} agent="Writer" floatDelay={1.8}>
          <SkeletonLines count={4} widths={[100, 90, 75, 50]} />
        </MiniFrame>
      </div>

      {/* Agent cursors */}
      <div
        className="absolute"
        style={{
          top: "17%", left: "42%",
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.5s ease 1.1s both" : "none",
        }}
      >
        <AgentCursor name="Researcher" color="#60A5FA" />
      </div>
      <div
        className="absolute"
        style={{
          top: "35%", right: "30%",
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.5s ease 1.3s both" : "none",
        }}
      >
        <AgentCursor name="Writer" color="#A78BFA" />
      </div>
      <div
        className="absolute"
        style={{
          top: "66%", left: "48%",
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.5s ease 1.5s both" : "none",
        }}
      >
        <AgentCursor name="Coder" color="#EF4444" />
      </div>
      <div
        className="absolute"
        style={{
          bottom: "25%", left: "33%",
          opacity: triggered ? undefined : 0,
          animation: triggered ? "hero-fade-in 0.5s ease 1.7s both" : "none",
        }}
      >
        <AgentCursor name="Analyst" color="#F59E0B" />
      </div>
    </div>
  );
}

/* ── Feature pill — rounded-full ──────────────────────────────────── */

function Pill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-glass-stroke bg-glass-fill px-4 py-3 backdrop-blur-glass-sm">
      <Icon className="h-4 w-4 text-muted" />
      <span className="text-sm font-medium text-secondary">{label}</span>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function LandingDemo() {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative flex items-center px-5 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-8 lg:px-12" data-testid="landing-demo">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left — canvas visual (below text on mobile) */}
          <div className="order-2 lg:order-1">
            <FramesCanvas triggered={triggered} />
          </div>

          {/* Right — copy (above canvas on mobile) */}
          <div
            className="order-1 flex flex-col justify-center lg:order-2"
            style={{
              opacity: triggered ? undefined : 0,
              animation: triggered ? "hero-fade-in 0.7s ease 0.2s both" : "none",
            }}
          >
            <span className="text-section-label mb-5 block">Canvas Workspace</span>
            <h2
              className="text-section-heading mb-6"
              data-testid="demo-heading"
            >
              Every output lands{" "}
              <span className="text-accent">on your canvas.</span>
            </h2>
            <p className="mb-8 text-base leading-relaxed text-secondary">
              <strong className="font-semibold text-primary">See everything, control everything</strong> — research briefs, email drafts, code files. Each agent delivers straight to a named frame. Arrange, resize, and export.
            </p>
            <a
              href="https://space.denker.ai"
              className="mb-10 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-bold text-canvas transition-opacity hover:opacity-80 max-sm:w-full sm:w-fit"
            >
              Try Free
            </a>
            <div className="grid grid-cols-2 gap-2">
              <Pill icon={Icons.Layers} label="Frames" />
              <Pill icon={Icons.Eye}    label="Live preview" />
              <Pill icon={Icons.Code}   label="All formats" />
              <Pill icon={Icons.Send}   label="Export" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
