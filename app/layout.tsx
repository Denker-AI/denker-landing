import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd } from "@/components/json-ld";
import { PostHogProvider } from "@/components/posthog-provider";
import { LinkedInProvider } from "@/components/linkedin-provider";
import { SITE_URL, TITLE, DESCRIPTION } from "@/lib/seo";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../public/fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

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
    "AI team",
    "AI agents",
    "AI workspace",
    "AI agent platform",
    "parallel AI agents",
    "visual AI workspace",
    "AI automation",
    "canvas workspace",
    "knowledge graph",
    "workflow automation",
    "autonomous AI agents",
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
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
        <script
          src="https://rankai.ai/apply.js"
          data-rankai-id="cmo8vcnbu0001xtxtgh0wuhk3"
          crossOrigin="anonymous"
          defer
        />
      </head>
      <body className="antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KB83CWVN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-KB83CWVN"
        />
      </body>
    </html>
  );
}
