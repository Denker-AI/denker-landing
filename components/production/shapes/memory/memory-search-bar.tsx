/**
 * Static port of dolcetto's memory-frame search pill, for the landing page's
 * motion carousel memory-graph demo.
 *
 * Source (read-only reference):
 *   denker-dolcetto/frontend/src/components/shapes/memory-frame/memory-search-bar.tsx
 *
 * Stripped for static display: search state, result list, global-search
 * consumption, graph-centering side effects. This demo never types into it —
 * it's the idle "Search nodes…" affordance seen top-left of the frame.
 */

import { Icons } from "@/components/production/ui/icons";
import { cn } from "@/lib/cn";

export function MemorySearchBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-6 items-center gap-1.5 rounded-control border border-glass-stroke-light bg-glass-fill px-2",
        className,
      )}
      data-testid="memory-frame-search"
    >
      <Icons.Search className="h-2.5 w-2.5 shrink-0 text-muted" />
      <span className="min-w-0 flex-1 truncate text-appkit-mini text-muted">
        Search nodes…
      </span>
    </div>
  );
}
