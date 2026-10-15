import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import siteConfig from "@/config/site.json";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const expectedAction = "contact";

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);

const readField = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: NextRequest) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const name = readField(payload.name, 80);
  const email = readField(payload.email, 254);
  const message = readField(payload.message, 4000);
  const turnstileToken = readField(payload.turnstileToken, 2048);

  if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
    return NextResponse.json(
      { error: "Enter a name, valid email address, and message of at least 10 characters." },
      { status: 400 }
    );
  }

  if (!turnstileToken) {
    return NextResponse.json({ error: "Please complete the security check." }, { status: 400 });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean)
  );

  if (!turnstileSecret || !resendApiKey || !from || expectedHostnames.size === 0 || siteConfig.email.includes("replace-with")) {
    console.error("Contact configuration missing", {
      turnstileSecretConfigured: Boolean(turnstileSecret),
      resendKeyConfigured: Boolean(resendApiKey),
      senderConfigured: Boolean(from),
      hostnamesConfigured: expectedHostnames.size > 0,
    });
    return NextResponse.json(
      { error: "The contact form is not configured yet. Please use another contact option." },
      { status: 503 }
    );
  }

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  let verification: Response;
  let turnstileResult: { success?: boolean; action?: string; hostname?: string } | null;

  try {
    verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken,
        ...(clientIp ? { remoteip: clientIp } : {}),
      }),
    });
    turnstileResult = (await verification.json().catch(() => null)) as { success?: boolean; action?: string; hostname?: string } | null;
  } catch {
    return NextResponse.json({ error: "Security verification failed. Please try again." }, { status: 403 });
  }

  if (
    !verification.ok ||
    !turnstileResult?.success ||
    turnstileResult.action !== expectedAction ||
    !turnstileResult.hostname ||
    !expectedHostnames.has(turnstileResult.hostname)
  ) {
    return NextResponse.json({ error: "Security verification failed. Please try again." }, { status: 403 });
  }

  try {
    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from,
      to: siteConfig.email,
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<h2>Portfolio enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
    });

    if (result.error) {
      console.error("Resend rejected contact email", {
        name: result.error.name,
        status: result.error.statusCode,
      });
      return NextResponse.json(
        { error: "Message delivery is temporarily unavailable. Please use the email link to contact Aswin." },
        { status: [401, 403].includes(result.error.statusCode ?? 0) ? 503 : 502 }
      );
    }

    if (!result.data?.id) throw new Error("Missing email confirmation");
  } catch (error) {
    console.error("Contact email request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ error: "Message delivery failed. Please try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
