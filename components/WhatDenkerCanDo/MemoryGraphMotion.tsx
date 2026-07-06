"use client";

import type { CSSProperties } from "react";
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

// Node positions are % of the slide frame; edges reference node ids. The
// center node is the workspace; leaves appear in save-order, matching the
// staggered reveal delays in globals.css (.memory-graph-node[data-order]).
// Colors mirror the production memory-graph canvas rendering
// (denker-dolcetto/frontend/src/components/shapes/memory-frame/types.ts
// GRAPH_NODE_COLORS) so this CSS/SVG slide reads as the same visual system,
// keyed by each node's closest graph-node type.
const nodes = [
  { id: "denker", label: "Denker AI", x: 48, y: 52, order: 0, color: "#F43F5E" }, // user_profile
  { id: "workspace", label: "Context-aware AI workspace", x: 27, y: 32, order: 1, color: "#06B6D4" }, // project
  { id: "positioning", label: "Why/How/What positioning", x: 66, y: 20, order: 2, color: "#6366F1" }, // document
  { id: "bottlenecks", label: "Reduce doing-everything-yourself bottlenecks", x: 76, y: 38, order: 3, color: "#94A3B8" }, // concept
  { id: "founders", label: "Founders, solo builders, and small teams", x: 24, y: 70, order: 4, color: "#94A3B8" }, // concept
  { id: "jane", label: "jane", x: 50, y: 84, order: 5, color: "#10B981" }, // person
  { id: "onboarding", label: "Onboarding context saved", x: 76, y: 76, order: 6, color: "#14B8A6" }, // preference
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
            pathLength={1}
          />
        ))}
      </svg>
      {nodes.map((node) => (
        <span
          key={node.id}
          className="memory-graph-node"
          data-order={node.order}
          style={{ left: `${node.x}%`, top: `${node.y}%`, "--node-color": node.color } as CSSProperties}
        >
          <i />
          <em>{node.label}</em>
        </span>
      ))}
      <div className="memory-graph-detail">
        <strong>Onboarding context saved</strong>
        <span>Positioning doc — saved from chat</span>
        <span>Investor update draft — Frame</span>
        <span>Taskboard DEN-126 — shipped</span>
      </div>
      <DenkerCursorBubble className="what-denker-graph-bubble">
        Saved to memory. Hover any node to see exactly what Denker keeps.
      </DenkerCursorBubble>
    </div>
  );
}
