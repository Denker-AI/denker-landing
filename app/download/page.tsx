import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, DESCRIPTION } from "@/lib/seo";
import { DownloadClient } from "./download-client";

export const metadata: Metadata = {
  title: "Download Denker for macOS",
  description: DESCRIPTION,
  alternates: { canonical: "/download" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Download Denker for macOS",
    description: DESCRIPTION,
    url: "https://www.denker.ai/download",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Denker for macOS",
    description: DESCRIPTION,
  },
};

export default function DownloadPage() {
  return <DownloadClient />;
}
