/**
 * Static port of dolcetto's shared task metadata chip components, for the
 * landing page's motion carousel taskboard demo.
 *
 * Source (read-only reference):
 *   denker-dolcetto/frontend/src/components/shapes/taskboard-frame/task-metadata-chips.tsx
 *
 * Stripped for static display only: no store/API types, no click handlers,
 * no note previews. No ship-status chip or due-date chip — the demo cards
 * match production's ticket · agent · comments metadata row exactly.
 */

import { cn } from "@/lib/cn";
import { Icons } from "@/components/production/ui/icons";
import type { DemoTaskPriority, DemoTaskStatus } from "./types";

/* ── Canonical color maps (mirrors dolcetto's STATUS_DOT_COLORS / PRIORITY_BORDER_CLASSES) ── */

export const STATUS_DOT_COLORS: Record<DemoTaskStatus, string> = {
  backlog: "var(--color-muted)",
  todo: "var(--color-status-selected)",
  in_progress: "var(--color-warning)",
  blocked: "var(--color-danger)",
  // No dedicated status-review token; --color-accent-purple is the nearest semantic match.
  in_review: "var(--color-accent-purple)",
  done: "var(--color-accent)",
};

export const PRIORITY_BORDER_CLASSES: Record<DemoTaskPriority, string> = {
  urgent: "border-l-danger",
  high: "border-l-warning",
  medium: "border-l-status-selected",
  low: "border-l-muted",
};

export const STATUS_LABELS: Record<DemoTaskStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  blocked: "Blocked",
  in_review: "In Review",
  done: "Done",
};

/* ── Chip components ───────────────────────────────────────── */

/** Colored dot indicating task status with spec-defined hex colors. */
export function TaskStatusDot({
  status,
  size = 7,
  className,
}: {
  status: DemoTaskStatus;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("shrink-0 rounded-full", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: STATUS_DOT_COLORS[status],
      }}
      aria-label={STATUS_LABELS[status]}
      data-testid="status-dot"
    />
  );
}

/** Small colored dot + agent name. */
export function AgentChip({
  name,
  color,
  className,
}: {
  name: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      data-testid="agent-chip"
    >
      <span
        className="shrink-0 rounded-full"
        style={{ width: 5, height: 5, backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="truncate text-muted">{name}</span>
    </span>
  );
}

/** Comment icon + count, highlighted green when last comment is from an agent. */
export function CommentBadge({
  count,
  isAgentAuthored,
  className,
}: {
  count: number;
  isAgentAuthored?: boolean;
  className?: string;
}) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5",
        isAgentAuthored ? "text-accent" : "text-muted",
        className,
      )}
      data-testid="comment-badge"
    >
      <Icons.MessageSquare className="h-2.5 w-2.5" />
      <span className="text-appkit-mini">{count}</span>
    </span>
  );
}

/** Monospace ticket number display. */
export function TicketChip({
  ticket,
  className,
}: {
  ticket: string;
  className?: string;
}) {
  return (
    <span
      className={cn("font-mono text-muted", className)}
      data-testid="ticket-chip"
    >
      {ticket}
    </span>
  );
}

/** Full metadata row for a demo task — ticket, agent, comments. */
export function TaskMetadataRow({
  task,
  className,
}: {
  task: {
    ticket: string;
    agent: string;
    agentColor: string;
    comments: number;
    commentsAgentAuthored?: boolean;
  };
  className?: string;
}) {
  const chipSize = "text-appkit-mini";

  return (
    <div
      className={cn("flex items-center gap-2 flex-wrap", className)}
      data-testid="task-metadata-row"
    >
      <TicketChip ticket={task.ticket} className={chipSize} />
      <AgentChip
        name={task.agent}
        color={task.agentColor}
        className={chipSize}
      />
      <CommentBadge
        count={task.comments}
        isAgentAuthored={task.commentsAgentAuthored}
        className={chipSize}
      />
    </div>
  );
}
