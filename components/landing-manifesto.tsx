"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

function sm(p: number, s: number, e: number): number {
  const t = Math.max(0, Math.min(1, (p - s) / (e - s)));
  return t * t * (3 - 2 * t);
}

// Generate zoom-slider ticks: 0–30 units, tick every 1 unit
// Size: large every 10 (0,10,20,30), medium every 5, small every 1
const TOTAL_UNITS = 30;
const TICKS = Array.from({ length: TOTAL_UNITS + 1 }, (_, i) => {
  const pos = i / TOTAL_UNITS;
  const large  = i % 10 === 0;
  const medium = i % 5  === 0 && !large;
  return {
    pos,
    width: large ? 14 : medium ? 9 : 5,
    opacity: large ? 0.7 : medium ? 0.45 : 0.22,
    accent: i === 0 || i === 10 || i === 20 || i === 30,
  };
});

// Row positions match the large ticks at 0, 10, 20 (0%, 33%, 66%)
const ROW_POSITIONS = [0, 10 / TOTAL_UNITS, 20 / TOTAL_UNITS];

export function LandingManifesto() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setProgress(Math.max(0, Math.min(1, (vh * 0.85 - rect.top) / (vh * 1.1))));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const labelP   = sm(progress, 0.00, 0.12);
  const row1P    = sm(progress, 0.10, 0.32);
  const row2P    = sm(progress, 0.30, 0.55);
  const row3P    = sm(progress, 0.52, 0.76);
  const subtextP = sm(progress, 0.74, 0.95);
  const spineScale = Math.min(1, progress * 1.4);

  const rows = [
    { label: "Yesterday", text: "You did everything yourself.",       progress: row1P, accent: false },
    { label: "Today",     text: "AI sessions scatter the work.",      progress: row2P, accent: false },
    { label: "Tomorrow",  text: "You direct. Agents execute.",        progress: row3P, accent: true  },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32 lg:px-12"
      data-testid="landing-manifesto"
    >
      <div className="relative mx-auto max-w-xl">

        {/* Section label */}
        <div
          className="mb-14 text-center"
          style={{ opacity: labelP, transform: `translateY(${(1 - labelP) * -10}px)` }}
        >
          <span className="badge-section">The shift</span>
        </div>

        <div className="flex gap-8">

          {/* ── Zoom-slider ruler ── */}
          <div className="relative shrink-0 self-stretch" style={{ width: 24 }}>

            {/* Spine */}
            <div
              className="absolute top-0 w-px origin-top"
              style={{
                left: 2,
                height: "100%",
                backgroundColor: "var(--color-glass-stroke)",
                opacity: 0.4,
                transform: `scaleY(${spineScale})`,
              }}
            />

            {/* All ticks */}
            {TICKS.map((tick, i) => {
              // Reveal each tick as the spine draws past it
              const revealed = Math.max(0, Math.min(1, (spineScale - tick.pos) / 0.08));
              // Accent ticks get green when their row is active
              const rowIdx = ROW_POSITIONS.indexOf(tick.pos);
              const rowProgress = rowIdx >= 0
                ? [row1P, row2P, row3P][rowIdx] ?? 0
                : 0;
              const isRowTick = rowIdx >= 0;
              const isLastRow = rowIdx === 2;

              const color = isLastRow && isRowTick
                ? `rgba(21,128,61,${Math.max(revealed * tick.opacity, rowProgress * 0.9)})`
                : `rgba(148,163,184,${revealed * tick.opacity})`;

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${tick.pos * 100}%`,
                    left: 2,
                    width: tick.width,
                    height: 1,
                    backgroundColor: color,
                    boxShadow:
                      isLastRow && isRowTick && rowProgress > 0.85
                        ? "0 0 6px rgba(21,128,61,0.5)"
                        : undefined,
                  }}
                />
              );
            })}
          </div>

          {/* ── Content rows ── */}
          <div className="flex flex-col" style={{ gap: "clamp(36px, 8vw, 60px)" }}>
            {rows.map((row) => (
              <div
                key={row.label}
                style={{
                  opacity: row.progress,
                  transform: `translateY(${(1 - row.progress) * 18}px)`,
                }}
              >
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-muted">
                  {row.label}
                </span>
                <p
                  className={cn(
                    "font-satoshi text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl",
                    row.accent ? "text-accent" : "text-primary",
                  )}
                  style={{
                    animation:
                      row.accent && row.progress > 0.9
                        ? "tomorrow-pulse 3s ease infinite"
                        : undefined,
                  }}
                >
                  {row.text}
                </p>
              </div>
            ))}

            <p
              className="max-w-md text-base leading-relaxed text-primary"
              style={{
                opacity: subtextP,
                transform: `translateY(${(1 - subtextP) * 12}px)`,
              }}
            >
              Denker keeps tasks, context and outputs together, so founders
              review faster and move more business work forward.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
