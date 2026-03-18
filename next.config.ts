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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.posthog.com; style-src 'self' 'unsafe-inline' *.fontshare.com *.googleapis.com; font-src 'self' *.fontshare.com *.gstatic.com; img-src 'self' data: blob:; connect-src 'self' *.posthog.com *.fontshare.com; frame-ancestors 'none'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
