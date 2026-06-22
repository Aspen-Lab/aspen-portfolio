"use server";

import { Resend } from "resend";
import { contactInfo } from "@/lib/contact";
import type { Locale } from "@/i18n/routing";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string; fields?: FieldErrors };

const RECIPIENT = contactInfo.email;
const FROM = "Aspen Portfolio <onboarding@resend.dev>";

const messages: Record<Locale, {
  successDev: string;
  success: string;
  errorGeneric: string;
  errorFields: string;
  errorName: string;
  errorEmail: string;
  errorMessage: string;
}> = {
  en: {
    successDev: "Thanks — message logged in dev. (Set RESEND_API_KEY to enable email.)",
    success: "Thanks — I'll reply within 48h.",
    errorGeneric: "Couldn't send. Please email directly instead.",
    errorFields: "Please check the fields below.",
    errorName: "Tell me your name.",
    errorEmail: "That doesn't look like an email.",
    errorMessage: "A few more words help me reply well.",
  },
  cn: {
    successDev: "已收到 —— 开发环境只记录到日志(配置 RESEND_API_KEY 后才真发邮件)。",
    success: "已收到 —— 48 小时内回你。",
    errorGeneric: "发送失败,请直接发邮件。",
    errorFields: "请检查下方字段。",
    errorName: "名字写一下吧。",
    errorEmail: "邮箱格式好像不对。",
    errorMessage: "再多写几句更好回。",
  },
};

function localeFromForm(formData: FormData): Locale {
  return formData.get("locale") === "cn" ? "cn" : "en";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: bots fill the hidden "company" field. Humans don't.
  const hp = String(formData.get("company") ?? "").trim();
  const locale = localeFromForm(formData);
  const msg = messages[locale];
  if (hp) return { status: "ok", message: msg.success };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const fieldErrors: FieldErrors = {};
  if (name.length < 1) fieldErrors.name = msg.errorName;
  if (!isEmail(email)) fieldErrors.email = msg.errorEmail;
  if (message.length < 10)
    fieldErrors.message = msg.errorMessage;

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: msg.errorFields,
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
      message: msg.successDev,
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
        message: msg.errorGeneric,
      };
    }
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return {
      status: "error",
      message: msg.errorGeneric,
    };
  }

  return {
    status: "ok",
    message: msg.success,
  };
}
