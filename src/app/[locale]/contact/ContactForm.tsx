"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { sendMessage, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Contact.form");
  const [state, formAction, pending] = useActionState(sendMessage, initial);
  const fieldErrors = state.status === "error" ? state.fields : undefined;

  return (
    <form action={formAction} className="space-y-8" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot — invisible to humans, bots fill it */}
      <div className="absolute left-[-10000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <Field
        id="name"
        label={t("name")}
        type="text"
        autoComplete="name"
        required
        error={fieldErrors?.name}
      />
      <Field
        id="email"
        label={t("email")}
        type="email"
        autoComplete="email"
        required
        error={fieldErrors?.email}
      />
      <Field
        id="message"
        label={t("message")}
        as="textarea"
        rows={5}
        required
        error={fieldErrors?.message}
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="font-mono uppercase tracking-[0.2em] text-[12px] text-paper bg-ink rounded-full px-7 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? t("sending") : t("send")}
        </button>

        <p
          aria-live="polite"
          className={`font-mono uppercase tracking-[0.16em] text-[11px] ${
            state.status === "ok"
              ? "text-ink"
              : state.status === "error"
                ? "text-mute"
                : "text-soft"
          }`}
        >
          {state.status === "idle"
            ? t("idleHint")
            : state.message}
        </p>
      </div>
    </form>
  );
}

type FieldBase = {
  id: "name" | "email" | "message";
  label: string;
  required?: boolean;
  error?: string;
};

type InputField = FieldBase & {
  as?: "input";
  type: "text" | "email";
  autoComplete?: string;
  rows?: never;
};

type TextareaField = FieldBase & {
  as: "textarea";
  rows: number;
  type?: never;
  autoComplete?: never;
};

function Field(props: InputField | TextareaField) {
  const { id, label, error, required } = props;
  // A filled plane, not an underlined or outlined box: it lifts a tone on
  // hover and focus, and keyboard focus adds the ring on top.
  const baseClasses =
    "w-full rounded-[var(--r-raised)] [corner-shape:squircle] bg-[var(--tile)] text-[16px] text-ink py-3 px-4 outline-none hover:bg-[#1d1d20] focus:bg-[#1d1d20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink transition-colors duration-200 placeholder:text-soft";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label
          htmlFor={id}
          className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft"
        >
          {label}
        </label>
        {error && (
          <span className="font-mono uppercase tracking-[0.16em] text-[10px] text-mute">
            {error}
          </span>
        )}
      </div>

      {props.as === "textarea" ? (
        <textarea
          id={id}
          name={id}
          rows={props.rows}
          required={required}
          className={`${baseClasses} resize-none leading-[1.55]`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={props.type}
          autoComplete={props.autoComplete}
          required={required}
          className={baseClasses}
        />
      )}
    </div>
  );
}
