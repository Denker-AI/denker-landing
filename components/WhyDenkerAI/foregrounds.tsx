import {
  Camera,
  Check,
  FileText,
  Kanban,
  Lock,
  Play,
  Search,
  Sparkles,
  Table2,
  Timer,
} from "lucide-react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { AgentAvatarPreview } from "@/components/production/ui/agent-avatar-preview";

/**
 * Static foreground stills for the "Why Denker AI?" gallery cards (§5 of the
 * 2026-07-06 sections redesign). Each is authored at a fixed ~660px design
 * width; the carousel scales it per breakpoint (see .gallery-card-foreground).
 * No animation — motion lives only in the "Explore what Denker can do" section.
 */

/* Traffic-light window dots */
function WindowDots() {
  return (
    <div className="flex gap-1.5">
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </div>
  );
}

/* ── Card 1 — "It sees what you see." ─────────────────────────────────────
   A browser window playing a video with a screenshot-question input bar
   floating over it. */
export function ScreenUnderstandingStill() {
  return (
    <div className="relative w-[660px] pb-6">
      <div className="overflow-hidden rounded-[18px] border border-white/12 bg-[#0c171c]/95 shadow-[0_34px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl">
        {/* Chrome */}
        <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.04] px-4 py-2.5">
          <WindowDots />
          <div className="flex flex-1 justify-center">
            <div className="flex items-center gap-1.5 rounded-md bg-black/35 px-3 py-1 text-[11px] font-medium text-white/55">
              <Lock className="size-3" />
              <span>youtube.com/watch?v=denker-demo</span>
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* "Video" surface — abstract teal poster (no baked screenshot) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[radial-gradient(120%_120%_at_25%_15%,#1b6f7e_0%,#0e3f52_44%,#081e2b_100%)]">
          <div className="absolute -left-10 top-8 size-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-2 right-6 size-40 rounded-full bg-teal-300/20 blur-3xl" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.14)_50%,transparent_62%)]" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-white/14 ring-1 ring-white/30 backdrop-blur-md">
              <Play className="ml-0.5 size-6 fill-white text-white" />
            </div>
          </div>

          {/* Scrubber */}
          <div className="absolute inset-x-4 bottom-3 flex items-center gap-3">
            <span className="text-[11px] font-medium tabular-nums text-white/85">2:14</span>
            <div className="relative h-1 flex-1 rounded-full bg-white/25">
              <div className="absolute inset-y-0 left-0 w-[38%] rounded-full bg-accent" />
              <div className="absolute left-[38%] top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
            </div>
            <span className="text-[11px] font-medium tabular-nums text-white/60">8:32</span>
          </div>
        </div>
      </div>

      {/* Floating Denker screenshot-question input bar */}
      <div className="absolute inset-x-8 -bottom-1 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-[#0f1c22]/85 px-2.5 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(120%_120%_at_25%_15%,#1b6f7e,#0e3f52)] ring-1 ring-white/15">
          <Camera className="size-4 text-white/85" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <Sparkles className="size-3.5 shrink-0 text-accent" />
          <span className="truncate text-[13px] font-medium text-white/90">
            What&apos;s happening in this scene?
          </span>
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
          <ArrowUp className="size-4 text-[#04140b]" weight="bold" />
        </div>
      </div>
    </div>
  );
}

/* ── Card 2 — "One AI across all your tools." ────────────────────────────
   A Notion-style doc window being filled from Sheets, with a Denker cursor
   bubble narrating the cross-app move. */
export function CrossToolStill() {
  const rows = [
    ["Maya Chen", "Northwind", "maya@northwind.io"],
    ["Leo Park", "Fjord Labs", "leo@fjord.dev"],
    ["Ana Ruiz", "Beacon", "ana@beacon.so"],
  ];
  return (
    <div className="relative w-[660px]">
      <div className="overflow-hidden rounded-[18px] border border-black/5 bg-white shadow-[0_34px_90px_rgba(0,0,0,0.4)]">
        {/* Chrome */}
        <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#f7f7f5] px-4 py-2.5">
          <WindowDots />
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-grey-500">
            <FileText className="size-3.5" />
            <span>Notion — Q3 Outreach</span>
          </div>
        </div>

        <div className="flex h-[318px]">
          {/* Sidebar */}
          <aside className="w-[168px] shrink-0 border-r border-black/[0.05] bg-[#fbfbfa] px-3 py-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-grey-900 text-[10px] font-bold text-white">
                N
              </span>
              <span className="text-[11px] font-semibold text-grey-600">Nova Labs</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-black/[0.03] px-2 py-1 text-[11px] text-grey-400">
              <Search className="size-3" /> Search
            </div>
            <div className="mt-3 space-y-1.5">
              {["Getting Started", "Roadmap", "Meeting Notes"].map((item) => (
                <div key={item} className="flex items-center gap-2 px-1 text-[11.5px] text-grey-500">
                  <FileText className="size-3 text-grey-400" />
                  {item}
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-md bg-accent/12 px-1 py-0.5 text-[11.5px] font-semibold text-grey-800">
                <FileText className="size-3 text-grey-600" />
                Q3 Outreach Contacts
              </div>
            </div>
          </aside>

          {/* Page */}
          <main className="min-w-0 flex-1 px-6 py-5">
            <div className="text-[22px] font-bold leading-tight text-grey-900">
              Q3 Outreach Contacts
            </div>
            <div className="mt-1 text-[12px] text-grey-400">
              Synced from Sheets · updated just now
            </div>

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-lg border border-black/[0.07]">
              <div className="grid grid-cols-[1.1fr_1fr_1.4fr] bg-[#f7f7f5] text-[11px] font-semibold text-grey-500">
                {["Name", "Company", "Email"].map((h) => (
                  <div key={h} className="flex items-center gap-1 border-r border-black/[0.05] px-3 py-2 last:border-r-0">
                    <Table2 className="size-3 text-grey-400" />
                    {h}
                  </div>
                ))}
              </div>
              {rows.map((r, i) => (
                <div
                  key={r[1]}
                  className="grid grid-cols-[1.1fr_1fr_1.4fr] border-t border-black/[0.05] text-[12px] text-grey-700"
                >
                  {r.map((cell, j) => (
                    <div
                      key={j}
                      className="truncate border-r border-black/[0.04] px-3 py-2 last:border-r-0"
                    >
                      {j === 0 ? <span className="font-medium text-grey-800">{cell}</span> : cell}
                    </div>
                  ))}
                  {i === rows.length - 1 && (
                    <div className="col-span-3 flex items-center gap-1.5 border-t border-black/[0.05] px-3 py-1.5 text-[11px] font-medium">
                      <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-accent">
                        <Check className="size-2.5 text-[#04140b]" strokeWidth={3} />
                      </span>
                      <span className="text-grey-500">3 contacts added from Sheets</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Denker cursor bubble narrating the cross-app move */}
      <div className="absolute -bottom-3 right-3 flex max-w-[280px] items-start gap-2 rounded-2xl border border-white/15 bg-[#0f1c22]/90 px-3 py-2 shadow-[0_18px_44px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <AgentAvatarPreview styleKey="glass" seed="Denker" size={22} />
        <div>
          <div className="text-[10px] font-semibold text-accent">Denker</div>
          <div className="text-[12px] font-medium leading-snug text-white/90">
            Fetching contacts from Sheets and creating a doc…
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Card 3 — "Answers become interfaces." ───────────────────────────────
   A Denker canvas where the answer materializes as live frames — a task
   board, an agent roster, and a takeaway report — floating as a workspace. */
function MiniFrameHeader({
  icon: Icon,
  title,
  accent = "bg-accent",
}: {
  icon: typeof Kanban;
  title: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-white/8 px-2.5 py-1.5">
      <span className={`h-3 w-0.5 rounded ${accent}`} />
      <Icon className="size-2.5 text-white/45" />
      <span className="flex-1 truncate text-[10px] font-semibold text-white/70">{title}</span>
      <AgentAvatarPreview styleKey="glass" seed="Denker" size={14} />
    </div>
  );
}

export function CanvasWorkspaceStill() {
  const columns: [string, string, number][] = [
    ["Backlog", "bg-white/25", 2],
    ["In progress", "bg-accent", 1],
    ["Done", "bg-sky-400", 3],
  ];
  const agents: [string, string, string][] = [
    ["Coder", "#60a5fa", "Opening PR #128"],
    ["Research", "#a78bfa", "Drafting brief"],
    ["QA", "#f472b6", "Reviewing build"],
  ];
  return (
    <div className="relative h-[404px] w-[660px]">
      {/* Canvas backdrop with dotted grid */}
      <div className="absolute inset-0 rounded-[18px] bg-[#0a151a]/70 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:18px_18px] ring-1 ring-white/8" />

      {/* Task board frame */}
      <div className="absolute left-5 top-6 w-[320px] overflow-hidden rounded-xl border border-white/12 bg-[#0f1c22]/92 shadow-[0_24px_60px_rgba(0,0,0,0.44)] backdrop-blur-xl">
        <MiniFrameHeader icon={Kanban} title="Task Board" />
        <div className="flex gap-2 p-2.5">
          {columns.map(([name, dot, count]) => (
            <div key={name} className="flex-1">
              <div className="mb-1.5 flex items-center gap-1">
                <span className={`size-1.5 rounded-full ${dot}`} />
                <span className="text-[9px] font-semibold text-white/55">{name}</span>
                <span className="text-[9px] text-white/30">{count}</span>
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: Math.min(count, 2) }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-white/8 bg-white/[0.05] px-2 py-1.5"
                  >
                    <div className="mb-1 h-1 w-3/4 rounded-full bg-white/25" />
                    <div className="h-1 w-1/2 rounded-full bg-white/12" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agents roster frame */}
      <div className="absolute right-4 top-4 w-[220px] overflow-hidden rounded-xl border border-white/12 bg-[#0f1c22]/92 shadow-[0_24px_60px_rgba(0,0,0,0.44)] backdrop-blur-xl">
        <MiniFrameHeader icon={Sparkles} title="Agents" accent="bg-sky-400" />
        <div className="space-y-1.5 p-2.5">
          {agents.map(([name, color, status]) => (
            <div key={name} className="flex items-center gap-2">
              <span
                className="size-6 shrink-0 rounded-full ring-1 ring-white/15"
                style={{ background: `radial-gradient(120% 120% at 30% 20%, ${color}, #0e3f52)` }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold text-white/85">{name}</div>
                <div className="truncate text-[9px] text-white/45">{status}</div>
              </div>
              <span className="size-1.5 rounded-full bg-accent" />
            </div>
          ))}
        </div>
      </div>

      {/* Takeaway report frame */}
      <div className="absolute bottom-5 right-9 w-[300px] overflow-hidden rounded-xl border border-white/12 bg-[#0f1c22]/92 shadow-[0_24px_60px_rgba(0,0,0,0.44)] backdrop-blur-xl">
        <MiniFrameHeader icon={FileText} title="Weekly Takeaways" accent="bg-violet-400" />
        <div className="p-3">
          <div className="mb-2 flex items-end gap-1.5">
            {[38, 60, 44, 78, 52].map((h, i) => (
              <div
                key={i}
                className="w-4 rounded-sm bg-accent/80"
                style={{ height: h, opacity: 0.5 + i * 0.1 }}
              />
            ))}
            <div className="ml-2 flex-1 space-y-1.5">
              <div className="h-1.5 w-full rounded-full bg-white/18" />
              <div className="h-1.5 w-4/5 rounded-full bg-white/12" />
              <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Small timer chip for extra depth */}
      <div className="absolute bottom-8 left-8 flex items-center gap-1.5 rounded-full border border-white/12 bg-[#0f1c22]/92 px-2.5 py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <Timer className="size-3 text-accent" />
        <span className="text-[10px] font-semibold text-white/80">24:12 focus</span>
      </div>
    </div>
  );
}
