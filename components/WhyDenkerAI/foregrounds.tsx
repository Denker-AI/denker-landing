"use client";

import { List, Lock, Mic, Play, Search } from "lucide-react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { AgentAvatarPreview } from "@/components/production/ui/agent-avatar-preview";
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";
import { Icons } from "@/components/production/ui/icons";
import {
  surfaceRoleAttributes,
  surfaceRoleClassName,
} from "@/components/production/ui/surface-contract";

/**
 * "Why Denker AI?" card foregrounds — clean UI windows rebuilt in code (same
 * approach as the Built-for-Founders foregrounds) and floated over the yellow
 * texture background. Not screenshots: focused, legible surfaces.
 */

function TrafficLights() {
  return (
    <span className="flex gap-1.5">
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </span>
  );
}

const STANDOUTS: [string, string, string][] = [
  ["Mistral", "AI models", "Valued at nearly $14 billion"],
  ["Nebius", "Cloud services", "Inked $19 billion deal with Microsoft"],
  ["Black Forest Labs", "AI images", "Partnered with xAI and Meta"],
  ["Lovable", "AI coding", "Fielding funding offers at $4 billion value"],
  ["Nscale", "Data centers", "Raised $1.1 billion from Nvidia, others"],
  ["Helsing", "Defense", "Valued at nearly $14 billion"],
  ["DeepL", "AI translations", "Valued at $2 billion"],
];

/* Card 1 — "It sees what you see." Browser on a video, Denker asked about the
   on-screen Bloomberg "Europe's AI Standouts" table via the green input bar. */
export function ScreenBrowser() {
  return (
    <div className="relative" style={{ width: 660 }}>
      <div className="overflow-hidden rounded-[14px] border border-grey-950/15 bg-black shadow-[0_34px_80px_-24px_rgba(9,20,40,0.7)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 bg-[#202124] px-3 py-2">
          <TrafficLights />
          <div className="ml-1 flex items-center gap-1.5 rounded-t-md bg-white/10 px-3 py-1 text-[11px] text-white/85">
            <span className="grid h-3 w-4 place-items-center rounded-[2px] bg-[#ff0000]">
              <Play className="size-1.5 fill-white text-white" />
            </span>
            Europe&apos;s AI Standouts - YouTube
          </div>
          <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] text-white/50">
            <Lock className="size-2.5" />
            youtube.com/watch?v=denker-demo
          </div>
        </div>

        {/* YouTube topbar */}
        <div className="flex items-center gap-3 bg-[#0f0f0f] px-3 py-2">
          <List className="size-4 text-white/80" />
          <div className="flex items-center gap-1">
            <span className="grid h-3.5 w-5 place-items-center rounded-[3px] bg-[#ff0000]">
              <Play className="size-2 fill-white text-white" />
            </span>
            <span className="text-[12px] font-semibold text-white">YouTube</span>
          </div>
          <div className="mx-auto flex w-[46%] items-center">
            <div className="flex h-6 flex-1 items-center rounded-l-full border border-white/15 bg-[#121212] px-3 text-[11px] text-white/80">
              ai podcast
            </div>
            <div className="grid h-6 w-9 place-items-center rounded-r-full border border-l-0 border-white/15 bg-[#222]">
              <Search className="size-3.5 text-white/70" />
            </div>
            <div className="ml-2 grid size-6 place-items-center rounded-full bg-[#181818]">
              <Mic className="size-3 text-white/80" />
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="relative aspect-[16/8] bg-[radial-gradient(120%_120%_at_28%_18%,#2b4fb0_0%,#1a63b8_45%,#0f8fbf_100%)]">
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:38px_38px]" />
          {["left-6 top-6", "right-8 top-12", "left-1/3 bottom-14", "right-10 bottom-24"].map((p) => (
            <span key={p} className={`absolute text-[9px] font-semibold text-white/30 ${p}`}>Bloomberg&nbsp;Tech</span>
          ))}

          {/* On-screen standouts table — centered (single video, no split) */}
          <div className="absolute left-1/2 top-3 w-[56%] -translate-x-1/2 rounded-sm bg-black/88 px-3 py-2.5">
            <div className="text-[12px] font-bold text-white">Europe&apos;s AI Standouts</div>
            <div className="mb-1.5 text-[8px] text-white/55">
              European startups fight to prove they can go toe-to-toe with Silicon Valley.
            </div>
            <div className="grid grid-cols-[1fr_1fr_1.6fr] border-b border-white/25 pb-1 text-[7.5px] font-semibold text-white/80">
              <span>Company</span><span>Sector</span><span>Investments</span>
            </div>
            {STANDOUTS.map(([c, s, inv]) => (
              <div key={c} className="grid grid-cols-[1fr_1fr_1.6fr] border-b border-white/10 py-[3px] text-[7.5px] text-white/85">
                <span className="font-medium">{c}</span>
                <span className="text-white/60">{s}</span>
                <span className="text-white/60">{inv}</span>
              </div>
            ))}
            <div className="mt-1 text-right text-[7px] font-semibold text-white/50">Bloomberg</div>
          </div>

          {/* Play button — centered in the video */}
          <div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/35 ring-1 ring-white/25 backdrop-blur-md">
            <Play className="ml-0.5 size-5 fill-white text-white" />
          </div>

          {/* Scrubber */}
          <div className="absolute inset-x-5 bottom-14 flex items-center gap-2">
            <span className="text-[10px] font-medium tabular-nums text-white/85">2:14</span>
            <div className="relative h-0.5 flex-1 rounded-full bg-white/25">
              <div className="absolute inset-y-0 left-0 w-[38%] rounded-full bg-[#ff0000]" />
              <div className="absolute left-[38%] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>
            <span className="text-[10px] font-medium tabular-nums text-white/60">8:32</span>
          </div>

          {/* Real Denker input bar (dark liquid-glass shell) with the
              screenshot camera. Fixed, narrow, and centered so the question
              WRAPS onto a second line and the bar grows taller — it never
              truncates, and it stays inside the portrait mobile crop. */}
          <form
            className={`${surfaceRoleClassName("chrome")} liquid-glass denker-input-bar-shell absolute bottom-4 left-1/2 flex w-[62%] max-w-[380px] -translate-x-1/2 flex-col rounded-[var(--radius-surface-chrome)] border`}
            {...surfaceRoleAttributes("chrome", { nativeLevel: "root", nativeGroup: "input-bar" })}
          >
            <div className="flex min-h-[42px] items-center gap-2 py-1.5 pl-2 pr-3">
              <span className="flex shrink-0 items-center justify-center self-start rounded-full ring-1 ring-accent/80 shadow-glow-accent-sm">
                <AgentAvatarPreview styleKey="glass" seed="Denker" size={30} />
              </span>
              <span className="min-w-0 flex-1 text-appkit-caption font-medium leading-snug text-primary [overflow-wrap:anywhere]">
                Tell me what does this Europe&apos;s AI Standout means?
              </span>
              <span className="flex size-7 shrink-0 items-center justify-center self-start rounded-full text-accent">
                <Icons.Camera className="size-4" />
              </span>
              <span className="flex size-7 shrink-0 items-center justify-center self-start rounded-full text-primary">
                <ArrowUp className="size-4" weight="bold" />
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Card 2 — "One AI across all your tools." Clean Notion (dark) doc with the
   real Denker cursor bubble narrating a Sheets → Notion move. */
export function NotionDoc() {
  const recents = ["User Retention Report", "Daily AI Work Submissions", "Simple AI work tracking", "New submission"];
  return (
    <div className="relative" style={{ width: 660 }}>
      <div className="overflow-hidden rounded-[14px] border border-grey-950/15 bg-[#191919] shadow-[0_34px_80px_-24px_rgba(9,20,40,0.7)]">
        {/* chrome */}
        <div className="flex items-center gap-2 bg-[#202124] px-3 py-2">
          <TrafficLights />
          <div className="ml-1 flex items-center gap-1.5 rounded-t-md bg-white/10 px-3 py-1 text-[11px] text-white/85">
            <span className="grid size-3.5 place-items-center rounded-[3px] bg-white text-[8px] font-bold text-black">N</span>
            Notion — User Retention Report
          </div>
        </div>

        <div className="flex h-[356px]">
          {/* sidebar (clean) */}
          <aside className="flex w-[176px] shrink-0 flex-col gap-3 border-r border-white/8 bg-[#202020] px-3 py-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded bg-[#e0533d] text-[9px] font-bold text-white">D</span>
              <span className="font-medium text-white/85">daksh&apos;s Workspace</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 font-medium text-white/90">
              <span className="text-white/50">⌂</span> Home
            </div>
            <div>
              <div className="mb-1 px-1 text-[9px] font-semibold uppercase tracking-wide text-white/35">Recents</div>
              <div className="space-y-1.5">
                {recents.map((r, i) => (
                  <div key={r} className={`flex items-center gap-1.5 rounded px-1 py-0.5 ${i === 0 ? "bg-white/10 text-white" : "text-white/60"}`}>
                    <span className="text-white/40">▤</span>
                    <span className="truncate">{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1.5 text-white/70">
              <span className="text-[#3af88c]">✦</span> New chat <span className="ml-auto text-white/35">⌘O</span>
            </div>
          </aside>

          {/* page */}
          <main className="relative min-w-0 flex-1 px-9 py-8">
            <div className="mb-1 flex items-center gap-2 text-[11px] text-white/45">
              <span>User Retention Report</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5">🔒 Private</span>
            </div>
            <h3 className="text-[25px] font-bold text-white">User Retention Report</h3>
            <p className="mt-2 text-[13px] text-white/35">Press &lsquo;space&rsquo; for AI or &lsquo;/&rsquo; for commands</p>

            <div className="pointer-events-none absolute left-[78px] top-[124px]">
              <DenkerCursorBubble maxWidthPx={290}>
                Fetching contact from google sheets and creating an document in notion for next meeting…
              </DenkerCursorBubble>
            </div>

            <div className="absolute inset-x-9 bottom-6">
              <div className="mb-2 text-[10px] text-white/35">Get started with</div>
              <div className="flex flex-wrap gap-2 text-[11px] text-white/75">
                {["✦ Ask AI", "◍ AI Meeting Notes", "▦ Database", "▤ Form"].map((b) => (
                  <span key={b} className="rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1">{b}</span>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
