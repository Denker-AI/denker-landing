import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://eu.i.posthog.com https://eu-assets.i.posthog.com",
              "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
              "font-src 'self' https://cdn.fontshare.com https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self' https://eu.i.posthog.com https://eu-assets.i.posthog.com https://api.fontshare.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
