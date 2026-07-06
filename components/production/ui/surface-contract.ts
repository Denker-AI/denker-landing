const surfaceRoles = [
  "chrome",
  "toolbar",
  "progress",
  "panel",
  "side-panel",
  "modal",
  "menu",
  "input",
  "rail",
  "frame",
] as const;

type SurfaceRole = (typeof surfaceRoles)[number];

const nativeSurfaceLevels = ["auto", "root", "island", "child"] as const;

type NativeSurfaceLevel = (typeof nativeSurfaceLevels)[number];

interface NativeSurfaceOptions {
  nativeLevel?: NativeSurfaceLevel;
  nativeGroup?: string;
}

const surfaceRoleClasses: Record<SurfaceRole, string> = {
  chrome: "denker-glass-chrome",
  toolbar: "denker-glass-toolbar",
  progress: "denker-glass-progress",
  panel: "denker-glass-surface",
  "side-panel": "denker-glass-rail",
  modal: "denker-glass-rail",
  menu: "denker-glass-menu",
  input: "denker-glass-input",
  rail: "denker-glass-rail",
  frame: "denker-glass-frame",
};

function isSurfaceRole(value: string | null): value is SurfaceRole {
  return surfaceRoles.includes(value as SurfaceRole);
}

function isNativeSurfaceLevel(
  value: string | null,
): value is NativeSurfaceLevel {
  return nativeSurfaceLevels.includes(value as NativeSurfaceLevel);
}

function surfaceRoleClassName(role: SurfaceRole) {
  return surfaceRoleClasses[role];
}

function surfaceRoleAttributes(
  role: SurfaceRole,
  options: NativeSurfaceOptions = {},
) {
  const attrs: {
    "data-denker-surface-role": SurfaceRole;
    "data-denker-native-level"?: NativeSurfaceLevel;
    "data-denker-native-group"?: string;
  } = { "data-denker-surface-role": role };

  if (options.nativeLevel && options.nativeLevel !== "auto") {
    attrs["data-denker-native-level"] = options.nativeLevel;
  }

  const group = options.nativeGroup?.trim();
  if (group) attrs["data-denker-native-group"] = group;

  return attrs;
}

function surfaceHoverClassName() {
  return "denker-glass-hover";
}

export {
  isNativeSurfaceLevel,
  isSurfaceRole,
  nativeSurfaceLevels,
  surfaceHoverClassName,
  surfaceRoleAttributes,
  surfaceRoleClassName,
  surfaceRoles,
};
export type { NativeSurfaceLevel, NativeSurfaceOptions, SurfaceRole };
