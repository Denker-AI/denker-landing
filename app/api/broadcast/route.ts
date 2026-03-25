import { NextRequest, NextResponse } from "next/server";
import { getNewsletter } from "@/lib/newsletters";
import { generateNewsletterEmail } from "@/lib/newsletter-email";

const RESEND_API = "https://api.resend.com";

/**
 * POST /api/broadcast
 *
 * Creates a Resend broadcast for a newsletter.
 * Requires RESEND_FULL_ACCESS_API_KEY and RESEND_AUDIENCE_ID in env.
 *
 * Body: { slug: string, send?: boolean }
 *   - slug: newsletter slug from the registry
 *   - send: if true, sends the broadcast immediately (default: false, just creates)
 *
 * Security: Protected by a shared secret (BROADCAST_SECRET env var).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.BROADCAST_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_FULL_ACCESS_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { error: "RESEND_FULL_ACCESS_API_KEY and RESEND_AUDIENCE_ID required" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const slug = body?.slug;
  const shouldSend = body?.send === true;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const newsletter = getNewsletter(slug);
  if (!newsletter) {
    return NextResponse.json({ error: `Newsletter "${slug}" not found` }, { status: 404 });
  }

  const html = generateNewsletterEmail(newsletter);

  try {
    /* Step 1: Create broadcast */
    const createRes = await fetch(`${RESEND_API}/broadcasts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audience_id: audienceId,
        from: "Denker <team@denker.ai>",
        reply_to: "team@denker.ai",
        subject: newsletter.subject,
        html,
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error("Failed to create broadcast:", err);
      return NextResponse.json({ error: "Failed to create broadcast", details: err }, { status: 502 });
    }

    const { id: broadcastId } = await createRes.json();

    /* Step 2: Optionally send */
    if (shouldSend) {
      const sendRes = await fetch(`${RESEND_API}/broadcasts/${broadcastId}/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!sendRes.ok) {
        const err = await sendRes.text();
        console.error("Failed to send broadcast:", err);
        return NextResponse.json(
          { error: "Broadcast created but failed to send", broadcastId, details: err },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, broadcastId, sent: true });
    }

    return NextResponse.json({ ok: true, broadcastId, sent: false });
  } catch (err) {
    console.error("Broadcast handler error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
