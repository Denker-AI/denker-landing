import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { SwitcherProject } from "./space-switcher";

const COMPACT_PROJECT_INITIAL_STYLE: CSSProperties = {
  color: "var(--color-muted)",
  textShadow: "var(--denk-readable-text-shadow)",
};

function projectInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function CompactProjectInitial({ project }: { project: SwitcherProject }) {
  return (
    <span
      className={cn(
        "pointer-events-none relative z-10 flex h-full w-full items-center justify-center bg-transparent text-appkit-body font-bold leading-none",
      )}
      style={COMPACT_PROJECT_INITIAL_STYLE}
      data-testid="space-switcher-project-initial"
      aria-hidden="true"
    >
      {projectInitial(project.name)}
    </span>
  );
}

export { CompactProjectInitial };
