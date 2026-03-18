import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Denker — Where humans and AI agents co-work visually",
  description:
    "A limitless canvas workspace where your AI agents research, write, code, and automate — all visible in real time. No black boxes. No config hell.",
  openGraph: {
    title: "Denker — Where humans and AI agents co-work visually",
    description:
      "A limitless canvas workspace where your AI agents research, write, code, and automate — all visible in real time.",
    url: "https://www.denker.ai",
    siteName: "Denker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Denker — Where humans and AI agents co-work visually",
    description:
      "A limitless canvas workspace where your AI agents research, write, code, and automate — all visible in real time.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
