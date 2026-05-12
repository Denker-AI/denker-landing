import { ImageResponse } from "next/og";
import { getPost, CATEGORY_LABELS } from "@/lib/newsletters";
import { SITE_URL } from "@/lib/seo";

export const runtime = "edge";
export const alt = "Denker Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_ACCENT: Record<string, string> = {
  newsletter: "#3AF88C",
  changelog: "#60A5FA",
  "use-case": "#FBBF24",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  /* Satori (next/og) only accepts OTF/TTF, not WOFF2 — use the local TTF files. */
  const [fontBold, fontMedium, logoUrl] = await Promise.all([
    fetch(new URL("../../_fonts/satoshi-700.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("../../_fonts/satoshi-500.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("/logo/logo-white.svg", SITE_URL))
      .then((r) => r.text())
      .then((svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`),
  ]);

  const title = post?.heroTitle ?? "Denker Blog";
  const category = post?.category ?? "newsletter";
  const accent = CATEGORY_ACCENT[category] ?? "#3AF88C";
  const categoryLabel = post ? CATEGORY_LABELS[post.category] : "Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0A0A0F",
          padding: "72px 80px",
          fontFamily: "Satoshi, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 600,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${accent}18 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -60,
            width: 480,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,200,50,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: 999,
              border: `1px solid ${accent}40`,
              backgroundColor: `${accent}15`,
              color: accent,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {categoryLabel}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              fontSize: title.length > 60 ? 52 : 64,
              fontWeight: 700,
              color: "#F2F2F7",
              lineHeight: 1.1,
              margin: 0,
              maxWidth: 900,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 28,
          }}
        >
          {/* Real Denker wordmark — replaces the previous placeholder square. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Denker" width={130} height={32} style={{ width: 130, height: 32 }} />

          <span
            style={{
              fontSize: 16,
              color: "rgba(242,242,247,0.4)",
              fontWeight: 500,
            }}
          >
            denker.ai
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Satoshi", data: fontBold, weight: 700, style: "normal" },
        { name: "Satoshi", data: fontMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
