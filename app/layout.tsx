import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd } from "@/components/json-ld";
import { PostHogProvider } from "@/components/posthog-provider";
import { LinkedInProvider } from "@/components/linkedin-provider";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../public/fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

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
    <html lang="en" className={`dark ${satoshi.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className="antialiased">
        <PostHogProvider />
        <LinkedInProvider />
        {children}
        <CookieConsent />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=9957393&fmt=gif"
          />
        </noscript>
      </body>
    </html>
  );
}
