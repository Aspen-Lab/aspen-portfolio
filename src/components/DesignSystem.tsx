"use client";

import { useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { designSystem as ds } from "@/lib/work";
import { Reveal } from "./Reveal";
import styles from "./DesignSystem.module.css";

/* Aspen Origin on the home page, flat (Aspen, 2026-10-25: 「这里的视觉很
   难看」): no 3D slabs or shadows. On the left, squares nested in the
   site's two tones with Origin's 2×2 mark at the centre; on the right,
   the name, one line and one button. On the hero's grid. */
export function DesignSystem() {
  const cn = useLocale() === "cn";

  return (
    <section className="container-fluid" aria-labelledby="origin-title">
      <Reveal>
        <div className={styles.grid}>
          <div className={styles.art} aria-hidden>
            <div className={styles.canvas}>
              <div className={styles.inset}>
                <div className={styles.raised}>
                  <span className={styles.mark}><i /><i /><i /><i /></span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.copy}>
            <h2 id="origin-title">{ds.name}</h2>
            <p className={styles.tagline}>{ds.tagline[cn ? "cn" : "en"]}</p>
            <a href={ds.href} target="_blank" rel="noreferrer" className={styles.enterLink}>
              <span>{cn ? "进入设计系统" : "Open design system"}</span>
              <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
