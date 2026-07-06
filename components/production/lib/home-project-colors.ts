export const HOME_PROJECT_COLOR = "#8E8E93";
export const HOME_ACTIVE_SPACE_COLOR = "#D4D4D8";

export function projectColorForDisplay({
  color,
  isHome,
}: {
  color: string;
  isHome?: boolean;
}) {
  if (isHome) {
    return HOME_PROJECT_COLOR;
  }
  return color;
}
