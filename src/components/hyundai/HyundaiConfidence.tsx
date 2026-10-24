"use client";

import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { roveFocus, roveKeys } from "@/components/nutra/rove";
import styles from "./HyundaiConfidence.module.css";

/* How confidence became a number (boards 30, 31), as one split card on
   the sheet stack.

   The sheet: the formula as board 30 prints it, typeset with real stacked
   fractions (the four normalised terms, the Greek weights in grey-1),
   then the four terms as rows, each with the board's own description,
   then the line that names α–δ. No coefficient values: none is printed.

   The slab: where each term comes from, board 31's pipeline top-down in
   bands (inputs, scripts, the derived terms, confidence.py, the metric).
   Implemented nodes are raised chips; the planned branches (camera/FER
   and Tobii, per the owner's copy) are ghosts on a dashed edge under a
   'Planned' label. LS has no connector into confidence.py, as on the
   board. The end node, the confidence metric, is the figure's one accent
   mark.

   Pointing at, focusing or tapping a term writes data-term on the root
   (no re-render): CSS rings that term's path in ink, from its input
   file through its script to its node, inks its chip, and steps the
   other terms of the formula back. A phone reads the pipeline as a
   grouped list with the same nodes. */

type TermKey = "hrv" | "hrdiff" | "ecgvar" | "t";

const TERMS: { k: TermKey; code: string; en: string; cn: string }[] = [
  {
    k: "hrv",
    code: "HRV",
    en: "Heart Rate Variability (standard deviation of heart rate BPM in a given interval)",
    cn: "心率变异性（给定区间内\u200b心率 BPM 的标准差）",
  },
  {
    k: "hrdiff",
    code: "HR_diff",
    en: "Absolute difference between current heart rate and baseline resting heart rate",
    cn: "当前心率与静息基线心率之差的绝对值",
  },
  {
    k: "ecgvar",
    code: "ECG_var",
    en: "Variance of ECG signal in a given interval",
    cn: "给定区间内\u200b心电信号的方差",
  },
  {
    k: "t",
    code: "T",
    en: "Duration of the task (normalized between 0 and 1, where 1 is the longest observed duration)",
    // the range 0–1 and "1 为" held (word joiners, a no-break space)
    cn: "任务时长（归一化到 0\u2060–\u20601，1\u00a0为观测到的最长时长）",
  },
];

const COPY = {
  en: {
    aria: "Confidence metric: formula and data pipeline",
    kicker: "Confidence Metric Formula",
    formula:
      "C equals 100 times, 1 minus, alpha times HRV over HRV max, plus beta times HR diff over HR max, plus gamma times ECG var over ECG max, plus delta times T",
    terms: "The four terms",
    coef: "Weighting coefficients",
    implemented: "Implemented",
    planned: "Planned",
    pipeline: "Data pipeline",
    metric: "confidence metric",
    sr: "Implemented: ECG.csv goes through ecg.py to HRV/HRVmax and ECGvar/ECG; BPM.csv goes through bpm.py to HRdiff/HRmax and T; Google Form gives SS. These feed confidence.py, which outputs the confidence metric. Planned: Cam Data through FER software to FS, which also feeds confidence.py; Tobii Data through tobii.py to LS, not yet connected.",
  },
  cn: {
    aria: "信心指标：公式与数据处理流程",
    kicker: "信心指标公式",
    formula:
      "C 等于 100 乘以，1 减去，alpha 乘 HRV 比 HRV max，加 beta 乘 HR diff 比 HR max，加 gamma 乘 ECG var 比 ECG max，加 delta 乘 T",
    terms: "四个变量",
    coef: "权重系数",
    implemented: "已实现",
    planned: "计划中",
    pipeline: "数据处理流程",
    metric: "信心指标",
    sr: "已实现：ECG.csv 经 ecg.py 得到 HRV/HRVmax 与 ECGvar/ECG；BPM.csv 经 bpm.py 得到 HRdiff/HRmax 与 T；Google Form 得到 SS。它们汇入 confidence.py，输出信心指标。计划中：Cam Data 经 FER software 得到 FS，同样汇入 confidence.py；Tobii Data 经 tobii.py 得到 LS，尚未接入。",
  },
};

/* ── The formula ── */

function Frac({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <span className={styles.frac}>
      <span className={styles.fracN}>{n}</span>
      <span className={styles.fracD}>{d}</span>
    </span>
  );
}
const Sub = ({ children }: { children: ReactNode }) => <sub className={styles.sub}>{children}</sub>;

/** One weighted term of the sum: its Greek weight, its ratio, the plus */
function FTerm({ k, w, children, last }: { k: TermKey; w: string; children: ReactNode; last?: boolean }) {
  return (
    <span className={styles.fterm} data-t={k}>
      <span className={styles.coefSym}>{w}</span>
      <span className={styles.dot}>·</span>
      {children}
      {last ? (
        <span className={styles.paren}>))</span>
      ) : (
        <span className={styles.plus}>+</span>
      )}
    </span>
  );
}

function Formula({ label }: { label: string }) {
  return (
    <div className={`t-subhead ${styles.formula}`} role="math" aria-label={label}>
      <span className={styles.lead}>
        <span>C</span>
        <span className={styles.op}>=</span>
        <span>100</span>
        <span className={styles.op}>×</span>
        <span className={styles.paren}>(</span>
        <span>1</span>
        <span className={styles.op}>−</span>
        <span className={styles.paren}>(</span>
      </span>
      <span className={styles.sum}>
        <FTerm k="hrv" w="α">
          <Frac
            n="HRV"
            d={
              <>
                HRV<Sub>max</Sub>
              </>
            }
          />
        </FTerm>
        <FTerm k="hrdiff" w="β">
          <Frac
            n={
              <>
                HR<Sub>diff</Sub>
              </>
            }
            d={
              <>
                HR<Sub>max</Sub>
              </>
            }
          />
        </FTerm>
        <FTerm k="ecgvar" w="γ">
          <Frac
            n={
              <>
                ECG<Sub>var</Sub>
              </>
            }
            d={
              <>
                ECG<Sub>max</Sub>
              </>
            }
          />
        </FTerm>
        <FTerm k="t" w="δ" last>
          <span className={styles.single}>T</span>
        </FTerm>
      </span>
    </div>
  );
}

/* ── The pipeline ── a node is a chip; `t` names the terms whose path it
   lies on; `p` marks a planned node. Columns are seven equal leaf
   columns, so every connector sits on a column centre or edge. */

type Node = { label: ReactNode; col: string; t?: string; p?: boolean; frac?: [string, string] };

const INPUTS: Node[] = [
  { label: "ECG.csv", col: "1 / 3", t: "hrv ecgvar" },
  { label: "BPM.csv", col: "3 / 5", t: "hrdiff t" },
  { label: "Google Form", col: "5 / 6" },
  { label: "Cam Data", col: "6 / 7", p: true },
  { label: "Tobii Data", col: "7 / 8", p: true },
];
const SCRIPTS: Node[] = [
  { label: "ecg.py", col: "1 / 3", t: "hrv ecgvar" },
  { label: "bpm.py", col: "3 / 5", t: "hrdiff t" },
  { label: "FER software", col: "6 / 7", p: true },
  { label: "tobii.py", col: "7 / 8", p: true },
];
const OUTPUTS: Node[] = [
  { label: "HRV/HRVmax", frac: ["HRV", "HRVmax"], col: "1 / 2", t: "hrv" },
  { label: "ECGvar/ECG", frac: ["ECGvar", "ECG"], col: "2 / 3", t: "ecgvar" },
  { label: "HRdiff/HRmax", frac: ["HRdiff", "HRmax"], col: "3 / 4", t: "hrdiff" },
  { label: "T", col: "4 / 5", t: "t" },
  { label: "SS", col: "5 / 6" },
  { label: "FS", col: "6 / 7", p: true },
  { label: "LS", col: "7 / 8", p: true },
];

function Chip({ n, accent, className }: { n: Node; accent?: boolean; className?: string }) {
  return (
    <span
      className={`${styles.node} ${className ?? ""}`}
      data-t={n.t}
      data-p={n.p || undefined}
      data-accent={accent || undefined}>
      {n.frac ? (
        <span className={styles.nfrac}>
          <span>{n.frac[0]}</span>
          <span>{n.frac[1]}</span>
        </span>
      ) : (
        n.label
      )}
    </span>
  );
}

/** One connector row between two bands. Segments are placed in column
    units (x: 0–7 across the seven leaf columns; y: 0–1 down the row) as
    1px HTML rules, so every line is crisp and a planned run is a dashed
    border. A segment with `t` has an ink twin that lights with its term;
    heads mark where a line meets a node. */
type Wire = { v?: [number, number, number]; h?: [number, number, number]; t?: string; p?: boolean };
function wireStyle(w: Wire): CSSProperties {
  const [p, a, b] = w.v ?? w.h ?? [0, 0, 0];
  return { [w.v ? "--x" : "--y"]: p, "--a": a, "--b": b } as CSSProperties;
}
function Wires({ wires, heads, h, i }: { wires: Wire[]; heads: { x: number; t?: string; p?: boolean }[]; h: number; i: number }) {
  return (
    <div className={`${styles.wires} ${styles.e}`} style={{ height: h, "--i": i } as CSSProperties} aria-hidden>
      {wires.map((w, k) => (
        <span key={k} className={styles.seg} data-o={w.v ? "v" : "h"} data-p={w.p || undefined} style={wireStyle(w)} />
      ))}
      {wires
        .filter((w) => w.t)
        .map((w, k) => (
          <span key={`i${k}`} className={styles.seg} data-o={w.v ? "v" : "h"} data-ink="" data-t={w.t} style={wireStyle(w)} />
        ))}
      {heads.map((hd, k) => (
        <span
          key={`h${k}`}
          className={styles.head}
          data-t={hd.t}
          data-p={hd.p || undefined}
          style={{ "--x": hd.x } as CSSProperties}
        />
      ))}
    </div>
  );
}

function Tree({ t }: { t: (typeof COPY)["en"] }) {
  return (
    <div className={styles.tree} aria-hidden>
      <div className={`${styles.groups} ${styles.e}`} style={{ "--i": 0 } as CSSProperties}>
        <span className={`t-label ${styles.group}`} style={{ gridColumn: "1 / 6" }}>
          {t.implemented}
        </span>
        <span className={`t-label ${styles.group}`} data-p="" style={{ gridColumn: "6 / 8" }}>
          {t.planned}
        </span>
      </div>
      <div className={`${styles.band} ${styles.e}`} style={{ "--i": 1 } as CSSProperties}>
        {INPUTS.map((n) => (
          <span key={String(n.label)} className={styles.cell} style={{ gridColumn: n.col }}>
            <Chip n={n} />
          </span>
        ))}
      </div>
      <Wires
        i={2}
        h={32}
        wires={[
          { v: [1, 0, 1], t: "hrv ecgvar" },
          { v: [3, 0, 1], t: "hrdiff t" },
          { v: [4.5, 0, 1] },
          { v: [5.5, 0, 1], p: true },
          { v: [6.5, 0, 1], p: true },
        ]}
        heads={[{ x: 1, t: "hrv ecgvar" }, { x: 3, t: "hrdiff t" }, { x: 5.5, p: true }, { x: 6.5, p: true }]}
      />
      <div className={`${styles.band} ${styles.e}`} style={{ "--i": 3 } as CSSProperties}>
        {SCRIPTS.map((n) => (
          <span key={String(n.label)} className={styles.cell} style={{ gridColumn: n.col }}>
            <Chip n={n} />
          </span>
        ))}
        {/* Google Form passes straight down to SS */}
        <span className={styles.pass} style={{ gridColumn: "5 / 6" }} />
      </div>
      <Wires
        i={4}
        h={40}
        wires={[
          { v: [1, 0, 0.5], t: "hrv ecgvar" },
          { h: [0.5, 0.5, 1], t: "hrv" },
          { v: [0.5, 0.5, 1], t: "hrv" },
          { h: [0.5, 1, 1.5], t: "ecgvar" },
          { v: [1.5, 0.5, 1], t: "ecgvar" },
          { v: [3, 0, 0.5], t: "hrdiff t" },
          { h: [0.5, 2.5, 3], t: "hrdiff" },
          { v: [2.5, 0.5, 1], t: "hrdiff" },
          { h: [0.5, 3, 3.5], t: "t" },
          { v: [3.5, 0.5, 1], t: "t" },
          { v: [4.5, 0, 1] },
          { v: [5.5, 0, 1], p: true },
          { v: [6.5, 0, 1], p: true },
        ]}
        heads={[
          { x: 0.5, t: "hrv" },
          { x: 1.5, t: "ecgvar" },
          { x: 2.5, t: "hrdiff" },
          { x: 3.5, t: "t" },
          { x: 4.5 },
          { x: 5.5, p: true },
          { x: 6.5, p: true },
        ]}
      />
      <div className={`${styles.band} ${styles.e}`} style={{ "--i": 5 } as CSSProperties}>
        {OUTPUTS.map((n) => (
          <span key={String(n.label)} className={styles.cell} style={{ gridColumn: n.col }}>
            <Chip n={n} />
          </span>
        ))}
      </div>
      {/* Every derived term joins one bus into confidence.py; FS (planned)
          on a dashed run; LS has no connector */}
      <Wires
        i={6}
        h={56}
        wires={[
          { v: [0.5, 0, 0.5] },
          { v: [1.5, 0, 0.5] },
          { v: [2.5, 0, 0.5] },
          { v: [3.5, 0, 0.5] },
          { v: [4.5, 0, 0.5] },
          { h: [0.5, 0.5, 4.5] },
          { v: [5.5, 0, 0.5], p: true },
          { h: [0.5, 4.5, 5.5], p: true },
          { v: [3, 0.5, 1] },
        ]}
        heads={[{ x: 3 }]}
      />
      <div className={`${styles.band} ${styles.e}`} style={{ "--i": 7 } as CSSProperties}>
        <span className={styles.cell} style={{ gridColumn: "1 / 7" }}>
          <Chip n={{ label: "confidence.py", col: "" }} />
        </span>
      </div>
      <Wires i={8} h={32} wires={[{ v: [3, 0, 1] }]} heads={[{ x: 3 }]} />
      <div className={`${styles.band} ${styles.end}`}>
        <span className={styles.cell} style={{ gridColumn: "1 / 7" }}>
          <Chip n={{ label: t.metric, col: "" }} accent className={styles.metric} />
        </span>
      </div>
    </div>
  );
}

/* ── Phone: the same nodes as a grouped list ── */
function Arrow({ p }: { p?: boolean }) {
  return (
    <svg viewBox="0 0 16 8" className={styles.arrow} data-p={p || undefined} aria-hidden>
      <path d="M0 4H11" />
      <path d="M10 1L15 4L10 7Z" className={styles.arrowHead} />
    </svg>
  );
}

type Item = Node | "to" | "and";

function List({ t }: { t: (typeof COPY)["en"] }) {
  /* Each node keeps the arrow that leads into it, and outputs joined by
     '·' stay together, so a row wraps only between steps */
  const row = (items: Item[], p?: boolean) => {
    const out: ReactNode[] = [];
    let lead: Item | null = null;
    items.forEach((it, k) => {
      if (it === "to" || it === "and") {
        lead = it;
        return;
      }
      const node = <Chip key={`n${k}`} n={it} />;
      if (lead === "and") {
        const last = out.pop() as ReactNode;
        out.push(
          <span key={k} className={styles.litem}>
            {last}
            <span className={styles.ldot}>·</span>
            {node}
          </span>,
        );
      } else {
        out.push(
          <span key={k} className={styles.litem}>
            {lead === "to" && <Arrow p={p} />}
            {node}
          </span>,
        );
      }
      lead = null;
    });
    return <li className={styles.lrow}>{out}</li>;
  };
  return (
    <div className={styles.list} aria-hidden>
      <p className={`t-label ${styles.lgroup} ${styles.e}`} style={{ "--i": 0 } as CSSProperties}>
        {t.implemented}
      </p>
      <ul className={`${styles.lrows} ${styles.e}`} style={{ "--i": 1 } as CSSProperties}>
        {row([INPUTS[0], "to", SCRIPTS[0], "to", OUTPUTS[0], "and", OUTPUTS[1]])}
        {row([INPUTS[1], "to", SCRIPTS[1], "to", OUTPUTS[2], "and", OUTPUTS[3]])}
        {row([INPUTS[2], "to", OUTPUTS[4]])}
      </ul>
      <p className={`t-label ${styles.lgroup} ${styles.e}`} data-p="" style={{ "--i": 2 } as CSSProperties}>
        {t.planned}
      </p>
      <ul className={`${styles.lrows} ${styles.e}`} style={{ "--i": 3 } as CSSProperties}>
        {row([INPUTS[3], "to", SCRIPTS[2], "to", OUTPUTS[5]], true)}
        {row([INPUTS[4], "to", SCRIPTS[3], "to", OUTPUTS[6]], true)}
      </ul>
      <div className={`${styles.lend} ${styles.e}`} style={{ "--i": 4 } as CSSProperties}>
        <Chip n={{ label: "confidence.py", col: "" }} />
        <span className={styles.litem}>
          <Arrow />
          <Chip n={{ label: t.metric, col: "" }} accent className={styles.metric} />
        </span>
      </div>
    </div>
  );
}

export function HyundaiConfidence() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const say = (s: string) => (cn ? hold(s, styles.word) : s);

  /* The lit term is a data attribute on the root: no re-render */
  const mark = useCallback((k: TermKey | null) => {
    const el = root.current;
    if (!el) return;
    if (k) el.dataset.term = k;
    else delete el.dataset.term;
  }, []);

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} aria-label={t.aria} data-in={inView}>
      <div className={styles.card}>
        <div className={styles.sheet}>
          <p className={`t-label ${styles.kicker} ${styles.e}`} style={{ "--i": 0 } as CSSProperties}>
            {say(t.kicker)}
          </p>
          <div className={`${styles.formulaWrap} ${styles.e}`} style={{ "--i": 1 } as CSSProperties}>
            <Formula label={t.formula} />
          </div>
          <div className={styles.rows} role="group" aria-label={t.terms} onKeyDown={roveKeys} onFocus={roveFocus}>
            {TERMS.map((term, i) => (
              <button
                key={term.k}
                type="button"
                className={`${styles.row} ${styles.e}`}
                style={{ "--i": 3 + i } as CSSProperties}
                data-rove={term.k}
                data-k={term.k}
                tabIndex={i === 0 ? 0 : -1}
                onPointerEnter={(e) => e.pointerType === "mouse" && mark(term.k)}
                onPointerLeave={(e) => e.pointerType === "mouse" && mark(null)}
                onPointerDown={(e) => e.pointerType !== "mouse" && mark(term.k)}
                onFocus={() => mark(term.k)}
                onBlur={() => mark(null)}>
                <span className={styles.code}>
                  <span className={styles.codeBase}>{term.code}</span>
                  <span aria-hidden className={styles.codeLit}>
                    {term.code}
                  </span>
                </span>
                <span className={`t-small ${styles.desc}`}>{cn ? hold(term.cn, styles.word) : term.en}</span>
              </button>
            ))}
          </div>
          <p className={`t-small ${styles.coefLine} ${styles.e}`} style={{ "--i": 7 } as CSSProperties}>
            <span className={styles.coefSym}>α, β, γ, δ</span>
            <span className={styles.coefEq}>{cn ? "：" : " = "}</span>
            {say(t.coef)}
          </p>
        </div>

        <div className={styles.slab}>
          <p className={`t-label ${styles.kicker} ${styles.slabKicker} ${styles.e}`} style={{ "--i": 0 } as CSSProperties}>
            <span aria-hidden className={styles.kSq} />
            <span>{say(t.pipeline)}</span>
          </p>
          <p className="sr-only">{t.sr}</p>
          <Tree t={t} />
          <List t={t} />
        </div>
      </div>
    </figure>
  );
}
