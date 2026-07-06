interface CompactAnchorLayoutInput {
  hovered: boolean;
  stackProjectIds: string[];
  centerProjectId?: string;
  includeAddProject: boolean;
  expandedWidth: number;
  collapsedWidth: number;
  basePaddingX: number;
  avatarSize: number;
  expandedStep: number;
}

function getCompactAnchorLayout({
  hovered,
  stackProjectIds,
  centerProjectId,
  includeAddProject,
  expandedWidth,
  collapsedWidth,
  basePaddingX,
  avatarSize,
  expandedStep,
}: CompactAnchorLayoutInput) {
  if (!hovered) {
    return { width: collapsedWidth, anchorOffset: collapsedWidth / 2 };
  }

  const anchorProjectIndex = centerProjectId
    ? stackProjectIds.indexOf(centerProjectId)
    : -1;
  const anchorStackIndex =
    anchorProjectIndex < 0
      ? 0
      : anchorProjectIndex + (includeAddProject ? 1 : 0);
  const anchorCenter =
    basePaddingX + anchorStackIndex * expandedStep + avatarSize / 2;

  return {
    width: Math.max(collapsedWidth, expandedWidth),
    anchorOffset: anchorCenter,
  };
}

export { getCompactAnchorLayout };
