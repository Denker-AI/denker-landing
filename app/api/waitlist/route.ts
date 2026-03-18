import { NextRequest, NextResponse } from "next/server";

const RESEND_API = "https://api.resend.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Simple in-memory rate limiter (per serverless instance) */
const ipRequests = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const email = body?.email;
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    /* Add to Resend Audience (if configured) */
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      const audienceRes = await fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, unsubscribed: false }),
      });

      if (!audienceRes.ok) {
        const err = await audienceRes.text();
        console.error("Failed to add contact to audience:", err);
      }
    }

    /* Send confirmation email */
    const emailRes = await fetch(`${RESEND_API}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Denker <hello@denker.ai>",
        to: normalizedEmail,
        subject: "You're on the Denker waitlist!",
        html: confirmationEmailHtml(normalizedEmail),
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

function confirmationEmailHtml(email: string): string {
  const safeEmail = escapeHtml(email);
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0A0A0F;color:#F5F5F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;padding:48px 24px;">
    <tr><td>
      <h1 style="font-size:24px;font-weight:700;margin:0 0 8px;color:#F5F5F7;">
        You're on the list <span style="color:#30D158;">&#10003;</span>
      </h1>
      <p style="font-size:15px;color:#A1A1A6;margin:0 0 24px;line-height:1.6;">
        Thanks for joining the Denker waitlist. We're building a workspace where
        humans and AI agents co-work visually on a limitless canvas.
      </p>
      <p style="font-size:15px;color:#A1A1A6;margin:0 0 24px;line-height:1.6;">
        We'll reach out to <strong style="color:#F5F5F7;">${safeEmail}</strong>
        when your early access spot is ready.
      </p>
      <p style="font-size:13px;color:#636366;margin:0;">
        &mdash; The Denker Team
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}
