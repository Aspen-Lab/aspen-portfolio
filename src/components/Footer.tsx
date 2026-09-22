"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowUp, ArrowUpRight, Code2, MapPin } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { socials } from "@/lib/contact";
import { AspenMark } from "./Logo";
import { FooterDotLab } from "./FooterDotLab";
import styles from "./Footer.module.css";

function BellevueTime({ label }: { label: string }) {
  const [time, setTime] = useState("—:—");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return <span className={styles.time} aria-label={`${label}: ${time}`}>{time}</span>;
}

export function Footer() {
  const cn = useLocale() === "cn";
  const onContact = usePathname() === "/contact";
  const year = new Date().getFullYear();
  const copy = cn
    ? {
        footer: "页脚",
        backTop: "回到顶部",
        role: "创始设计工程师 / 设计 ↔ 代码",
        headline: "保持好奇，",
        ending: "继续创造。",
        description: "从一个好想法，到一个真正用得起来的产品。",
        contact: "聊聊你的想法",
        navigation: "继续探索",
        work: "作品",
        about: "关于",
        email: "邮件",
        time: "Bellevue 当地时间",
        credit: "由 Aspen 设计并构建",
        signature: "从设计到代码，亲手完成。",
      }
    : {
        footer: "Footer",
        backTop: "Back to top",
        role: "Founding Design Engineer / Design ↔ code",
        headline: "Always curious.",
        ending: "Still building.",
        description: "From a good idea to something people can actually use.",
        contact: "Start a conversation",
        navigation: "Keep exploring",
        work: "Work",
        about: "About",
        email: "Email",
        time: "Local time in Bellevue",
        credit: "Designed & built by Aspen",
        signature: "From design to code, by hand.",
      };

  function backToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Keep the visitor on their current page, including a case study.
    document.querySelector<HTMLAnchorElement>("header a")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <footer id="footer" className={styles.footer} aria-label={copy.footer}>
      <div className="container-fluid">
        <div className={styles.inner}>
          <div className={styles.topline}>
            <Link href="/" className={styles.brand}>
              <AspenMark size={24} />
              <span>Aspen Lab</span>
            </Link>
            <button type="button" className={styles.top} onClick={backToTop}>
              <span>{copy.backTop}</span>
              <span className={styles.topIcon}><ArrowUp size={20} strokeWidth={1.4} aria-hidden /></span>
            </button>
          </div>

          <div className={styles.body}>
            <div>
              <p className={styles.eyebrow}>{copy.role}</p>
              <h2 className={styles.headline}>
                <span>{copy.headline}</span>
                <span><em>{copy.ending}</em></span>
              </h2>
              <p className={styles.description}>{copy.description}</p>
              <Link href={onContact ? "/#work" : "/contact"} className={styles.contact}>
                {onContact ? (cn ? "看看我的作品" : "Explore my work") : copy.contact}<ArrowUpRight size={21} strokeWidth={1.35} aria-hidden />
              </Link>
            </div>
            <div className={styles.play}><FooterDotLab cn={cn} /></div>
          </div>

          <div className={styles.utility}>
            <div className={styles.location}>
              <MapPin size={14} strokeWidth={1.5} aria-hidden />
              <span>Bellevue, WA</span>
              <span className={styles.timeDivider} aria-hidden>/</span>
              <BellevueTime label={copy.time} />
            </div>
            <nav className={styles.nav} aria-label={copy.navigation}>
              <Link href="/#work">{copy.work}</Link>
              <Link href="/about">{copy.about}</Link>
              {socials.filter((social) => social.platform === "GitHub" || social.platform === "Email").map((social) => (
                <a key={social.platform} href={social.href} target={social.platform === "Email" ? undefined : "_blank"} rel={social.platform === "Email" ? undefined : "noreferrer"}>
                  {social.platform === "Email" ? copy.email : social.platform}<ArrowUpRight size={12} aria-hidden />
                </a>
              ))}
            </nav>
          </div>
          <div className={styles.credit}>
            <span>© {year} Aspen Lab <span aria-hidden>·</span> {copy.credit}</span>
            <span className={styles.signature}><Code2 size={13} strokeWidth={1.3} aria-hidden />{copy.signature}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
