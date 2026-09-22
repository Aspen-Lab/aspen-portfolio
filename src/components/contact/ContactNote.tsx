"use client";

import { useId, useRef, useState } from "react";
import { AspenMark } from "../Logo";
import styles from "./ContactNote.module.css";

type ContactNoteProps = { cn: boolean; email: string };
type CopyStatus = "idle" | "copied" | "selected" | "unavailable";

const topics = [
  {
    key: "project",
    label: { en: "Project", cn: "项目合作" },
    subject: { en: "Project inquiry — Aspen", cn: "项目合作｜Aspen" },
    invitation: { en: "Tell me what you’re making, and where you’d like a design engineer to help.", cn: "聊聊你正在做的项目，以及希望设计工程师一起解决的问题。" },
  },
  {
    key: "role",
    label: { en: "Opportunity", cn: "工作机会" },
    subject: { en: "Role opportunity — Aspen", cn: "工作机会｜Aspen" },
    invitation: { en: "Share a little about the role, the team, and the problems you’re working on.", cn: "介绍一下角色、团队，以及你们正在解决的问题。" },
  },
  {
    key: "hello",
    label: { en: "Just hello", cn: "打个招呼" },
    subject: { en: "Hello, Aspen", cn: "你好，Aspen" },
    invitation: { en: "A thought, a shared curiosity, or simply a hello. I’d love to hear it.", cn: "一个想法、一份共同的好奇，或简单的一句你好，都可以。" },
  },
] as const;

export function ContactNote({ cn, email }: ContactNoteProps) {
  const id = useId();
  const addressRef = useRef<HTMLAnchorElement>(null);
  const [topic, setTopic] = useState(0);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [copying, setCopying] = useState(false);
  const selectedTopic = topics[topic];
  const at = email.lastIndexOf("@");
  const subject = cn ? selectedTopic.subject.cn : selectedTopic.subject.en;
  const mailto = "mailto:" + email + "?subject=" + encodeURIComponent(subject);

  async function copyAddress() {
    setCopying(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setCopyStatus("copied");
    } catch {
      // Keep the address visible and selectable when browser clipboard access
      // is unavailable. This fallback never claims that copying succeeded.
      const selection = window.getSelection();
      const address = addressRef.current;
      if (selection && address) {
        try {
          const range = document.createRange();
          range.selectNodeContents(address);
          selection.removeAllRanges();
          selection.addRange(range);
          setCopyStatus("selected");
        } catch {
          setCopyStatus("unavailable");
        }
      } else {
        setCopyStatus("unavailable");
      }
    } finally {
      setCopying(false);
    }
  }

  const feedback = copyStatus === "copied"
    ? (cn ? "邮箱已复制。" : "Email address copied.")
    : copyStatus === "selected"
      ? (cn ? "无法自动复制。已选中地址，请手动复制。" : "Automatic copy is unavailable. The address is selected; copy it manually.")
      : copyStatus === "unavailable"
        ? (cn ? "无法自动复制。可选中上方邮箱手动复制。" : "Automatic copy is unavailable. Select the email above to copy it manually.")
        : "";

  return (
    <aside className={styles.note} aria-labelledby={id + "-name"}>
      <div className={styles.paper}>
        <div className={styles.letterhead}>
          <div>
            <p className={styles.kicker}>{cn ? "写给" : "A NOTE TO"}</p>
            <h2 className={styles.name} id={id + "-name"}>Aspen.</h2>
            <p className={styles.role}>{cn ? "创始设计工程师" : "Founding Design Engineer"}</p>
          </div>
          <div className={styles.seal} aria-hidden="true"><AspenMark size={26} /></div>
        </div>

        <div className={styles.addressBlock}>
          <p className={styles.addressLabel}>{cn ? "邮箱" : "EMAIL ADDRESS"}</p>
          <a ref={addressRef} href={mailto} className={styles.address}>{at > 0 ? <>{email.slice(0, at)}<wbr />{email.slice(at)}</> : email}</a>
          <div className={styles.copyRow}>
            <p className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
            <button type="button" className={styles.copy} onClick={copyAddress} disabled={copying} aria-label={(cn ? "复制地址：" : "Copy address: ") + email}>
              {copyStatus === "copied"
                ? <svg viewBox="0 0 18 18" width="14" height="14" fill="none" aria-hidden="true"><path d="m3 9 4 4 8-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                : <svg viewBox="0 0 18 18" width="14" height="14" fill="none" aria-hidden="true"><path d="M6.5 3H14v9H6.5zM4 6H2.5v9H10v-1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              <span>{cn ? "复制地址" : "Copy address"}</span>
            </button>
          </div>
        </div>

        <div className={styles.topicBlock}>
          <p className={styles.topicLabel} id={id + "-topics"}>{cn ? "想聊什么？" : "What’s on your mind?"}</p>
          <div className={styles.topics} role="group" aria-labelledby={id + "-topics"}>
            {topics.map((item, index) => (
              <button key={item.key} type="button" aria-pressed={topic === index} aria-controls={id + "-invitation"} onClick={() => setTopic(index)} className={styles.topic}>
                {cn ? item.label.cn : item.label.en}
              </button>
            ))}
          </div>
          <p id={id + "-invitation"} className={styles.invitation} aria-live="polite"><span key={selectedTopic.key} className={styles.invitationText}>{cn ? selectedTopic.invitation.cn : selectedTopic.invitation.en}</span></p>
        </div>

        <a className={styles.write} href={mailto}>
          <span>{cn ? "写封邮件" : "Write an email"}</span>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
        <p className={styles.deliveryNote}>{cn ? "在你的邮件应用中打开" : "Opens in your email app"}</p>
      </div>
    </aside>
  );
}
