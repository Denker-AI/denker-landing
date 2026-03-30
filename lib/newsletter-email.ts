import type { Newsletter } from "./newsletters";

/**
 * Generates the email HTML for a newsletter, ready for Resend broadcasting.
 * Uses Dolcetto dark glass theme with inline styles for email client compatibility.
 *
 * Resend variables: {{{FIRST_NAME}}}, {{{EMAIL}}}, {{{RESEND_UNSUBSCRIBE_URL}}}
 */

const LOGO_URL = "https://www.denker.ai/logo/logo-white.png";
const SITE_URL = "https://www.denker.ai";
const F = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FH = "'Satoshi', -apple-system, sans-serif";

const C = {
  bg: "#0F1115",
  card: "#141821",
  cardBorder: "#1e2230",
  surface: "#1a1f2a",
  surfaceBorder: "#242a36",
  accent: "#3AF88C",
  accentDark: "#044b2b",
  text: "#F5F5F7",
  textSec: "#A1A1A6",
  textMuted: "#636366",
  divider: "#1e2230",
  badgeGreenBg: "rgba(58,248,140,0.12)",
  badgeAmberBg: "rgba(255,214,10,0.12)",
  badgeAmberText: "#FFD60A",
  badgeBlueBg: "rgba(96,165,250,0.12)",
  badgeBlueText: "#60A5FA",
};

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  green: { bg: C.badgeGreenBg, color: C.accent },
  amber: { bg: C.badgeAmberBg, color: C.badgeAmberText },
  blue: { bg: C.badgeBlueBg, color: C.badgeBlueText },
};

function featureHtml(f: Newsletter["features"][number]): string {
  const badge = BADGE_STYLES[f.badgeColor] ?? BADGE_STYLES.green;
  // Skip SVG images — most email clients don't render them
  const hasRasterImage = f.image && !f.image.endsWith(".svg");
  const imageBlock = hasRasterImage
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
        <tr><td align="center">
          <img src="${SITE_URL}${f.image}" alt="${f.title}" width="488" class="responsive-img"
               style="display:block;width:488px;height:auto;max-width:100%;border-radius:12px;border:1px solid ${C.surfaceBorder};" />
        </td></tr>
      </table>`
    : "";

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background-color:${C.surface};border:1px solid ${C.surfaceBorder};border-radius:12px;">
      <tr><td style="padding:24px;">
        <span style="display:inline-block;background-color:${badge.bg};color:${badge.color};font-family:${F};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;padding:4px 10px;border-radius:4px;margin-bottom:12px;">${f.badge}</span>
        <h3 style="font-family:${FH};font-size:20px;font-weight:700;color:${C.text};margin:12px 0 8px;">${f.title}</h3>
        <p style="font-family:${F};font-size:15px;color:${C.textSec};margin:0 0 16px;line-height:1.65;">${f.description}</p>
        ${imageBlock}
        <p style="font-family:${F};font-size:14px;color:${C.textMuted};margin:16px 0 0;line-height:1.6;font-style:italic;">${f.tagline}</p>
      </td></tr>
    </table>`;
}

export function generateNewsletterEmail(newsletter: Newsletter): string {
  const featuresHtml = newsletter.features.map(featureHtml).join("\n");
  const viewInBrowserUrl = `${SITE_URL}/blog/${newsletter.slug}`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark only" />
  <title>${newsletter.subject}</title>
  <style>
    :root { color-scheme: dark only; }
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .wrapper { width: 100% !important; padding: 20px 12px !important; }
      .container { width: 100% !important; }
      .content-area { padding: 32px 16px !important; }
      .responsive-img { width: 100% !important; height: auto !important; }
      .cta-button { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.bg};background-image:radial-gradient(ellipse 60% 50% at 15% 25%, rgba(58,248,140,0.07) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 80% 65%, rgba(255,200,50,0.05) 0%, transparent 70%);background-size:100% 100%, 100% 100%;">

    <!-- View in browser -->
    <tr><td align="center" style="padding:16px 16px 8px;">
      <p style="font-family:${F};font-size:12px;color:${C.textMuted};margin:0;">
        Email not displaying correctly? <a href="${viewInBrowserUrl}" style="color:${C.accent};text-decoration:underline;">View in browser</a>
      </p>
    </td></tr>

    <tr><td align="center" class="wrapper" style="padding:24px 16px 48px;">
      <table width="560" cellpadding="0" cellspacing="0" class="container" style="max-width:560px;width:100%;">

        <!-- Logo -->
        <tr><td align="center" style="padding:0 0 32px;">
          <a href="${SITE_URL}" style="text-decoration:none;">
            <img src="${LOGO_URL}" alt="Denker" height="28" style="display:inline-block;" />
          </a>
        </td></tr>

        <!-- Main card -->
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;overflow:hidden;border:1px solid ${C.cardBorder};background-color:${C.card};">
            <!-- Top highlight line -->
            <tr><td style="height:1px;background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.20) 50%, transparent 100%);"></td></tr>

            <tr><td class="content-area" style="padding:44px 36px;">
              <!-- Greeting -->
              <p style="font-family:${F};font-size:15px;color:${C.textSec};margin:0 0 24px;line-height:1.7;">Hi {{{FIRST_NAME|there}}},</p>

              <!-- Hero heading -->
              <h1 style="font-family:${FH};font-size:28px;font-weight:700;margin:0 0 8px;color:${C.text};line-height:1.2;">${newsletter.heroTitle}</h1>
              <p style="font-family:${FH};font-size:18px;font-weight:500;color:${C.accent};margin:0 0 28px;line-height:1.4;">${newsletter.heroSubtitle}</p>

              <!-- Intro -->
              <p style="font-family:${F};font-size:15px;color:${C.textSec};line-height:1.7;margin:0 0 32px;">${newsletter.intro}</p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr><td style="border-top:1px solid ${C.divider};"></td></tr>
              </table>

              <!-- Features -->
              ${featuresHtml}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0;">
                <tr><td align="center">
                  <a href="${newsletter.cta.url}" class="cta-button" style="display:inline-block;background-color:${C.accent};color:#000;font-family:${F};font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:99px;">${newsletter.cta.text} &rarr;</a>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 0 0;text-align:center;">
          <p style="font-family:${F};font-size:12px;color:${C.textMuted};margin:0 0 6px;line-height:1.6;">Denker AI &middot; Hamburg, Germany</p>
          <p style="font-family:${F};font-size:12px;margin:0;">
            <a href="${SITE_URL}" style="color:${C.accent};text-decoration:none;">denker.ai</a>
            <span style="color:${C.textMuted};"> &nbsp;&middot;&nbsp; </span>
            <a href="https://linkedin.com/company/denkerai" style="color:${C.textMuted};text-decoration:none;">LinkedIn</a>
            <span style="color:${C.textMuted};"> &nbsp;&middot;&nbsp; </span>
            <a href="${SITE_URL}/privacy" style="color:${C.textMuted};text-decoration:none;">Privacy</a>
            <span style="color:${C.textMuted};"> &nbsp;&middot;&nbsp; </span>
            <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${C.textMuted};text-decoration:underline;">Unsubscribe</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
