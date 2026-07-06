import type { ReactNode } from "react";

function ContextMenu({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function ContextMenuTrigger({ children }: { asChild?: boolean; children: ReactNode }) {
  return <>{children}</>;
}

export { ContextMenu, ContextMenuTrigger };
