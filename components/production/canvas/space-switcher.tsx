import {
  useEffect,
  useLayoutEffect,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Icons } from "@/components/production/ui/icons";
import { ProjectAvatar } from "@/components/production/ui/project-avatar";
import { ContextMenu, ContextMenuTrigger } from "@/components/production/ui/context-menu";
import { cn } from "@/lib/cn";
import {
  HOME_ACTIVE_SPACE_COLOR,
  projectColorForDisplay,
} from "@/components/production/lib/home-project-colors";
import { ensureVoiceGlassKeyframes } from "@/components/production/cursors/voice-glass-keyframes";
import {
  compactProjectTintStyle,
  compactSpeakingFillStyle,
  compactSpeakingReflectionStyle,
} from "./space-switcher-glass";
import { getCompactAnchorLayout } from "./space-switcher-compact-anchor";
import { CompactProjectInitial } from "./space-switcher-compact-initial";
import {
  joinSpaceSwitcherProjectIds,
  useSpaceSwitcherHoverExpansion,
} from "./use-space-switcher-hover-expansion";
import {
  surfaceRoleAttributes,
  surfaceRoleClassName,
} from "@/components/production/ui/surface-contract";

/**
 * Space switcher — stacked project avatars with expandable space dots.
 *
 * Projects are tightly stacked (overlapping) with active on top.
 * Hover expands the stack with the same easing as the avatar translations so
 * neighboring chrome moves as one surface instead of snapping to the final
 * footprint.
 * Active project's space dots shown after the stack.
 */

interface SwitcherSpace {
  id: string;
  label: string;
  active?: boolean;
  color?: string;
  isPinned?: boolean;
}

interface SwitcherProject {
  id: string;
  name: string;
  color: string;
  active?: boolean;
  isHome?: boolean;
  isPinned?: boolean;
  spaces: SwitcherSpace[];
}

interface SpaceSwitcherProps {
  projects: SwitcherProject[];
  density?: "regular" | "compact";
  onSelectProject: (projectId: string) => void;
  onSelectSpace: (spaceId: string) => void;
  onAddProject?: () => void;
  onAddSpace?: () => void;
  renderProjectContextMenu?: (project: SwitcherProject) => ReactNode;
  renderSpaceContextMenu?: (
    project: SwitcherProject,
    space: SwitcherSpace,
  ) => ReactNode;
  agentSpeaking?: boolean;
  collapseToCenterProject?: boolean;
  autoExpandCompact?: boolean;
  onCompactAnchorOffsetChange?: (offset: number) => void;
  className?: string;
  "data-testid"?: string;
}

const AVATAR_SIZE = 28;
const COLLAPSED_OVERLAP = -14; // half overlap
const EXPANDED_GAP = 5;
const COLLAPSED_STEP = AVATAR_SIZE + COLLAPSED_OVERLAP;
const EXPANDED_STEP = AVATAR_SIZE + EXPANDED_GAP;
const STACK_TRANSITION = "280ms cubic-bezier(0.22, 1, 0.36, 1)";
const COMPACT_STACK_TRANSITION = "420ms cubic-bezier(0.18, 0.9, 0.18, 1)";
const COMPACT_COLLAPSED_WIDTH = 36;
const COMPACT_CENTER_PADDING_X = 8;
const COMPACT_BASE_PADDING_X = COMPACT_CENTER_PADDING_X / 2;
const COMPACT_GAP = 8;
const DIVIDER_WIDTH = 1;

const TOOLTIP_CLASS =
  "denker-glass-tooltip pointer-events-none absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-canvas-md font-medium opacity-0 transition-opacity group-hover:opacity-100";

function activeSpaceDotColor(project: SwitcherProject): string {
  return project.isHome
    ? HOME_ACTIVE_SPACE_COLOR
    : projectColorForDisplay(project);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function SpaceSwitcher({
  projects,
  density = "regular",
  onSelectProject,
  onSelectSpace,
  onAddProject,
  onAddSpace,
  renderProjectContextMenu,
  renderSpaceContextMenu,
  agentSpeaking = false,
  collapseToCenterProject = false,
  autoExpandCompact = false,
  onCompactAnchorOffsetChange,
  className,
  "data-testid": testId = "space-switcher",
}: SpaceSwitcherProps) {
  const reducedMotion = usePrefersReducedMotion();
  const activeProject = projects.find((p) => p.active);
  const isCompact = density === "compact";
  const centerProject =
    activeProject ?? projects.find((project) => project.isHome) ?? projects[0];
  const useCenteredCompactLayout =
    isCompact && collapseToCenterProject && Boolean(centerProject);

  const collapsedStackOrder = [
    ...projects.filter((p) => !p.active),
    ...projects.filter((p) => p.active),
  ];
  const collapsedProjectIdKey = joinSpaceSwitcherProjectIds(
    collapsedStackOrder.map((project) => project.id),
  );
  const {
    hovered,
    expandedProjectIds,
    beginHoverExpansion,
    scheduleHoverCollapse,
  } = useSpaceSwitcherHoverExpansion({
    delayed: useCenteredCompactLayout,
    autoExpand: autoExpandCompact && useCenteredCompactLayout,
    projectIdKey: collapsedProjectIdKey,
  });
  const showCompactCollapsed =
    useCenteredCompactLayout && !hovered && Boolean(centerProject);
  const showCompactProjectTint =
    showCompactCollapsed && Boolean(centerProject && !centerProject.isHome);

  const projectsById = new Map(
    projects.map((project) => [project.id, project]),
  );
  const expandedProjectIdSet = new Set(expandedProjectIds ?? []);
  const expandedStackOrder =
    expandedProjectIds === null
      ? collapsedStackOrder
      : [
          ...expandedProjectIds.flatMap((projectId) => {
            const project = projectsById.get(projectId);
            return project ? [project] : [];
          }),
          ...projects.filter(
            (project) => !expandedProjectIdSet.has(project.id),
          ),
        ];

  // Expanded order is captured at hover entry. That lets the stack spread out
  // from its collapsed sequence without avatars jumping to new slots mid-hover.
  const stackOrder = showCompactCollapsed
    ? centerProject
      ? [centerProject]
      : []
    : hovered
      ? expandedStackOrder
      : collapsedStackOrder;
  const includeAddProject = !showCompactCollapsed;

  const stackItemCount = stackOrder.length + (includeAddProject ? 1 : 0);

  function getTranslateX(idx: number): number {
    return idx * (hovered ? EXPANDED_STEP : COLLAPSED_STEP);
  }

  const stackWidth =
    AVATAR_SIZE +
    Math.max(0, stackItemCount - 1) *
      (hovered ? EXPANDED_STEP : COLLAPSED_STEP);
  const spaceButtonCount = activeProject ? activeProject.spaces.length + 1 : 0;
  const hasSpaceDivider = Boolean(
    !showCompactCollapsed && activeProject && activeProject.spaces.length > 0,
  );
  const compactExpandedWidth =
    COMPACT_CENTER_PADDING_X +
    (AVATAR_SIZE + projects.length * EXPANDED_STEP) +
    (hasSpaceDivider ? DIVIDER_WIDTH : 0) +
    spaceButtonCount * AVATAR_SIZE +
    (hasSpaceDivider ? 1 : 0) * COMPACT_GAP +
    spaceButtonCount * COMPACT_GAP;
  const compactAnchorLayout = getCompactAnchorLayout({
    hovered,
    stackProjectIds: stackOrder.map((project) => project.id),
    centerProjectId: centerProject?.id,
    includeAddProject,
    expandedWidth: compactExpandedWidth,
    collapsedWidth: COMPACT_COLLAPSED_WIDTH,
    basePaddingX: COMPACT_BASE_PADDING_X,
    avatarSize: AVATAR_SIZE,
    expandedStep: EXPANDED_STEP,
  });
  const stackTransition = useCenteredCompactLayout
    ? COMPACT_STACK_TRANSITION
    : STACK_TRANSITION;

  useLayoutEffect(() => {
    if (useCenteredCompactLayout)
      onCompactAnchorOffsetChange?.(compactAnchorLayout.anchorOffset);
  }, [
    compactAnchorLayout.anchorOffset,
    onCompactAnchorOffsetChange,
    useCenteredCompactLayout,
  ]);

  useEffect(() => {
    if (agentSpeaking) ensureVoiceGlassKeyframes();
  }, [agentSpeaking]);

  function isInternalPointerTransition(event: PointerEvent<HTMLElement>) {
    const relatedTarget = event.relatedTarget;
    return (
      relatedTarget instanceof Node &&
      event.currentTarget.contains(relatedTarget)
    );
  }

  function handleSwitcherPointerEnter(event: PointerEvent<HTMLElement>) {
    if (isInternalPointerTransition(event)) return;
    beginHoverExpansion();
  }

  function handleSwitcherPointerLeave(event: PointerEvent<HTMLElement>) {
    if (isInternalPointerTransition(event)) return;
    if (useCenteredCompactLayout && autoExpandCompact) return;
    scheduleHoverCollapse();
  }

  return (
    <div
      className={cn(
        surfaceRoleClassName("rail"),
        "pointer-events-auto relative isolate inline-flex items-center !overflow-visible",
        isCompact
          ? useCenteredCompactLayout
            ? cn(
                "h-9 justify-center gap-2 px-1",
                "denker-compact-switcher-surface",
                showCompactCollapsed && "denker-compact-circle-surface",
              )
            : "h-9 gap-2 px-2"
          : "h-11 gap-2.5 px-2.5",
        className,
      )}
      style={
        useCenteredCompactLayout
          ? {
              width: compactAnchorLayout.width,
              transition: `width ${stackTransition}`,
              willChange: "width",
            }
          : undefined
      }
      data-testid={testId}
      data-interactive="true"
      role="tablist"
      onPointerEnter={handleSwitcherPointerEnter}
      onPointerLeave={handleSwitcherPointerLeave}
      {...surfaceRoleAttributes("rail", {
        nativeLevel: useCenteredCompactLayout ? "island" : "root",
        nativeGroup: "space-switcher",
      })}
    >
      {showCompactProjectTint && centerProject && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-px z-10 rounded-full"
          data-testid="space-switcher-project-tint"
          style={compactProjectTintStyle(centerProject.color)}
        />
      )}

      {agentSpeaking && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-px z-20 overflow-hidden rounded-[inherit]"
          data-testid={`${testId}-agent-speaking-fill`}
          style={compactSpeakingFillStyle(centerProject?.color ?? "#30D158")}
        >
          <span
            className="absolute -inset-x-12 -inset-y-8"
            data-testid={`${testId}-agent-speaking-reflection`}
            style={compactSpeakingReflectionStyle(
              centerProject?.color ?? "#30D158",
              reducedMotion,
            )}
          />
        </span>
      )}

      <div
        className="relative z-30 flex items-center"
        data-testid="space-switcher-stack"
        style={{
          width: showCompactCollapsed
            ? COMPACT_COLLAPSED_WIDTH
            : Math.max(stackWidth, AVATAR_SIZE),
          height: showCompactCollapsed ? COMPACT_COLLAPSED_WIDTH : AVATAR_SIZE,
          transition: `width ${stackTransition}`,
          willChange: "width",
        }}
      >
        {includeAddProject && (
          <div
            className="absolute left-0 top-0"
            style={{
              transform: `translateX(${getTranslateX(0)}px)`,
              zIndex: 0,
              transition: `transform ${stackTransition}`,
              willChange: "transform",
            }}
          >
            <button
              type="button"
              onClick={onAddProject}
              className={cn(
                "group relative flex h-7 w-7 shrink-0 items-center justify-center rounded-control border border-transparent bg-transparent text-primary",
              )}
              aria-label="Add project"
              data-testid="space-switcher-add-project"
            >
              <Icons.Plus className="h-3.5 w-3.5" />
              {hovered && <span className={TOOLTIP_CLASS}>New project</span>}
            </button>
          </div>
        )}

        {stackOrder.map((project, idx) => {
          const isCollapsedProjectButton = showCompactCollapsed;
          const projectButton = (
            <button
              type="button"
              onClick={() => onSelectProject(project.id)}
              className={cn(
                "group relative flex shrink-0 items-center justify-center border border-transparent bg-transparent",
                isCollapsedProjectButton
                  ? "h-9 w-9 rounded-full"
                  : "h-7 w-7 rounded-control",
              )}
              role="tab"
              aria-selected={project.active}
              aria-label={project.name}
              data-testid={`space-switcher-project-${project.id}`}
            >
              {isCollapsedProjectButton && !project.isHome ? (
                <CompactProjectInitial project={project} />
              ) : (
                <ProjectAvatar
                  name={project.name}
                  color={project.color}
                  isHome={project.isHome}
                  className={cn(
                    isCollapsedProjectButton
                      ? "h-9 w-9 text-appkit-body"
                      : "h-7 w-7 text-appkit-body",
                    useCenteredCompactLayout &&
                      project.isHome &&
                      "denker-compact-home-project-avatar",
                  )}
                />
              )}
              {hovered && <span className={TOOLTIP_CLASS}>{project.name}</span>}
            </button>
          );

          return (
            <div
              key={project.id}
              className="absolute left-0 top-0"
              style={{
                transform: `translateX(${getTranslateX(
                  idx + (includeAddProject ? 1 : 0),
                )}px)`,
                zIndex: project.active ? stackItemCount + 1 : idx + 1,
                transition: `transform ${stackTransition}`,
                willChange: "transform",
              }}
            >
              {renderProjectContextMenu ? (
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    {projectButton}
                  </ContextMenuTrigger>
                  {renderProjectContextMenu(project)}
                </ContextMenu>
              ) : (
                projectButton
              )}
            </div>
          );
        })}
      </div>

      {hasSpaceDivider && (
        <span className="relative z-30 h-5 w-px bg-glass-stroke-subtle" />
      )}

      {!showCompactCollapsed &&
        activeProject?.spaces.map((space) => {
          const spaceButton = (
            <button
              type="button"
              role="tab"
              aria-selected={space.active}
              aria-label={space.label}
              onClick={() => onSelectSpace(space.id)}
              className={cn(
                "group relative z-30 flex h-7 w-7 items-center justify-center rounded-full border border-transparent bg-transparent transition-colors",
              )}
              data-testid={`space-tab-${space.id}`}
            >
              <span
                className={cn(
                  "block rounded-full transition-[background-color,box-shadow,opacity] duration-150",
                  space.active
                    ? "h-3 w-3 border border-glass-stroke-light shadow-[0_0_0_3px_rgba(255,255,255,0.16)]"
                    : "h-1.5 w-1.5 bg-muted opacity-30",
                )}
                style={
                  space.active && activeProject
                    ? { backgroundColor: activeSpaceDotColor(activeProject) }
                    : undefined
                }
              />
              <span className={TOOLTIP_CLASS}>{space.label}</span>
            </button>
          );

          if (!renderSpaceContextMenu) {
            return (
              <span key={space.id} className="contents">
                {spaceButton}
              </span>
            );
          }

          return (
            <ContextMenu key={space.id}>
              <ContextMenuTrigger asChild>{spaceButton}</ContextMenuTrigger>
              {renderSpaceContextMenu(activeProject, space)}
            </ContextMenu>
          );
        })}

      {!showCompactCollapsed && activeProject && (
        <button
          type="button"
          onClick={onAddSpace}
          className={cn(
            "group relative z-30 flex h-7 w-7 items-center justify-center rounded-full border border-transparent bg-transparent text-muted",
          )}
          aria-label="Add space"
          data-testid="space-switcher-add"
        >
          <Icons.Plus className="h-3.5 w-3.5" />
          <span className={TOOLTIP_CLASS}>New space</span>
        </button>
      )}
    </div>
  );
}

export type { SwitcherSpace, SwitcherProject, SpaceSwitcherProps };
