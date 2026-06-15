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

const PEERLIST_ASSETS = `${SITE_URL}/blog/assets/denker-peerlist-launch`;
const PEERLIST_URL = "https://peerlist.io/denker/project/denker";

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  green: { bg: C.badgeGreenBg, color: C.accent },
  amber: { bg: C.badgeAmberBg, color: C.badgeAmberText },
  blue: { bg: C.badgeBlueBg, color: C.badgeBlueText },
};

function peerlistDemoHtml({
  title,
  copy,
  image,
  href,
}: {
  title: string;
  copy: string;
  image: string;
  href: string;
}): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0 0;">
      <tr><td>
        <h2 style="font-family:${FH};font-size:21px;font-weight:700;color:#111713;margin:0 0 8px;line-height:1.2;">${title}</h2>
        <p style="font-family:${F};font-size:15px;color:#53655a;margin:0 0 16px;line-height:1.65;">${copy}</p>
        <a href="${href}" style="display:block;text-decoration:none;">
          <img src="${PEERLIST_ASSETS}/${image}" alt="${title}" width="560" class="responsive-img"
               style="display:block;width:560px;height:auto;max-width:100%;" />
        </a>
        <a href="${href}" style="display:inline-block;color:#087a3b;font-family:${F};font-size:14px;font-weight:800;text-decoration:none;margin-top:12px;">Watch with sound</a>
      </td></tr>
    </table>`;
}

function generatePeerlistLaunchEmail(newsletter: Newsletter): string {
  const viewInBrowserUrl = `${SITE_URL}/blog/${newsletter.slug}`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${newsletter.subject}</title>
  <style>
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .wrapper { width: 100% !important; padding: 18px 10px 40px !important; }
      .container { width: 100% !important; }
      .content-area { padding: 28px 20px 30px !important; }
      .responsive-img { width: 100% !important; height: auto !important; }
      .primary-cta { display: block !important; text-align: center !important; }
      .support-cta { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f3f8f3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f8f3;background-image:radial-gradient(circle at 18% 0%, rgba(58,248,140,0.22), transparent 34%),radial-gradient(circle at 85% 18%, rgba(255,255,255,0.92), transparent 34%),linear-gradient(180deg, #ddf8e5 0%, #f7faf5 52%, #eff6ef 100%);">
    <tr><td align="center" style="padding:16px 16px 8px;">
      <p style="font-family:${F};font-size:12px;color:#7f8b83;margin:0;">
        Email not displaying correctly? <a href="${viewInBrowserUrl}" style="color:#087a3b;text-decoration:underline;">View in browser</a>
      </p>
    </td></tr>

    <tr><td align="center" class="wrapper" style="padding:24px 16px 52px;">
      <table width="650" cellpadding="0" cellspacing="0" class="container" style="max-width:650px;width:100%;">
        <tr><td align="center" style="padding:0 0 22px;">
          <a href="${SITE_URL}" style="text-decoration:none;">
            <img src="https://www.denker.ai/logo/logo-black.svg" alt="Denker" width="118" style="display:inline-block;width:118px;height:auto;opacity:0.86;" />
          </a>
        </td></tr>

        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:30px;overflow:hidden;background-color:rgba(255,255,255,0.76);box-shadow:0 28px 90px rgba(30,49,38,0.12);">
            <tr><td class="content-area" style="padding:42px;">
              <span style="display:inline-block;border-radius:99px;background-color:rgba(48,242,124,0.13);color:#087a3b;font-family:${F};font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;padding:6px 11px;margin:0 0 14px;">Peerlist launch</span>
              <h1 style="font-family:${FH};font-size:40px;font-weight:800;color:#111713;margin:0 0 8px;line-height:1.06;">${newsletter.heroTitle}</h1>
              <p style="font-family:${FH};font-size:19px;font-weight:750;color:#1c7d45;margin:0 0 22px;line-height:1.35;">${newsletter.heroSubtitle}</p>
              <p style="font-family:${F};font-size:15px;color:#53655a;line-height:1.68;margin:0 0 12px;">Today we launched Denker on Peerlist.</p>
              <p style="font-family:${F};font-size:15px;color:#53655a;line-height:1.68;margin:0 0 28px;">Speak a task, keep your context, and watch agents execute in one shared workspace.</p>

              <img src="${PEERLIST_ASSETS}/denker-launch-dashboard.png" alt="Denker live on Peerlist" width="566" class="responsive-img"
                   style="display:block;width:566px;height:auto;max-width:100%;border-radius:18px;background-color:#ffffff;" />

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 34px;">
                <tr>
                  <td style="font-family:${F};font-size:14px;color:#53655a;line-height:1.45;">If you like the direction, help more builders find it.</td>
                  <td align="right" style="padding-left:16px;">
                    <a href="${PEERLIST_URL}" class="support-cta" style="display:inline-block;background-color:#30f27c;color:#07130a;font-family:${F};font-size:14px;font-weight:800;text-decoration:none;padding:13px 20px;border-radius:99px;white-space:nowrap;">Support on Peerlist</a>
                  </td>
                </tr>
              </table>

              ${peerlistDemoHtml({
                title: "Speak to Denker",
                copy: "Use voice input without opening another chat tab.",
                image: "voice-input.gif",
                href: `${viewInBrowserUrl}#voice-input-demo`,
              })}
              ${peerlistDemoHtml({
                title: "Watch the task move",
                copy: "Tasks, notes, and outputs stay visible as the workspace changes.",
                image: "task-execution.gif",
                href: `${viewInBrowserUrl}#task-execution-demo`,
              })}

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:34px 0 28px;background-color:rgba(255,255,255,0.50);border-radius:24px;">
                <tr><td style="padding:20px 22px;">
                  <p style="font-family:${F};font-size:15px;color:#53655a;line-height:1.68;margin:0 0 10px;"><strong style="color:#111713;">Voice first.</strong> Talk to the desktop app naturally.</p>
                  <p style="font-family:${F};font-size:15px;color:#53655a;line-height:1.68;margin:0 0 10px;"><strong style="color:#111713;">Real execution.</strong> Agents run tasks in a shared workspace.</p>
                  <p style="font-family:${F};font-size:15px;color:#53655a;line-height:1.68;margin:0;"><strong style="color:#111713;">Visible context.</strong> The work stays on screen.</p>
                </td></tr>
              </table>

              <p style="font-family:${F};font-size:15px;color:#53655a;line-height:1.68;margin:0 0 30px;">Try it on real work. If it feels useful, supporting the Peerlist launch helps more builders find it.</p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center">
                  <a href="${newsletter.cta.url}" class="primary-cta" style="display:block;width:100%;background-color:#30f27c;color:#07130a;font-family:${F};font-size:17px;font-weight:900;text-decoration:none;padding:18px 0;border-radius:99px;">${newsletter.cta.text}</a>
                  <a href="${PEERLIST_URL}" style="display:block;color:#087a3b;font-family:${F};font-size:14px;font-weight:800;text-decoration:none;margin-top:18px;">Support the Peerlist launch</a>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="font-family:${F};font-size:12px;color:#8a958e;margin:0 0 6px;line-height:1.6;">Denker AI &middot; Hamburg, Germany</p>
          <p style="font-family:${F};font-size:12px;margin:0;">
            <a href="${SITE_URL}" style="color:#1c7d45;text-decoration:none;">denker.ai</a>
            <span style="color:#8a958e;"> &nbsp;&middot;&nbsp; </span>
            <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#8a958e;text-decoration:underline;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function featureHtml(f: Newsletter["features"][number]): string {
  const badge = BADGE_STYLES[f.badgeColor] ?? BADGE_STYLES.green;
  // Skip SVG images — most email clients don't render them
  const hasImage = f.image && !f.image.endsWith(".svg");
  // For MP4 videos, use the corresponding GIF for email (auto-plays inline)
  const imageSrc = f.image?.endsWith(".mp4")
    ? `${SITE_URL}${f.image.replace(".mp4", ".gif")}`
    : `${SITE_URL}${f.image}`;
  const imageBlock = hasImage
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
        <tr><td align="center">
          <img src="${imageSrc}" alt="${f.title}" width="488" class="responsive-img"
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
  if (newsletter.slug === "denker-peerlist-launch") {
    return generatePeerlistLaunchEmail(newsletter);
  }

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
              <p style="font-family:${F};font-size:15px;color:${C.textSec};margin:0 0 24px;line-height:1.7;">Hi there,</p>

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

              ${newsletter.note ? `<!-- Migration note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
                <tr><td style="border-top:1px solid ${C.divider};padding-top:24px;">
                  <p style="font-family:${F};font-size:14px;color:${C.textSec};line-height:1.65;margin:0;">${newsletter.note}</p>
                </td></tr>
              </table>` : ""}

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
