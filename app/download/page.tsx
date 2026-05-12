import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { DownloadClient } from "./download-client";

export const metadata: Metadata = {
  title: "Download Denker for macOS",
  description: "Download the Denker desktop app for macOS. Your AI team on one canvas.",
  alternates: { canonical: "/download" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Download Denker for macOS",
    description: "Download the Denker desktop app for macOS. Your AI team on one canvas.",
    url: "https://www.denker.ai/download",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Denker for macOS",
    description: "Download the Denker desktop app for macOS. Your AI team on one canvas.",
  },
};

export default function DownloadPage() {
  return <DownloadClient />;
}
