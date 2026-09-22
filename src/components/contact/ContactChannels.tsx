import { ArrowUpRight } from "lucide-react";
import { siFramer, siGithub } from "simple-icons";
import styles from "./ContactChannels.module.css";

type ContactChannel = { platform: string; handle: string; href: string };

const descriptions: Record<string, { en: string; cn: string }> = {
  linkedin: { en: "Professional background & connections", cn: "职业经历和交流" },
  github: { en: "Code & personal projects", cn: "代码与个人项目" },
  framer: { en: "Earlier portfolio", cn: "早期作品集" },
};

function ChannelMark({ platform }: { platform: string }) {
  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className={styles.brandMark} aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="22" height="22" rx="2.1" fill="currentColor" />
        <g className={styles.logoCutout}>
          <circle cx="6.5" cy="7" r="1.6" />
          <path d="M5.1 10h2.8v9H5.1ZM10 10h2.7v1.25c.54-.9 1.46-1.48 2.85-1.48 2.43 0 3.35 1.43 3.35 4.07V19h-2.8v-4.58c0-1.38-.25-2.36-1.57-2.36-1.43 0-1.73 1.13-1.73 2.49V19H10Z" />
        </g>
      </svg>
    );
  }

  const icon = platform === "github" ? siGithub : platform === "framer" ? siFramer : null;
  if (!icon) return <ArrowUpRight className={styles.brandMark} strokeWidth={1.1} aria-hidden="true" />;

  return (
    <svg viewBox="0 0 24 24" className={styles.brandMark} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}

export function ContactChannels({ cn, items }: { cn: boolean; items: ReadonlyArray<ContactChannel> }) {
  return (
    <ul className={styles.channels}>
      {items.map((item, index) => {
        const platform = item.platform.toLowerCase();
        const description = descriptions[platform];
        return (
          <li key={item.platform} className={styles.item}>
            <a href={item.href} target="_blank" rel="noreferrer" className={styles.card}>
              <div className={styles.topline}>
                <ChannelMark platform={platform} />
                <span className={styles.direction} aria-hidden="true">
                  <span className={styles.folio}>{String(index + 1).padStart(2, "0")}</span>
                  <ArrowUpRight className={styles.arrow} size={20} strokeWidth={1.35} />
                </span>
              </div>
              <h3 className={styles.platform}>{item.platform}</h3>
              {description && <p className={styles.description}>{description[cn ? "cn" : "en"]}</p>}
              <span className={styles.handle}>{item.handle}</span>
              <span className={styles.srOnly}>{cn ? "（在新标签页打开）" : " (opens in a new tab)"}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
