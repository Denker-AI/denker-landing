type DesktopModeState = {
  mode: "workspace" | "denk";
};

const state: DesktopModeState = { mode: "workspace" };

export function useDesktopMode<T>(selector: (state: DesktopModeState) => T): T {
  return selector(state);
}
