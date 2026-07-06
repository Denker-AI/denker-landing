/**
 * Static port of dolcetto's memory-details-sidebar, for the landing page's
 * motion carousel memory-graph demo.
 *
 * Source (read-only reference):
 *   denker-dolcetto/frontend/src/components/shapes/memory-frame/memory-details-sidebar.tsx
 *   denker-dolcetto/frontend/src/components/shapes/memory-frame/memory-details-content.tsx
 *
 * Layout (verbatim from production, `variant="panel"`):
 *   Header: icon + title + type badge
 *   Description paragraph
 *   Edit / Delete action row (Delete in red)
 *   RELATED (n) list — each item: icon, label, italic quoted claim,
 *     confidence % pill + source tag
 *
 * Stripped for static display: stores (useMemoryStore), API types, edit-mode
 * state/inputs, delete confirmation dialog, close/back navigation, metadata
 * list. This demo only ever shows one node ("Denker AI") already selected.
 */

import { Icons } from "@/components/production/ui/icons";
import { cn } from "@/lib/cn";
import { GRAPH_NODE_COLORS } from "./types";
import type { DemoMemoryNode, GraphNodeType } from "./types";

function getNodeIcon(type: GraphNodeType) {
  switch (type) {
    case "user_profile":
      return <Icons.Heart className="h-4 w-4" />;
    case "person":
      return <Icons.User className="h-4 w-4" />;
    case "company":
      return <Icons.Building2 className="h-4 w-4" />;
    case "project":
      return <Icons.FolderKanban className="h-4 w-4" />;
    case "resource":
      return <Icons.Bookmark className="h-4 w-4" />;
    case "document":
      return <Icons.FileText className="h-4 w-4" />;
    case "concept":
      return <Icons.Lightbulb className="h-4 w-4" />;
    case "process":
      return <Icons.Cog className="h-4 w-4" />;
    case "preference":
      return <Icons.SlidersHorizontal className="h-4 w-4" />;
    case "outcome":
      return <Icons.Target className="h-4 w-4" />;
    case "category":
      return <Icons.Tag className="h-4 w-4" />;
    default:
      return <Icons.FileText className="h-4 w-4" />;
  }
}

export interface MemoryDetailsPanelProps {
  node: DemoMemoryNode;
  className?: string;
}

export function MemoryDetailsPanel({ node, className }: MemoryDetailsPanelProps) {
  const nodeColor = GRAPH_NODE_COLORS[node.type];

  return (
    <div
      className={cn("relative flex min-w-0 flex-col", className)}
      data-testid="memory-details-panel"
    >
      <div className="scrollbar-none space-y-4 px-4 pb-4 pt-4">
        {/* Header */}
        <div className="flex items-start gap-2.5">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-control"
            style={{ backgroundColor: `${nodeColor}15`, color: nodeColor }}
          >
            {getNodeIcon(node.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="break-words text-sm font-semibold leading-snug text-primary">
              {node.label}
            </h4>
            <span
              className="mt-1 inline-block rounded-full px-2 py-0 text-appkit-mini capitalize"
              style={{ backgroundColor: `${nodeColor}15`, color: nodeColor }}
            >
              {node.type === "company" ? "Company" : node.type}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-muted">
          {node.description}
        </p>

        {/* Actions */}
        <div className="flex gap-1.5">
          <button
            type="button"
            className="rounded-full px-2.5 py-1 text-xs text-secondary transition-colors hover:text-primary"
            data-testid="memory-details-edit"
          >
            <Icons.Edit2 className="mr-1 inline h-3 w-3" /> Edit
          </button>
          <button
            type="button"
            className="rounded-full px-2.5 py-1 text-xs text-status-error transition-colors hover:bg-status-error/10"
            data-testid="memory-details-delete"
          >
            <Icons.Trash2 className="mr-1 inline h-3 w-3" /> Delete
          </button>
        </div>

        {/* Related */}
        {node.related.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-appkit-mini font-medium uppercase tracking-wide text-muted">
              <Icons.Link2 className="h-3 w-3" /> Related ({node.related.length})
            </label>
            <div className="space-y-1.5" data-testid="memory-details-related-list">
              {node.related.map((r) => (
                <div
                  key={r.id}
                  className="flex w-full items-start gap-2 rounded-control border border-glass-stroke-faint bg-glass-fill-heavy p-2 text-left"
                  data-testid="memory-details-related-item"
                >
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-control-sm"
                    style={{
                      backgroundColor: `${GRAPH_NODE_COLORS[r.type]}22`,
                      color: GRAPH_NODE_COLORS[r.type],
                    }}
                  >
                    {getNodeIcon(r.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-xs font-medium leading-snug text-primary">
                      {r.label}
                    </p>
                    <p className="whitespace-pre-wrap break-words text-appkit-mini italic leading-relaxed text-muted">
                      &ldquo;{r.claim}&rdquo;
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-appkit-mini font-medium text-accent">
                        {(r.confidence * 100).toFixed(0)}%
                      </span>
                      <span className="rounded-full bg-glass-fill-dense px-1.5 py-0.5 text-appkit-mini text-secondary">
                        {r.sourceType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
