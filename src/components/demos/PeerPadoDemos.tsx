import type { CSSProperties, ReactNode } from "react";
import styles from "./PeerPadoDemos.module.css";

type DemoProps = { playing: boolean; cn: boolean };

/* Every scene is drawn twice. The wide drawing (640 × 400) is for the
   desktop viewfinder. A phone plate is ~350px across, which would shrink
   that drawing's labels to 5px, so below 600px of plate the stage swaps
   to a compact drawing on a 320 × 200 canvas: the same moment at roughly
   1:1, its chrome (kickers, footers, "sample" tags) left out, nothing
   under 10 units. The swap is a container query on the stage, so the
   server and the client render the same markup. */
function Stage({ playing, cn, children }: DemoProps & { children: ReactNode }) {
  return (
    <div className={styles.stage} data-playing={playing} data-cn={cn} aria-hidden="true">
      {children}
    </div>
  );
}

const vars = (i: number) => ({ "--i": i }) as CSSProperties;

/** A sample briefing, rather than a feed of purported live research results. */
export function PeerDemo({ playing, cn }: DemoProps) {
  const cards = cn
    ? [["01", "方法", "把问题", "再问一遍"], ["02", "模型", "新的视角", "新的连接"], ["03", "数据", "从细节", "看见规律"]]
    : [["01", "METHODS", "A better", "question."], ["02", "MODELS", "Another", "perspective."], ["03", "DATA", "Patterns", "in the detail."]];
  const topics = cn ? ["机器学习", "神经科学"] : ["MACHINE LEARNING", "NEUROSCIENCE"];
  // Chip widths follow the label: Latin mono runs ~6.4 units a glyph, CJK 11.
  const chip = cn ? [84, 66] : [144, 98];

  return (
    <Stage playing={playing} cn={cn}>
      <svg className={`${styles.scene} ${styles.wide}`} viewBox="0 0 640 400" focusable="false">
        <rect width="640" height="400" fill="#151515" />
        <text x="30" y="39" className={styles.peerLogo}>Peer</text>
        <text x="610" y="34" textAnchor="end" className={styles.micro} fill="#919191">{cn ? "你的每日研究简报" : "YOUR DAILY BRIEFING"}</text>
        <path d="M30 54H610" stroke="#323232" />

        <text x="32" y="104" className={styles.peerTitle}>{cn ? "十篇，恰好。" : "Ten. Just for you."}</text>
        <text x="33" y="127" className={styles.body} fill="#9f9f9f">{cn ? "从一个研究方向开始。" : "Start with what you’re working on."}</text>
        <g>
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={459 + i * 15} y={83 + i * 1.8} width="11" height={43 - i * 1.8} fill="#dadada" className={styles.bar} style={vars(i)} />
          ))}
        </g>

        <g>
          <rect className={styles.topicSelected} x="32" y="150" width="173" height="29" fill="#c56d41" />
          <text x="45" y="169" className={styles.topic} fill="#141414">{topics[0]}</text>
          <path className={styles.topicCheck} d="m181 164 4 4 7-8" stroke="#141414" strokeWidth="1.7" fill="none" />
          <rect x="212" y="150" width="142" height="29" fill="none" stroke="#3f3f3f" />
          <text x="225" y="169" className={styles.topic} fill="#959595">{topics[1]}</text>
          <rect x="361" y="150" width="151" height="29" fill="none" stroke="#3f3f3f" />
          <text x="374" y="169" className={styles.topic} fill="#959595">{cn ? "气候科学" : "CLIMATE SCIENCE"}</text>
        </g>

        {cards.map(([number, label, first, second], i) => (
          <g key={number} className={styles.paper} style={vars(i)}>
            <rect x={32 + i * 196} y="198" width="184" height="157" fill={i === 1 ? "#262626" : "#212121"} />
            <path d={`M${32 + i * 196} 208v-10h10M${216 + i * 196} 345v10h-10`} stroke="#747474" fill="none" />
            <text x={48 + i * 196} y="222" className={styles.micro} fill="#aaa99d">{number} / {label}</text>
            <text x={48 + i * 196} y="265" className={styles.paperTitle}>{first}</text>
            <text x={48 + i * 196} y="295" className={styles.paperTitle} fontStyle="italic">{second}</text>
            <path d={`M${48 + i * 196} 316h134M${48 + i * 196} 326h${i === 1 ? 82 : 107}`} stroke="#646464" strokeWidth="2" opacity=".65" />
            <text x={198 + i * 196} y="340" textAnchor="end" className={styles.micro} fill="#858585">↗</text>
          </g>
        ))}

        <text x="32" y="379" className={styles.micro} fill="#7f7f7f">{cn ? "方向 → 筛选 → 每日十篇" : "YOUR FIELD → A SHORTLIST → TEN A DAY"}</text>
        <text x="610" y="381" textAnchor="end" className={styles.micro} fill="#7f7f7f">{cn ? "示例简报" : "SAMPLE BRIEF"}</text>
      </svg>

      {/* Compact: the promise, the ten, the chosen field, two papers. */}
      <svg className={`${styles.scene} ${styles.compact}`} viewBox="0 0 320 200" focusable="false">
        <rect width="320" height="200" fill="#151515" />
        <text x="16" y="31" className={styles.peerLogo}>Peer</text>
        <path d="M16 44H304" stroke="#323232" />

        <text x="16" y="82" className={styles.peerTitle}>{cn ? "十篇，恰好。" : "Ten. Just for you."}</text>
        <g>
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={246 + i * 6} y={56 + i * 1.1} width="4" height={24 - i * 1.1} fill="#dadada" className={styles.bar} style={vars(i)} />
          ))}
        </g>

        <g>
          <rect className={styles.topicSelected} x="16" y="98" width={chip[0]} height="23" fill="#c56d41" />
          <text x="26" y="113.5" className={styles.topic} fill="#141414">{topics[0]}</text>
          <path className={styles.topicCheck} d={`m${chip[0] - 4} 109.5 3 3 5.5-6.5`} stroke="#141414" strokeWidth="1.5" fill="none" />
          <rect x={chip[0] + 22.5} y="98.5" width={chip[1]} height="22" fill="none" stroke="#3f3f3f" />
          <text x={chip[0] + 32} y="113.5" className={styles.topic} fill="#959595">{topics[1]}</text>
        </g>

        {cards.slice(0, 2).map(([number, label, first, second], i) => (
          <g key={number} className={styles.paper} style={vars(i)}>
            <rect x={16 + i * 148} y="136" width="140" height="80" fill={i === 1 ? "#262626" : "#212121"} />
            <path d={`M${16 + i * 148} 143v-7h7`} stroke="#747474" fill="none" />
            <text x={27 + i * 148} y="154" className={styles.micro} fill="#aaa99d">{number} / {label}</text>
            <text x={27 + i * 148} y="174" className={styles.paperTitle}>{first}</text>
            <text x={27 + i * 148} y="192" className={styles.paperTitle} fontStyle="italic">{second}</text>
          </g>
        ))}
        {/* The third paper waits off the edge: there are more than two. */}
        <rect className={styles.paper} style={vars(2)} x="312" y="136" width="140" height="80" fill="#212121" />
      </svg>
    </Stage>
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
  const log = [{ label: cn ? "早餐" : "Breakfast", time: "08:00" }, { label: cn ? "用药记录" : "Medication log", time: "09:00" }];

  return (
    <Stage playing={playing} cn={cn}>
      <svg className={`${styles.scene} ${styles.wide}`} viewBox="0 0 640 400" focusable="false">
        <rect width="640" height="400" fill="#1a1a1a" />
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
        {log.map((item, i) => (
          <g key={item.time} className={styles.logRow} style={vars(i)}>
            <rect x="232" y={130 + i * 51} width="354" height="43" rx="10" fill="#f4f4f4" />
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
        <text x="610" y="381" textAnchor="end" className={styles.micro} fill="#9c8aae">{cn ? "演示记录" : "SAMPLE ENTRIES"}</text>
      </svg>

      {/* Compact: the notebook card fills the plate — the cat, two entries, Paw. */}
      <svg className={`${styles.scene} ${styles.compact}`} viewBox="0 0 320 200" focusable="false">
        <rect width="320" height="200" fill="#1a1a1a" />
        <text x="16" y="31" className={styles.padoLogo}>Pado</text>

        <rect x="12" y="44" width="296" height="146" rx="14" fill="#e6e0ef" />
        <path d="M112 58v118" stroke="#d0c6df" />
        <g transform="translate(62 90) scale(.48) translate(-116 -172)"><CatFace /></g>
        <text x="62" y="137" textAnchor="middle" className={styles.catName}>mo mo</text>
        <rect x="24" y="149" width="76" height="19" rx="9.5" fill="#d4c8e7" />
        <text x="62" y="162" textAnchor="middle" className={styles.small} fill="#71528e">{cn ? "日常已记录" : "ALL NOTED"}</text>

        {log.map((item, i) => (
          <g key={item.time} className={styles.logRow} style={vars(i)}>
            <rect x="124" y={56 + i * 34} width="172" height="28" rx="8" fill="#f4f4f4" />
            <circle cx="139" cy={70 + i * 34} r="7.5" fill="#b195eb" opacity=".22" />
            <path className={styles.check} d={`m135.5 ${70 + i * 34} 2.6 2.6 4.6-5.4`} fill="none" stroke="#845ab9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <text x="153" y={74.5 + i * 34} className={styles.logLabel}>{item.label}</text>
            <text x="287" y={74 + i * 34} textAnchor="end" className={styles.small} fill="#8a7b96">{item.time}</text>
          </g>
        ))}

        <g className={styles.pawMessage}>
          <rect x="124" y="124" width="172" height="56" rx="10" fill="#d7c7f1" />
          <circle cx="138" cy="139" r="6.5" fill="#9b76d4" />
          <path d="M135.6 141.4q2.4-4 4.8 0m-4.8-4.8v.8m2.4-2.4v.8m2.4.8v.8" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
          <text x="150" y="143" className={styles.pawLabel}>Paw</text>
          <path d="M280 139h8m-4-4v8" stroke="#a188c3" strokeWidth="1.3" />
          <text x="134" y="159" className={styles.pawCopy}>{cn ? "把最近几天的记录，" : "The last few days,"}</text>
          <text x="134" y="173" className={styles.pawCopy}>{cn ? "放在一起看。" : "all in one place."}</text>
        </g>
      </svg>
    </Stage>
  );
}
