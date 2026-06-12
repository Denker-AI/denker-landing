/**
 * Temporary preview page for newsletter mockup screenshots.
 * Visit /preview to review all 4 feature images before capturing.
 * DELETE THIS FILE after screenshots are taken.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
  alternates: { canonical: "/preview" },
};

/* ── Shared UI atoms ──────────────────────────────────────── */

function AccentDot({ color }: { color: string }) {
  return <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />;
}

function FrameHeader({
  title,
  color,
  agent,
  status,
}: {
  title: string;
  color: string;
  agent?: string;
  status?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-glass-stroke-faint px-3 py-2">
      <AccentDot color={color} />
      <span className="truncate text-[10px] font-semibold text-primary">{title}</span>
      <div className="ml-auto flex items-center gap-1.5">
        {agent && <span className="text-[8px] font-medium text-muted">{agent}</span>}
        {status && (
          <span className="flex items-center gap-1 text-[8px] text-muted">
            <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

function Frame({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`liquid-glass flex flex-col overflow-hidden rounded-[10px] border border-glass-stroke ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function CursorLabel({ name, color, info }: { name: string; color: string; info?: string }) {
  return (
    <div className="flex items-center gap-1">
      <svg width="14" height="18" viewBox="0 0 12 16" fill="none">
        <path d="M1 1L11 8L5 9L3 15L1 1Z" fill={color} stroke={color} strokeWidth="0.5" />
      </svg>
      <span
        className="flex items-center gap-1 rounded-xl px-2 py-0.5 text-[10px] font-bold text-white"
        style={{ backgroundColor: `${color}CC` }}
      >
        {name}
        {info && (
          <>
            <span className="text-white/50">&middot;</span>
            <span className="font-normal text-white/80">{info}</span>
          </>
        )}
      </span>
    </div>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return <div className="h-[5px] rounded-sm bg-glass-fill-heavy" style={{ width }} />;
}

function SkeletonBlock({ widths }: { widths: string[] }) {
  return (
    <div className="flex flex-col gap-[3px]">
      {widths.map((w, i) => (
        <SkeletonLine key={i} width={w} />
      ))}
    </div>
  );
}

/* ── MOCKUP 1: The Canvas ─────────────────────────────────── */

function CanvasMockup() {
  return (
    <div className="relative h-[420px] w-[700px] overflow-hidden rounded-2xl border border-glass-stroke bg-canvas">
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Gradient blobs */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 45% at 20% 30%, rgba(58,248,140,0.08) 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 75% 65%, rgba(96,165,250,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Research frame */}
      <div className="absolute" style={{ top: 28, left: 30, width: 240 }}>
        <Frame>
          <FrameHeader title="Market Research" color="#BF5AF2" agent="Aria" status="writing" />
          <div className="p-3">
            <p className="text-[9px] leading-[1.5] text-secondary">
              The AI agent tools market is projected to reach $28.5B by 2028, growing at 34% CAGR.
              Key segments include autonomous coding, research automation, and workflow orchestration...
            </p>
            <span className="inline-block h-[11px] w-[1px] animate-pulse bg-accent" />
          </div>
        </Frame>
        <div className="absolute -top-5 left-[200px]">
          <CursorLabel name="Aria" color="#A78BFA" info="writing" />
        </div>
      </div>

      {/* Code frame */}
      <div className="absolute" style={{ top: 20, right: 30, width: 240 }}>
        <Frame>
          <FrameHeader title="API Integration" color="#0A84FF" agent="Kai" status="streaming" />
          <div className="bg-surface p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-elevated/60 px-1.5 py-0.5 text-[7px] text-muted">TypeScript</span>
            </div>
            <pre className="text-[8px] leading-[1.5] text-secondary">
              <code>{`async function fetchAnalysis() {
  const res = await fetch(
    '/api/v1/analysis',
    { headers: { auth: token } }
  );
  return res.json();
}`}</code>
            </pre>
          </div>
        </Frame>
        <div className="absolute -top-5 right-4">
          <CursorLabel name="Kai" color="#60A5FA" info="coding" />
        </div>
      </div>

      {/* Email frame */}
      <div className="absolute" style={{ bottom: 30, left: 50, width: 220 }}>
        <Frame>
          <FrameHeader title="Outreach Draft" color="#FF375F" agent="Mia" />
          <div className="p-3">
            <SkeletonBlock widths={["100%", "90%", "100%", "75%", "85%"]} />
          </div>
        </Frame>
      </div>

      {/* Workflow frame */}
      <div className="absolute" style={{ bottom: 20, right: 40, width: 200 }}>
        <Frame>
          <FrameHeader title="Deploy Pipeline" color="#FFD60A" status="running" />
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between text-[8px] text-muted">
              <span>2/4 steps</span>
              <span>50%</span>
            </div>
            <div className="mb-3 h-[6px] overflow-hidden rounded-full bg-surface">
              <div className="h-full w-1/2 rounded-full bg-accent" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 rounded border-l-2 border-emerald-400 bg-surface/50 px-2 py-1">
                <svg className="h-2.5 w-2.5 text-emerald-400" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.3 5.3L7 9.6 4.7 7.3a1 1 0 00-1.4 1.4l3 3a1 1 0 001.4 0l5-5a1 1 0 00-1.4-1.4z" /></svg>
                <span className="text-[8px] text-secondary">Build assets</span>
              </div>
              <div className="flex items-center gap-1.5 rounded border-l-2 border-emerald-400 bg-surface/50 px-2 py-1">
                <svg className="h-2.5 w-2.5 text-emerald-400" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.3 5.3L7 9.6 4.7 7.3a1 1 0 00-1.4 1.4l3 3a1 1 0 001.4 0l5-5a1 1 0 00-1.4-1.4z" /></svg>
                <span className="text-[8px] text-secondary">Run tests</span>
              </div>
              <div className="flex items-center gap-1.5 rounded border-l-2 border-accent bg-surface/50 px-2 py-1">
                <div className="h-2.5 w-2.5 animate-spin rounded-full border border-accent border-t-transparent" />
                <span className="text-[8px] font-medium text-primary">Deploy staging</span>
              </div>
              <div className="flex items-center gap-1.5 rounded border-l-2 border-glass-stroke bg-surface/30 px-2 py-1">
                <div className="h-2.5 w-2.5 rounded-full border border-glass-stroke" />
                <span className="text-[8px] text-muted">Deploy production</span>
              </div>
            </div>
          </div>
        </Frame>
      </div>

      {/* Floating cursor */}
      <div className="absolute" style={{ top: "55%", left: "42%" }}>
        <CursorLabel name="Mia" color="#F472B6" info="drafting email" />
      </div>
    </div>
  );
}

/* ── MOCKUP 2: AI Agents as Teammates ─────────────────────── */

function AgentsMockup() {
  const agents = [
    { name: "Aria", role: "Researcher", color: "#A78BFA", status: "Analyzing 12 sources...", icon: "🔍" },
    { name: "Kai", role: "Engineer", color: "#60A5FA", status: "Writing API tests", icon: "⚡" },
    { name: "Mia", role: "Writer", color: "#F472B6", status: "Drafting outreach copy", icon: "✏️" },
    { name: "Nova", role: "Analyst", color: "#34D399", status: "Building funnel chart", icon: "📊" },
  ];

  return (
    <div className="relative h-[420px] w-[700px] overflow-hidden rounded-2xl border border-glass-stroke bg-canvas">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 45% at 25% 35%, rgba(167,139,250,0.07) 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 70% 60%, rgba(244,114,182,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Agent sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-[200px] border-r border-glass-stroke bg-glass-fill-dense backdrop-blur-glass">
        <div className="border-b border-glass-stroke px-4 py-3">
          <span className="text-[11px] font-semibold text-primary">Agents</span>
          <span className="ml-2 text-[10px] text-muted">4 active</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2">
          {agents.map((a) => (
            <div key={a.name} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-glass-fill-heavy">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
                style={{ backgroundColor: `${a.color}20`, border: `1.5px solid ${a.color}` }}
              >
                {a.icon}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-primary">{a.name}</span>
                  <span className="text-[8px] text-muted">{a.role}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                  <span className="text-[8px] text-secondary">{a.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas area with frames and cursors */}
      <div className="absolute left-[200px] top-0 right-0 bottom-0">
        {/* Aria's frame */}
        <div className="absolute" style={{ top: 24, left: 24, width: 220 }}>
          <Frame>
            <FrameHeader title="Competitor Analysis" color="#BF5AF2" agent="Aria" status="writing" />
            <div className="p-3">
              <p className="text-[9px] leading-[1.5] text-secondary">
                <strong className="text-primary">Key Finding:</strong> Three direct competitors identified.
                Market leader holds 42% share with enterprise focus...
              </p>
              <span className="inline-block h-[11px] w-[1px] animate-pulse bg-accent" />
            </div>
          </Frame>
          <div className="absolute -top-5 left-[170px]">
            <CursorLabel name="Aria" color="#A78BFA" />
          </div>
        </div>

        {/* Kai's frame */}
        <div className="absolute" style={{ top: 20, right: 24, width: 220 }}>
          <Frame>
            <FrameHeader title="auth-middleware.ts" color="#0A84FF" agent="Kai" status="streaming" />
            <div className="bg-surface p-3">
              <pre className="text-[8px] leading-[1.5] text-secondary">
                <code>{`export async function verify(
  token: string
): Promise<Session> {
  const decoded = jwt.verify(
    token, SECRET_KEY
  );
  return decoded as Session;
}`}</code>
              </pre>
            </div>
          </Frame>
          <div className="absolute -top-5 right-8">
            <CursorLabel name="Kai" color="#60A5FA" />
          </div>
        </div>

        {/* Mia's frame */}
        <div className="absolute" style={{ bottom: 40, left: 40, width: 200 }}>
          <Frame>
            <FrameHeader title="Welcome Email" color="#FF375F" agent="Mia" />
            <div className="p-3">
              <p className="text-[9px] leading-[1.5] text-secondary">
                Subject: <span className="text-primary">Welcome to Denker</span>
              </p>
              <div className="mt-2">
                <SkeletonBlock widths={["100%", "85%", "95%", "60%"]} />
              </div>
            </div>
          </Frame>
          <div className="absolute -top-5 left-[150px]">
            <CursorLabel name="Mia" color="#F472B6" />
          </div>
        </div>

        {/* Nova's frame */}
        <div className="absolute" style={{ bottom: 30, right: 30, width: 200 }}>
          <Frame>
            <FrameHeader title="Conversion Funnel" color="#34D399" agent="Nova" />
            <div className="p-3">
              {/* Simple bar chart mockup */}
              <div className="flex items-end gap-2 h-[50px]">
                <div className="flex flex-col items-center gap-0.5 flex-1">
                  <div className="w-full rounded-t bg-accent/60" style={{ height: "45px" }} />
                  <span className="text-[6px] text-muted">Visit</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 flex-1">
                  <div className="w-full rounded-t bg-accent/50" style={{ height: "32px" }} />
                  <span className="text-[6px] text-muted">Sign up</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 flex-1">
                  <div className="w-full rounded-t bg-accent/40" style={{ height: "20px" }} />
                  <span className="text-[6px] text-muted">Trial</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 flex-1">
                  <div className="w-full rounded-t bg-accent/30" style={{ height: "12px" }} />
                  <span className="text-[6px] text-muted">Paid</span>
                </div>
              </div>
            </div>
          </Frame>
          <div className="absolute -top-5 right-8">
            <CursorLabel name="Nova" color="#34D399" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MOCKUP 3: Memory Graph ───────────────────────────────── */

function MemoryMockup() {
  /* Static SVG-based knowledge graph */
  const nodes = [
    { id: "user", x: 350, y: 210, r: 14, label: "You", color: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
    { id: "denker", x: 260, y: 130, r: 10, label: "Denker AI", color: "#3AF88C", glow: "rgba(58,248,140,0.2)" },
    { id: "canvas", x: 160, y: 80, r: 8, label: "Canvas Engine", color: "#60A5FA", glow: "rgba(96,165,250,0.2)" },
    { id: "react", x: 80, y: 140, r: 7, label: "React Flow", color: "#60A5FA", glow: "" },
    { id: "agents", x: 360, y: 80, r: 8, label: "Agent System", color: "#A78BFA", glow: "rgba(167,139,250,0.2)" },
    { id: "claude", x: 460, y: 40, r: 7, label: "Claude Code", color: "#A78BFA", glow: "" },
    { id: "companion", x: 480, y: 130, r: 7, label: "Companion", color: "#A78BFA", glow: "" },
    { id: "memory", x: 200, y: 230, r: 8, label: "Memory", color: "#14B8A6", glow: "rgba(20,184,166,0.2)" },
    { id: "pgvector", x: 100, y: 290, r: 7, label: "pgvector", color: "#14B8A6", glow: "" },
    { id: "workflow", x: 460, y: 260, r: 8, label: "Workflows", color: "#FFD60A", glow: "rgba(255,214,10,0.15)" },
    { id: "stripe", x: 530, y: 200, r: 6, label: "Stripe", color: "#F472B6", glow: "" },
    { id: "team", x: 300, y: 310, r: 7, label: "Team", color: "#F59E0B", glow: "" },
    { id: "investor", x: 420, y: 340, r: 6, label: "YC Batch", color: "#F59E0B", glow: "" },
  ];
  const edges = [
    ["user", "denker"], ["denker", "canvas"], ["denker", "agents"], ["denker", "memory"],
    ["denker", "workflow"], ["canvas", "react"], ["agents", "claude"], ["agents", "companion"],
    ["memory", "pgvector"], ["workflow", "stripe"], ["user", "team"], ["user", "investor"],
    ["team", "denker"],
  ];

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative h-[420px] w-[700px] overflow-hidden rounded-2xl border border-glass-stroke bg-canvas">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Frame chrome */}
      <div className="liquid-glass absolute inset-3 flex flex-col overflow-hidden rounded-[10px] border border-glass-stroke">
        <FrameHeader title="Knowledge Graph" color="#64D2FF" agent="12 nodes" status="live" />

        {/* Graph area */}
        <div className="relative flex-1">
          <svg className="absolute inset-0 h-full w-full">
            {/* Edges */}
            {edges.map(([from, to], i) => {
              const a = nodeMap[from];
              const b = nodeMap[to];
              if (!a || !b) return null;
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="rgba(148,163,184,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
              );
            })}
            {/* Nodes */}
            {nodes.map((n) => (
              <g key={n.id}>
                {n.glow && (
                  <circle cx={n.x} cy={n.y} r={n.r + 8} fill={n.glow} />
                )}
                <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.85} />
                <text
                  x={n.x}
                  y={n.y + n.r + 12}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize="9"
                  fontFamily="Inter, sans-serif"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Node detail panel */}
          <div className="absolute right-3 top-3 w-[170px] rounded-xl border border-glass-stroke bg-glass-fill-dense p-3 backdrop-blur-glass">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#3AF88C" }} />
              <span className="text-[11px] font-bold text-primary">Denker AI</span>
            </div>
            <div className="mb-2 text-[8px] text-muted">Company &middot; Added 3 days ago</div>
            <div className="mb-2 border-t border-glass-stroke pt-2">
              <span className="text-[8px] font-semibold text-secondary">Connections</span>
            </div>
            <div className="flex flex-col gap-1">
              {["Canvas Engine", "Agent System", "Memory", "Workflows", "Team"].map((c, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-glass-fill-heavy" />
                  <span className="text-[8px] text-secondary">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MOCKUP 4: Natural Language Workflows ─────────────────── */

function WorkflowMockup() {
  return (
    <div className="relative h-[420px] w-[700px] overflow-hidden rounded-2xl border border-glass-stroke bg-canvas">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 45% at 30% 40%, rgba(255,214,10,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 70% 55%, rgba(58,248,140,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Input bar at top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[500px]">
        <div className="flex items-center gap-2 rounded-2xl border border-glass-stroke bg-glass-fill-dense px-4 py-3 backdrop-blur-glass">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20">
            <svg className="h-3 w-3 text-accent" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v10M3 8h10" /></svg>
          </div>
          <span className="text-[11px] text-secondary">
            &ldquo;Research the top 5 AI agent frameworks, compare pricing, and draft a summary report with recommendations&rdquo;
          </span>
        </div>
      </div>

      {/* Workflow execution card */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[420px]">
        <Frame>
          <FrameHeader title="Research &amp; Report Pipeline" color="#FFD60A" status="running" />
          <div className="p-4">
            {/* Progress */}
            <div className="mb-3 flex items-center justify-between text-[9px]">
              <span className="font-medium text-primary">3/5 steps complete</span>
              <span className="text-accent">60%</span>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: "60%" }} />
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-2">
              {[
                { name: "Find top AI agent frameworks", agent: "Aria", status: "done" },
                { name: "Gather pricing & feature data", agent: "Aria", status: "done" },
                { name: "Compare frameworks side-by-side", agent: "Nova", status: "done" },
                { name: "Draft summary report", agent: "Mia", status: "running" },
                { name: "Review & format final output", agent: "You", status: "pending" },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 border-l-2 ${
                    step.status === "done"
                      ? "border-emerald-400 bg-surface/40"
                      : step.status === "running"
                        ? "border-accent bg-accent/5"
                        : step.status === "pending"
                          ? "border-amber-400/50 bg-surface/20"
                          : "border-glass-stroke bg-surface/20"
                  }`}
                >
                  {step.status === "done" && (
                    <svg className="h-3.5 w-3.5 shrink-0 text-emerald-400" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.3 5.3L7 9.6 4.7 7.3a1 1 0 00-1.4 1.4l3 3a1 1 0 001.4 0l5-5a1 1 0 00-1.4-1.4z" /></svg>
                  )}
                  {step.status === "running" && (
                    <div className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-accent border-t-transparent" />
                  )}
                  {step.status === "pending" && (
                    <svg className="h-3.5 w-3.5 shrink-0 text-amber-400/70" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1" /></svg>
                  )}
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-medium ${step.status === "running" ? "text-primary" : step.status === "done" ? "text-secondary" : "text-muted"}`}>
                      {step.name}
                    </span>
                    <span className="text-[8px] text-muted">Assigned to {step.agent}</span>
                  </div>
                  {step.status === "pending" && step.agent === "You" && (
                    <div className="ml-auto flex gap-1">
                      <span className="rounded bg-accent/15 px-2 py-0.5 text-[8px] font-semibold text-accent">Approve</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Frame>
      </div>

      {/* Connected output frames */}
      <div className="absolute bottom-4 left-6 w-[180px]">
        <Frame>
          <FrameHeader title="Framework Comparison" color="#BF5AF2" agent="Nova" />
          <div className="p-2">
            <SkeletonBlock widths={["100%", "90%", "75%"]} />
          </div>
        </Frame>
      </div>
      <div className="absolute bottom-4 right-6 w-[180px]">
        <Frame>
          <FrameHeader title="Summary Report" color="#FF375F" agent="Mia" status="writing" />
          <div className="p-2">
            <SkeletonBlock widths={["100%", "85%", "95%", "60%"]} />
            <span className="mt-1 inline-block h-[9px] w-[1px] animate-pulse bg-accent" />
          </div>
        </Frame>
      </div>
    </div>
  );
}

/* ── Preview page ─────────────────────────────────────────── */

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-canvas p-8">
      <div className="mx-auto max-w-[800px] space-y-16">
        <div>
          <h1 className="mb-2 text-xl font-bold font-satoshi text-primary">
            Newsletter Image Previews
          </h1>
          <p className="text-sm text-muted">Review each mockup. These will be captured at 700x420 for the newsletter.</p>
        </div>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">1. The Canvas</h2>
          <CanvasMockup />
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">2. AI Agents as Teammates</h2>
          <AgentsMockup />
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">3. Memory That Actually Works</h2>
          <MemoryMockup />
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">4. Natural Language Workflows</h2>
          <WorkflowMockup />
        </section>
      </div>
    </div>
  );
}
