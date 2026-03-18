import type { Metadata } from "next";
import { DenkerLogo } from "@/components/denker-logo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6">
      <a href="/" className="mb-16">
        <DenkerLogo variant="wordmark" height={22} />
      </a>

      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">404</p>
      <h1
        className="mb-4 text-center text-5xl font-black tracking-tight text-primary lg:text-6xl"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        Page not found.
      </h1>
      <p className="mb-10 text-center text-base text-secondary">
        This page doesn&apos;t exist — or it moved somewhere else.
      </p>

      <a
        href="/"
        className="inline-flex h-11 items-center rounded-full bg-primary px-7 text-sm font-bold text-canvas transition-opacity hover:opacity-80"
      >
        Back to home
      </a>
    </div>
  );
}
