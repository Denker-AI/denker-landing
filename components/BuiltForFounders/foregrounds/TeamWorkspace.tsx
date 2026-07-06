"use client";

import { Hash, Home, LayoutGrid, Sparkles, Users } from "lucide-react";
import { AgentAvatarPreview } from "@/components/production/ui/agent-avatar-preview";
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

// Card 5 foreground — a team-workspace chat where Denker turns a discussion
// into assigned tasks. Authored at 640px width. Uses production
// AgentAvatarPreview + DenkerCursorBubble.

const rail = [
  { icon: Home, label: "Home", active: true },
  { icon: LayoutGrid, label: "Planner" },
  { icon: Sparkles, label: "AI" },
  { icon: Users, label: "Teams" },
];

const spaces = [
  { name: "Nordic Design", count: "" },
  { name: "Design", count: "11", indent: true },
  { name: "Development", count: "12", indent: true },
  { name: "Marketing", count: "2", indent: true },
];

const dms = ["Lucas Martin", "Julien Moreau", "Pierre Dubois", "Thomas Bernard"];

export function TeamWorkspace() {
  return (
    <div className="relative" style={{ width: 640 }}>
      <div className="flex h-[380px] overflow-hidden rounded-[16px] border border-grey-950/10 bg-white shadow-[0_30px_70px_-20px_rgba(9,20,40,0.6)]">
        {/* icon rail */}
        <div className="flex w-14 shrink-0 flex-col items-center gap-4 bg-grey-900 py-4">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-500 text-[11px] font-bold text-white">L</span>
          {rail.map(({ icon: Icon, label, active }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <Icon className={`size-4 ${active ? "text-white" : "text-white/45"}`} />
              <span className={`text-[7px] ${active ? "text-white" : "text-white/40"}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* inner sidebar */}
        <div className="w-40 shrink-0 border-r border-grey-950/8 bg-grey-50 px-2.5 py-3">
          <p className="text-[11px] font-bold text-grey-900">Home</p>
          <div className="mt-2 flex flex-col gap-1 text-[10px] text-grey-600">
            <span>Inbox</span>
            <span>Replies</span>
            <span>My Tasks</span>
          </div>
          <p className="mt-3 text-[8px] font-bold uppercase tracking-wide text-grey-400">Spaces</p>
          <div className="mt-1 flex flex-col gap-1 text-[10px]">
            {spaces.map((s) => (
              <span key={s.name} className={`flex items-center justify-between ${s.indent ? "pl-3 text-grey-600" : "font-medium text-grey-800"}`}>
                <span>{s.name}</span>
                {s.count && <span className="text-grey-400">{s.count}</span>}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[8px] font-bold uppercase tracking-wide text-grey-400">Direct Messages</p>
          <div className="mt-1 flex flex-col gap-1 text-[10px] text-grey-600">
            {dms.map((d, i) => (
              <span key={d} className={`flex items-center gap-1.5 ${i === 0 ? "rounded bg-white px-1 py-0.5 font-medium text-grey-900" : ""}`}>
                <AgentAvatarPreview styleKey="glass" seed={d} sizeClassName="h-3.5 w-3.5" />
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* chat main */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-grey-950/8 px-4 py-2.5">
            <AgentAvatarPreview styleKey="glass" seed="Lucas Martin" size={24} />
            <span className="text-[12px] font-semibold text-grey-900">Lucas Martin</span>
            <div className="ml-3 flex gap-3 text-[10px] text-grey-400">
              <span className="border-b-2 border-grey-900 pb-0.5 font-medium text-grey-900">Chat</span>
              <span>Calendar</span>
              <span>Tasks</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-3 px-4 py-3">
            <div className="flex items-start gap-2">
              <AgentAvatarPreview styleKey="glass" seed="Lucas Martin" size={24} className="mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-grey-900">Lucas Martin <span className="ml-1 font-normal text-grey-400">12:48 PM</span></p>
                <p className="mt-0.5 text-[11px] text-grey-700">Hey — send the weekly sprint report for marketing, urgently.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-grey-950/8 bg-grey-50 px-3 py-2">
              <Hash className="size-3.5 text-grey-400" />
              <span className="text-[10px] text-grey-400">Write to Lucas Martin, press &apos;/&apos; for commands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Denker cursor + glass bubble */}
      <DenkerCursorBubble
        className="![transform:none] !left-[49%] !top-[58%]"
        maxWidthPx={205}
      >
        Turning the marketing-strategy discussion into tasks — one assigned to each teammate.
      </DenkerCursorBubble>
    </div>
  );
}
