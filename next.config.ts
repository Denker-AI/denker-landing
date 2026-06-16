import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [
      {
        // Negative-lookahead excludes /embed so this global block does not
        // emit a second CSP on that route — browsers intersect duplicate CSP
        // headers restrictively, which would silently block embedding.
        source: "/((?!embed$).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.posthog.com snap.licdn.com www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://i.ytimg.com https://peerlist.io *.ads.linkedin.com www.googletagmanager.com www.google-analytics.com; connect-src 'self' https://updates.denker.ai *.posthog.com *.linkedin.com www.google-analytics.com analytics.google.com stats.g.doubleclick.net; frame-src https://www.youtube-nocookie.com https://www.youtube.com; frame-ancestors 'none'",
          },
        ],
      },
      {
        source: "/embed",
        headers: [
          // ALLOWALL is a no-op value; CSP frame-ancestors is the real control.
          // Modern browsers prefer frame-ancestors over X-Frame-Options when both
          // are present, but we need to override the global DENY.
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // YouTube and other providers validate embed eligibility against
          // the `Referer` header. `no-referrer` strips that and triggers
          // "Error 153 / Video player configuration error" — `strict-origin`
          // sends only the origin (`https://www.denker.ai`) which is enough
          // for validation without leaking the full path.
          { key: "Referrer-Policy", value: "strict-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'none'",
              // Next.js App Router ships hydration/runtime scripts even for pure
              // server components — must allow self-hosted scripts or the page
              // hits CSP violations at runtime.
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com https://player.twitch.tv https://www.loom.com https://fast.wistia.net https://fast.wistia.com",
              "frame-ancestors 'self' https://*.denker.ai tauri://localhost http://tauri.localhost",
            ].join("; "),
          },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
