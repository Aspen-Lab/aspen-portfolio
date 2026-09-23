"use client";

import { useLocale } from "next-intl";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { socials } from "@/lib/contact";
import { AspenMark } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  const cn = useLocale() === "cn";
  const onContact = usePathname() === "/contact";
  const year = new Date().getFullYear();

  function backToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector<HTMLAnchorElement>("header a")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <footer id="footer" className={styles.footer} aria-label={cn ? "页脚" : "Footer"}>
      <div className="container-fluid">
        <div className={styles.inner}>
          <div className={styles.closing}>
            <h2 className={styles.headline}>{cn ? "保持好奇，继续创造。" : "Always curious. Still building."}</h2>
            <Link href={onContact ? "/#work" : "/contact"} className={styles.contact}>
              {onContact ? (cn ? "看看我的作品" : "Explore my work") : (cn ? "聊聊你的想法" : "Start a conversation")}
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>

          <div className={styles.bottom}>
            <div className={styles.identity}>
              <Link href="/" className={styles.brand}><AspenMark size={17} /><span>Aspen Lab</span></Link>
              <span className={styles.copyright}>© {year}</span>
            </div>
            <nav className={styles.links} aria-label={cn ? "页脚链接" : "Footer links"}>
              {socials.filter(social => social.platform === "GitHub" || social.platform === "Email").map(social => (
                <a key={social.platform} href={social.href} target={social.platform === "Email" ? undefined : "_blank"} rel={social.platform === "Email" ? undefined : "noreferrer"}>
                  {social.platform === "Email" ? (cn ? "邮件" : "Email") : social.platform}
                </a>
              ))}
              <button type="button" onClick={backToTop} className={styles.top}>
                {cn ? "回到顶部" : "Back to top"}<ArrowUp size={13} strokeWidth={1.5} aria-hidden />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
