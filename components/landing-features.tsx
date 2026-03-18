import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";

/* ── Brand SVG icons ─────────────────────────────────────────────── */

function GmailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path fill="#4A90E2" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
function SlackIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}
function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#ccc">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function NotionIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933z" />
    </svg>
  );
}
function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Shared pill ─────────────────────────────────────────────────── */

function Pill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-glass-stroke bg-glass-fill px-4 py-3 backdrop-blur-glass-sm">
      <Icon className="h-4 w-4 text-muted" />
      <span className="text-sm font-medium text-secondary">{label}</span>
    </div>
  );
}

/* ── Workflow flowchart ──────────────────────────────────────────── */

type StepStatus = "completed" | "running" | "pending";

interface ChartStep {
  id: string;
  label: string;
  iconType: "clock" | "search" | "listChecks" | "shield" | "gmail" | "linkedin";
  status: StepStatus;
  dashed?: boolean;
  badge?: string;
  approved?: boolean;
}

const CHART_STEPS: ChartStep[] = [
  { id: "trigger",  label: "Every Monday at 9 am",       iconType: "clock",    status: "completed", dashed: true                 },
  { id: "research", label: "Research top 5 competitors", iconType: "search",   status: "completed",              badge: "Aria"  },
  { id: "approve",  label: "Human approval",             iconType: "shield",   status: "completed", dashed: true, approved: true },
  { id: "send",     label: "Draft & send newsletter",    iconType: "gmail",    status: "running",                badge: "Mia"   },
  { id: "linkedin", label: "Post on LinkedIn",           iconType: "linkedin", status: "pending",                badge: "Mia"   },
];

function ChartStepIcon({ iconType }: { iconType: ChartStep["iconType"] }) {
  if (iconType === "gmail")    return <GmailIcon size={12} />;
  if (iconType === "linkedin") return <LinkedInIcon size={12} />;
  const map = { clock: Icons.Clock, search: Icons.Search, listChecks: Icons.ListChecks, shield: Icons.ShieldCheck } as const;
  const Icon = map[iconType as keyof typeof map];
  return <Icon className="h-3 w-3 shrink-0 text-muted" />;
}

const FLOW_NODE_W = 260;
const FLOW_NODE_H = 36;
const FLOW_GAP_H  = 44;

function WorkflowPill({ step }: { step: ChartStep }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full px-3",
        "border bg-glass-fill/80 backdrop-blur-sm",
        step.dashed ? "border-dashed border-glass-stroke" : "border-glass-stroke",
        step.status === "completed" && !step.dashed && "border-success/30 bg-success/[0.04]",
        step.status === "running" && "border-blue-400/30 bg-blue-400/[0.04]",
        step.status === "pending" && "opacity-40",
      )}
      style={{ width: FLOW_NODE_W, height: FLOW_NODE_H }}
    >
      {/* Status indicator — left side */}
      {step.status === "completed" ? (
        <Icons.Check className="h-3 w-3 shrink-0 text-success" />
      ) : (
        <ChartStepIcon iconType={step.iconType} />
      )}
      <span className={cn(
        "flex-1 truncate text-xs font-medium",
        step.status === "completed" ? "text-secondary" : "text-secondary",
      )}>{step.label}</span>
      {step.badge && <span className="shrink-0 text-[9px] text-muted">{step.badge}</span>}
      {step.approved && (
        <span className="shrink-0 rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent">Approved</span>
      )}
      {/* Status dot — right side */}
      {step.status === "running" && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
        </span>
      )}
      {step.status === "completed" && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
      )}
      {step.status === "pending" && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
      )}
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex flex-col items-center" style={{ height: FLOW_GAP_H }}>
      <div className="w-px flex-1" style={{ backgroundColor: "var(--color-glass-stroke)" }} />
      <svg width="6" height="5" viewBox="0 0 6 5" className="shrink-0">
        <path d="M3 5L0 0h6z" fill="var(--color-glass-stroke)" />
      </svg>
    </div>
  );
}

function WorkflowFlowchart() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      {CHART_STEPS.map((step, i) => (
        <div key={step.id} className="flex flex-col items-center">
          <WorkflowPill step={step} />
          {i < CHART_STEPS.length - 1 && <FlowConnector />}
        </div>
      ))}
    </div>
  );
}

const completedSteps = CHART_STEPS.filter((s) => s.status === "completed").length;

function WorkflowVisual() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-glass-stroke bg-glass-fill shadow-glass" style={{ height: 560 }}>
      {/* Frame header + progress */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-0.5 shrink-0 rounded-full bg-frame-workflow" />
          <Icons.GitBranch className="h-3 w-3 shrink-0 text-muted" />
          <span className="flex-1 truncate text-xs font-semibold text-primary">Research competitors → publish newsletter</span>
          <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">Running</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-glass-fill-heavy">
            <div
              className="relative h-full overflow-hidden rounded-full bg-accent"
              style={{ width: `${(completedSteps / CHART_STEPS.length) * 100}%` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
          <span className="shrink-0 text-[10px] text-muted">{completedSteps}/{CHART_STEPS.length}</span>
        </div>
      </div>
      <div className="flex-1 p-6">
        <WorkflowFlowchart />
      </div>
    </div>
  );
}

/* ── Memory visual ───────────────────────────────────────────────── */

function MemoryVisual() {
  const hubs = [
    { cx: 200, cy: 130, r: 11, color: "#A78BFA", label: "Product Strategy" },
    { cx: 110, cy: 320, r:  9, color: "#60A5FA", label: "Customer Research" },
    { cx: 310, cy: 330, r:  9, color: "#34D399", label: "Competitor Intel"  },
  ];
  const satellites = [
    { x: 80,  y: 60,  r: 5, color: "#FFD700", label: "Solo Founders",  hub: 0 },
    { x: 330, y: 70,  r: 5, color: "#94A3B8", label: "Pricing Model",  hub: 0 },
    { x: 60,  y: 195, r: 5, color: "#94A3B8", label: "ICP: Operators", hub: 0 },
    { x: 355, y: 200, r: 5, color: "#86A8E0", label: "Market: $12B",   hub: 0 },
    { x: 35,  y: 390, r: 5, color: "#60A5FA", label: "NPS: 72",        hub: 1 },
    { x: 150, y: 430, r: 5, color: "#818CF8", label: "5 interviews",   hub: 1 },
    { x: 55,  y: 460, r: 4, color: "#94A3B8", label: "Churn reasons",  hub: 1 },
    { x: 355, y: 390, r: 5, color: "#94A3B8", label: "Linear pricing", hub: 2 },
    { x: 245, y: 440, r: 5, color: "#F472B6", label: "Canvas UX",      hub: 2 },
    { x: 360, y: 455, r: 4, color: "#86A8E0", label: "Feature gaps",   hub: 2 },
  ];
  const crossLinks = [[0, 1], [0, 2], [1, 2]] as const;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-glass-stroke bg-glass-fill p-4 shadow-glass" style={{ height: "min(560px, 70vh)" }}>
      <div className="mb-2 flex items-center gap-2">
        <Icons.Network className="h-3.5 w-3.5 text-purple-400" />
        <span className="text-xs font-semibold text-secondary">Knowledge Graph</span>
        <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">3 clusters · 13 entities</span>
        <div className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
      </div>
      <svg viewBox="0 0 420 500" className="w-full flex-1">
        {crossLinks.map(([a, b], i) => (
          <line key={`cross-${i}`} x1={hubs[a].cx} y1={hubs[a].cy} x2={hubs[b].cx} y2={hubs[b].cy}
            stroke="rgba(148,163,184,0.12)" strokeWidth="1" strokeDasharray="6 6" />
        ))}
        {satellites.map((n, i) => (
          <line key={`sat-${i}`} x1={hubs[n.hub].cx} y1={hubs[n.hub].cy} x2={n.x} y2={n.y}
            stroke="rgba(148,163,184,0.22)" strokeWidth="1.5" strokeDasharray="4 5" />
        ))}
        {hubs.map((h, i) => (
          <g key={`hub-${i}`}>
            {i === 0 && (
              <>
                <circle cx={h.cx} cy={h.cy} r={h.r + 18} fill={h.color} opacity="0.06">
                  <animate attributeName="r" values={`${h.r + 14};${h.r + 22};${h.r + 14}`} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.08;0.02;0.08" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={h.cx} cy={h.cy} r={h.r + 10} fill="none" stroke={h.color} strokeWidth="0.8" opacity="0.25">
                  <animate attributeName="r" values={`${h.r + 8};${h.r + 14};${h.r + 8}`} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.08;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            <circle cx={h.cx} cy={h.cy} r={h.r + 6} fill={h.color} opacity="0.12" />
            <circle cx={h.cx} cy={h.cy} r={h.r} fill={h.color} />
            <text x={h.cx} y={h.cy + h.r + 13} textAnchor="middle" fill="rgba(200,195,255,0.85)" fontSize="8" fontWeight="600">{h.label}</text>
          </g>
        ))}
        {satellites.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.x} cy={n.y} r={n.r + 3} fill={n.color} opacity="0.12" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity="0.85" />
            <text x={n.x} y={n.y + n.r + 11} textAnchor="middle" fill="rgba(148,163,184,0.8)" fontSize="7.5">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Bento ───────────────────────────────────────────────────────── */

const CONN_APPS = [
  { id: "gmail",    Icon: GmailIcon,    bg: "bg-white",     name: "Gmail",    connected: true  },
  { id: "slack",    Icon: SlackIcon,    bg: "bg-[#4A154B]", name: "Slack",    connected: true  },
  { id: "linkedin", Icon: LinkedInIcon, bg: "bg-[#0A66C2]", name: "LinkedIn", connected: true  },
  { id: "github",   Icon: GitHubIcon,   bg: "bg-[#1a1a1a]", name: "GitHub",   connected: false },
  { id: "notion",   Icon: NotionIcon,   bg: "bg-[#1a1a1a]", name: "Notion",   connected: false },
];

function ConnectionGrid() {
  const connCount = CONN_APPS.filter((a) => a.connected).length;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {CONN_APPS.map((app) => (
          <div key={app.id} className={cn("flex flex-col items-center gap-1", !app.connected && "opacity-30")}>
            <div className="relative">
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px] border",
                app.connected ? "border-glass-stroke shadow-glass-sm" : "border-dashed border-glass-stroke",
                app.bg,
              )}>
                <app.Icon size={20} />
              </div>
              {app.connected && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-glass-fill" />
              )}
            </div>
            <span className={cn("text-[9px]", app.connected ? "text-secondary" : "text-muted")}>{app.name}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1 opacity-40">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-dashed border-glass-stroke bg-glass-fill">
            <Icons.Plus className="h-3.5 w-3.5 text-muted" />
          </div>
          <span className="text-[9px] text-muted">Browse</span>
        </div>
      </div>
      <p className="text-center text-[10px] text-muted">{connCount} of {CONN_APPS.length} connected</p>
    </div>
  );
}

const AGENT_PRESETS = [
  { id: "aria", letter: "A", color: "#A78BFA", name: "Aria",       desc: "Research & search"  },
  { id: "mia",  letter: "M", color: "#F472B6", name: "Mia",        desc: "Write & draft"       },
  { id: "kai",  letter: "K", color: "#60A5FA", name: "Kai",        desc: "Code & build"        },
  { id: "rex",  letter: "R", color: "#FFD60A", name: "Rex",        desc: "Analyze & insights"  },
];

function AgentDockCard() {
  return (
    <div className="flex flex-col gap-5">
      {/* Input bar — mirrors real InputBar: glass pill + agent stack + input + send */}
      <div className="flex h-10 items-center gap-2 rounded-full border border-glass-stroke bg-glass-fill p-1.5 shadow-glass backdrop-blur-glass">
        {/* Agent stack — overlapping */}
        <div className="relative flex shrink-0 items-center" style={{ width: 56, height: 24 }}>
          {AGENT_PRESETS.map((a, i) => (
            <div
              key={a.id}
              className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-white"
              style={{
                backgroundColor: a.color,
                transform: `translateX(${i * 8}px)`,
                zIndex: AGENT_PRESETS.length - i,
              }}
            >
              {a.letter}
            </div>
          ))}
          <span className="pointer-events-none absolute -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-accent px-0.5 text-[8px] font-bold text-white shadow-sm" style={{ left: 20, zIndex: 10 }}>
            {AGENT_PRESETS.length}
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px shrink-0 bg-glass-stroke-subtle" />

        {/* Placeholder text */}
        <span className="flex-1 text-[13px] text-muted">Ask anything...</span>

        {/* Send button */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Icons.ArrowUp className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Agent preset grid */}
      <div className="grid grid-cols-2 gap-2">
        {AGENT_PRESETS.map((a) => (
          <div key={a.id} className="flex items-center gap-2.5 rounded-xl border border-glass-stroke bg-glass-fill px-3 py-2.5 shadow-glass-sm backdrop-blur-glass-sm">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-canvas"
              style={{ backgroundColor: a.color }}
            >
              {a.letter}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-primary">{a.name}</div>
              <div className="truncate text-[10px] text-muted">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BentoCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col rounded-2xl border border-glass-stroke bg-glass-fill p-6 backdrop-blur-glass", className)}>
      {children}
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────────────── */

export function LandingFeatures() {
  return (
    <section className="relative" data-testid="landing-features">

      {/* ── Workflow — text left, visual right ── */}
      <div className="flex items-center px-5 py-20 sm:px-6 lg:min-h-screen lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[0.9fr_1.1fr]">

            {/* Copy — left */}
            <div className="flex flex-col justify-center">
              <span className="text-section-label mb-5 block">Workflow Builder</span>
              <h2
                className="text-section-heading mb-6"
                data-testid="features-heading"
              >
                Automate your work{" "}
                <span className="text-accent">as simple as conversation</span>
              </h2>
              <p className="mb-8 text-base leading-relaxed text-secondary">
                <strong className="font-semibold text-primary">Plan, configure, and deliver</strong> — just describe the work in conversation, Denker creates, configures, and runs your workflow. No setup hours. No learning curve.
              </p>
              <a
                href="#community"
                className="mb-10 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-bold text-canvas transition-opacity hover:opacity-80 max-sm:w-full sm:w-fit"
              >
                Join Waitlist
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Pill icon={Icons.Zap}         label="Workflow"   />
                <Pill icon={Icons.Clock}       label="Schedule"   />
                <Pill icon={Icons.ShieldCheck} label="Approval"   />
                <Pill icon={Icons.Plug}        label="Connector"  />
              </div>
            </div>

            {/* Visual — right */}
            <WorkflowVisual />

          </div>
        </div>
      </div>

      {/* ── Memory — visual left, text right ── */}
      <div className="flex items-center px-5 py-20 sm:px-6 lg:min-h-screen lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Visual — left on desktop, below text on mobile */}
            <div className="order-2 lg:order-1">
              <MemoryVisual />
            </div>

            {/* Copy — right on desktop, above visual on mobile */}
            <div className="order-1 flex flex-col justify-center lg:order-2">
              <span className="text-section-label mb-5 block">Intelligent Memory</span>
              <h2
                className="text-section-heading mb-6"
              >
                Remember{" "}
                <span className="text-accent">everything that matters</span>
              </h2>
              <p className="mb-8 text-base leading-relaxed text-secondary">
                <strong className="font-semibold text-primary">Every task builds your knowledge graph</strong> — clients, context, preferences, outcomes. Agents surface exactly what&apos;s relevant when it matters, without you repeating yourself.
              </p>
              <a
                href="#community"
                className="mb-10 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-bold text-canvas transition-opacity hover:opacity-80 max-sm:w-full sm:w-fit"
              >
                Join Waitlist
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Pill icon={Icons.Network}  label="Knowledge graph"  />
                <Pill icon={Icons.Eye}    label="Always in context" />
                <Pill icon={Icons.Layers} label="Persistent"        />
                <Pill icon={Icons.Search} label="Semantic search"   />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bento ── */}
      <div className="flex flex-col justify-center px-5 py-20 sm:px-6 lg:min-h-screen lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-14 text-center">
            <h2
              className="text-section-heading"
            >
              Built for thinkers,
              <br />
              <span className="text-accent">powered by simplicity</span>
            </h2>
          </div>

          {/* Row 1 */}
          <div className="mb-4 grid gap-4 lg:grid-cols-3">

            {/* Agent dock — 2/3 */}
            <BentoCard className="lg:col-span-2">
              <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">Agents</span>
              <h3 className="mb-5 text-lg font-bold text-primary" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                Ready-made agents
              </h3>
              <AgentDockCard />
            </BentoCard>

            {/* Integrations — 1/3 */}
            <BentoCard>
              <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">Integrations</span>
              <h3 className="mb-5 text-lg font-bold text-primary" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                Connects to everything you use
              </h3>
              <ConnectionGrid />
            </BentoCard>

          </div>

          {/* Row 2 */}
          <div className="grid gap-4 md:grid-cols-3">

            <BentoCard>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icons.Heart className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-2 font-bold text-primary">Heartbeat</h3>
              <p className="text-sm leading-relaxed text-secondary">
                Agents run 24/7 in the cloud. Close the tab — your work continues on schedule.
              </p>
            </BentoCard>

            <BentoCard>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icons.ShieldCheck className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-2 font-bold text-primary">Always in control</h3>
              <p className="text-sm leading-relaxed text-secondary">
                Set approval gates anywhere. Nothing moves forward without your explicit sign-off.
              </p>
            </BentoCard>

            <BentoCard>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Icons.Cpu className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-2 font-bold text-primary">Autonomous</h3>
              <p className="text-sm leading-relaxed text-secondary">
                Agents plan and track their own tasks. You see every step — steer anytime.
              </p>
            </BentoCard>

          </div>
        </div>
      </div>

    </section>
  );
}
