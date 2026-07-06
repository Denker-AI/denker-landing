// Login/sign-in destination for all "Get Started" CTAs. Sends users to the
// Denker Space auth flow with the desktop-handoff intent.
export const LOGIN_URL =
  "https://space.denker.ai/auth/login?intent=desktop&next=https%3A%2F%2Fspace.denker.ai%2Fauth%2Fdesktop-handoff";

// Desktop app download for every "Download Denker" button. Points at the real
// OS-aware download page, which detects the visitor's platform, auto-triggers
// the production macOS .dmg (resolved from the Tauri updater CDN at
// updates.denker.ai/latest.json), and shows a newsletter fallback for
// Windows/Linux/mobile. Prefer this over linking the raw .dmg so non-Mac
// visitors aren't handed a Mac installer.
//
// When the `/download` page is restored into this repo during the merge,
// change this to the internal path "/download".
export const DOWNLOAD_URL = "https://www.denker.ai/download";
