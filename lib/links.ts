// Login/sign-in destination for all "Get Started" CTAs. Sends users to the
// Denker Space auth flow with the desktop-handoff intent.
export const LOGIN_URL =
  "https://space.denker.ai/auth/login?intent=desktop&next=https%3A%2F%2Fspace.denker.ai%2Fauth%2Fdesktop-handoff";

// Desktop app download for every "Download Denker" button. The 337 MB .dmg is
// hosted on GitHub Releases (too large for the repo), which keeps every version
// permanently: to ship an update, create a new release, upload the new .dmg,
// and point this URL at it — older releases stay available at their own URLs.
//
// NOTE: this URL only works once the v1.0.0 release exists with this asset.
export const DOWNLOAD_URL =
  "https://github.com/chauhannikunj1328/Denker-Website/releases/download/v1.0.0/Denker_latest_universal.dmg";
