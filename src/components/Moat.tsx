"use client";

import { memo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useInView } from "motion/react";
import {
  PencilRuler,
  TrendingUp,
  GitPullRequest,
  Award,
  Building2,
  LineChart,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { combos } from "@/lib/work";
import type { Combo, Project } from "@/lib/work";
import { axelProject, axelProjectCn } from "@/lib/axel";
import { Reveal } from "./Reveal";
import styles from "./Moat.module.css";

/* Six proof points, one at a time: the claim on the left, and beside it a
   sheet drawn in Latent Health's plot language (latenthealth.com,
   "Platform") — cream card, hairline grid, mono ticks, one focus mark with
   a dashed hexagon and a boxed tag on a dashed leader. Every figure on a
   sheet is one the copy already states; where there is no number (the
   delivery chain, the founding path, the awards) the sheet draws the
   order of things, not a measurement. Flat fills only; no gradients.

   All six stay mounted, stacked in one cell; choosing one only flips a
   data attribute, and the swap is a CSS cross-fade of opacity and
   transform, so it can be interrupted midway and nothing is torn down or
   rebuilt. */

const ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  PencilRuler,
  TrendingUp,
  GitPullRequest,
  Award,
  Building2,
  LineChart,
];

/* A translation of `combos` in src/lib/work.ts, entry for entry: no claim
   here that the English does not make. */
const COMBOS_CN: Combo[] = [
  {
    index: "01",
    title: "世界级 Figma 能力",
    proof: "集成周期快 40%",
    body: "我在 TikTok Pay PIPO UED 写的供应商对接 SOP 成为跨市场标准 —— VN / MY / ID 的集成周期缩短约 40%。Tokens、组件、错误状态、边界情况全部覆盖。",
  },
  {
    index: "02",
    title: "被 TikTok 背书",
    proof: "完成率 70 → 90%",
    body: "越南 KYC 新用户完成率提升 20 个百分点。系统在实习结束后继续沿用，成为团队默认 playbook。设计能变成流程制度，就是最硬的背书。",
  },
  {
    index: "03",
    title: "前端，直接以 PR 交付",
    proof: "Axel 创始设计工程师",
    body: "从产品设计到生产环境前端，以可审阅的 PR 交付。在 Axel，我在设计与工程之间双向打通，并把体验延伸到品牌、营销活动和 79 个交易类邮件模板。",
  },
  {
    index: "04",
    title: "iF + Red Dot + IDEA",
    proof: "一年三个奖",
    body: "iF Design、Red Dot 和 IDEA Student Award，都在 2025 年 —— 获奖的是 Field of Vision（视障手杖）和 CryoSave（CDC NWSS 包装）。HCI 与行为科学的训练为手艺托底。",
  },
  {
    index: "05",
    title: "创始人式产品判断",
    proof: "$300K · 1K+ 用户",
    body: "XING Art：联合创办、MiraclePlus '25 $300K pre-seed、产品跑到真实规模，后续转为股东 + advisor。我会读 GMV / MRR / funnels —— 在 brief 出现前先找到问题。",
  },
  {
    index: "06",
    title: "市场品味，被 P&L 验证",
    proof: "200%+ 年化",
    body: "个人投资组合 200%+ 年化。产品和市场本质是同一个问题：什么会复利、什么是噪音、什么被错误定价。能找到 alpha 的直觉，也能找到值得 shipping 的概念。",
  },
];

const AWARDS = [
  { name: "iF Design Award", project: "Field of Vision" },
  { name: "Red Dot Design Award", project: "Field of Vision" },
  { name: "IDEA Student Award", project: "CryoSave · CDC NWSS" },
];

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

function hexagon(r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

/* ─── The focus ───────────────────────────────────────────────────────
   A zero-size anchor on the point it marks: the dot, the dashed hexagon
   around it, a dashed leader and the boxed tag at its end. The tag hangs
   centred, or flush to the anchor's side when the point is near an edge
   of the sheet. */

function Focus({
  tag,
  dir = "down",
  align = "center",
  style,
}: {
  tag: string;
  dir?: "down" | "up";
  align?: "center" | "end";
  style?: CSSProperties;
}) {
  return (
    <span className={styles.focus} data-dir={dir} data-align={align} style={style}>
      <svg aria-hidden viewBox="-22 -22 44 44" className={styles.mark}>
        <polygon points={hexagon(17)} className={styles.hex} />
        <circle r="6" className={styles.dot} />
      </svg>
      <span aria-hidden className={styles.leader} />
      <span className={styles.tag}>{tag}</span>
    </span>
  );
}

/* ─── Bars on an axis ─────────────────────────────────────────────────
   Rows of flat bars over a hairline grid. The focus row carries the
   accent (from `from`, when only the change is the point); `ghost` draws
   a dashed, unfilled stretch: a cut that was saved, or an open end. */

type Row = {
  label: string;
  value?: string;
  to: number;
  from?: number;
  ghost?: [number, number];
  focus?: boolean;
};

function Bars({
  rows,
  max,
  ticks,
  tag,
}: {
  rows: Row[];
  max: number;
  ticks: { at: number; label?: string }[];
  tag: string;
}) {
  const pct = (n: number) => `${(n / max) * 100}%`;

  return (
    <div className={styles.bars}>
      <div aria-hidden className={styles.gridlines}>
        {ticks.map((t) => (
          <span key={t.at} style={{ left: pct(t.at) }} data-axis={t.at === 0} />
        ))}
      </div>

      {rows.map((r, i) => (
        <div key={r.label} className={styles.row} data-focus={!!r.focus} style={v({ "--i": i })}>
          <p className={styles.rowHead}>
            <span>{r.label}</span>
            {r.value && <span className={styles.rowValue}>{r.value}</span>}
          </p>
          <div className={styles.track}>
            {r.ghost && (
              <span
                aria-hidden
                className={styles.ghost}
                style={{ left: pct(r.ghost[0]), width: pct(r.ghost[1] - r.ghost[0]) }}
              />
            )}
            <span aria-hidden className={styles.fill} data-split={r.from !== undefined} style={{ width: pct(r.to) }}>
              {r.from !== undefined && (
                <span className={styles.gain} style={{ left: `${(r.from / r.to) * 100}%` }} />
              )}
            </span>
            {r.focus && (
              <Focus tag={tag} align={r.to / max > 0.72 ? "end" : "center"} style={{ left: pct(r.to) }} />
            )}
          </div>
        </div>
      ))}

      <div aria-hidden className={styles.axis}>
        {ticks.map((t) => (
          <span
            key={t.at}
            className={styles.tick}
            style={{ left: pct(t.at) }}
            data-edge={t.at === 0 ? "start" : t.at === max ? "end" : undefined}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── A chain of stations ─────────────────────────────────────────────
   Left to right on one hairline, the way the work moves; the line draws
   through and each station lights as it is reached. The last one is the
   handoff, so it is the focus. */

function Chain({ stops, tag }: { stops: string[]; tag: string }) {
  const n = stops.length;
  return (
    <div className={styles.chain} style={v({ "--n": n })}>
      <span aria-hidden className={styles.line}>
        <span className={styles.lineLit} />
      </span>
      {Array.from({ length: n - 1 }, (_, k) => (
        <svg
          key={k}
          aria-hidden
          viewBox="0 0 8 10"
          className={styles.chevron}
          style={v({ left: `${((k + 1) / n) * 100}%`, "--i": k })}
        >
          <path d="M2 1.5 L6 5 L2 8.5" />
        </svg>
      ))}
      <ol className={styles.stations}>
        {stops.map((s, i) => {
          const last = i === n - 1;
          return (
            <li key={s} className={styles.station} style={v({ "--i": i })}>
              <span className={styles.stationMark}>
                {last ? <Focus tag={tag} dir="up" align="end" /> : <span aria-hidden className={styles.node} />}
              </span>
              <span className={styles.stationLabel}>{s}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ─── A path down a rail ──────────────────────────────────────────────
   Stages in the order they happened; no dates, so no time axis. The
   focus stage reads its fact off a dashed leader into the boxed tag. */

function Path({ steps }: { steps: { label: string; tag?: string }[] }) {
  return (
    <ol className={styles.path}>
      {steps.map((s, i) => (
        <li key={s.label} className={styles.step} data-focus={!!s.tag} style={v({ "--i": i })}>
          <span aria-hidden className={styles.stepMark}>
            {s.tag ? (
              <svg viewBox="-22 -22 44 44" className={styles.mark}>
                <polygon points={hexagon(17)} className={styles.hex} />
                <circle r="6" className={styles.dot} />
              </svg>
            ) : (
              <span className={styles.node} />
            )}
          </span>
          <span className={styles.stepLabel}>{s.label}</span>
          {s.tag && (
            <>
              <span aria-hidden className={styles.stepLeader} />
              <span className={`${styles.tag} ${styles.stepTag}`}>{s.tag}</span>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ─── The sheet ───────────────────────────────────────────────────────
   One kicker on top, the drawing, and at most one line of note in body
   type underneath — no small print. */

function Sheet({ kicker, foot, children }: { kicker: string; foot?: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.sheetWrap}>
      <figure className={styles.sheet}>
        <figcaption className={styles.kicker}>{kicker}</figcaption>
        <div className={styles.drawing}>{children}</div>
        {foot && (
          <div className={styles.foot}>
            {typeof foot === "string" ? <p className={styles.note}>{foot}</p> : foot}
          </div>
        )}
      </figure>
    </div>
  );
}

/* A count drawn as what it counts: one cell per template, set in tens
   (five by two, like a counting frame) so the number reads at a glance:
   79 is seven full tens and one a cell short. The tens light in turn. */
function Count({ n, label }: { n: number; label: string }) {
  return (
    <div className={styles.count}>
      <p className={styles.figure}>{n}</p>
      <p className={styles.countLabel}>{label}</p>
      <span aria-hidden className={styles.cells}>
        {Array.from({ length: Math.ceil(n / 10) }, (_, t) => (
          <span key={t} className={styles.ten} style={v({ "--i": t })}>
            {Array.from({ length: Math.min(10, n - t * 10) }, (_, k) => (
              <span key={k} />
            ))}
          </span>
        ))}
      </span>
    </div>
  );
}

/* The role as src/lib/axel.ts draws it: one chain from problem to
   production, the same stages and wording as the case study. */
const roleSpan = (p: Project) => p.sections?.find((s) => s.span)?.span;
const ROLE = { en: roleSpan(axelProject), cn: roleSpan(axelProjectCn) };

function Widget({ index, cn }: { index: number; cn: boolean }) {
  switch (index) {
    case 0:
      // "Integration cycles cut ~40%": the standard cycle is the base (100),
      // the SOP cycle stops about 40% short of it.
      return (
        <Sheet
          kicker={cn ? "集成周期 · 标准 = 100" : "Integration cycle\u00a0· standard = 100"}
          foot={cn ? "TikTok Pay PIPO 供应商对接，VN / MY / ID" : "TikTok Pay PIPO vendor integration, VN / MY / ID"}
        >
          <Bars
            max={100}
            ticks={[{ at: 0, label: "0" }, { at: 25 }, { at: 50 }, { at: 75 }, { at: 100, label: "100" }]}
            tag={cn ? "约 −40%" : "≈ −40%"}
            rows={[
              { label: cn ? "标准流程" : "Standard", to: 100 },
              { label: cn ? "有 SOP" : "With SOP", to: 60, ghost: [60, 100], focus: true },
            ]}
          />
        </Sheet>
      );

    case 1:
      return (
        <Sheet
          kicker={cn ? "KYC 完成率 · 越南" : "KYC completion · Vietnam"}
          foot={cn ? "新用户流程，前后两版" : "New-user flow, before and after"}
        >
          <Bars
            max={100}
            ticks={[{ at: 0, label: "0" }, { at: 25 }, { at: 50, label: "50%" }, { at: 75 }, { at: 100, label: "100%" }]}
            tag="+20 pp"
            rows={[
              { label: cn ? "v1 · 之前" : "v1 · before", value: "70%", to: 70 },
              { label: cn ? "v2 · 之后" : "v2 · after", value: "90%", to: 90, from: 70, focus: true },
            ]}
          />
        </Sheet>
      );

    case 2: {
      // The claim is "design through production frontend, delivered as
      // reviewable PRs" at Axel: the chain is that role's own stages, and
      // what comes out of the last one is the PR.
      const role = cn ? ROLE.cn : ROLE.en;
      return (
        <Sheet
          kicker={role?.total ?? (cn ? "从问题到上线" : "Problem to production")}
          foot={
            <Count
              n={79}
              label={cn ? "Axel 的交易类邮件模板，从 onboarding 到取消" : "Transactional email templates at Axel, onboarding to cancellation"}
            />
          }
        >
          {role && <Chain stops={role.stages} tag={cn ? "可审阅的 PR" : "Reviewable PR"} />}
        </Sheet>
      );
    }

    case 3:
      return (
        <Sheet kicker={cn ? "获奖 · 2025" : "Recognition · 2025"}>
          <ol className={styles.awards}>
            {AWARDS.map((a, i) => (
              <li key={a.name} className={styles.award} style={v({ "--i": i })}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.awardName}>{a.name}</span>
                <span className={styles.awardFor}>{a.project}</span>
              </li>
            ))}
          </ol>
        </Sheet>
      );

    case 4:
      return (
        <Sheet kicker={cn ? "XING Art · 创业路径" : "XING Art · the path"}>
          <Path
            steps={[
              { label: cn ? "联合创办 XING Art" : "Co-founded XING Art" },
              { label: cn ? "$300K 种子前轮" : "$300K pre-seed", tag: "MiraclePlus '25" },
              { label: cn ? "产品跑到规模 · 1K+ 用户" : "Product at scale · 1K+ users" },
              { label: cn ? "转为股东 + advisor" : "Shareholder + advisor" },
            ]}
          />
        </Sheet>
      );

    case 5:
      // "200%+": the bar stops at 200 and the dashed stretch past it is
      // the plus, an open end rather than a second number.
      return (
        <Sheet
          kicker={cn ? "年化收益" : "Annualized return"}
          foot={cn ? "和判断产品的是同一种直觉" : "The same instinct that ships products"}
        >
          <Bars
            max={250}
            ticks={[
              { at: 0, label: "0" },
              { at: 50 },
              { at: 100, label: "100%" },
              { at: 150 },
              { at: 200, label: "200%" },
              { at: 250 },
            ]}
            tag="200%+"
            rows={[{ label: cn ? "个人投资组合" : "Personal portfolio", to: 200, ghost: [200, 250], focus: true }]}
          />
        </Sheet>
      );

    default:
      return null;
  }
}

/* ─── One entry ──────────────────────────────────────────────────────
   The claim and its sheet. Memoized: a switch re-renders only the entry
   leaving and the entry arriving, and each of those only flips `data-on`
   and `inert` on its root. */

const Entry = memo(function Entry({ combo, index, cn, on }: { combo: Combo; index: number; cn: boolean; on: boolean }) {
  const Icon = ICONS[index];
  return (
    <div id={`combo-${combo.index}`} className={styles.entry} data-on={on} inert={!on}>
      <div className={styles.copy}>
        <div className={styles.label}>
          <span className={styles.icon}>
            <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
          </span>
          <span className={styles.title}>{combo.title}</span>
        </div>
        <p className={`type-display ${styles.proof}`}>{combo.proof}</p>
        <p className={styles.body}>{combo.body}</p>
      </div>

      <Widget index={index} cn={cn} />
    </div>
  );
});

/* ─── Main section ─────────────────────────────────────────────────── */

/* Lives at the bottom of /about now — it used to own a home tab, but the
   home page reads better with four. `inPage` drops the tab-panel padding
   so it sits in the About rhythm instead of floating. */
export function Moat({ inPage = false }: { inPage?: boolean }) {
  const cn = useLocale() === "cn";
  const t = useTranslations("Moat");
  const panel = useRef<HTMLDivElement>(null);
  // The sheets draw themselves once the panel is on screen; after that,
  // each entry draws as it is chosen.
  const inView = useInView(panel, { once: true, amount: 0.35 });
  const [active, setActive] = useState(0);
  const localizedCombos = cn ? COMBOS_CN : combos;

  return (
    <section id="combo" className={inPage ? "pb-8 scroll-mt-28" : "container-fluid pt-14 pb-32 scroll-mt-28"}>
      <Reveal>
        <p className="type-display text-ink leading-[1.15] max-w-3xl mb-12" style={{ fontSize: "clamp(30px, 4.2vw, 54px)" }}>
          {t.rich("intro", {
            i: (chunks: ReactNode) => <span className={styles.em}>{chunks}</span>,
            ink: (chunks: ReactNode) => <span className="block mt-5 font-sans text-[18px] sm:text-[21px] leading-relaxed text-mute tracking-normal">{chunks}</span>,
          })}
        </p>
      </Reveal>

      {/* Numbered selector — six mono labels on the paper; the active one is
          held by a registration bracket that glides between them. The
          labels sit on fixed columns, so the bracket's place is a plain
          translate off one custom property; hover is CSS alone. An entry
          is chosen by click, tap or keyboard, never by passing over it. */}
      <Reveal delay={0.05}>
        <div className="overflow-x-auto no-scrollbar mb-10 -mx-3 px-3 py-1">
          <div className={styles.tabs} style={v({ "--active": active })}>
            <span aria-hidden className={styles.bracket}>
              <span className="reg-mark tl" style={{ width: 7, height: 7, left: 0, top: 0 }} />
              <span className="reg-mark tr" style={{ width: 7, height: 7, right: 0, top: 0 }} />
              <span className="reg-mark br" style={{ width: 7, height: 7, right: 0, bottom: 0 }} />
              <span className="reg-mark bl" style={{ width: 7, height: 7, left: 0, bottom: 0 }} />
            </span>
            {localizedCombos.map((c, i) => (
              <button
                key={c.index}
                type="button"
                aria-pressed={active === i}
                aria-controls={`combo-${c.index}`}
                aria-label={`${c.index} · ${c.title}`}
                onClick={() => setActive(i)}
                className={styles.tab}
              >
                {c.index}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Detail panel — eight viewfinder marks around the six entries */}
      <Reveal delay={0.1}>
        <div ref={panel} className={styles.panel} data-run={inView}>
          <div className={styles.frame}>
            <span className="reg-mark tl" />
            <span className="reg-mark tr" />
            <span className="reg-mark br" />
            <span className="reg-mark bl" />
            <span className="vf-tick top" />
            <span className="vf-tick bottom" />
            <span className="vf-tick left" />
            <span className="vf-tick right" />

            <div className={styles.entries}>
              {localizedCombos.map((c, i) => (
                <Entry key={c.index} combo={c} index={i} cn={cn} on={active === i} />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
