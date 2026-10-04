"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./CapabilityCards.module.css";

type StudyKind = "design" | "code" | "brand" | "research";
type CapabilityItem = { icon: StudyKind; name: string; tag: string; desc: string };
type CapabilityCardsProps = { cn: boolean; items: ReadonlyArray<CapabilityItem> };

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");
/** Stagger index for a study's loops (read as --i in the CSS). */
const at = (index: number) => ({ "--i": index }) as CSSProperties;

function Choice({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return <button type="button" aria-pressed={active} aria-label={label} onClick={onClick} className={styles.choice}>{children}</button>;
}

/** Product design · a list a reader scans row by row; the tiles move one after another when the layout changes. */
function LayoutStudy({ cn }: { cn: boolean }) {
  const [columns, setColumns] = useState(false);
  return (
    <>
      <div className={styles.canvas} aria-hidden="true">
        <svg viewBox="0 0 320 114" className={styles.visual}>
          <path d="M31 3v108m258-108v108" className={styles.guide} />
          {[0, 1, 2].map((i) => (
            <g key={i} className={styles.layoutTile} style={{ transform: columns ? "translate(" + (39 + i * 83) + "px, 8px)" : "translate(39px," + (8 + i * 34) + "px)", transitionDelay: `${i * 50}ms` }}>
              <rect width={columns ? 76 : 242} height={columns ? 98 : 29} rx="3" className={cx(styles.tile, styles.scan, styles.motion)} style={{ ...at(i), transitionDelay: `${i * 50}ms` }} />
              <g className={styles.layoutSymbol} style={{ transform: columns ? "translate(38px, 33px)" : "translate(17px, 14px)" }}>
                {i === 0 && <circle r="7" className={styles.symbolFill} />}
                {i === 1 && <path d="m0-8 8 14H-8Z" className={styles.symbolFill} />}
                {i === 2 && <rect x="-6" y="-6" width="12" height="12" className={styles.symbolFill} transform="rotate(45)" />}
              </g>
              <path d={columns ? "M17 64h42m-42 12h27" : "M39 11h131m-131 8h87"} className={styles.contentLine} />
              {!columns && <path d="M217 14h10m-4-4 4 4-4 4" className={cx(styles.contentLine, styles.nudge, styles.motion)} style={at(i)} />}
            </g>
          ))}
        </svg>
      </div>
      <div className={styles.controls} role="group" aria-label={cn ? "切换抽象布局" : "Change the abstract layout"}>
        <Choice active={!columns} onClick={() => setColumns(false)}><span aria-hidden="true">☰</span>{cn ? "行布局" : "Rows"}</Choice>
        <Choice active={columns} onClick={() => setColumns(true)}><span aria-hidden="true">▥</span>{cn ? "列布局" : "Columns"}</Choice>
      </div>
    </>
  );
}

/** Design engineering · one component through its states: the spinner turns, the bar fills, the check draws. */
function StateStudy({ cn }: { cn: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const text = state === "idle" ? (cn ? "准备开始" : "Ready when you are") : state === "loading" ? (cn ? "正在构建…" : "Putting it together…") : (cn ? "可以探索了" : "Ready to explore");
  const progress = state === "idle" ? 1 : state === "loading" ? 0.46 : 0;
  return (
    <>
      <div className={styles.canvas} aria-hidden="true">
        <svg viewBox="0 0 320 114" className={styles.visual}>
          <path d="M30 55h27m206 0h27" className={styles.guide} />
          <rect x="58" y="16" width="204" height="73" rx="6" className={styles.tile} />
          <g key={state} className={styles.stateGlyph} transform="translate(81 44)">
            {state === "idle" && (
              <>
                <circle r="10" className={cx(styles.ring, styles.pulse, styles.motion)} />
                <path d="m-3-7 10 7-10 7Z" className={styles.symbolFill} />
              </>
            )}
            {state === "loading" && (
              <>
                <circle r="8" className={styles.guide} />
                <circle r="8" pathLength={1} className={cx(styles.brightLine, styles.arc, styles.spin, styles.motion)} />
              </>
            )}
            {state === "done" && (
              <>
                <circle r="9" className={cx(styles.guide, styles.pop)} />
                <path pathLength={1} d="m-5 0 3 3 7-7" className={cx(styles.brightLine, styles.check)} />
              </>
            )}
          </g>
          <text key={`text-${state}`} x="100" y="48" className={cx(styles.stateText, styles.fadeIn)}>{text}</text>
          <path d="M77 69h166" className={styles.guide} />
          <path pathLength={1} d="M77 69h166" className={styles.stateProgress} style={{ strokeDashoffset: progress }} />
          {state === "loading" && <circle cx="153" cy="69" r="2" className={cx(styles.symbolFill, styles.blink, styles.motion)} />}
          <text x="160" y="108" textAnchor="middle" className={styles.codeReadout}>{"<Button state=\"" + state + "\" />"}</text>
        </svg>
      </div>
      <div className={styles.controls} role="group" aria-label={cn ? "切换示例组件状态" : "Change the sample component state"}>
        <Choice active={state === "idle"} onClick={() => setState("idle")}>{cn ? "待机" : "Idle"}</Choice>
        <Choice active={state === "loading"} onClick={() => setState("loading")}>{cn ? "加载" : "Loading"}</Choice>
        <Choice active={state === "done"} onClick={() => setState("done")}>{cn ? "完成" : "Done"}</Choice>
      </div>
    </>
  );
}

/** Brand & visual · a specimen on its metrics, with brackets that measure its live width. */
function TypeStudy({ cn }: { cn: boolean }) {
  const [serif, setSerif] = useState(true);
  const [spaced, setSpaced] = useState(false);
  const specimen = useRef<SVGTextElement>(null);
  const [span, setSpan] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const box = specimen.current?.getBBox();
      if (box?.width) setSpan({ x: box.x, w: box.width });
    };
    measure();
    // letter-spacing eases over 300ms; read the settled width after it.
    const timer = window.setTimeout(measure, 340);
    document.fonts?.ready.then(measure);
    return () => window.clearTimeout(timer);
  }, [serif, spaced]);

  const xHeight = serif ? 44 : 39;
  return (
    <>
      <div className={styles.canvas} aria-hidden="true">
        <svg viewBox="0 0 320 114" className={styles.visual}>
          <path d="M35 24h250M35 85h250" className={styles.guide} />
          <path d={`M35 ${xHeight}h250`} className={cx(styles.guide, styles.dashed, styles.metric)} />
          <text x="36" y="21" className={styles.metricLabel}>CAP</text>
          <text x="36" y={xHeight - 3} className={cx(styles.metricLabel, styles.metric)}>X</text>
          <text x="36" y="82" className={styles.metricLabel}>BASE</text>
          <path d="M57 19v10m206-10v10M57 80v10m206-10v10" className={styles.contentLine} />
          <text ref={specimen} x="160" y="84" textAnchor="middle" className={styles.specimen} style={{ fontFamily: serif ? "var(--font-newsreader), Georgia, serif" : "var(--font-sans)", letterSpacing: spaced ? "14px" : "-4px", fontWeight: serif ? 350 : 450 } as CSSProperties}>Aa</text>
          {span && (
            <g className={styles.measure}>
              <path d={`M${span.x} 94v8M${span.x + span.w} 94v8`} className={styles.brightLine} />
              <path d={`M${span.x} 98H${span.x + span.w}`} className={styles.contentLine} />
              <text x="160" y="110" textAnchor="middle" className={styles.codeReadout}>W {Math.round(span.w)}</text>
            </g>
          )}
          <text x="42" y="108" className={styles.codeReadout}>{serif ? "SERIF" : "SANS"}</text>
          <text x="278" y="108" textAnchor="end" className={styles.codeReadout}>{spaced ? (cn ? "疏" : "OPEN") : (cn ? "密" : "TIGHT")}</text>
        </svg>
      </div>
      <div className={styles.controls} role="group" aria-label={cn ? "调整抽象字形与字距" : "Adjust the abstract type study"}>
        <Choice active={serif} onClick={() => setSerif(true)}>{cn ? "衬线" : "Serif"}</Choice>
        <Choice active={!serif} onClick={() => setSerif(false)}>{cn ? "无衬线" : "Sans"}</Choice>
        <Choice active={spaced} onClick={() => setSpaced((value) => !value)} label={cn ? "加宽字距" : "Space — widen letter spacing"}><span aria-hidden="true">↔</span>{cn ? "字距" : "Space"}</Choice>
      </div>
    </>
  );
}

/** Research × psychology · where attention goes: a scanpath of fixations over the content or the action. */
function FocusStudy({ cn }: { cn: boolean }) {
  const [action, setAction] = useState(false);
  const fixations = action
    ? [[96, 30], [168, 56], [206, 84], [226, 86], [214, 84]]
    : [[72, 30], [118, 29], [160, 33], [204, 35], [120, 57], [226, 58]];
  const scanpath = `M${fixations.map(([x, y]) => `${x} ${y}`).join("L")}`;
  return (
    <>
      <div className={styles.canvas} aria-hidden="true">
        <svg viewBox="0 0 320 114" className={styles.visual}>
          <rect x="48" y="8" width="224" height="98" rx="3" className={styles.tile} />
          <g className={styles.focusGroup} opacity={action ? .35 : 1}>
            <circle cx="71" cy="30" r="5" className={styles.symbolFill} />
            <path d="M85 25h77m-77 10h123" className={styles.contentLine} />
            <path d="M65 52h182m-182 10h132" className={styles.guide} />
          </g>
          <path d="M65 88h64" className={styles.guide} />
          <g className={styles.focusGroup} opacity={action ? 1 : .45}>
            <rect x="186" y="75" width="66" height="20" rx="2" fill="var(--color-ink)" fillOpacity=".13" />
            <path d="M199 85h29m-4-4 4 4-4 4" className={styles.brightLine} />
          </g>
          <g key={String(action)}>
            <path d={scanpath} className={cx(styles.guide, styles.dashed)} />
            {fixations.map(([x, y], index) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5 + (index % 3)} className={cx(styles.fixation, styles.motion)} style={at(index)} />
            ))}
            <circle r="3" className={cx(styles.gaze, styles.motion)} style={{ offsetPath: `path("${scanpath}")` }} />
          </g>
          <rect x={action ? 179 : 58} y={action ? 69 : 17} width={action ? 80 : 198} height={action ? 32 : 28} rx="4" className={styles.focusOutline} />
          <path d={action ? "M259 85H289" : "M256 31H289"} className={styles.focusLeader} />
          <circle cx="291" cy={action ? 85 : 31} r="2" className={styles.symbolFill} />
        </svg>
      </div>
      <div className={styles.controls} role="group" aria-label={cn ? "切换观察焦点" : "Change the observation focus"}>
        <Choice active={!action} onClick={() => setAction(false)}>{cn ? "观察内容" : "Content"}</Choice>
        <Choice active={action} onClick={() => setAction(true)}>{cn ? "观察操作" : "Action"}</Choice>
      </div>
    </>
  );
}

function Study({ kind, cn }: { kind: StudyKind; cn: boolean }) {
  if (kind === "design") return <LayoutStudy cn={cn} />;
  if (kind === "code") return <StateStudy cn={cn} />;
  if (kind === "brand") return <TypeStudy cn={cn} />;
  return <FocusStudy cn={cn} />;
}

export function CapabilityCards({ cn, items }: CapabilityCardsProps) {
  const id = useId();
  const grid = useRef<HTMLDivElement>(null);

  // Loops run only while their card is on screen.
  useEffect(() => {
    const cards = grid.current?.querySelectorAll<HTMLElement>("article");
    if (!cards?.length) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) (entry.target as HTMLElement).dataset.inview = String(entry.isIntersecting);
    }, { threshold: 0.3 });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.root}>
      <div ref={grid} className={styles.grid}>
        {items.map((item, index) => (
          <article key={item.icon} className={styles.card} aria-labelledby={id + "-" + item.icon}>
            <div className={styles.study}>
              <p className={styles.studyLabel}><span>{cn ? "抽象 UI · 个人练习" : "Abstract UI · personal study"}</span><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></p>
              <Study kind={item.icon} cn={cn} />
            </div>
            <div className={styles.copy}>
              <p className={styles.tag}>{item.tag}</p>
              <h3 id={id + "-" + item.icon} className={styles.name}>{item.name}</h3>
              <p className={styles.description}>{item.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
