"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Seg } from "@/components/nutra/Seg";
import styles from "./HyundaiResults.module.css";

/* Green UI led for every participant shown (boards 32 and 30), as one
   split card on the sheet stack.

   The sheet charts the confidence metric true to scale on one 0–70 axis
   (board 32 drew podiums by rank, so a 0 still had a bar). Total: the
   four participants in the board's order, three bars each, White UI
   grey-2, Blue UI grey-1, Green UI ink; a 0 is a 2px stub. The selected
   participant's Green bar is the figure's one accent mark. By task: the
   selected participant's three tasks (LKA, LFA, SCC) on the same axis,
   '—' where board 30 records nothing, and Green UI's mean (its total)
   as a 1.5px accent rule across them, the state's one accent mark: the
   total is that mean.

   The slab opens the selected participant: each direction's task scores
   and our check that its total equals the mean of the tasks recorded
   (it holds for all twelve totals; neither board prints the method). No
   original-UI series (no board prints one) and no overall participant
   count. A stable live line says the selected participant's totals. */

type UI = "white" | "blue" | "green";
type Row = { p: string; total: Record<UI, number>; tasks: Record<UI, (number | null)[]> };

const UIS: UI[] = ["white", "blue", "green"];
const TASKS = ["LKA", "LFA", "SCC"] as const;

/* Totals: board 32; task scores: board 30's 'Confidence Metric' rows */
const DATA: Row[] = [
  {
    p: "P011",
    total: { white: 22.1, blue: 35.35, green: 36.66 },
    tasks: { white: [44.2, null, 0], blue: [47.7, null, 23], green: [56.5, 14.44, 39.03] },
  },
  {
    p: "P013",
    total: { white: 0, blue: 28.39, green: 39.15 },
    tasks: { white: [0, null, 0], blue: [32.68, null, 24.1], green: [49.04, 37.5, 30.92] },
  },
  {
    p: "P007",
    total: { white: 8.78, blue: 4.05, green: 37.73 },
    tasks: { white: [17.56, null, 0], blue: [0, null, 8.09], green: [69.04, null, 6.42] },
  },
  {
    p: "P014",
    total: { white: 0, blue: 31.33, green: 41.28 },
    tasks: { white: [0, null, 0], blue: [39.22, null, 23.44], green: [38.55, null, 44.01] },
  },
];

const COPY = {
  en: {
    aria: "Confidence scores of the three directions for four participants shown",
    title: "Confidence Metric Results",
    ui: { white: "White UI", blue: "Blue UI", green: "Green UI" } as Record<UI, string>,
    total: "Total",
    byTask: "By task",
    view: "View",
    participants: "Participants",
    mean: "Mean",
    note: "Each total equals the mean of that direction’s task scores on the calculation board.",
    shown: "Participants shown: P011,\u00a0P013,\u00a0P007,\u00a0P014",
    missing: "not recorded",
  },
  cn: {
    aria: "三种方案在图中四位参与者中的信心评分",
    title: "信心指标结果",
    ui: { white: "白色方案", blue: "蓝色方案", green: "绿色方案" } as Record<UI, string>,
    total: "总分",
    byTask: "分任务",
    view: "视图",
    participants: "参与者",
    mean: "平均",
    note: "每项总分\u200b与计算表中该方案各任务得分的平均值一致。",
    shown: "图中参与者：P011、P013、P007、P014",
    missing: "未记录",
  },
};
type Copy = (typeof COPY)["en"];

const v = (n: number) => ({ "--v": n }) as CSSProperties;

/** Gridlines every 10 on the 0–70 axis, drawn inside each view so they
    crossfade with it */
const Grid = () => (
  <span aria-hidden className={styles.grid}>
    {Array.from({ length: 8 }, (_, i) => (
      <span key={i} className={styles.gridLine} style={{ "--g": i } as CSSProperties} />
    ))}
  </span>
);

/** One bar on the shared axis (0–70): a full-width plane scaled to its
    value, a 2px stub under it for a 0, the value riding a full-width
    carrier moved by the same fraction. Transform only, so a new
    participant glides. */
function Bar({ ui, value, k }: { ui: UI; value: number | null; k: number }) {
  return (
    <span className={styles.track} data-ui={ui} style={{ ...v(value ?? 0), "--k": k } as CSSProperties}>
      {value === null ? (
        <span className={`t-small ${styles.none}`}>—</span>
      ) : (
        <>
          <span className={styles.stub} />
          <span className={styles.bar} />
          <span className={styles.valAt}>
            <span className={`t-small ${styles.val}`}>{value}</span>
          </span>
        </>
      )}
    </span>
  );
}

/** Total: four participant rows, a radio set */
function TotalView({
  t,
  sel,
  onSel,
}: {
  t: Copy;
  sel: number;
  onSel: (i: number, focus?: boolean) => void;
}) {
  const onKey = (e: KeyboardEvent) => {
    const n = DATA.length;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (sel + 1) % n
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (sel - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    onSel(next, true);
  };
  return (
    <div className={styles.rows} role="radiogroup" aria-label={t.participants} onKeyDown={onKey}>
      <Grid />
      {DATA.map((r, i) => (
        <button
          key={r.p}
          type="button"
          role="radio"
          aria-checked={i === sel}
          tabIndex={i === sel ? 0 : -1}
          data-row={i}
          className={styles.row}
          style={{ "--r": i } as CSSProperties}
          aria-label={`${r.p}: ${UIS.map((u) => `${t.ui[u]} ${r.total[u]}`).join(", ")}`}
          onClick={() => onSel(i)}>
          <span className={`t-label ${styles.rowLabel}`} data-code="">
            {r.p}
          </span>
          <span className={styles.bars} aria-hidden>
            {UIS.map((u, k) => (
              <Bar key={u} ui={u} value={r.total[u]} k={i * 3 + k} />
            ))}
          </span>
        </button>
      ))}
    </div>
  );
}

/** By task: the selected participant's three tasks, Green's mean ruled */
function TaskView({ t, row }: { t: Copy; row: Row }) {
  return (
    <div className={styles.taskRows} role="img" aria-label={taskSummary(t, row)}>
      <Grid />
      <span aria-hidden className={styles.meanLayer}>
        <span className={styles.meanRule} style={v(row.total.green)} />
        <span className={styles.meanTagWrap} style={v(row.total.green)}>
          <span className={`boxed-tag ${styles.meanTag}`}>
            {t.mean} {row.total.green}
          </span>
        </span>
      </span>
      {TASKS.map((task, j) => (
        <div key={task} className={styles.row} data-static="">
          <span className={`t-label ${styles.rowLabel}`} data-code="">
            {task}
          </span>
          <span className={styles.bars} aria-hidden>
            {UIS.map((u, k) => (
              <Bar key={u} ui={u} value={row.tasks[u][j]} k={j * 3 + k} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

function taskSummary(t: Copy, row: Row) {
  return `${row.p}: ${TASKS.map(
    (task, j) => `${task}: ${UIS.map((u) => `${t.ui[u]} ${row.tasks[u][j] ?? t.missing}`).join(", ")}`,
  ).join("; ")}`;
}

/** The slab: one direction's task scores and its total as their mean */
function Mean({ t, row, ui, cn }: { t: Copy; row: Row; ui: UI; cn: boolean }) {
  const scores = row.tasks[ui];
  const kept = scores.filter((s): s is number => s !== null);
  return (
    <div className={styles.block} data-ui={ui}>
      <p className={styles.blockHead}>
        <span aria-hidden className={styles.key} data-ui={ui} />
        <span className="t-small">{cn ? hold(t.ui[ui], styles.word) : t.ui[ui]}</span>
      </p>
      <dl className={styles.tasks}>
        {TASKS.map((task, j) => (
          <div key={task} className={styles.taskCell}>
            <dt className="t-label" data-code="">
              {task}
            </dt>
            <dd className={`t-small ${styles.taskVal}`} data-none={scores[j] === null || undefined}>
              {scores[j] === null ? (
                <>
                  <span aria-hidden>—</span>
                  <span className="sr-only">{t.missing}</span>
                </>
              ) : (
                scores[j]
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className={`t-small ${styles.eq}`}>
        <span className={styles.eqSum}>
          ({kept.join(" + ")}) / {kept.length}
        </span>{" "}
        <span className={styles.eqRes}>= {row.total[ui]}</span>
      </p>
    </div>
  );
}

export function HyundaiResults() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });
  const [sel, setSel] = useState(0);
  const [view, setView] = useState<"total" | "task">("total");
  const say = (s: string) => (cn ? hold(s, styles.word) : s);
  const row = DATA[sel];

  const onSel = (i: number, focus?: boolean) => {
    setSel(i);
    if (focus) root.current?.querySelector<HTMLElement>(`[data-row="${i}"]`)?.focus();
  };

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} aria-label={t.aria} data-in={inView} data-view={view}>
      <div className={styles.card}>
        <div className={styles.sheet}>
          <div className={styles.head}>
            <div className={styles.headText}>
              <p className={`t-label ${styles.title}`}>{say(t.title)}</p>
              <ul className={styles.legend}>
                {UIS.map((u) => (
                  <li key={u} className={styles.legendItem}>
                    <span aria-hidden className={styles.key} data-ui={u} />
                    <span className="t-small">{say(t.ui[u])}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Seg
              className={styles.seg}
              label={t.view}
              value={view}
              onChange={setView}
              options={[
                { value: "total", label: t.total },
                { value: "task", label: t.byTask },
              ]}
            />
          </div>

          <div className={styles.chart}>
            <div className={styles.views}>
              <div className={styles.view} data-v="total" inert={view !== "total"}>
                <TotalView t={t} sel={sel} onSel={onSel} />
              </div>
              <div className={styles.view} data-v="task" inert={view !== "task"}>
                <Seg
                  className={styles.pseg}
                  label={t.participants}
                  value={row.p}
                  onChange={(p) => setSel(DATA.findIndex((d) => d.p === p))}
                  options={DATA.map((d) => ({ value: d.p, label: d.p }))}
                />
                <TaskView t={t} row={row} />
              </div>
            </div>
            <div aria-hidden className={styles.ticks}>
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className={`t-label ${styles.tick}`} data-code="" style={{ "--g": i } as CSSProperties}>
                  {i * 10}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.slab}>
          <p className={`t-subhead ${styles.pid}`}>{row.p}</p>
          <p className="sr-only" aria-live="polite">
            {`${row.p}: ${(["green", "blue", "white"] as UI[]).map((u) => `${t.ui[u]} ${row.total[u]}`).join(cn ? "，" : ", ")}`}
          </p>
          <div key={row.p} className={styles.blocks}>
            {(["green", "blue", "white"] as UI[]).map((u) => (
              <Mean key={u} t={t} row={row} ui={u} cn={cn} />
            ))}
          </div>
          <p className={`t-small ${styles.note}`}>{say(t.note)}</p>
          <p className={`t-small ${styles.shown}`}>{say(t.shown)}</p>
        </div>
      </div>
    </figure>
  );
}
