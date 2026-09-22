import type { Metadata } from "next";
import { ArrowDownRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ContactNote } from "@/components/contact/ContactNote";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { contactInfo, socials } from "@/lib/contact";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/seo";
import styles from "./contact.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const cn = locale === "cn";
  return pageMeta(locale, "/contact", {
    title: cn ? "联系 — Aspen W." : "Contact — Aspen W.",
    description: cn
      ? "联系 Aspen W.，Axel 创始设计工程师。聊聊产品设计、前端开发、品牌，或一个值得实现的想法。"
      : "Get in touch with Aspen W., Founding Design Engineer at Axel. Let's talk product, frontend, brand, or an idea worth building.",
  });
}

export default async function Contact({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const cn = locale === "cn";
  const links = socials.filter((social) => social.href && social.platform !== "Email");

  return (
    <article className={`container-fluid ${styles.page}`}>
      <div className={styles.masthead}>
        <span>03 <span aria-hidden>/</span> {cn ? "联系" : "CONTACT"}</span>
        <span>{cn ? "一段新对话的起点" : "THE START OF A CONVERSATION"}</span>
      </div>
      <section className={styles.hero} aria-labelledby="contact-title">
        <Reveal className={styles.statement}>
          <p className={styles.eyebrow}><span aria-hidden />{cn ? "ASPEN W. · 创始设计工程师" : "ASPEN W. · FOUNDING DESIGN ENGINEER"}</p>
          <h1 id="contact-title" className={`type-display ${styles.headline}`}>
            {cn ? "好想法，" : "Good things"}<br />
            {cn ? "从一句你好" : "start with"}<br />
            <em>{cn ? "开始。" : "hello."}</em><span className={styles.asterisk} aria-hidden>✳</span>
          </h1>
          <p className={styles.intro}>
            {cn ? "设计、前端、品牌，或一个还没成形的点子。都可以从聊聊开始。" : "Product, code, brand, or an idea that's still taking shape. I'd love to hear what you're thinking."}
          </p>
          <div className={styles.signature}>
            <span>Aspen W.</span>
            <p><MapPin size={13} strokeWidth={1.5} aria-hidden />Bellevue, Washington</p>
          </div>
        </Reveal>
        <Reveal delay={0.12} className={styles.note}><ContactNote cn={cn} email={contactInfo.email} /></Reveal>
      </section>
      <section className={styles.connections} aria-labelledby="contact-elsewhere">
        <div className={styles.sectionHead}>
          <div><span className={styles.eyebrow}>{cn ? "不止在收件箱" : "BEYOND THE INBOX"}</span><h2 id="contact-elsewhere" className="type-display">{cn ? "也在这些地方。" : "Elsewhere, too."}</h2></div>
          <ArrowDownRight size={30} strokeWidth={1} aria-hidden />
        </div>
        <ContactChannels cn={cn} items={links} />
      </section>
    </article>
  );
}
