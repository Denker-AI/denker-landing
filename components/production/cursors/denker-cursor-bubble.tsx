import { AgentCursorArrow } from "@/components/production/cursors/agent-cursor-arrow";
import {
  cursorGlassStyle,
  cursorTextShadow,
} from "@/components/production/cursors/agent-cursor-glass";
import { cn } from "@/lib/cn";

// Agent cursor + glass speech bubble. Callers position it via `className`
// (e.g. the motion sections' animated bubble classes, or static offsets in
// carousel card stills). `name`/`color` support non-Denker agents.
export function DenkerCursorBubble({
  children,
  className,
  name = "Denker",
  color = "#3AF88C",
  maxWidthPx = 340,
}: {
  children: string;
  className?: string;
  name?: string;
  color?: string;
  maxWidthPx?: number;
}) {
  const agentTextShadow = cursorTextShadow(color);
  return (
    <div className={cn("what-denker-motion-bubble", className)}>
      <AgentCursorArrow
        color={color}
        mode="glass"
        shape="soft"
        liquidLevel={0.3}
        width={17}
        height={22}
        position="relative"
      />
      <div
        className={cn(
          "denker-agent-cursor-bubble pointer-events-auto absolute left-3 top-3",
          "flex w-max shrink-0 flex-col items-start gap-1",
          "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
          "border px-3 py-2 text-appkit-caption font-medium leading-snug"
        )}
        style={{ ...cursorGlassStyle(color), maxWidth: maxWidthPx }}
        data-cursor-tone="normal"
        data-testid="agent-cursor-bubble"
      >
        <span
          className="text-appkit-mini font-semibold leading-none text-[var(--agent-cursor-name-color)]"
          style={{ textShadow: agentTextShadow }}
          data-testid="agent-cursor-name"
        >
          {name}
        </span>
        <div className="flex w-full min-w-0 items-start gap-1">
          <div className="min-w-0 flex-1" data-testid="agent-cursor-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
