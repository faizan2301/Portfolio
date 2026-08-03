import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact/schema";
import { checkRateLimit, getClientIp } from "@/lib/contact/rate-limit";
import { verifyTurnstile } from "@/lib/contact/turnstile";
import {
  buildOwnerNotificationEmail,
  buildVisitorAutoReplyEmail,
} from "@/lib/contact/emails";

export const runtime = "nodejs";

function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return jsonError("Email service is not configured", 500);
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "hello@faizanshaikh.dev";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

    const ip = getClientIp(req.headers);
    const rate = checkRateLimit(`contact:${ip}`);

    if (!rate.ok) {
      return jsonError("Too many messages. Please try again later.", 429, {
        retryAfterSec: rate.retryAfterSec,
      });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const message =
        Object.values(fieldErrors).flat()[0] || "Invalid form data";
      return jsonError(message, 400, { fieldErrors });
    }

    const data = parsed.data;

    // Honeypot — bots fill hidden fields
    if (data.website) {
      return NextResponse.json({ ok: true });
    }

    const turnstile = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstile.ok) {
      return jsonError(turnstile.error || "Security check failed", 403);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const ownerMail = buildOwnerNotificationEmail(data);
    const autoReply = buildVisitorAutoReplyEmail(data);

    const { error: ownerError } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: ownerMail.subject,
      html: ownerMail.html,
      text: ownerMail.text,
    });

    if (ownerError) {
      console.error("[contact] owner email failed:", ownerError);
      return jsonError("Failed to send message. Please try again later.", 502);
    }

    const { error: replyError } = await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: autoReply.subject,
      html: autoReply.html,
      text: autoReply.text,
    });

    if (replyError) {
      // Owner already got the message — don't fail the whole request
      console.error("[contact] auto-reply failed:", replyError);
    }

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          "X-RateLimit-Remaining": String(rate.remaining),
        },
      }
    );
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return jsonError("Something went wrong. Please try again later.", 500);
  }
}
