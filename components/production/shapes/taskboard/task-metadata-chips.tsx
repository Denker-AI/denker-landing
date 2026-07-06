/**
 * Static port of dolcetto's shared task metadata chip components, for the
 * landing page's motion carousel taskboard demo.
 *
 * Source (read-only reference):
 *   denker-dolcetto/frontend/src/components/shapes/taskboard-frame/task-metadata-chips.tsx
 *   denker-dolcetto/frontend/src/components/shapes/taskboard-frame/ship-status-chip.tsx
 *
 * Stripped for static display only: no store/API types, no click handlers,
 * no note previews. `ShipStatusChip` is folded in here (its dolcetto file is
 * mostly resolution logic) as a small static sub-component.
 */

import { cn } from "@/lib/cn";
import { Icons } from "@/components/production/ui/icons";
import type { DemoTaskPriority, DemoTaskStatus, ShipState } from "./types";

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

/** Calendar icon + relative due date text, red if overdue. */
export function DueDateChip({
  label,
  isOverdue,
  className,
}: {
  label: string;
  isOverdue?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5",
        isOverdue ? "text-danger" : "text-muted",
        className,
      )}
      data-testid="due-date-chip"
    >
      <Icons.Calendar className="h-2.5 w-2.5" />
      <span>{label}</span>
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

/* ── Ship status chip (folded in from dolcetto's ship-status-chip.tsx) ──── */

type ShipVariant = "neutral" | "blue" | "amber" | "red" | "green" | "purple";

const SHIP_VARIANT_CLASSES: Record<ShipVariant, string> = {
  // dolcetto's source references `bg-glass-fill-faint`, which isn't a real
  // token there either (nearest defined fill is `glass-fill`) — using the
  // real token rather than porting the dead class name.
  neutral: "border-glass-stroke-faint bg-glass-fill text-muted",
  blue: "border-status-selected/40 bg-status-selected/15 text-status-selected",
  amber: "border-warning/40 bg-warning/15 text-warning",
  red: "border-danger/40 bg-danger/15 text-danger",
  green: "border-success/40 bg-success/15 text-success",
  // No dedicated status-merged token; --color-accent-purple is the nearest match.
  purple: "border-accent-purple/40 bg-accent-purple/15 text-accent-purple",
};

/** Static ship-code / PR / merge status chip (demo data drives label + variant directly). */
export function ShipStatusChip({
  state,
  className,
}: {
  state: ShipState | null;
  className?: string;
}) {
  if (!state) return null;

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded border px-1.5 text-appkit-mini font-medium",
        SHIP_VARIANT_CLASSES[state.variant],
        className,
      )}
      data-testid="ship-status-chip"
    >
      {state.icon === "spinner" && (
        <Icons.Loader className="h-2.5 w-2.5 animate-spin" />
      )}
      {state.icon === "check" && <Icons.Check className="h-2.5 w-2.5" />}
      {state.icon === "x" && <Icons.X className="h-2.5 w-2.5" />}
      <span>{state.label}</span>
    </span>
  );
}

/** Full metadata row for a demo task — ticket, due date, agent, comments, ship status. */
export function TaskMetadataRow({
  task,
  className,
}: {
  task: {
    ticket: string;
    due: string;
    dueOverdue?: boolean;
    agent: string;
    agentColor: string;
    comments: number;
    commentsAgentAuthored?: boolean;
    ship: ShipState | null;
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
      <DueDateChip
        label={task.due}
        isOverdue={task.dueOverdue}
        className={chipSize}
      />
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
      <ShipStatusChip state={task.ship} />
    </div>
  );
}
