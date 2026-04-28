import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.posthog.com snap.licdn.com www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://i.ytimg.com *.ads.linkedin.com www.googletagmanager.com www.google-analytics.com; connect-src 'self' *.posthog.com *.linkedin.com www.google-analytics.com analytics.google.com stats.g.doubleclick.net; frame-src https://www.youtube-nocookie.com https://www.youtube.com; frame-ancestors 'none'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
