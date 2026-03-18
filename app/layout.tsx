import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const SITE_URL = "https://www.denker.ai";
const TITLE = "Denker — Where humans and AI agents co-work visually";
const DESCRIPTION =
  "A limitless canvas workspace where your AI agents research, write, code, and automate — all visible in real time. No black boxes. No config hell.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
    { media: "(prefers-color-scheme: light)", color: "#F2F2F7" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Denker",
  },
  description: DESCRIPTION,
  keywords: [
    "AI agents",
    "AI workspace",
    "AI automation",
    "canvas workspace",
    "knowledge graph",
    "workflow automation",
    "AI team",
  ],
  authors: [{ name: "Denker AI" }],
  creator: "Denker AI",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Denker",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Denker — AI agents co-working on a visual canvas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
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
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500&display=optional"
          as="style"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500&display=optional"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
