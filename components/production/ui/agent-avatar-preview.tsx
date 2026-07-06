import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { generateAgentAvatar } from "@/components/production/lib/dicebear-styles";
import type { AgentAvatarStyleKey } from "@/components/production/lib/dicebear-styles";

interface AgentAvatarPreviewProps {
  styleKey: AgentAvatarStyleKey;
  seed: string;
  size?: number;
  sizeClassName?: string;
  className?: string;
  "data-testid"?: string;
}

const sizeClasses: Record<number, string> = {
  24: "h-appkit-lg w-appkit-lg",
  28: "h-[calc(var(--appkit-space-lg)+var(--appkit-space-2xs))] w-[calc(var(--appkit-space-lg)+var(--appkit-space-2xs))]",
  32: "h-appkit-xl w-appkit-xl",
  36: "h-[calc(var(--appkit-space-xl)+var(--appkit-space-2xs))] w-[calc(var(--appkit-space-xl)+var(--appkit-space-2xs))]",
  40: "h-[calc(var(--appkit-space-xl)+var(--appkit-space-xs))] w-[calc(var(--appkit-space-xl)+var(--appkit-space-xs))]",
};

export function AgentAvatarPreview({
  styleKey,
  seed,
  size = 32,
  sizeClassName,
  className,
  "data-testid": testId = "agent-avatar-preview",
}: AgentAvatarPreviewProps) {
  const dataUri = useMemo(
    () => generateAgentAvatar(styleKey, seed),
    [styleKey, seed],
  );

  const sizeClass = sizeClassName ?? sizeClasses[size];

  return (
    <img
      src={dataUri}
      alt="Agent avatar"
      className={cn(
        "shrink-0 rounded-pill",
        sizeClass ?? "h-appkit-xl w-appkit-xl",
        className,
      )}
      data-testid={testId}
    />
  );
}

export type { AgentAvatarPreviewProps };
