import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this app so Next.js doesn't infer a parent
  // directory when multiple lockfiles exist elsewhere on the machine.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
