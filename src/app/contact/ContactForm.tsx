"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, initial);
  const fieldErrors = state.status === "error" ? state.fields : undefined;

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {/* Honeypot — invisible to humans, bots fill it */}
      <div className="absolute left-[-10000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <Field
        id="name"
        label="Name"
        type="text"
        autoComplete="name"
        required
        error={fieldErrors?.name}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={fieldErrors?.email}
      />
      <Field
        id="message"
        label="Message"
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
          {pending ? "Sending…" : "Send message"}
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
            ? "Or email directly — link is right above."
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
  const baseClasses =
    "w-full bg-transparent border-b border-line text-[16px] text-ink py-3 px-0 outline-none focus:border-ink transition-colors placeholder:text-soft";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
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
