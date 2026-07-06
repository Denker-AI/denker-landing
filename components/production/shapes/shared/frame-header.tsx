import type { LucideIcon } from "lucide-react";
import { Icons } from "@/components/production/ui/icons";
import { AgentAvatarPreview } from "@/components/production/ui/agent-avatar-preview";
import { cn } from "@/lib/cn";
import { useProjectStore } from "@/components/production/stores/project-store";
import type { AgentAvatarStyleKey } from "@/components/production/lib/dicebear-styles";

/**
 * Frame card header — accent bar, icon, title, agent label, pin button, and hide button.
 */

interface FrameHeaderProps {
  /** Frame title (rendered as plain text unless `titleSlot` is provided) */
  title: string;
  /**
   * Optional custom node rendered in place of the plain title. Use when the
   * title needs to be interactive (e.g. a branch picker dropdown). The
   * `title` string is still required for accessibility/fallback.
   */
  titleSlot?: React.ReactNode;
  /** Lucide icon for the frame type */
  icon: LucideIcon;
  /** Frame type accent color class for the bar, e.g. "bg-accent" or "bg-frame-search" */
  accentColor?: string;
  /** Agent name label shown right of title */
  agentName?: string;
  /** Agent avatar seed shown next to the label when available */
  agentAvatarSeed?: string;
  /** Agent avatar style used by the caller's authenticated context */
  agentAvatarStyleKey?: AgentAvatarStyleKey;
  /** Deprecated: agent color is no longer rendered in the frame header */
  agentColor?: string;
  /** Task ticket for badge display */
  taskTicket?: {
    id: string;
    number: number;
    title: string;
  } | null;
  /** Callback when ticket badge is clicked */
  onTaskClick?: (taskId: string) => void;
  /** Whether this frame is pinned */
  pinned?: boolean;
  /** Callback to toggle pin state */
  onTogglePin?: () => void;
  /** Callback to hide the frame without deleting it */
  onHide?: () => void;
  /** Focus-mode chromeless rendering: absolutely overlay the header and
   *  reveal it only while `chromeVisible` is true (cursor near the frame's
   *  top/bottom edge — see useFrameChromeAutoHide). */
  autoHide?: boolean;
  /** Whether the auto-hidden chrome is currently revealed. Only meaningful
   *  with `autoHide`. */
  chromeVisible?: boolean;
  /** Called when pointer leaves an auto-revealed header. */
  onChromeMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  /** Deprecated: status dots are no longer rendered in the frame header */
  statusColor?: string;
  /** Extra action buttons rendered before the pin button */
  children?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function FrameHeader({
  title,
  titleSlot,
  icon: Icon,
  accentColor = "bg-accent",
  agentName,
  agentAvatarSeed,
  agentAvatarStyleKey = "glass",
  taskTicket,
  onTaskClick,
  pinned = false,
  onTogglePin,
  onHide,
  autoHide = false,
  chromeVisible = false,
  onChromeMouseLeave,
  children,
  className,
  "data-testid": testId,
}: FrameHeaderProps) {
  const ticketPrefix = useProjectStore(
    (s) => s.currentSpace?.ticket_prefix ?? "Z",
  );

  return (
    <div
      className={cn(
        "group/header flex w-full items-center border-b border-glass-stroke-faint",
        "min-h-[var(--denk-frame-header-min-height)] gap-[var(--denk-frame-header-gap)] [padding-block-start:var(--denk-frame-header-padding-block-start)] [padding-block-end:var(--denk-frame-header-padding-block-end)] [padding-inline:var(--denk-frame-header-padding-inline)]",
        autoHide &&
          "absolute inset-x-0 top-0 z-20 rounded-t-frame bg-surface transition-opacity duration-150",
        autoHide &&
          (chromeVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"),
        className,
      )}
      data-testid={testId}
      data-frame-header="true"
      onMouseLeave={onChromeMouseLeave}
    >
      {/* Accent bar */}
      <span
        className={cn("h-3 w-0.5 shrink-0 rounded", accentColor)}
        aria-hidden="true"
      />

      {/* Frame type icon */}
      <Icon className="h-2.5 w-2.5 shrink-0 text-muted" aria-hidden="true" />

      {/* Title — custom slot or plain text */}
      {titleSlot ? (
        <span className="flex min-w-0 flex-1 items-center" aria-label={title}>
          {titleSlot}
        </span>
      ) : (
        <span className="flex-1 truncate text-appkit-body font-semibold text-secondary">
          {title}
        </span>
      )}

      {/* Task ticket badge — clickable pill */}
      {taskTicket && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTaskClick?.(taskTicket.id);
          }}
          className="flex-shrink-0 rounded px-1.5 py-0.5 text-appkit-mini font-semibold bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
          data-testid="frame-header-task-badge"
          title={taskTicket.title}
        >
          {ticketPrefix}-{taskTicket.number}
        </button>
      )}

      {/* Agent name */}
      {agentName && (
        <span
          className="flex-shrink-0 inline-flex items-center gap-1"
          data-testid="frame-header-agent"
        >
          {agentAvatarSeed && (
            <AgentAvatarPreview
              styleKey={agentAvatarStyleKey}
              seed={agentAvatarSeed}
              size={24}
              sizeClassName="h-4 w-4"
              data-testid="frame-header-agent-avatar"
            />
          )}
          <span className="truncate text-appkit-mini text-muted max-w-[60px]">
            {agentName}
          </span>
        </span>
      )}

      {/* Extra action buttons */}
      {children}

      {/* Pin button — visible on hover or when pinned */}
      {onTogglePin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
            pinned ? "text-accent" : "text-muted hover:text-secondary",
          )}
          aria-label={pinned ? "Unpin frame" : "Pin frame"}
          data-testid="frame-pin-button"
        >
          <Icons.Pin className={cn("h-2.5 w-2.5", pinned && "fill-current")} />
        </button>
      )}

      {onHide && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onHide();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          className="nodrag flex h-4 w-4 shrink-0 items-center justify-center rounded text-muted transition-colors hover:bg-glass-stroke-subtle hover:text-secondary"
          aria-label="Hide frame"
          data-testid="frame-hide-button"
          title="Hide frame"
        >
          <Icons.X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
}

export type { FrameHeaderProps };
