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
        <rect x="12" y="38" width="264" height="195" rx="4" className={styles.surface} />
        <path d="M12 65H276" className={styles.rule} />
        <path d="m26 49-3 3 3 3m5-6 3 3-3 3" className={styles.glyph} />
        <text x="44" y="55" className={styles.filename}>TripCard.tsx</text>
        <path d="M252 51h9" className={styles.rule} />
        <rect x="43" y="141" width="219" height="19" fill="currentColor" opacity=".04" className={styles.codeHighlight} />
        {code.map((line, i) => (
          <g key={line}>
            <text x="29" y={88 + i * 18} className={styles.lineNumber}>{i + 1}</text>
            <text x="44" y={88 + i * 18} xmlSpace="preserve" className={i === 4 ? styles.codeBright : styles.code}>{line}</text>
          </g>
        ))}
      </g>
      <Flow d="M276 136H335" delay={350} />
      <path d="m329 132 5 4-5 4" className={styles.glyph} />
      <g>
        <rect x="343" y="17" width="284" height="226" rx="5" className={styles.surface} />
        <path d="M343 44H627" className={styles.rule} />
        <circle cx="356" cy="31" r="2" className={styles.dimFill} />
        <circle cx="364" cy="31" r="2" className={styles.dimFill} />
        <circle cx="372" cy="31" r="2" className={styles.dimFill} />
        <text x="485" y="34" textAnchor="middle" className={styles.micro}>{cn ? "运行中的组件" : "COMPONENT PREVIEW"}</text>
        <g className={styles.frontendResult}>
          <rect x="359" y="58" width="252" height="93" rx="2" fill="#d6d4ca" />
          <path d="M359 131 423 91l43 27 47-41 98 69v5H359Z" fill="#b0afa6" />
          <path d="m359 151 106-37 55 37" fill="#95968e" />
          <path d="m518 151 48-31 45 24v7" fill="#c7c5bb" />
          <circle cx="564" cy="82" r="11" fill="#eeece2" />
          <text x="359" y="184" className={styles.serif} style={cn ? { fontSize: 22 } : undefined}>{cn ? "下一站，出发。" : "A place to go."}</text>
          <path d="M359 198h126" className={styles.placeholder} />
          <path d="M359 209h87" className={styles.placeholder} opacity=".5" />
          <g className={styles.buttonReveal}>
            <rect x="522" y="179" width="89" height="36" rx="3" fill="#e4e2d8" />
            <text x="533" y="201" className={styles.buttonText}>{cn ? "探索" : "Explore"}</text>
            <path d="M588 197h11m-4-4 4 4-4 4" fill="none" stroke="#30302e" strokeWidth="1.25" />
          </g>
        </g>
      </g>
      <text x="309" y="158" textAnchor="middle" className={styles.tiny}>JSX</text>
    </>
  );
}

function EmailScene({ cn }: { cn: boolean }) {
  return (
    <>
      <g className={styles.input}>
        <path d="M13 60h136l12 12v125H13Z" className={styles.surface} />
        <path d="M149 60v12h12M13 89h148" className={styles.rule} />
        <text x="27" y="79" className={styles.filename}>{cn ? "事件数据" : "event.json"}</text>
        <text x="26" y="113" className={styles.codeBright}>{"{"}</text>
        <text x="37" y="132" className={styles.code}>{'"name":'}</text>
        <text x="47" y="150" className={styles.codeBright}>{'"Traveler"'}</text>
        <text x="26" y="174" className={styles.codeBright}>{"}"}</text>
      </g>
      <Flow d="M162 130H190" delay={200} />
      <g>
        <rect x="198" y="33" width="215" height="194" rx="4" className={styles.surface} />
        <path d="M198 61H413" className={styles.rule} />
        <text x="213" y="51" className={styles.filename}>welcome.liquid</text>
        <rect x="209" y="116" width="193" height="22" rx="1" fill="currentColor" opacity=".07" className={styles.templateHighlight} />
        <text x="214" y="91" className={styles.code}>{"{% if customer.name %}"}</text>
        <text x="214" y="112" className={styles.codeBright}>Hello,</text>
        <text x="214" y="131" className={styles.codeBright}>{"{{ customer.name }}"}</text>
        <text x="214" y="155" className={styles.code}>{"{% else %}"}</text>
        <text x="214" y="176" className={styles.codeBright}>Hello, traveler</text>
        <text x="214" y="200" className={styles.code}>{"{% endif %}"}</text>
      </g>
      <Flow d="M414 130H441" delay={1000} />
      <g className={styles.emailResult}>
        <rect x="450" y="17" width="177" height="227" rx="3" fill="#e8e6dc" />
        <path d="M464 39h24" fill="none" stroke="#252522" strokeWidth="2" />
        <text x="613" y="42" textAnchor="end" className={styles.paperMicro}>INBOX</text>
        <path d="M464 54h149" fill="none" stroke="#c8c6bc" />
        <text x="464" y="82" className={styles.emailGreeting}>{cn ? "你好，Traveler。" : "Hello, Traveler."}</text>
        <path d="M465 97h125m-125 9h102" stroke="#aaa89f" strokeWidth="2" />
        <rect x="464" y="123" width="149" height="61" fill="#d7d5cb" />
        <path d="m473 173 129-34m-64 17-7-20 10 3 11 13m-3 5-3 15 7-2 10-18" fill="none" stroke="#8a8a80" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="464" y="197" width="149" height="28" rx="2" fill="#292925" />
        <text x="538" y="215" textAnchor="middle" className={styles.emailButton}>{cn ? "查看详情" : "View details"}</text>
      </g>
      <text x="86" y="219" textAnchor="middle" className={styles.micro}>{cn ? "示例数据" : "SAMPLE PAYLOAD"}</text>
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
          <text x="44" y={60 + i * 67} className={styles.filename}>{source}</text>
          <path d={"M44 " + (71 + i * 67) + "h" + (i === 2 ? 107 : 77)} className={styles.placeholder} opacity=".6" />
        </g>
      ))}
      <Flow d="M178 62H192Q204 62 204 76V117Q204 130 217 130H232" delay={180} />
      <Flow d="M178 129H232" delay={340} />
      <Flow d="M178 196H192Q204 196 204 182V143Q204 130 217 130H232" delay={500} />
      <g>
        <rect x="241" y="30" width="208" height="204" rx="4" className={styles.surface} />
        <path d="M241 61H449" className={styles.rule} />
        <text x="256" y="50" className={styles.filename}>pipeline.py</text>
        <path d="M262 91V206" className={styles.rule} />
        {stages.map((stage, i) => (
          <g key={stage} className={styles.stage} style={{ "--i": i } as CSSProperties}>
            <circle cx="262" cy={87 + i * 38} r="3" fill="#c2c2b9" />
            <text x="279" y={91 + i * 38} className={styles.codeBright}>{stage}</text>
            <path d={"m426 " + (84 + i * 38) + " 3 3 5-6"} className={styles.stageCheck} />
          </g>
        ))}
      </g>
      <Flow d="M449 130H501" delay={1400} />
      <path d="m496 126 5 4-5 4" className={styles.glyph} />
      <g className={styles.databaseResult}>
        <rect x="510" y="51" width="116" height="167" rx="4" className={styles.surface} />
        <path d="M510 80H626" className={styles.rule} />
        <path d="M521 63h8v8h-8Zm4 0v8m-4-4h8" className={styles.glyph} />
        <text x="537" y="70" className={styles.filename}>papers</text>
        <path d="M542 80V218M510 112H626M510 146H626M510 180H626" className={styles.rule} />
        {[0, 1, 2, 3].map((i) => <g key={i}><rect x="522" y={94 + i * 34} width="9" height="3" fill="#898a80" /><path d={"M553 " + (95 + i * 34) + "h" + (i % 2 === 0 ? 54 : 41)} className={styles.placeholder} /><path d={"M553 " + (103 + i * 34) + "h" + (i % 2 === 0 ? 29 : 47)} className={styles.placeholder} opacity=".4" /></g>)}
      </g>
      <text x="568" y="241" textAnchor="middle" className={styles.micro}>{cn ? "结构化存储" : "STRUCTURED"}</text>
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
