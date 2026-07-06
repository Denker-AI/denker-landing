/**
 * Static port of dolcetto's single Kanban column — header with status dot,
 * name + count, and a card list — for the landing page's motion carousel
 * taskboard demo.
 *
 * Source (read-only reference):
 *   denker-dolcetto/frontend/src/components/shapes/taskboard-frame/kanban-column.tsx
 *
 * Stripped for static display: HTML5 drag-and-drop (drop zone, drag-over
 * state), the "+" create-task modal wiring (button kept as a visual affordance
 * matching production's backlog/todo columns, without a working handler).
 */

import { cn } from "@/lib/cn";
import { Icons } from "@/components/production/ui/icons";
import { STATUS_DOT_COLORS, STATUS_LABELS } from "./task-metadata-chips";
import { KanbanCard } from "./kanban-card";
import type { DemoTask, DemoTaskStatus } from "./types";

const CREATABLE_STATUSES = new Set<DemoTaskStatus>(["backlog", "todo"]);

export interface KanbanColumnProps {
  status: DemoTaskStatus;
  tasks: DemoTask[];
  className?: string;
  /** Per-card extra className hook — used by the landing demo's moving-card choreography. */
  getCardClassName?: (task: DemoTask) => string | undefined;
  /**
   * When set, renders the count as an outgoing/incoming span pair (for the
   * "Done" column's count-up choreography) instead of a plain number.
   */
  countTransitionTo?: number;
}

export function KanbanColumn({
  status,
  tasks,
  className,
  getCardClassName,
  countTransitionTo,
}: KanbanColumnProps) {
  const canCreate = CREATABLE_STATUSES.has(status);
  const statusColor = STATUS_DOT_COLORS[status];

  return (
    <div
      className={cn(
        // Production's real taskboard renders columns with no border or
        // per-column fill — they float directly on the shared liquid-glass
        // board sheet (dolcetto's kanban-column source does carry
        // `border-glass-stroke-faint bg-surface/30`, but that combination is
        // visually imperceptible there; ported as-is it reads as a visible
        // box on the landing page, which doesn't match the real product).
        "flex min-w-[120px] flex-1 flex-col rounded-control",
        className,
      )}
      data-testid={`kanban-column-${status}`}
      data-status={status}
    >
      {/* Column header */}
      <div className="flex shrink-0 items-center gap-1 px-1.5 py-1.5">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
        <span className="min-w-0 flex-1 truncate text-appkit-small font-semibold text-secondary">
          {STATUS_LABELS[status]}
        </span>
        {countTransitionTo != null ? (
          <span className="taskboard-done-count relative shrink-0 text-appkit-mini text-muted">
            <span>{tasks.length}</span>
            <span>{countTransitionTo}</span>
          </span>
        ) : (
          <span className="shrink-0 text-appkit-mini text-muted">{tasks.length}</span>
        )}
        {canCreate && (
          <span
            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded text-muted"
            aria-hidden="true"
            data-testid={`kanban-column-add-${status}`}
          >
            <Icons.Plus className="h-2.5 w-2.5" />
          </span>
        )}
      </div>

      {/* Card list */}
      <div className="scrollbar-none min-h-0 flex-1 space-y-1 overflow-y-auto px-1.5 pb-1.5">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} className={getCardClassName?.(task)} />
        ))}
      </div>
    </div>
  );
}
