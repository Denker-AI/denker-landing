"use client";

import { Check } from "lucide-react";
import { AgentAvatarPreview } from "@/components/production/ui/agent-avatar-preview";
import { VoiceListeningGlass } from "@/components/production/cursors/voice-listening-glass";

// Card 2 foreground — the "Choose your agent voice" panel, centered, with a
// small production VoiceListeningGlass pill beneath it. The voice orbs reuse the
// real agent-avatar gradient (AgentAvatarPreview "glass") rather than hand-made
// radial gradients, so they match the avatars used everywhere else in the app.
// 420px design width.

const voices = [
  { name: "Fenrir", note: "Bright, lively", selected: true },
  { name: "Puck", note: "Warm, grounded" },
  { name: "Jessica", note: "Clear, natural" },
  { name: "Sky", note: "Soft, calm" },
];

export function VoicePicker() {
  return (
    <div className="flex flex-col items-center gap-5" style={{ width: 420 }}>
      {/* Glass onboarding panel */}
      <div className="w-full rounded-[24px] border border-white/25 bg-white/12 px-6 py-6 shadow-[0_30px_70px_-20px_rgba(9,20,40,0.6)] backdrop-blur-2xl">
        <h3 className="text-[22px] font-bold leading-tight text-white">Choose your agent voice.</h3>
        <p className="mt-1 text-[13px] font-medium text-white/60">Pick one voice for agent replies.</p>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {voices.map((v) => (
            <div key={v.name} className="flex flex-col items-center gap-2">
              <div className="relative">
                <AgentAvatarPreview
                  styleKey="glass"
                  seed={v.name}
                  size={56}
                  sizeClassName="size-14"
                  className="rounded-full shadow-[inset_0_-6px_12px_rgba(0,0,0,0.22)]"
                />
                {v.selected && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-white text-grey-950 shadow">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[12px] font-semibold text-white">{v.name}</p>
              <p className="-mt-1.5 text-[9px] font-medium text-white/55">{v.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[13px] font-medium text-white/55">Set up later</span>
          <span className="rounded-full bg-accent px-5 py-2 text-[13px] font-semibold text-grey-950">Next</span>
        </div>
      </div>

      {/* Small production voice indicator */}
      <VoiceListeningGlass color="#3AF88C" camera size="compact" surface="dark" />
    </div>
  );
}
