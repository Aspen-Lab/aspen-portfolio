"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./CapabilityCards.module.css";

type StudyKind = "design" | "code" | "brand" | "research";
type CapabilityItem = { icon: StudyKind; name: string; tag: string; desc: string };
type CapabilityCardsProps = { cn: boolean; items: ReadonlyArray<CapabilityItem> };

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");
/** Stagger index for a study's loops (read as --i in the CSS). */
const at = (index: number) => ({ "--i": index }) as CSSProperties;

/* Every study draws on one 400 × 170 plate that fills the card's stage, so
   the four sit at one size and the art scales with the card. The labels
   are HTML pinned over the drawing in % (MorphChart's overlay), so they
   ride the art but keep their own 15px at every width instead of
   shrinking with it. */
const VW = 400;
const VH = 170;
const pin = (x: number, y: number) => ({ left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%` }) as CSSProperties;

function Plate({ children, labels }: { children: ReactNode; labels?: ReactNode }) {
  return (
    <div className={styles.canvas} aria-hidden="true">
      <svg viewBox={`0 0 ${VW} ${VH}`} className={styles.visual}>{children}</svg>
      {labels}
    </div>
  );
}

function Choice({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return <button type="button" aria-pressed={active} aria-label={label} onClick={onClick} className={styles.choice}>{children}</button>;
}

/** Product design · a list a reader scans row by row; the tiles move one after another when the layout changes. */
function LayoutStudy({ cn }: { cn: boolean }) {
  const [columns, setColumns] = useState(false);
  return (
    <>
      <Plate>
        {[0, 1, 2].map((i) => (
          <g key={i} className={styles.layoutTile} style={{ transform: columns ? `translate(${48 + i * 104}px, 10px)` : `translate(48px, ${10 + i * 52}px)`, transitionDelay: `${i * 50}ms` }}>
            <rect width={columns ? 96 : 304} height={columns ? 150 : 46} rx="3" className={styles.tile} style={{ transitionDelay: `${i * 50}ms` }} />
            <rect width={columns ? 96 : 304} height={columns ? 150 : 46} rx="3" className={cx(styles.tileLift, styles.scan, styles.motion)} style={{ ...at(i), transitionDelay: `${i * 50}ms` }} />
            <g className={styles.layoutSymbol} style={{ transform: columns ? "translate(48px, 56px)" : "translate(25px, 23px)" }}>
              {i === 0 && <circle r="8" className={styles.symbolFill} />}
              {i === 1 && <path d="m0-10 9.5 16h-19Z" className={styles.symbolFill} />}
              {i === 2 && <rect x="-6.5" y="-6.5" width="13" height="13" className={styles.symbolFill} transform="rotate(45)" />}
            </g>
            <path d={columns ? "M18 104h60m-60 14h38" : "M50 18h176m-176 11h112"} className={styles.contentLine} />
            {!columns && <path d="M272 23h16m-5-5 5 5-5 5" className={cx(styles.contentLine, styles.nudge, styles.motion)} style={at(i)} />}
          </g>
        ))}
      </Plate>
      <div className={styles.controls} role="group" aria-label={cn ? "切换抽象布局" : "Change the abstract layout"}>
        <Choice active={!columns} onClick={() => setColumns(false)}><span aria-hidden="true">☰</span>{cn ? "行布局" : "Rows"}</Choice>
        <Choice active={columns} onClick={() => setColumns(true)}><span aria-hidden="true">▥</span>{cn ? "列布局" : "Columns"}</Choice>
      </div>
    </>
  );
}

/* The bar of the sample component runs from x 90 to 310, under the glyph
   and the text; FILLED is the share of it drawn in each state, and the
   loading dot rides its end. */
const BAR = { x: 90, w: 220, y: 88 };
const FILLED = { idle: 0, loading: 0.54, done: 1 } as const;

/** Design engineering · one component through its states: the spinner turns, the bar fills, the check draws. */
function StateStudy({ cn }: { cn: boolean }) {
  const [state, setState] = useState<keyof typeof FILLED>("idle");
  const text = state === "idle" ? (cn ? "准备开始" : "Ready when you are") : state === "loading" ? (cn ? "正在构建…" : "Putting it together…") : (cn ? "可以探索了" : "Ready to explore");
  return (
    <>
      <Plate labels={<span className={styles.codeTag} style={pin(200, 132)}>{`<Button state="${state}" />`}</span>}>
        <rect x="72" y="22" width="256" height="88" rx="8" className={styles.tile} />
        <g key={state} transform="translate(102 54)">
          {state === "idle" && (
            <>
              <circle r="12" className={cx(styles.ring, styles.pulse, styles.motion)} />
              <path d="m-4-8 12 8-12 8Z" className={styles.symbolFill} />
            </>
          )}
          {state === "loading" && (
            <>
              <circle r="10" className={styles.guide} />
              <circle r="10" pathLength={1} className={cx(styles.brightLine, styles.arc, styles.spin, styles.motion)} />
            </>
          )}
          {state === "done" && (
            <>
              <circle r="11" className={cx(styles.guide, styles.pop)} />
              <path pathLength={1} d="m-6 0 4 4 8-8" className={cx(styles.brightLine, styles.check)} />
            </>
          )}
        </g>
        <text key={`text-${state}`} x="126" y="59" className={cx(styles.stateText, styles.fadeIn)}>{text}</text>
        <path d={`M${BAR.x} ${BAR.y}h${BAR.w}`} className={styles.guide} />
        <path pathLength={1} d={`M${BAR.x} ${BAR.y}h${BAR.w}`} className={styles.stateProgress} style={{ strokeDashoffset: 1 - FILLED[state] }} />
        {state === "loading" && <circle cx={BAR.x + BAR.w * FILLED.loading} cy={BAR.y} r="2.5" className={cx(styles.symbolFill, styles.blink, styles.motion)} />}
        {/* a dashed leader from the component down to its props, set on a raised tag */}
        <path d="M200 110v22" className={styles.leader} />
      </Plate>
      <div className={styles.controls} role="group" aria-label={cn ? "切换示例组件状态" : "Change the sample component state"}>
        <Choice active={state === "idle"} onClick={() => setState("idle")}>{cn ? "待机" : "Idle"}</Choice>
        <Choice active={state === "loading"} onClick={() => setState("loading")}>{cn ? "加载" : "Loading"}</Choice>
        <Choice active={state === "done"} onClick={() => setState("done")}>{cn ? "完成" : "Done"}</Choice>
      </div>
    </>
  );
}

/* The specimen: "Aa" at 124 on a baseline at y 124, centred on x 220.
   The guides run from x 8 to 392; each label sits on the left end of its
   own line, centred on it and masking it, so the line reads as starting
   after the name and the labels never stack, even where cap height and
   x-height are 16px apart on a small phone. */
const SPECIMEN = { size: 124, x: 220, baseline: 124, bracket: 146 };
const GUIDE = 8;
/* Ascent of the specimen's own glyphs as a share of its size: the cap
   line sits on the apex of the A, the x line on the arch of the a.
   Newsreader at 350 and Geist at 450, measured in Chrome; the effect
   below measures again in the reader's browser once the fonts are in,
   so the guides stay on the glyphs whatever the face renders as. */
const ASCENT = { serif: { cap: 0.725, x: 0.5215 }, sans: { cap: 0.71, x: 0.543 } };
type Face = keyof typeof ASCENT;

/** Brand & visual · a specimen on its metrics, with brackets that measure its live width. */
function TypeStudy({ cn }: { cn: boolean }) {
  const [serif, setSerif] = useState(true);
  const [spaced, setSpaced] = useState(false);
  const specimen = useRef<SVGTextElement>(null);
  const [span, setSpan] = useState<{ x: number; w: number } | null>(null);
  const [ascent, setAscent] = useState(ASCENT);
  const face: Face = serif ? "serif" : "sans";

  useEffect(() => {
    const measure = () => {
      const node = specimen.current;
      if (!node) return;
      const keep = (x: number, w: number) => setSpan((prev) => (prev && Math.abs(prev.x - x) < 0.05 && Math.abs(prev.w - w) < 0.05 ? prev : { x, w }));
      // getBBox only knows the em box and the tracking after the last
      // letter; the ink comes from a canvas set in the same face, weight
      // and size, placed at each letter's laid-out origin.
      const style = getComputedStyle(node);
      const pen = document.createElement("canvas").getContext("2d");
      if (pen) pen.font = `${style.fontWeight} ${SPECIMEN.size}px ${style.fontFamily}`;
      if (!pen || !pen.font.includes(`${SPECIMEN.size}px`)) {
        const box = node.getBBox();
        if (box.width) keep(box.x, box.width);
        return;
      }
      const upper = pen.measureText("A");
      const lower = pen.measureText("a");
      try {
        const left = node.getStartPositionOfChar(0).x - upper.actualBoundingBoxLeft;
        const right = node.getStartPositionOfChar(1).x + lower.actualBoundingBoxRight;
        if (right > left) keep(left, right - left);
      } catch {
        const box = node.getBBox();
        if (box.width) keep(box.x, box.width);
      }
      const cap = upper.actualBoundingBoxAscent / SPECIMEN.size;
      const x = lower.actualBoundingBoxAscent / SPECIMEN.size;
      if (!(cap > 0.4 && cap < 1 && x > 0.2 && x < cap)) return;
      setAscent((prev) => (Math.abs(prev[face].cap - cap) < 0.002 && Math.abs(prev[face].x - x) < 0.002 ? prev : { ...prev, [face]: { cap, x } }));
    };
    measure();
    // letter-spacing eases over 300ms; read the settled width after it.
    const timer = window.setTimeout(measure, 340);
    document.fonts?.ready.then(measure);
    return () => window.clearTimeout(timer);
  }, [face, spaced]);

  const capY = SPECIMEN.baseline - ascent[face].cap * SPECIMEN.size;
  const xY = SPECIMEN.baseline - ascent[face].x * SPECIMEN.size;
  const labels = (
    <>
      <span className={styles.metricLabel} style={pin(GUIDE, capY)}>{cn ? "大写高度" : "Cap height"}</span>
      {/* x-height reads from the line's right end, so on a small phone it
          never stacks on the cap-height label just above it */}
      <span className={cx(styles.metricLabel, styles.metricLabelEnd)} style={pin(VW - GUIDE, xY)}>{cn ? "x 字高" : "x-height"}</span>
      <span className={styles.metricLabel} style={pin(GUIDE, SPECIMEN.baseline)}>{cn ? "基线" : "Baseline"}</span>
      {span && <span key={face + String(spaced)} className={cx(styles.readout, styles.appear)} style={pin(span.x + span.w / 2, SPECIMEN.bracket)}>W {Math.round(span.w)}</span>}
    </>
  );
  return (
    <>
      <Plate labels={labels}>
        <path d={`M${GUIDE} ${capY}H${VW - GUIDE}`} className={cx(styles.guide, styles.guideOnCard, styles.metric)} />
        <path d={`M${GUIDE} ${xY}H${VW - GUIDE}`} className={cx(styles.guide, styles.guideOnCard, styles.dashed, styles.metric)} />
        <path d={`M${GUIDE} ${SPECIMEN.baseline}H${VW - GUIDE}`} className={styles.axis} />
        <text ref={specimen} x={SPECIMEN.x} y={SPECIMEN.baseline} textAnchor="middle" className={styles.specimen} style={{ fontSize: SPECIMEN.size, fontFamily: serif ? "var(--font-newsreader), Georgia, serif" : "var(--font-sans)", letterSpacing: spaced ? "0.16em" : "-0.045em", fontWeight: serif ? 350 : 450 } as CSSProperties}>Aa</text>
        {span && (
          <g className={styles.measure}>
            <path d={`M${span.x} ${SPECIMEN.bracket - 6}v12M${span.x + span.w} ${SPECIMEN.bracket - 6}v12`} className={styles.brightLine} />
            <path d={`M${span.x} ${SPECIMEN.bracket}H${span.x + span.w}`} className={styles.contentLine} />
          </g>
        )}
      </Plate>
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
    ? [[120, 42], [212, 86], [268, 134], [294, 138], [282, 135]]
    : [[84, 40], [140, 38], [196, 42], [254, 46], [150, 84], [286, 88]];
  const scanpath = `M${fixations.map(([x, y]) => `${x} ${y}`).join("L")}`;
  return (
    <>
      <Plate>
        <rect x="56" y="10" width="288" height="152" rx="3" className={styles.tile} />
        <rect x={action ? 238 : 66} y={action ? 116 : 24} width={action ? 96 : 228} height={action ? 40 : 32} rx="3" className={styles.focusPlane} />
        <g className={styles.focusGroup} data-dim={action || undefined}>
          <circle cx="84" cy="40" r="7" className={styles.symbolFill} />
          <path d="M102 34h104m-104 12h160" className={styles.contentLine} />
          <path d="M76 80h248m-248 14h176" className={styles.guide} />
        </g>
        <path d="M76 138h84" className={styles.guide} />
        <g className={styles.focusGroup} data-dim={!action || undefined}>
          <rect x="244" y="122" width="84" height="28" rx="2" className={styles.button} />
          <path d="M270 136h32m-5-5 5 5-5 5" className={styles.brightLine} />
        </g>
        <g key={String(action)}>
          <path d={scanpath} className={cx(styles.guide, styles.dashed)} />
          {fixations.map(([x, y], index) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5 + (index % 3) * 1.5} className={cx(styles.fixation, styles.motion)} style={at(index)} />
          ))}
          <circle r="3.5" className={cx(styles.gaze, styles.motion)} style={{ offsetPath: `path("${scanpath}")` }} />
        </g>
        <path d={action ? "M334 136H376" : "M294 40H376"} className={styles.focusLeader} />
        <circle cx="378" cy={action ? 136 : 40} r="2.5" className={styles.symbolFill} />
      </Plate>
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
        {/* The cards no longer wear a small "abstract UI · personal study"
            kicker and a number each: the note above them says it once, at
            reading size. */}
        {items.map((item) => (
          <article key={item.icon} className={styles.card} aria-labelledby={id + "-" + item.icon}>
            <div className={styles.study}>
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
