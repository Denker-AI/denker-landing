import { NextRequest, NextResponse } from "next/server";
import { getNewsletter } from "@/lib/newsletters";
import { generateNewsletterEmail } from "@/lib/newsletter-email";

/* ── Brand tokens — dolcetto glass style ─────────────────── */
const LOGO_URL = "https://www.denker.ai/logo/logo-white.png";
const F = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FH = "'Satoshi', -apple-system, sans-serif";

const C = {
  bg: "#0A0A0F",
  card: "rgba(255,255,255,0.06)",
  cardSolid: "#101018",
  cardBorder: "rgba(255,255,255,0.15)",
  cardBorderSolid: "#25252f",
  surface: "#1c1c26",
  surfaceBorder: "#252530",
  accent: "#30D158",
  accentLight: "#3AF88C",
  text: "#F5F5F7",
  textSec: "#A1A1A6",
  textMuted: "#636366",
  divider: "#222230",
  specular: "rgba(255,255,255,0.08)",
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function shell(content: string): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark only" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap" rel="stylesheet" />
  <style>
    :root { color-scheme: dark only; }
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    @media only screen and (max-width: 620px) {
      .wrapper { width: 100% !important; padding: 20px 12px !important; }
      .container { width: 100% !important; }
      .content-area { padding: 32px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};">
  <!-- Canvas background with dot grid + gradient blobs -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.bg};background-image:radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px), radial-gradient(ellipse 55% 45% at 15% 25%, rgba(48,209,88,0.14) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 75%, rgba(10,132,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 75% 8%, rgba(167,139,250,0.10) 0%, transparent 65%);background-size:24px 24px, 100% 100%, 100% 100%, 100% 100%;">
    <tr><td align="center" class="wrapper" style="padding:48px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" class="container" style="max-width:560px;width:100%;">

        <!-- Logo -->
        <tr><td align="center" style="padding:0 0 36px;">
          <img src="${LOGO_URL}" alt="Denker" height="28" style="display:inline-block;" />
        </td></tr>

        <!-- Glass card -->
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;overflow:hidden;border:1px solid ${C.cardBorderSolid};background-color:${C.cardSolid};">
            <!-- Specular highlight (top edge) -->
            <tr><td style="height:1px;background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.20) 50%, transparent 100%);"></td></tr>
            <!-- Content -->
            <tr><td class="content-area" style="padding:44px 36px;">
              ${content}
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 0 0;text-align:center;">
          <p style="font-family:${F};font-size:12px;color:${C.textMuted};margin:0 0 6px;line-height:1.6;">
            Denker AI &middot; Hamburg, Germany
          </p>
          <p style="font-family:${F};font-size:12px;margin:0;">
            <a href="https://www.denker.ai" style="color:${C.accent};text-decoration:none;">denker.ai</a>
            <span style="color:${C.textMuted};"> &nbsp;&middot;&nbsp; </span>
            <a href="https://linkedin.com/company/denkerai" style="color:${C.textMuted};text-decoration:none;">LinkedIn</a>
            <span style="color:${C.textMuted};"> &nbsp;&middot;&nbsp; </span>
            <a href="https://www.denker.ai/privacy" style="color:${C.textMuted};text-decoration:none;">Privacy</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Newsletter ─────────────────────────────────────────── */

function newsletterHtml(email: string): string {
  const safe = esc(email);
  return shell(`
    <h1 style="font-family:${FH};font-size:24px;font-weight:700;margin:0 0 20px;color:${C.text};line-height:1.3;">
      You're subscribed
    </h1>

    <p style="font-family:${F};font-size:15px;color:${C.textSec};line-height:1.7;margin:0 0 28px;">
      Welcome to the Denker newsletter. We'll share product updates,
      workflow ideas, and practical guides on working with AI agents.
    </p>

    <!-- Glass card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr><td style="background-color:${C.surface};border:1px solid ${C.surfaceBorder};border-radius:12px;padding:20px 24px;">
        <p style="font-family:${F};font-size:11px;color:${C.textMuted};margin:0 0 6px;text-transform:uppercase;letter-spacing:0.08em;">Subscribed as</p>
        <p style="font-family:${F};font-size:16px;color:${C.text};margin:0;font-weight:600;"><a style="color:${C.text};text-decoration:none;">${safe}</a></p>
      </td></tr>
    </table>

    <p style="font-family:${F};font-size:14px;color:${C.text};margin:0 0 14px;font-weight:600;">
      What to expect
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr>
        <td style="width:20px;vertical-align:top;padding:4px 0;">
          <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${C.accent};"></span>
        </td>
        <td style="font-family:${F};font-size:14px;color:${C.textSec};line-height:1.6;padding-bottom:10px;">
          A short email every 1&ndash;2 weeks &mdash; never more.
        </td>
      </tr>
      <tr>
        <td style="width:20px;vertical-align:top;padding:4px 0;">
          <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${C.accent};"></span>
        </td>
        <td style="font-family:${F};font-size:14px;color:${C.textSec};line-height:1.6;padding-bottom:10px;">
          Feature launches, tips, and behind-the-scenes.
        </td>
      </tr>
      <tr>
        <td style="width:20px;vertical-align:top;padding:4px 0;">
          <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${C.accent};"></span>
        </td>
        <td style="font-family:${F};font-size:14px;color:${C.textSec};line-height:1.6;">
          Unsubscribe anytime with one click.
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr><td align="center">
        <a href="https://www.denker.ai" style="display:inline-block;background-color:${C.accent};color:#000;font-family:${F};font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:99px;">
          Visit Denker &rarr;
        </a>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-top:1px solid ${C.divider};padding-top:20px;">
        <p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;">
          Reply to this email anytime &mdash; we read every one.
        </p>
      </td></tr>
    </table>
  `);
}

/* ── Preview route ──────────────────────────────────────── */

/**
 * GET /api/preview-email                           (newsletter welcome preview)
 * GET /api/preview-email?slug=introducing-denker   (newsletter broadcast preview)
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (slug) {
    const n = getNewsletter(slug);
    if (!n) return NextResponse.json({ error: `Newsletter "${slug}" not found` }, { status: 404 });
    return new NextResponse(generateNewsletterEmail(n), {
      headers: { "Content-Type": "text/html" },
    });
  }

  const html = newsletterHtml("juan@denker.ai");

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
