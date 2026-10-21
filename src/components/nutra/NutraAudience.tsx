"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import styles from "./NutraAudience.module.css";

/* The problem as two users, one split card. Left, on the slab, Group A:
   the disciplined "Pro" most budgeting apps are built for, drawn
   receding (an outlined letter, grey squares, grey words). Right, on a
   sheet laid over two back sheets, Group B: the new learner Nutra is for,
   in ink, its letter block the figure's one accent mark. Neither group is
   drawn bigger than the other; the owner's "much larger" stays in the
   prose. The words come from board 011 with its typos fixed ("Nube",
   "Lake Self Control"); the two tags restate the owner's copy.

   A statement, so nothing answers a pointer. Once, on view: A rises, B
   follows 120ms later, B's accent block lands last. Reduced motion shows
   the final frame. */

type Group = {
  letter: "A" | "B";
  label: string;
  title: string;
  rows: string[];
  tag: string;
};

const COPY: Record<"en" | "cn", { aria: string; a: Group; b: Group }> = {
  en: {
    aria: "Two user groups: A, disciplined; B, new learners",
    a: {
      letter: "A",
      label: "Group A",
      title: "Pro",
      rows: ["High self\u2011control", "Manages money with any tool", "Plans strategically"],
      tag: "Who most apps are built for",
    },
    b: {
      letter: "B",
      label: "Group B",
      title: "New learner",
      rows: ["Lacks self\u2011control", "Needs help making a plan", "Needs to manage money better"],
      tag: "Who Nutra is for",
    },
  },
  cn: {
    aria: "两类用户：A 自律，B 新手",
    a: {
      letter: "A",
      label: "A 组",
      title: "高手",
      rows: ["自控力强", "用什么工具都能管好钱", "会有策略地做计划"],
      tag: "大多数 App 为他们打造",
    },
    b: {
      letter: "B",
      label: "B 组",
      title: "新手",
      rows: ["缺乏自控力", "需要有人帮忙做计划", "需要改善理财方式"],
      tag: "Nutra 为他们而做",
    },
  },
};

function Side({ group, front }: { group: Group; front: boolean }) {
  const w = styles.word;
  return (
    <div className={styles.side} data-side={group.letter}>
      <div className={styles.head}>
        <span aria-hidden className={styles.letter} data-front={front}>
          {group.letter}
        </span>
        <div className={styles.names}>
          <p className={`t-label ${styles.label}`}>{hold(group.label, w)}</p>
          <p className={`t-subhead ${styles.title}`}>{hold(group.title, w)}</p>
        </div>
      </div>
      <ul className={styles.rows}>
        {group.rows.map((row, i) => (
          <li key={row} className={`t-small ${styles.row}`} style={{ "--i": i } as CSSProperties}>
            <span aria-hidden className={styles.sq} />
            <span>{hold(row, w)}</span>
          </li>
        ))}
      </ul>
      <p className={`t-label ${styles.tag}`}>{hold(group.tag, w)}</p>
    </div>
  );
}

export function NutraAudience() {
  const cn = useLocale() === "cn";
  const copy = cn ? COPY.cn : COPY.en;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });

  return (
    <figure ref={ref} className={styles.fig} data-in={inView} aria-label={copy.aria}>
      <div className={styles.split}>
        <div className={`slab ${styles.a}`}>
          <Side group={copy.a} front={false} />
        </div>
        <div className={`paper-stack ${styles.bStack}`}>
          <div className={`paper ${styles.b}`}>
            <Side group={copy.b} front />
          </div>
        </div>
      </div>
    </figure>
  );
}
