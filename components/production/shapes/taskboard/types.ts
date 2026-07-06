/**
 * Minimal local types for the landing page's static taskboard demo port.
 *
 * Deliberately NOT the dolcetto `Task` API type — only the fields the
 * static markup in kanban-card.tsx / kanban-column.tsx / task-metadata-chips.tsx
 * actually renders. No `@/api` imports.
 */

export type DemoTaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "blocked"
  | "in_review"
  | "done";

export type DemoTaskPriority = "urgent" | "high" | "medium" | "low";

export interface ShipState {
  label: string;
  variant: "neutral" | "blue" | "amber" | "red" | "green" | "purple";
  icon?: "check" | "x" | "spinner";
}

export interface DemoTask {
  id: string;
  ticket: string;
  title: string;
  status: DemoTaskStatus;
  priority: DemoTaskPriority;
  agent: string;
  agentColor: string;
  due: string;
  dueOverdue?: boolean;
  comments: number;
  commentsAgentAuthored?: boolean;
  ship: ShipState | null;
}

export interface DemoColumn {
  status: DemoTaskStatus;
  tasks: DemoTask[];
}
