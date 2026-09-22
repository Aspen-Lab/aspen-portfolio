import type { CSSProperties } from "react";
import styles from "./PeerPadoDemos.module.css";

type DemoProps = { playing: boolean; cn: boolean };

/** A sample briefing, rather than a feed of purported live research results. */
export function PeerDemo({ playing, cn }: DemoProps) {
  const cards = cn
    ? [["01", "方法", "把问题", "再问一遍"], ["02", "模型", "新的视角", "新的连接"], ["03", "数据", "从细节", "看见规律"]]
    : [["01", "METHODS", "A better", "question."], ["02", "MODELS", "Another", "perspective."], ["03", "DATA", "Patterns", "in the detail."]];

  return (
    <svg className={`${styles.scene} ${styles.peer}`} viewBox="0 0 640 400" data-playing={playing} aria-hidden="true" focusable="false">
      <rect width="640" height="400" fill="#151515" />
      <text x="30" y="39" className={styles.peerLogo}>Peer</text>
      <text x="610" y="34" textAnchor="end" className={styles.micro} fill="#93938c">{cn ? "你的每日研究简报" : "YOUR DAILY BRIEFING"}</text>
      <path d="M30 54H610" stroke="#33332f" />

      <text x="32" y="104" className={styles.peerTitle}>{cn ? "十篇，恰好。" : "Ten. Just for you."}</text>
      <text x="33" y="127" className={styles.body} fill="#a1a19a">{cn ? "从一个研究方向开始。" : "Start with what you’re working on."}</text>
      <g className={styles.bars}>
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={459 + i * 15} y={83 + i * 1.8} width="11" height={43 - i * 1.8} fill="#deded3" className={styles.bar} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>

      <g>
        <rect className={styles.topicSelected} x="32" y="150" width="173" height="29" fill="#c56d41" />
        <text x="45" y="169" className={styles.topic} fill="#161411">{cn ? "机器学习" : "MACHINE LEARNING"}</text>
        <path className={styles.topicCheck} d="m181 164 4 4 7-8" stroke="#161411" strokeWidth="1.7" fill="none" />
        <rect x="212" y="150" width="142" height="29" fill="none" stroke="#41413b" />
        <text x="225" y="169" className={styles.topic} fill="#989890">{cn ? "神经科学" : "NEUROSCIENCE"}</text>
        <rect x="361" y="150" width="151" height="29" fill="none" stroke="#41413b" />
        <text x="374" y="169" className={styles.topic} fill="#989890">{cn ? "气候科学" : "CLIMATE SCIENCE"}</text>
      </g>

      {cards.map(([number, label, first, second], i) => (
        <g key={number} className={styles.paper} style={{ "--i": i } as CSSProperties}>
          <rect x={32 + i * 196} y="198" width="184" height="157" fill={i === 1 ? "#272723" : "#22221f"} />
          <path d={`M${32 + i * 196} 208v-10h10M${216 + i * 196} 345v10h-10`} stroke="#77776d" fill="none" />
          <text x={48 + i * 196} y="222" className={styles.micro} fill="#aaa99d">{number} / {label}</text>
          <text x={48 + i * 196} y="265" className={styles.paperTitle}>{first}</text>
          <text x={48 + i * 196} y="295" className={styles.paperTitle} fontStyle="italic">{second}</text>
          <path d={`M${48 + i * 196} 316h134M${48 + i * 196} 326h${i === 1 ? 82 : 107}`} stroke="#68685d" strokeWidth="2" opacity=".65" />
          <text x={198 + i * 196} y="340" textAnchor="end" className={styles.micro} fill="#89897d">↗</text>
        </g>
      ))}

      <text x="32" y="379" className={styles.micro} fill="#82827a">{cn ? "方向 → 筛选 → 每日十篇" : "YOUR FIELD → A SHORTLIST → TEN A DAY"}</text>
      <text x="610" y="379" textAnchor="end" className={styles.micro} fill="#82827a">{cn ? "示例简报" : "SAMPLE BRIEF"}</text>
    </svg>
  );
}

function CatFace() {
  return (
    <g className={styles.cat}>
      <path d="M73 167c-10-8-13-36-5-45l28 16c15-4 26-4 40 0l29-16c8 9 4 37-5 45 5 11 5 24-1 36-14 25-72 25-86 0-6-12-6-25 0-36Z" fill="#ab90f2" />
      <path d="m74 135 14 10-12 9Zm83 0-14 10 12 9Z" fill="#d5c6fb" />
      <g className={styles.catEyes} fill="#332449"><ellipse cx="96" cy="176" rx="3.3" ry="5" /><ellipse cx="136" cy="176" rx="3.3" ry="5" /></g>
      <path d="m112 188 4 4 4-4M116 192v5m-8 0c3 4 5 4 8 0 3 4 5 4 8 0" fill="none" stroke="#5b3e7b" strokeWidth="2" strokeLinecap="round" />
      <path d="m75 187 10 2m-10 6 10-1m62-5 10-2m-10 7 10 1" stroke="#79629f" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

/** A small, illustrative household log with no health guidance or live data. */
export function PadoDemo({ playing, cn }: DemoProps) {
  return (
    <svg className={`${styles.scene} ${styles.pado}`} viewBox="0 0 640 400" data-playing={playing} aria-hidden="true" focusable="false">
      <rect width="640" height="400" fill="#19171e" />
      <circle cx="569" cy="365" r="137" fill="#a388dc" opacity=".035" />
      <text x="31" y="43" className={styles.padoLogo}>Pado</text>
      <text x="610" y="38" textAnchor="end" className={styles.micro} fill="#a991d6">{cn ? "家里这只猫，每天的本子" : "A LITTLE CARE, EVERY DAY."}</text>
      <path d="M30 60H610" stroke="#39313f" />

      <rect x="30" y="80" width="580" height="268" rx="20" fill="#e6e0ef" />
      <path d="M210 104v218" stroke="#d0c6df" />
      <text x="52" y="110" className={styles.small} fill="#776783">{cn ? "今天 · 示例" : "TODAY · DEMO"}</text>
      <CatFace />
      <text x="116" y="250" textAnchor="middle" className={styles.catName}>mo mo</text>
      <text x="116" y="273" textAnchor="middle" className={styles.body} fill="#877693">{cn ? "全家一起照顾" : "One shared notebook"}</text>
      <rect x="72" y="292" width="88" height="26" rx="13" fill="#d4c8e7" />
      <text x="116" y="309" textAnchor="middle" className={styles.small} fill="#71528e">{cn ? "日常已记录" : "ALL NOTED"}</text>

      <text x="233" y="113" className={styles.padoHeading}>{cn ? "今天的小事" : "The little things."}</text>
      {[{ label: cn ? "早餐" : "Breakfast", time: "08:00" }, { label: cn ? "用药记录" : "Medication log", time: "09:00" }].map((item, i) => (
        <g key={item.time} className={styles.logRow} style={{ "--i": i } as CSSProperties}>
          <rect x="232" y={130 + i * 51} width="354" height="43" rx="10" fill="#f4effa" />
          <circle cx="253" cy={151 + i * 51} r="9" fill="#b195eb" opacity=".22" />
          <path className={styles.check} d={`m248 ${151 + i * 51} 3.5 3.5 6-7`} fill="none" stroke="#845ab9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="273" y={157 + i * 51} className={styles.logLabel}>{item.label}</text>
          <text x="568" y={155 + i * 51} textAnchor="end" className={styles.small} fill="#9788a2">{item.time}</text>
        </g>
      ))}

      <g className={styles.pawMessage}>
        <rect x="232" y="239" width="354" height="82" rx="13" fill="#d7c7f1" />
        <circle cx="253" cy="260" r="8" fill="#9b76d4" />
        <path d="M250 263q3-5 6 0m-6-6v1m3-3v1m3 1v1" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <text x="269" y="265" className={styles.pawLabel}>Paw</text>
        <text x="246" y="292" className={styles.pawCopy}>{cn ? "把最近几天的记录，放在一起看。" : "The last few days, all in one place."}</text>
        <path d="M561 255h10m-5-5v10" stroke="#a188c3" strokeWidth="1.5" />
      </g>
      <text x="32" y="379" className={styles.micro} fill="#9c8aae">{cn ? "记录 → 共享 → 问问 PAW" : "LOG IT → SHARE IT → ASK PAW"}</text>
      <text x="610" y="379" textAnchor="end" className={styles.micro} fill="#9c8aae">{cn ? "演示记录" : "SAMPLE ENTRIES"}</text>
    </svg>
  );
}
