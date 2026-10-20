"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { hold } from "@/lib/hold";
import styles from "./OwnershipStrip.module.css";

/* The claim of the section as one split card: on the left, on the sheet,
   what the AI coding tools do, as two raised chips; on the right, on the
   slab, what stays mine, each line led by a solid ink square. One 1px
   outline holds both halves, so they read as one statement. Every word
   restates the section's body; nothing here is new. The squares fade on
   once, one after another, when the card comes into view; nothing
   responds to a pointer. Reduced motion shows them still. */

type Group = { title: string; items: string[] };

export function OwnershipStrip({ tools, mine, note }: { tools: Group; mine: Group; note?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  return (
    <figure ref={ref} className={styles.strip} data-in={inView}>
      <div className={styles.box}>
        <div className={styles.tools}>
          <p className={`t-label ${styles.title}`}>{hold(tools.title, styles.word)}</p>
          <ul className={styles.chips}>
            {tools.items.map((item) => (
              <li key={item} className="chip">
                {hold(item, styles.word)}
              </li>
            ))}
          </ul>
        </div>
        <div className={`slab ${styles.mine}`}>
          <p className={`t-label ${styles.title}`}>{hold(mine.title, styles.word)}</p>
          <ul className={styles.list}>
            {mine.items.map((item, i) => (
              <li key={item} className={`t-subhead ${styles.row}`} style={{ "--i": i } as CSSProperties}>
                <span aria-hidden className={styles.sq} />
                <span>{hold(item, styles.word)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {note && <figcaption className={`t-small ${styles.note}`}>{hold(note, styles.word)}</figcaption>}
    </figure>
  );
}
