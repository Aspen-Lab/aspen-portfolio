import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { contactInfo, replyExpectation } from "@/lib/contact";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — Aspen W.",
  description:
    "Get in touch with Aspen W. — Design Engineer at Axel (Gordian, YC W19). Email, phone, scheduled chat, or quick message. Usually replies within 48h.",
};

type Method = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

function methods(): Method[] {
  const items: Method[] = [
    {
      label: "Email",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      label: "Phone",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/[\s+]/g, "")}`,
    },
  ];

  if (contactInfo.calendly) {
    items.push({
      label: "Schedule",
      value: "Book a 15-minute chat",
      href: contactInfo.calendly,
      external: true,
    });
  }
  if (contactInfo.linkedin) {
    items.push({
      label: "LinkedIn",
      value: "Connect on LinkedIn",
      href: contactInfo.linkedin,
      external: true,
    });
  }
  if (contactInfo.resume) {
    items.push({
      label: "Resume",
      value: "Download PDF",
      href: contactInfo.resume,
      external: true,
    });
  }

  return items;
}

const elsewhere: Method[] = [
  { label: "Design Studies", value: "Notion", href: contactInfo.notion, external: true },
  { label: "Aspen Lab", value: "Framer", href: contactInfo.framer, external: true },
  { label: "Code", value: "GitHub", href: contactInfo.github, external: true },
];

export default function Contact() {
  const direct = methods();

  return (
    <article className="pb-32">
      <section className="container-fluid pt-12 pb-20">
        <Reveal>
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
            {"{ Contact }"} · Get in touch
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1
            className="mt-10 font-display font-light tracking-[-0.025em] text-ink leading-[0.96]"
            style={{ fontSize: "clamp(48px, 8vw, 112px)" }}
          >
            Have something
            <br />
            <span className="italic font-normal">in motion?</span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-12 max-w-xl text-[18px] leading-[1.6] text-mute">
            Pick the channel that suits you — direct line, scheduled chat, or
            the quick form below. {replyExpectation}.
          </p>
        </Reveal>
      </section>

      {/* Direct methods */}
      <section className="container-fluid mt-8">
        <Reveal>
          <div className="border-t border-line pt-8 mb-10">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[28px] sm:text-[34px] tracking-[-0.01em]">
                <span className="font-mono text-soft text-[14px] tracking-[0.2em] uppercase mr-3">
                  {"{ 01 }"}
                </span>
                Direct
              </h2>
              <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hidden sm:block">
                {replyExpectation}
              </p>
            </div>
          </div>
        </Reveal>

        <ul className="border-t border-line">
          {direct.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.04}>
              <li className="border-b border-line/60">
                <a
                  href={m.href}
                  target={m.external ? "_blank" : undefined}
                  rel={m.external ? "noreferrer" : undefined}
                  className="group grid grid-cols-12 items-baseline gap-x-4 py-6 hover:bg-cream/50 transition-colors -mx-3 px-3 rounded-md"
                >
                  <span className="col-span-4 sm:col-span-3 font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
                    {m.label}
                  </span>
                  <span className="col-span-7 sm:col-span-8 font-display text-[20px] sm:text-[24px] tracking-[-0.005em] text-ink">
                    {m.value}
                  </span>
                  <span
                    aria-hidden
                    className="col-span-1 text-right font-mono text-[14px] text-soft group-hover:text-ink group-hover:translate-x-1 transition-all"
                  >
                    →
                  </span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Elsewhere */}
      <section className="container-fluid mt-20">
        <Reveal>
          <div className="border-t border-line pt-8 mb-10">
            <h2 className="font-display text-[28px] sm:text-[34px] tracking-[-0.01em]">
              <span className="font-mono text-soft text-[14px] tracking-[0.2em] uppercase mr-3">
                {"{ 02 }"}
              </span>
              Elsewhere
            </h2>
          </div>
        </Reveal>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {elsewhere.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.04}>
              <li>
                <a
                  href={m.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block p-6 rounded-[8px] border border-line hover:border-ink/40 transition-colors h-full"
                >
                  <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-4">
                    {m.label}
                  </p>
                  <p className="font-display text-[22px] tracking-[-0.005em] text-ink">
                    {m.value}
                    <span
                      aria-hidden
                      className="ml-2 text-soft group-hover:text-ink group-hover:translate-x-0.5 inline-block transition-all"
                    >
                      →
                    </span>
                  </p>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Quick message */}
      <section className="container-fluid mt-24">
        <Reveal>
          <div className="border-t border-line pt-8 mb-10">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[28px] sm:text-[34px] tracking-[-0.01em]">
                <span className="font-mono text-soft text-[14px] tracking-[0.2em] uppercase mr-3">
                  {"{ 03 }"}
                </span>
                Quick message
              </h2>
              <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hidden sm:block">
                Goes straight to my inbox
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="max-w-2xl">
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </article>
  );
}
