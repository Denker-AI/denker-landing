import { ImageResponse } from "next/og";
import { TITLE, DESCRIPTION } from "@/lib/seo";

export const runtime = "edge";
export const alt = "Denker — Your AI team working in parallel on one canvas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#30D158";
const CANVAS = "#0A0A0F";
const TEXT = "#F2F2F7";

export default async function Image() {
  const [fontBold, fontMedium] = await Promise.all([
    fetch(new URL("./_fonts/satoshi-700.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("./_fonts/satoshi-500.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: CANVAS,
          padding: "80px 88px",
          fontFamily: "Satoshi, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glows mirroring the homepage canvas */}
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 720,
            height: 560,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${ACCENT}1F 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            right: -80,
            width: 560,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,200,50,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 120,
            right: -40,
            width: 380,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,180,80,0.05) 0%, transparent 65%)",
          }}
        />

        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 56 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 4, backgroundColor: CANVAS }} />
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: "-0.01em",
            }}
          >
            Denker
          </span>
        </div>

        {/* Title */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: TEXT,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 980,
              letterSpacing: "-0.025em",
            }}
          >
            {TITLE.replace(/^Denker\s*[—–-]\s*/, "")}
          </p>
          <p
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: "rgba(242,242,247,0.62)",
              lineHeight: 1.35,
              margin: 0,
              marginTop: 28,
              maxWidth: 980,
              letterSpacing: "-0.005em",
            }}
          >
            {DESCRIPTION}
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
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 18,
              fontWeight: 500,
              color: ACCENT,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: ACCENT }} />
            Multiple agents · One canvas · Always under your control
          </span>
          <span style={{ fontSize: 18, color: "rgba(242,242,247,0.45)", fontWeight: 500 }}>
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
