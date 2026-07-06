import type { ReactNode } from "react";

function DropdownMenu({ children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuTrigger({ children }: { asChild?: boolean; children: ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuContent({ children, className }: { children?: ReactNode; className?: string; side?: string; align?: string; sideOffset?: number; "data-testid"?: string }) {
  return (
    <div className={className} hidden>
      {children}
    </div>
  );
}

function DropdownMenuItem({ children, onSelect }: { children?: ReactNode; onSelect?: () => void; "aria-label"?: string; "data-testid"?: string }) {
  return (
    <button type="button" onClick={onSelect}>
      {children}
    </button>
  );
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger };
