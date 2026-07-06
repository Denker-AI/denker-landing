import { useState } from "react";
import { Icons } from "@/components/production/ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/production/ui";
import { cn } from "@/lib/cn";
import { useDesktopMode } from "@/components/production/stores/desktop-mode-store";

interface FrameFooterProps {
  onCopy?: () => void;
  onComment?: () => void;
  /** Number of comments on this frame — shows a count badge on the comment button */
  commentCount?: number;
  onExpand?: () => void;
  onDelete?: () => void;
  showResize?: boolean;
  onResizeStart?: React.PointerEventHandler;
  /** Custom left-side content — replaces the default action icons */
  children?: React.ReactNode;
  /** Extra icon actions rendered after the default left-side actions */
  inlineActions?: React.ReactNode;
  /** Extra Radix DropdownMenuItem nodes rendered above "Hide frame" */
  extraOverflowItems?: React.ReactNode;
  /** ISO timestamp of last user edit — shows an "edited" pill when set */
  editedByUserAt?: string | null;
  /** Focus-mode chromeless rendering: absolutely overlay the footer and
   *  reveal it only while `chromeVisible` is true (cursor near the frame's
   *  top/bottom edge — see useFrameChromeAutoHide). Forced visible while the
   *  more-menu is open (Radix portals the menu outside the node, which would
   *  otherwise drop the reveal). */
  autoHide?: boolean;
  /** Whether the auto-hidden chrome is currently revealed. Only meaningful
   *  with `autoHide`. */
  chromeVisible?: boolean;
  /** Called when pointer leaves an auto-revealed footer. */
  onChromeMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  "data-testid"?: string;
}

export function FrameFooter({
  onCopy,
  onComment,
  commentCount = 0,
  onExpand,
  onDelete,
  showResize = false,
  onResizeStart,
  children,
  inlineActions,
  extraOverflowItems,
  editedByUserAt,
  autoHide = false,
  chromeVisible = false,
  onChromeMouseLeave,
  className,
  "data-testid": testId,
}: FrameFooterProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const desktopMode = useDesktopMode((s) => s.mode);
  const showExpand = !!onExpand && desktopMode !== "denk";

  return (
    <div
      className={cn(
        "flex w-full items-center border-t border-glass-stroke-faint",
        "min-h-[var(--denk-frame-footer-min-height)] [padding-block-start:var(--denk-frame-footer-padding-block-start)] [padding-block-end:var(--denk-frame-footer-padding-block-end)] [padding-inline:var(--denk-frame-footer-padding-inline)]",
        autoHide &&
          "absolute inset-x-0 bottom-0 z-20 rounded-b-frame bg-surface transition-opacity duration-150",
        autoHide &&
          (chromeVisible || moreOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"),
        className,
      )}
      data-testid={testId}
      data-frame-footer="true"
      onMouseLeave={onChromeMouseLeave}
    >
      {/* Left content: custom children or default action icons */}
      {children ?? (
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onCopy}
            className="rounded p-1 text-muted transition-colors hover:text-secondary"
            aria-label="Copy frame"
            data-testid={testId ? `${testId}-copy` : undefined}
          >
            <Icons.Copy className="h-2.5 w-2.5" />
          </button>

          <button
            type="button"
            onClick={onComment}
            className={cn(
              "relative rounded p-1 transition-colors",
              commentCount > 0
                ? "text-accent hover:text-accent/80"
                : "text-muted hover:text-secondary",
            )}
            aria-label="Comment on frame"
            data-testid={testId ? `${testId}-comment` : undefined}
          >
            <Icons.MessageSquare className="h-2.5 w-2.5" />
            {commentCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-0.5 text-appkit-mini font-bold leading-none text-black">
                {commentCount}
              </span>
            )}
          </button>

          {showExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="rounded p-1 text-muted transition-colors hover:text-secondary"
              aria-label="Expand frame"
              data-testid={testId ? `${testId}-expand` : undefined}
            >
              <Icons.ZoomIn className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      )}

      {inlineActions && (
        <div className="nodrag ml-1 flex items-center gap-0.5">
          {inlineActions}
        </div>
      )}

      {editedByUserAt && (
        <span
          className="ml-1.5 text-tertiary text-appkit-small px-1.5 py-0.5 rounded bg-glass-stroke-faint"
          title={`You edited this on ${new Date(editedByUserAt).toLocaleString()}`}
          data-testid="frame-edited-pill"
        >
          edited
        </span>
      )}

      <div className="flex-1" />

      {/* More menu + resize */}
      <div className="flex items-center gap-1">
        <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "rounded p-1 transition-colors",
                moreOpen ? "text-secondary" : "text-muted hover:text-secondary",
              )}
              aria-label="More options"
              data-testid={testId ? `${testId}-more` : undefined}
            >
              <Icons.MoreHorizontal className="h-2.5 w-2.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            sideOffset={8}
            className="min-w-[120px]"
            data-testid={testId ? `${testId}-menu` : undefined}
          >
            {extraOverflowItems}
            <DropdownMenuItem
              onSelect={() => {
                onDelete?.();
                setMoreOpen(false);
              }}
              aria-label="Hide frame"
              data-testid={testId ? `${testId}-hide` : undefined}
            >
              <Icons.EyeOff className="h-3 w-3" />
              Hide frame
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {showResize && (
          <button
            type="button"
            onPointerDown={onResizeStart}
            className="nodrag cursor-se-resize p-0.5"
            aria-label="Resize frame"
            data-testid={testId ? `${testId}-resize` : undefined}
          >
            <Icons.MoveDiagonal2 className="h-2 w-2 text-muted" />
          </button>
        )}
      </div>
    </div>
  );
}

export type { FrameFooterProps };
