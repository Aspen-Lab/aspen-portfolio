"use client";

import { useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { designSystem as ds } from "@/lib/work";
import { Reveal } from "./Reveal";
import styles from "./DesignSystem.module.css";

/* Aspen Origin on the home page, simplified (Aspen, 2026-10-24: 「太乱了简单
   一些吧」): one plane, the material on the left (Origin's three surfaces
   stacked, Canvas under Inset under Raised), and on the right the name,
   one line and one way in. No selector, readout, kicker or link list:
   the docs carry those. The stack opens a little under the pointer. */
export function DesignSystem() {
  const cn = useLocale() === "cn";

  return (
    <section className="container-fluid" aria-labelledby="origin-title">
      <Reveal>
        <div className={styles.plane}>
          <div className={styles.stage} aria-hidden>
            <div className={styles.stack}>
              <div className={`${styles.slab} ${styles.canvasSlab}`} />
              <div className={`${styles.slab} ${styles.insetSlab}`}>
                <div className={styles.recess} />
              </div>
              <div className={`${styles.slab} ${styles.raisedSlab}`}>
                <span className={styles.sculptedMark}><i /><i /><i /><i /></span>
                <span className={styles.raisedSignature}>aspen origin</span>
              </div>
            </div>
          </div>
          <div className={styles.copy}>
            <h2 id="origin-title" className="type-display">{ds.name}</h2>
            <p>{ds.tagline[cn ? "cn" : "en"]}</p>
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
