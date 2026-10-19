"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { hold } from "@/lib/hold";
import styles from "./OwnershipStrip.module.css";

/* The claim of the section, drawn by weight alone: on the left, outlined
   and light, what the AI coding tools do; on the right, a solid black
   slab with what stays mine, each line led by a solid accent square. The
   two share one 1px outline, so they read as one statement in two halves.
   Every word restates the section's body; nothing here is new. The
   squares pop in once when the strip comes into view; nothing responds
   to a pointer. Reduced motion shows them still. */

type Group = { title: string; items: string[] };

export function OwnershipStrip({ tools, mine, note }: { tools: Group; mine: Group; note: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  return (
    <figure ref={ref} className={styles.strip} data-in={inView}>
      <div className={styles.box}>
        <div className={styles.tools}>
          <p className={styles.title}>{hold(tools.title, styles.word)}</p>
          <ul className={styles.chips}>
            {tools.items.map((item) => (
              <li key={item} className={styles.chip}>
                {hold(item, styles.word)}
              </li>
            ))}
          </ul>
        </div>
        <div className={`slab ${styles.mine}`}>
          <p className={styles.title}>{hold(mine.title, styles.word)}</p>
          <ul className={styles.list}>
            {mine.items.map((item, i) => (
              <li key={item} className={styles.row} style={{ "--i": i } as CSSProperties}>
                <span aria-hidden className={styles.sq} />
                <span>{hold(item, styles.word)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className={styles.note}>{hold(note, styles.word)}</figcaption>
    </figure>
  );
}
