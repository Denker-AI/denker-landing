/**
 * Static port of dolcetto's compact Kanban task card, for the landing page's
 * motion carousel taskboard demo.
 *
 * Source (read-only reference):
 *   denker-dolcetto/frontend/src/components/shapes/taskboard-frame/kanban-card.tsx
 *
 * Layout (verbatim from production):
 *   Line 1: [status dot] Title
 *   Line 2: ticket # · due date · agent · comment count · ship status
 *
 * Left border = priority color. No status/priority text (column and border
 * convey those). Stripped for static display: drag-and-drop, stores
 * (useCanvasStore), API types, click handlers, delegation rollup expansion
 * state, note previews.
 */

import { cn } from "@/lib/cn";
import { TaskStatusDot, PRIORITY_BORDER_CLASSES, TaskMetadataRow } from "./task-metadata-chips";
import type { DemoTask } from "./types";

export interface KanbanCardProps {
  task: DemoTask;
  className?: string;
}

export function KanbanCard({ task, className }: KanbanCardProps) {
  const borderClass = PRIORITY_BORDER_CLASSES[task.priority] ?? PRIORITY_BORDER_CLASSES.low;

  return (
    <div
      className={cn(
        "kanban-card rounded border-l-2 bg-elevated/60 px-2 py-1.5",
        borderClass,
        className,
      )}
      data-testid={`kanban-card-${task.id}`}
    >
      {/* Line 1: status dot + title */}
      <div className="flex items-center gap-1.5">
        <TaskStatusDot status={task.status} size={6} />
        <p className="truncate text-appkit-caption text-secondary">{task.title}</p>
      </div>

      {/* Line 2: metadata chips (no status/priority — column and border handle those) */}
      <div className="mt-1 flex flex-wrap items-center gap-1.5 pl-[14px]">
        <TaskMetadataRow task={task} />
      </div>
    </div>
  );
}
