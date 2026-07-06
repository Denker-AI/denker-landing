type ProductionProjectState = {
  currentProject: { id: string; name: string } | null;
  currentSpace: { id: string; ticket_prefix: string } | null;
};

const state: ProductionProjectState = {
  currentProject: { id: "demo-project", name: "Denker" },
  currentSpace: { id: "demo-space", ticket_prefix: "WEL" },
};

export function useProjectStore<T>(selector: (state: ProductionProjectState) => T): T {
  return selector(state);
}
