import type { CSSProperties } from "react";
import styles from "./BuildScenes.module.css";

type BuildSceneProps = {
  kind: "frontend" | "email" | "backend";
  cn: boolean;
  playing: boolean;
};

function Flow({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <g fill="none">
      <path d={d} className={styles.connection} />
      <path d={d} pathLength="100" className={styles.packet} style={{ "--delay": delay + "ms" } as CSSProperties} />
    </g>
  );
}

function FrontendScene({ cn }: { cn: boolean }) {
  const code = ["export function TripCard() {", "  return (", "    <article>", "      <h2>A place to go.</h2>", "      <Button>Explore</Button>", "    </article>", "  );", "}"];
  return (
    <>
      <g className={styles.input}>
        <rect x="4" y="22" width="312" height="226" rx="4" className={styles.surface} />
        <path d="M4 52H316" className={styles.rule} />
        <path d="m20 34-3 3 3 3m5-6 3 3-3 3" className={styles.glyph} />
        <text x="38" y="42" className={styles.filename}>TripCard.tsx</text>
        <path d="M292 37h9" className={styles.rule} />
        <rect x="35" y="148" width="276" height="20" className={styles.codeHighlight} />
        {code.map((line, i) => (
          <g key={line}>
            <text x="22" y={84 + i * 20} className={styles.lineNumber}>{i + 1}</text>
            <text x="38" y={84 + i * 20} xmlSpace="preserve" className={i === 4 ? styles.codeBright : styles.code}>{line}</text>
          </g>
        ))}
      </g>
      <Flow d="M316 136H337" delay={350} />
      <path d="m331 132 5 4-5 4" className={styles.glyph} />
      <g>
        <rect x="343" y="17" width="284" height="226" rx="5" className={styles.surface} />
        <path d="M343 44H627" className={styles.rule} />
        <circle cx="356" cy="31" r="2" className={styles.dimFill} />
        <circle cx="364" cy="31" r="2" className={styles.dimFill} />
        <circle cx="372" cy="31" r="2" className={styles.dimFill} />
        <text x="485" y="36" textAnchor="middle" className={styles.micro}>{cn ? "组件预览" : "Component preview"}</text>
        <g className={styles.frontendResult}>
          <rect x="359" y="58" width="252" height="93" rx="2" fill="#8c8c8c" />
          <path d="M359 131 423 91l43 27 47-41 98 69v5H359Z" fill="#1c1c1c" />
          <path d="m359 151 106-37 55 37" fill="#0f0f0f" />
          <path d="m518 151 48-31 45 24v7" fill="#0f0f0f" />
          <circle cx="564" cy="82" r="11" fill="#f3f3f3" />
          <text x="359" y="184" className={styles.serif} style={cn ? { fontSize: 22 } : undefined}>{cn ? "下一站，出发。" : "A place to go."}</text>
          <path d="M359 198h126" className={styles.placeholder} />
          <path d="M359 209h87" className={styles.placeholder} />
          <g className={styles.buttonReveal}>
            <rect x="522" y="179" width="89" height="36" rx="3" fill="#f3f3f3" />
            <text x="531" y="202" className={styles.buttonText}>{cn ? "探索" : "Explore"}</text>
            <path d="M588 197h11m-4-4 4 4-4 4" fill="none" stroke="#0f0f0f" strokeWidth="1.25" />
          </g>
        </g>
      </g>
    </>
  );
}

function EmailScene({ cn }: { cn: boolean }) {
  return (
    <>
      <g className={styles.input}>
        <path d="M4 56h142l12 12v136H4Z" className={styles.surface} />
        <path d="M146 56v12h12M4 88h154" className={styles.rule} />
        <text x="16" y="77" className={styles.filename}>{cn ? "事件数据" : "event.json"}</text>
        <text x="16" y="114" className={styles.codeBright}>{"{"}</text>
        <text x="28" y="136" className={styles.code}>{'"name":'}</text>
        <text x="40" y="158" className={styles.codeBright}>{'"Traveler"'}</text>
        <text x="16" y="182" className={styles.codeBright}>{"}"}</text>
      </g>
      <Flow d="M158 130H176" delay={200} />
      <g>
        <rect x="184" y="28" width="248" height="204" rx="4" className={styles.surface} />
        <path d="M184 58H432" className={styles.rule} />
        <text x="198" y="48" className={styles.filename}>welcome.liquid</text>
        <rect x="194" y="118" width="228" height="22" rx="1" className={styles.templateHighlight} />
        <text x="198" y="90" className={styles.code}>{"{% if customer.name %}"}</text>
        <text x="198" y="112" className={styles.codeBright}>Hello,</text>
        <text x="198" y="134" className={styles.codeBright}>{"{{ customer.name }}"}</text>
        <text x="198" y="160" className={styles.code}>{"{% else %}"}</text>
        <text x="198" y="182" className={styles.codeBright}>Hello, traveler</text>
        <text x="198" y="208" className={styles.code}>{"{% endif %}"}</text>
      </g>
      <Flow d="M432 130H442" delay={600} />
      <g className={styles.emailResult}>
        <rect x="450" y="17" width="177" height="227" rx="3" fill="#f3f3f3" />
        <path d="M464 39h24" fill="none" stroke="#0f0f0f" strokeWidth="2" />
        <text x="613" y="44" textAnchor="end" className={styles.paperMicro}>{cn ? "收件箱" : "Inbox"}</text>
        <path d="M464 54h149" fill="none" stroke="#8c8c8c" />
        <text x="464" y="82" className={styles.emailGreeting}>{cn ? "你好，Traveler。" : "Hello, Traveler."}</text>
        <path d="M465 97h125m-125 9h102" stroke="#8c8c8c" strokeWidth="2" />
        <rect x="464" y="123" width="149" height="61" fill="#8c8c8c" />
        <path d="m473 173 129-34m-64 17-7-20 10 3 11 13m-3 5-3 15 7-2 10-18" fill="none" stroke="#f3f3f3" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="464" y="197" width="149" height="28" rx="2" fill="#0f0f0f" />
        <text x="538" y="216" textAnchor="middle" className={styles.emailButton}>{cn ? "查看详情" : "View details"}</text>
      </g>
      <text x="81" y="228" textAnchor="middle" className={styles.micro}>{cn ? "示例数据" : "Sample payload"}</text>
    </>
  );
}

function BackendScene({ cn }: { cn: boolean }) {
  const sources = ["arXiv", "OpenAlex", "Semantic Scholar"];
  const stages = ["fetch()", "normalize()", "deduplicate()", "store()"];
  return (
    <>
      {sources.map((source, i) => (
        <g key={source} className={styles.source} style={{ "--i": i } as CSSProperties}>
          <path d={"M13 " + (37 + i * 67) + "h155l10 10v39H13Z"} className={styles.surface} />
          <path d={"M168 " + (37 + i * 67) + "v10h10"} className={styles.rule} />
          <path d={"M25 " + (51 + i * 67) + "h9m-9 5h9m-9 5h6"} className={styles.glyph} />
          <text x="44" y={61 + i * 67} className={styles.name}>{source}</text>
          <path d={"M44 " + (71 + i * 67) + "h" + (i === 2 ? 107 : 77)} className={styles.placeholder} />
        </g>
      ))}
      <Flow d="M178 62H192Q204 62 204 76V117Q204 130 217 130H232" delay={180} />
      <Flow d="M178 129H232" delay={340} />
      <Flow d="M178 196H192Q204 196 204 182V143Q204 130 217 130H232" delay={500} />
      <g>
        <rect x="241" y="30" width="208" height="204" rx="4" className={styles.surface} />
        <path d="M241 61H449" className={styles.rule} />
        <text x="256" y="51" className={styles.filename}>pipeline.py</text>
        <path d="M262 91V206" className={styles.rule} />
        {stages.map((stage, i) => (
          <g key={stage} className={styles.stage} style={{ "--i": i } as CSSProperties}>
            <circle cx="262" cy={87 + i * 38} r="3" fill="#f3f3f3" />
            <text x="279" y={92 + i * 38} className={styles.codeBright}>{stage}</text>
            <path d={"m426 " + (84 + i * 38) + " 3 3 5-6"} className={styles.stageCheck} />
          </g>
        ))}
      </g>
      <Flow d="M449 130H501" delay={950} />
      <path d="m496 126 5 4-5 4" className={styles.glyph} />
      <g className={styles.databaseResult}>
        <rect x="510" y="51" width="116" height="167" rx="4" className={styles.surface} />
        <path d="M510 80H626" className={styles.rule} />
        <path d="M521 63h8v8h-8Zm4 0v8m-4-4h8" className={styles.glyph} />
        <text x="537" y="71" className={styles.filename}>papers</text>
        <path d="M510 112H626M510 146H626M510 180H626" className={styles.rule} />
        {[0, 1, 2, 3].map((i) => <g key={i}><path d={"M522 " + (95 + i * 34) + "h" + (i % 2 === 0 ? 70 : 54)} className={styles.placeholder} /><path d={"M522 " + (103 + i * 34) + "h" + (i % 2 === 0 ? 38 : 60)} className={styles.placeholderQuiet} /></g>)}
      </g>
      <text x="568" y="246" textAnchor="middle" className={styles.micro}>{cn ? "结构化存储" : "Indexed records"}</text>
    </>
  );
}

export function BuildScene({ kind, cn, playing }: BuildSceneProps) {
  return (
    <svg className={styles.scene} viewBox="0 0 640 260" data-playing={playing} aria-hidden="true" focusable="false">
      {kind === "frontend" && <FrontendScene cn={cn} />}
      {kind === "email" && <EmailScene cn={cn} />}
      {kind === "backend" && <BackendScene cn={cn} />}
    </svg>
  );
}
