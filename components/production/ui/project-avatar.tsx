import { cn } from "@/lib/cn";
import { DenkerLogo } from "./logo";

/**
 * ProjectAvatar — colored project avatar, or a monochrome Denker mark for Home.
 *
 * Used in the browse tree, frame list, and project settings section.
 * Text color adapts to background luminance (white on dark, black on light).
 */

interface ProjectAvatarProps {
  name: string;
  color: string;
  size?: "sm" | "default";
  isHome?: boolean;
  className?: string;
  "data-testid"?: string;
}

/**
 * Determines whether a hex color is "dark" by computing relative luminance.
 * Returns true if text should be white, false if text should be black.
 */
function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  // Perceived luminance (sRGB)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

export function ProjectAvatar({
  name,
  color,
  size = "default",
  isHome = false,
  className,
  "data-testid": testId = "project-avatar",
}: ProjectAvatarProps) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  const textColor = isDarkColor(color) ? "#FFFFFF" : "#000000";
  const homeLogoHeight = size === "sm" ? 10 : 16;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-control-sm font-bold",
        size === "sm"
          ? "h-4 w-4 text-appkit-mini"
          : "h-6 w-6 text-appkit-caption",
        isHome &&
          "denker-home-project-avatar bg-transparent text-[var(--color-readable-overlay-primary)] shadow-none",
        className,
      )}
      style={isHome ? undefined : { backgroundColor: color, color: textColor }}
      data-testid={testId}
      aria-label={`${name} avatar`}
    >
      {isHome ? (
        <DenkerLogo
          variant="symbol"
          color="currentColor"
          height={homeLogoHeight}
          className="denker-home-project-logo -translate-x-px"
        />
      ) : (
        letter
      )}
    </span>
  );
}

export type { ProjectAvatarProps };
