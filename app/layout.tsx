import type { Metadata } from "next";
import { Geist, Roboto } from "next/font/google";
import { StartAtTop } from "@/components/ui/StartAtTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Denker AI | Your AI Coworker",
  description:
    "Never again follow every AI conversation manually, let your AI coworker follow where you work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${roboto.variable} h-full overflow-x-hidden antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </head>
      <body className="min-h-full min-w-[320px] flex flex-col overflow-x-hidden bg-grey-950 text-white">
        <StartAtTop />
        {children}
      </body>
    </html>
  );
}
