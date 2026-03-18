import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";

const SIDEBAR_SPACES = [
  { name: "Q2 Campaign", active: true },
  { name: "Product Launch", active: false },
  { name: "Research Hub", active: false },
];

const SIDEBAR_WORKFLOWS = [
  { name: "Newsletter", icon: Icons.Mail },
  { name: "Deploy", icon: Icons.Zap },
];

function MiniFrame({
  title,
  color,
  agent,
  streaming,
  x,
  y,
  width,
  children,
}: {
  title: string;
  color: string;
  agent: string;
  streaming?: boolean;
  x: number;
  y: number;
  width: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-[6px] border border-glass-stroke bg-glass-fill shadow-frame backdrop-blur-glass"
      style={{ left: x, top: y, width }}
    >
      <div className="flex items-center gap-1 border-b border-glass-stroke-faint px-1.5 py-1">
        <div className={cn("h-1 w-1 rounded-full", color)} />
        <span className="truncate text-[7px] font-medium text-primary">{title}</span>
        <span className="ml-auto text-[6px] text-muted">{agent}</span>
        {streaming && <div className="h-1 w-1 animate-pulse rounded-full bg-accent" />}
      </div>
      <div className="p-1.5">{children}</div>
    </div>
  );
}

function SkeletonLines({ count }: { count: number }) {
  return (
    <div className="space-y-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded bg-glass-fill-heavy"
          style={{ width: `${80 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function LandingDemo() {
  return (
    <section className="relative bg-canvas px-6 py-24 lg:px-12" data-testid="landing-demo">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-3xl font-bold tracking-tight text-primary lg:text-4xl"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
            data-testid="demo-heading"
          >
            Your workspace, <span className="text-accent">at a glance</span>
          </h2>
          <p className="text-base text-secondary">
            Sidebar, canvas, panels — everything in one view. Agents work while you watch.
          </p>
        </div>

        <div
          className="relative mx-auto overflow-hidden rounded-2xl border border-glass-stroke bg-glass-fill shadow-card-modal backdrop-blur-glass"
          style={{ aspectRatio: "16/10" }}
          data-testid="demo-mockup"
        >
          {/* Header bar */}
          <div className="flex h-8 items-center gap-2 border-b border-glass-stroke-faint px-3">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-danger/60" />
              <div className="h-2 w-2 rounded-full bg-warning/60" />
              <div className="h-2 w-2 rounded-full bg-accent/60" />
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5">
              <Icons.Search className="h-3 w-3 text-muted" />
              <Icons.Bell className="h-3 w-3 text-muted" />
              <Icons.Settings className="h-3 w-3 text-muted" />
              <div className="h-4 w-4 rounded-full bg-accent/30" />
            </div>
          </div>

          <div className="flex h-[calc(100%-32px)]">
            {/* Sidebar */}
            <div className="flex w-36 shrink-0 flex-col border-r border-glass-stroke-faint bg-glass-fill p-2">
              <div className="mb-3 flex items-center gap-1 rounded-md bg-glass-fill-heavy px-2 py-1">
                <Icons.Search className="h-2.5 w-2.5 text-muted" />
                <span className="text-[7px] text-muted">Search...</span>
              </div>
              <span className="mb-1 text-[6px] font-semibold uppercase tracking-wider text-muted">Spaces</span>
              {SIDEBAR_SPACES.map((s) => (
                <div
                  key={s.name}
                  className={cn(
                    "mb-0.5 flex items-center gap-1.5 rounded-md px-2 py-1 text-[7px]",
                    s.active ? "bg-glass-fill-heavy text-primary" : "text-secondary hover:bg-glass-fill-heavy",
                  )}
                >
                  <div className={cn("h-1 w-1 rounded-full", s.active ? "bg-accent" : "bg-muted")} />
                  {s.name}
                </div>
              ))}
              <span className="mb-1 mt-3 text-[6px] font-semibold uppercase tracking-wider text-muted">Automated</span>
              {SIDEBAR_WORKFLOWS.map((w) => (
                <div key={w.name} className="mb-0.5 flex items-center gap-1.5 rounded-md px-2 py-1 text-[7px] text-secondary">
                  <w.icon className="h-2 w-2" />
                  {w.name}
                </div>
              ))}
            </div>

            {/* Canvas area */}
            <div
              className="relative flex-1 overflow-hidden"
              style={{
                backgroundImage: "radial-gradient(circle, var(--color-canvas-dot) 0.5px, transparent 0.5px)",
                backgroundSize: "12px 12px",
              }}
            >
              <MiniFrame title="Market Analysis" color="bg-frame-search" agent="Aria" x={20} y={12} width={140}>
                <SkeletonLines count={3} />
              </MiniFrame>
              <MiniFrame title="API Client" color="bg-frame-code" agent="Kai" streaming x={180} y={8} width={130}>
                <div className="space-y-0.5 font-mono">
                  <div className="h-1 w-full rounded bg-blue-400/20" />
                  <div className="h-1 w-4/5 rounded bg-green-400/20" />
                  <div className="h-1 w-3/5 rounded bg-yellow-400/20" />
                </div>
              </MiniFrame>
              <MiniFrame title="Email Draft" color="bg-frame-email" agent="Mia" x={330} y={16} width={130}>
                <SkeletonLines count={4} />
              </MiniFrame>
              <MiniFrame title="Research Brief" color="bg-frame-conversation" agent="Aria" x={40} y={110} width={140}>
                <div className="space-y-1">
                  <div className="rounded bg-glass-fill-heavy p-1">
                    <div className="h-1 w-full rounded bg-glass-fill-heavy" />
                  </div>
                  <div className="rounded bg-accent/10 p-1">
                    <div className="h-1 w-full rounded bg-accent/20" />
                  </div>
                </div>
              </MiniFrame>
              <MiniFrame title="Deploy" color="bg-frame-workflow" agent="auto" x={210} y={120} width={120}>
                <div className="flex items-center gap-0.5">
                  <div className="h-2 w-2 rounded-full border border-accent bg-accent/30" />
                  <div className="h-px flex-1 bg-accent/30" />
                  <div className="h-2 w-2 rounded-full border border-accent bg-accent/30" />
                  <div className="h-px flex-1 bg-glass-stroke" />
                  <div className="h-2 w-2 rounded-full border border-glass-stroke" />
                </div>
              </MiniFrame>

              {/* Agent cursors */}
              <div className="absolute" style={{ left: 120, top: 75 }}>
                <div className="flex items-center gap-0.5">
                  <svg width="6" height="8" viewBox="0 0 12 16" fill="none">
                    <path d="M1 1L11 8L5 9L3 15L1 1Z" fill="#A78BFA" />
                  </svg>
                  <span className="rounded px-1 py-0.5 text-[5px] font-medium text-white" style={{ backgroundColor: "#A78BFA" }}>Aria</span>
                </div>
              </div>
              <div className="absolute" style={{ left: 270, top: 55 }}>
                <div className="flex items-center gap-0.5">
                  <svg width="6" height="8" viewBox="0 0 12 16" fill="none">
                    <path d="M1 1L11 8L5 9L3 15L1 1Z" fill="#60A5FA" />
                  </svg>
                  <span className="rounded px-1 py-0.5 text-[5px] font-medium text-white" style={{ backgroundColor: "#60A5FA" }}>Kai</span>
                </div>
              </div>

              {/* Input bar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1.5 rounded-lg border border-glass-stroke bg-glass-fill-dense px-2 py-1 shadow-glass-sm backdrop-blur-glass" style={{ width: 200 }}>
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-[6px] text-muted">Ask your agents anything...</span>
                </div>
              </div>

              {/* Zoom toolbar */}
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center gap-0.5 rounded-md border border-glass-stroke bg-glass-fill px-1 py-0.5 backdrop-blur-glass">
                  <Icons.ZoomIn className="h-2.5 w-2.5 text-muted" />
                  <span className="text-[6px] text-muted">100%</span>
                  <Icons.ZoomOut className="h-2.5 w-2.5 text-muted" />
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex w-28 shrink-0 flex-col border-l border-glass-stroke-faint bg-glass-fill p-2">
              <span className="mb-2 text-[7px] font-semibold text-primary">Market Analysis</span>
              <div className="mb-1 flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-purple-400/30 text-center text-[5px] leading-3 text-purple-300">A</div>
                <span className="text-[6px] text-secondary">Aria</span>
                <span className="ml-auto rounded bg-accent/20 px-1 text-[5px] text-accent">done</span>
              </div>
              <div className="my-2 border-t border-glass-stroke-faint" />
              <SkeletonLines count={5} />
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Multiple agents working in parallel — every action visible on the canvas.
        </p>
      </div>
    </section>
  );
}
