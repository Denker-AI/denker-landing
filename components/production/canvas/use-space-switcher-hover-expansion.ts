import { useCallback, useEffect, useRef, useState } from "react";

const SPACE_SWITCHER_HOVER_EXPAND_DELAY_MS = 180;
const SPACE_SWITCHER_HOVER_COLLAPSE_DELAY_MS = 340;
const PROJECT_ID_SEPARATOR = "\x1f";

function joinSpaceSwitcherProjectIds(projectIds: readonly string[]): string {
  return projectIds.join(PROJECT_ID_SEPARATOR);
}

function splitSpaceSwitcherProjectIds(projectIdKey: string): string[] {
  return projectIdKey ? projectIdKey.split(PROJECT_ID_SEPARATOR) : [];
}

function useSpaceSwitcherHoverExpansion({
  delayed,
  autoExpand,
  projectIdKey,
}: {
  delayed: boolean;
  autoExpand: boolean;
  projectIdKey: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[] | null>(
    null,
  );
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoExpandedRef = useRef(false);

  const clearExpandTimer = useCallback(() => {
    if (expandTimerRef.current !== null) clearTimeout(expandTimerRef.current);
    expandTimerRef.current = null;
  }, []);

  const clearCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current !== null)
      clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = null;
  }, []);

  const resetHoverExpansion = useCallback(() => {
    clearExpandTimer();
    clearCollapseTimer();
    autoExpandedRef.current = false;
    setHovered(false);
    setExpandedProjectIds(null);
  }, [clearCollapseTimer, clearExpandTimer]);

  const scheduleHoverCollapse = useCallback(() => {
    clearExpandTimer();
    autoExpandedRef.current = false;
    if (!delayed || !hovered) {
      resetHoverExpansion();
      return;
    }
    clearCollapseTimer();
    collapseTimerRef.current = setTimeout(() => {
      collapseTimerRef.current = null;
      setHovered(false);
      setExpandedProjectIds(null);
    }, SPACE_SWITCHER_HOVER_COLLAPSE_DELAY_MS);
  }, [
    clearCollapseTimer,
    clearExpandTimer,
    delayed,
    hovered,
    resetHoverExpansion,
  ]);

  const beginHoverExpansion = useCallback(() => {
    clearExpandTimer();
    clearCollapseTimer();
    if (hovered) return;
    setExpandedProjectIds(splitSpaceSwitcherProjectIds(projectIdKey));
    if (!delayed) {
      setHovered(true);
      return;
    }
    expandTimerRef.current = setTimeout(() => {
      expandTimerRef.current = null;
      setHovered(true);
    }, SPACE_SWITCHER_HOVER_EXPAND_DELAY_MS);
  }, [clearCollapseTimer, clearExpandTimer, delayed, hovered, projectIdKey]);

  useEffect(
    () => () => {
      clearExpandTimer();
      clearCollapseTimer();
    },
    [clearCollapseTimer, clearExpandTimer],
  );

  useEffect(() => {
    if (!autoExpand) {
      if (autoExpandedRef.current) scheduleHoverCollapse();
      return;
    }
    autoExpandedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- production space switcher intentionally opens from the mount effect for the landing hero demo.
    beginHoverExpansion();
    return clearExpandTimer;
  }, [autoExpand, beginHoverExpansion, clearExpandTimer, scheduleHoverCollapse]);

  return {
    hovered,
    expandedProjectIds,
    beginHoverExpansion,
    resetHoverExpansion,
    scheduleHoverCollapse,
  };
}

export { joinSpaceSwitcherProjectIds, useSpaceSwitcherHoverExpansion };
