export const COOKIE_KEY = "denker-cookie-consent";

export type ConsentValue = "accepted" | "declined" | null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(COOKIE_KEY) as ConsentValue;
  } catch {
    return null;
  }
}
