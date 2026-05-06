"use server";

import { Resend } from "resend";
import { contactInfo } from "@/lib/contact";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string; fields?: FieldErrors };

const RECIPIENT = contactInfo.email;
const FROM = "Aspen Portfolio <onboarding@resend.dev>";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: bots fill the hidden "company" field. Humans don't.
  const hp = String(formData.get("company") ?? "").trim();
  if (hp) return { status: "ok", message: "Thanks — I'll get back to you." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const fieldErrors: FieldErrors = {};
  if (name.length < 1) fieldErrors.name = "Tell me your name.";
  if (!isEmail(email)) fieldErrors.email = "That doesn't look like an email.";
  if (message.length < 10)
    fieldErrors.message = "A few more words help me reply well.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the fields below.",
      fields: fieldErrors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;

  // Dev fallback: if no key, log and pretend success
  if (!apiKey) {
    console.log("[contact] RESEND_API_KEY not set — would have sent:", {
      to: RECIPIENT,
      from: FROM,
      replyTo: email,
      subject: `[Portfolio] ${name}`,
      text: message,
    });
    return {
      status: "ok",
      message: "Thanks — message logged in dev. (Set RESEND_API_KEY to enable email.)",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      replyTo: email,
      subject: `[Portfolio] ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      console.error("[contact] resend error:", error);
      return {
        status: "error",
        message: "Couldn't send. Please email directly instead.",
      };
    }
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return {
      status: "error",
      message: "Couldn't send. Please email directly instead.",
    };
  }

  return {
    status: "ok",
    message: "Thanks — I'll reply within 48h.",
  };
}
