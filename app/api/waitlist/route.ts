import { NextRequest, NextResponse } from "next/server";

const RESEND_API = "https://api.resend.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Rate limiter (in-memory) ──────────────────────────── */
const ipRequests = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const sendKey = process.env.RESEND_API_KEY?.trim();
  const audienceKey = process.env.RESEND_FULL_ACCESS_API_KEY?.trim() || sendKey;
  if (!sendKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const email = body?.email;
  const source: "waitlist" | "newsletter" = body?.source === "newsletter" ? "newsletter" : "waitlist";

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();

    /* Add to Resend Audience — uses full access key.
     * The contacts POST is idempotent; it returns the contact id
     * regardless of whether it already existed. */
    if (audienceId && audienceKey) {
      const audienceRes = await fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${audienceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          unsubscribed: false,
        }),
      });

      if (!audienceRes.ok) {
        const err = await audienceRes.text();
        console.error("Failed to add contact to audience:", err);
      }
    }

    /* Send confirmation email */
    const isNewsletter = source === "newsletter";
    const emailRes = await fetch(`${RESEND_API}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Denker <team@denker.ai>",
        to: normalizedEmail,
        subject: isNewsletter
          ? "Welcome to the Denker Newsletter"
          : "You're on the Denker waitlist!",
        html: isNewsletter
          ? newsletterWelcomeHtml(normalizedEmail)
          : waitlistConfirmHtml(normalizedEmail),
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend email error:", err);
      return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Waitlist handler error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ── Email templates — dolcetto glass style ──────────────── */

const LOGO_URL = "https://www.denker.ai/logo/logo-white.png";
const F = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FH = "'Satoshi', -apple-system, sans-serif";
const E = {
  bg: "#0F1115",
  cardSolid: "#141821",
  cardBorderSolid: "#1e2230",
  surface: "#1a1f2a",
  surfaceBorder: "#242a36",
  accent: "#3AF88C",
  text: "#F5F5F7",
  textSec: "#A1A1A6",
  textMuted: "#636366",
  divider: "#1e2230",
};

function emailShell(content: string): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark only" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
<body style="margin:0;padding:0;background-color:${E.bg};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${E.bg};background-image:radial-gradient(ellipse 60% 50% at 15% 25%, rgba(58,248,140,0.07) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 80% 65%, rgba(255,200,50,0.05) 0%, transparent 70%);background-size:100% 100%, 100% 100%;">
    <tr><td align="center" class="wrapper" style="padding:48px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" class="container" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding:0 0 36px;">
          <img src="${LOGO_URL}" alt="Denker" height="28" style="display:inline-block;" />
        </td></tr>
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;overflow:hidden;border:1px solid ${E.cardBorderSolid};background-color:${E.cardSolid};">
            <tr><td style="height:1px;background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.20) 50%, transparent 100%);"></td></tr>
            <tr><td class="content-area" style="padding:44px 36px;">
              ${content}
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:32px 0 0;text-align:center;">
          <p style="font-family:${F};font-size:12px;color:${E.textMuted};margin:0 0 6px;line-height:1.6;">Denker AI &middot; Hamburg, Germany</p>
          <p style="font-family:${F};font-size:12px;margin:0;">
            <a href="https://www.denker.ai" style="color:${E.accent};text-decoration:none;">denker.ai</a>
            <span style="color:${E.textMuted};"> &nbsp;&middot;&nbsp; </span>
            <a href="https://linkedin.com/company/denkerai" style="color:${E.textMuted};text-decoration:none;">LinkedIn</a>
            <span style="color:${E.textMuted};"> &nbsp;&middot;&nbsp; </span>
            <a href="https://www.denker.ai/privacy" style="color:${E.textMuted};text-decoration:none;">Privacy</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function waitlistConfirmHtml(email: string): string {
  const safe = escapeHtml(email);
  const content = `
    <h1 style="font-family:${FH};font-size:24px;font-weight:700;margin:0 0 20px;color:${E.text};line-height:1.3;">You're on the waitlist</h1>
    <p style="font-family:${F};font-size:15px;color:${E.textSec};line-height:1.7;margin:0 0 28px;">Thanks for your interest in Denker. We're building a workspace where AI agents research, write, code, and automate &mdash; all visible on one canvas.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr><td style="background-color:${E.surface};border:1px solid ${E.surfaceBorder};border-radius:12px;padding:20px 24px;">
        <p style="font-family:${F};font-size:11px;color:${E.textMuted};margin:0 0 6px;text-transform:uppercase;letter-spacing:0.08em;">Reserved for</p>
        <p style="font-family:${F};font-size:16px;color:${E.text};margin:0;font-weight:600;"><a style="color:${E.text};text-decoration:none;">${safe}</a></p>
      </td></tr>
    </table>
    <p style="font-family:${F};font-size:14px;color:${E.text};margin:0 0 14px;font-weight:600;">What happens next</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr><td style="width:20px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${E.accent};"></span></td>
        <td style="font-family:${F};font-size:14px;color:${E.textSec};line-height:1.6;padding-bottom:10px;">We're rolling out access in waves over the coming weeks.</td></tr>
      <tr><td style="width:20px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${E.accent};"></span></td>
        <td style="font-family:${F};font-size:14px;color:${E.textSec};line-height:1.6;padding-bottom:10px;">You'll get an email the moment your spot opens.</td></tr>
      <tr><td style="width:20px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${E.accent};"></span></td>
        <td style="font-family:${F};font-size:14px;color:${E.textSec};line-height:1.6;">In the meantime, follow us on <a href="https://linkedin.com/company/denkerai" style="color:${E.accent};text-decoration:none;">LinkedIn</a> for updates.</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td align="center">
      <a href="https://linkedin.com/company/denkerai" style="display:inline-block;background-color:${E.accent};color:#000;font-family:${F};font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:99px;">Follow on LinkedIn &rarr;</a>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${E.divider};padding-top:20px;">
      <p style="font-family:${F};font-size:13px;color:${E.textMuted};margin:0;">Reply to this email anytime &mdash; we read every one.</p>
    </td></tr></table>`;
  return emailShell(content);
}

function newsletterWelcomeHtml(email: string): string {
  const safe = escapeHtml(email);
  const content = `
    <h1 style="font-family:${FH};font-size:24px;font-weight:700;margin:0 0 20px;color:${E.text};line-height:1.3;">You're subscribed</h1>
    <p style="font-family:${F};font-size:15px;color:${E.textSec};line-height:1.7;margin:0 0 28px;">Welcome to the Denker newsletter. We'll share product updates, workflow ideas, and practical guides on working with AI agents.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr><td style="background-color:${E.surface};border:1px solid ${E.surfaceBorder};border-radius:12px;padding:20px 24px;">
        <p style="font-family:${F};font-size:11px;color:${E.textMuted};margin:0 0 6px;text-transform:uppercase;letter-spacing:0.08em;">Subscribed as</p>
        <p style="font-family:${F};font-size:16px;color:${E.text};margin:0;font-weight:600;"><a style="color:${E.text};text-decoration:none;">${safe}</a></p>
      </td></tr>
    </table>
    <p style="font-family:${F};font-size:14px;color:${E.text};margin:0 0 14px;font-weight:600;">What to expect</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr><td style="width:20px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${E.accent};"></span></td>
        <td style="font-family:${F};font-size:14px;color:${E.textSec};line-height:1.6;padding-bottom:10px;">A short email every 1&ndash;2 weeks &mdash; never more.</td></tr>
      <tr><td style="width:20px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${E.accent};"></span></td>
        <td style="font-family:${F};font-size:14px;color:${E.textSec};line-height:1.6;padding-bottom:10px;">Feature launches, tips, and behind-the-scenes.</td></tr>
      <tr><td style="width:20px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${E.accent};"></span></td>
        <td style="font-family:${F};font-size:14px;color:${E.textSec};line-height:1.6;">Unsubscribe anytime with one click.</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td align="center">
      <a href="https://www.denker.ai" style="display:inline-block;background-color:${E.accent};color:#000;font-family:${F};font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:99px;">Visit Denker &rarr;</a>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${E.divider};padding-top:20px;">
      <p style="font-family:${F};font-size:13px;color:${E.textMuted};margin:0;">Reply to this email anytime &mdash; we read every one.</p>
    </td></tr></table>`;
  return emailShell(content);
}
