/**
 * Minimal local types for the landing page's static memory-graph demo port.
 *
 * Deliberately NOT the dolcetto `KnowledgeNode` / `ForceGraphNode` API types —
 * only the fields the static markup in memory-details-panel.tsx actually
 * renders. No `@/api` or `@/stores` imports.
 *
 * Source (read-only reference):
 *   denker-dolcetto/frontend/src/components/shapes/memory-frame/types.ts
 */

export type GraphNodeType =
  | "person"
  | "company"
  | "project"
  | "resource"
  | "concept"
  | "document"
  | "chunk"
  | "user_profile"
  | "process"
  | "preference"
  | "outcome"
  | "category";

/** Truth for node-dot/label colors — mirrors dolcetto's GRAPH_NODE_COLORS. */
export const GRAPH_NODE_COLORS: Record<GraphNodeType, string> = {
  person: "#10B981", // Emerald
  company: "#8B5CF6", // Violet
  project: "#06B6D4", // Cyan
  resource: "#F59E0B", // Amber
  document: "#6366F1", // Indigo
  concept: "#94A3B8", // Slate
  chunk: "#64748B", // Slate-600
  user_profile: "#F43F5E", // Rose — central hub
  process: "#EC4899", // Pink
  preference: "#14B8A6", // Teal
  outcome: "#EAB308", // Yellow
  category: "#A78BFA", // Light Violet
};

export interface DemoRelatedNode {
  id: string;
  label: string;
  type: GraphNodeType;
  claim: string;
  confidence: number; // 0.0–1.0
  sourceType: string;
}

export interface DemoMemoryNode {
  id: string;
  label: string;
  type: GraphNodeType;
  description: string;
  related: DemoRelatedNode[];
}
