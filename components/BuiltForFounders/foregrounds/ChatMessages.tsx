"use client";

import { ArrowUp, ImageIcon, Paperclip, Plus } from "lucide-react";
import { AgentAvatarPreview } from "@/components/production/ui/agent-avatar-preview";
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

// Card 1 foreground — a glass chat surface where Denker drafts and sends a
// reply. Uses production AgentAvatarPreview + DenkerCursorBubble. 480px design.

export function ChatMessages() {
  return (
    <div className="relative" style={{ width: 480 }}>
      <div className="flex flex-col gap-3 rounded-[22px] border border-white/25 bg-white/12 p-4 shadow-[0_30px_70px_-20px_rgba(9,20,40,0.6)] backdrop-blur-2xl">
        {/* incoming */}
        <div className="flex items-start gap-2">
          <AgentAvatarPreview styleKey="glass" seed="Louis Martin" size={28} className="mt-0.5" />
          <div className="rounded-2xl rounded-tl-md bg-white/85 px-3.5 py-2">
            <p className="text-[12px] text-grey-900">Would you be free for a meeting tonight at 8 PM?</p>
            <p className="mt-0.5 text-[9px] text-grey-400">3h ago</p>
          </div>
        </div>

        {/* outgoing */}
        <div className="flex items-start justify-end gap-2">
          <div className="max-w-[78%] rounded-2xl rounded-tr-md bg-white/90 px-3.5 py-2">
            <p className="text-[12px] text-grey-900">
              Hi Louis, I&apos;ve been reviewing our Q3 pipeline. Shifting focus to mid-market accounts could boost this quarter.
            </p>
            <p className="mt-0.5 text-right text-[9px] text-grey-400">3h ago</p>
          </div>
          <AgentAvatarPreview styleKey="glass" seed="Denker" size={28} className="mt-0.5" />
        </div>

        {/* input with Denker-drafted reply */}
        <div className="mt-1 rounded-2xl border border-white/30 bg-white/85 px-3.5 py-2.5">
          <p className="text-[12px] text-grey-900">
            See you at 8 PM in office for discussing sales strategy
            <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-grey-900" />
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-grey-400">
              <Plus className="size-4" />
              <Paperclip className="size-4" />
              <ImageIcon className="size-4" />
            </div>
            <span className="flex size-7 items-center justify-center rounded-full bg-grey-950 text-white">
              <ArrowUp className="size-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Real Denker cursor + glass bubble */}
      <DenkerCursorBubble
        className="![transform:none] !left-[52%] !top-[43%]"
        maxWidthPx={175}
      >
        Sending message to Louis — meeting at 8 PM in office.
      </DenkerCursorBubble>
    </div>
  );
}
