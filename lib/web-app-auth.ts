const WEB_APP_ORIGIN = "https://space.denker.ai";
const DESKTOP_HANDOFF_URL = `${WEB_APP_ORIGIN}/auth/desktop-handoff`;

function buildWebAppUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, WEB_APP_ORIGIN);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export const webAppAuthUrls = {
  login: buildWebAppUrl("/auth/login"),
  register: buildWebAppUrl("/auth/register"),
  desktopLogin: buildWebAppUrl("/auth/login", {
    intent: "desktop",
    next: DESKTOP_HANDOFF_URL,
  }),
  desktopRegister: buildWebAppUrl("/auth/register", {
    intent: "desktop",
    next: DESKTOP_HANDOFF_URL,
  }),
  mobileDesktopRegister: buildWebAppUrl("/auth/register", {
    platform: "mobile",
    intent: "desktop-handoff",
    next: DESKTOP_HANDOFF_URL,
  }),
} as const;
