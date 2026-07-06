"use client";

import type { CSSProperties } from "react";
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";
import { FrameFooter } from "@/components/production/shapes/shared/frame-footer";
import { FrameHeader } from "@/components/production/shapes/shared/frame-header";
import { MemoryDetailsPanel } from "@/components/production/shapes/memory/memory-details-panel";
import { MemorySearchBar } from "@/components/production/shapes/memory/memory-search-bar";
import { Icons } from "@/components/production/ui/icons";
import {
  surfaceRoleAttributes,
  surfaceRoleClassName,
} from "@/components/production/ui/surface-contract";
import { GRAPH_NODE_COLORS } from "@/components/production/shapes/memory/types";
import type { DemoMemoryNode } from "@/components/production/shapes/memory/types";
import { cn } from "@/lib/cn";

// Node positions are % of the graph area inside the frame; edges reference
// node ids. The center node ("Denker AI") is the selected node this demo
// clicks. Colors are keyed straight off GRAPH_NODE_COLORS (production truth
// — denker-dolcetto/frontend/src/components/shapes/memory-frame/types.ts)
// by each node's graph-node type, so this reads as the same visual system.
const nodes = [
  { id: "denker", label: "Denker AI", x: 46, y: 50, type: "company" as const },
  { id: "workspace", label: "Context-aware AI workspace", x: 21, y: 28, type: "project" as const },
  { id: "positioning", label: "Why/How/What positioning", x: 68, y: 16, type: "document" as const },
  { id: "bottlenecks", label: "Reduce doing-everything-yourself bottlenecks", x: 80, y: 38, type: "concept" as const },
  { id: "founders", label: "Founders, solo builders, and small teams", x: 18, y: 66, type: "concept" as const },
  { id: "jane", label: "jane", x: 46, y: 86, type: "person" as const },
  { id: "onboarding", label: "Onboarding context saved", x: 78, y: 74, type: "preference" as const },
] as const;

const edges: Array<[string, string]> = [
  ["denker", "workspace"],
  ["denker", "positioning"],
  ["denker", "bottlenecks"],
  ["denker", "founders"],
  ["denker", "jane"],
  ["positioning", "bottlenecks"],
];

const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

// The demo's one detail payoff — what the right panel shows once the
// "Denker AI" node is clicked. Matches the user's production screenshot.
const denkerNodeDetail: DemoMemoryNode = {
  id: "denker",
  label: "Denker AI",
  type: "company",
  description:
    "The project/company being onboarded. Public research and canvas frames describe it as an AI workflow automation / agent workspace product.",
  related: [
    {
      id: "positioning",
      label: "Why/How/What positioning",
      type: "document",
      claim:
        "Denker AI's positioning direction is: Why = good work starts when intent is captured clearly; How = stay close to workflow and preserve context; What = a context-aware AI workspace…",
      confidence: 0.86,
      sourceType: "session_extraction",
    },
    {
      id: "workspace",
      label: "Context-aware AI workspace",
      type: "project",
      claim:
        "Denker AI's product vision is a context-aware AI workspace / agent team that keeps context intact as work moves from intent to execution.",
      confidence: 0.82,
      sourceType: "session_extraction",
    },
  ],
};

export function MemoryGraphMotion({
  state,
}: {
  state: "hidden" | "playing" | "final";
}) {
  return (
    <div
      aria-hidden="true"
      className="what-denker-motion-layer what-denker-graph-motion"
      data-active={state !== "hidden" ? "true" : undefined}
      data-motion-state={state}
    >
      <div
        className={cn(surfaceRoleClassName("frame"), "liquid-glass what-denker-memory-shell border")}
        {...surfaceRoleAttributes("frame", {
          nativeLevel: "root",
          nativeGroup: "landing-memory-preview",
        })}
      >
        <FrameHeader
          title="Denker Knowledge Graph"
          icon={Icons.Network}
          accentColor="bg-accent"
          agentName="Denker"
          pinned
          onTogglePin={() => undefined}
          onHide={() => undefined}
          data-testid="what-denker-memory-frame-header"
        />

        <div className="what-denker-memory-body relative min-h-0 flex-1 overflow-hidden">
          <MemorySearchBar className="what-denker-memory-search absolute left-2 top-2 z-10 w-40" />

          <svg
            className="memory-graph-edges"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {edges.map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={nodeById[a].x}
                y1={nodeById[a].y}
                x2={nodeById[b].x}
                y2={nodeById[b].y}
              />
            ))}
          </svg>
          {nodes.map((node) => (
            <span
              key={node.id}
              className="memory-graph-node"
              data-node-id={node.id}
              data-selectable={node.id === "denker" ? "true" : undefined}
              style={
                {
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  "--node-color": GRAPH_NODE_COLORS[node.type],
                } as CSSProperties
              }
            >
              <i />
              <em>{node.label}</em>
            </span>
          ))}

          {/* Zoom controls — bottom-right of the graph area, matching
              production's memory-graph.tsx zoom cluster (decorative here). */}
          <div className="what-denker-memory-zoom nodrag nowheel absolute bottom-2 right-2 flex flex-col gap-1">
            <span className="what-denker-memory-zoom-btn">
              <Icons.Plus className="h-2.5 w-2.5" />
            </span>
            <span className="what-denker-memory-zoom-btn">
              <Icons.Minus className="h-2.5 w-2.5" />
            </span>
            <span className="what-denker-memory-zoom-btn">
              <Icons.RotateCcw className="h-2.5 w-2.5" />
            </span>
          </div>

          <DenkerCursorBubble className="what-denker-graph-bubble">
            Searching memory: onboarding context…
          </DenkerCursorBubble>
        </div>

        <FrameFooter
          onComment={() => undefined}
          onExpand={() => undefined}
          onDelete={() => undefined}
          data-testid="what-denker-memory-frame-footer"
        />
      </div>

      <div className="what-denker-memory-panel-wrap">
        <div
          className="what-denker-memory-panel border"
          {...surfaceRoleAttributes("panel", { nativeLevel: "island" })}
        >
          <MemoryDetailsPanel node={denkerNodeDetail} />
        </div>
      </div>
    </div>
  );
}
