"use client";

import { useEffect, useReducer, useRef } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { INITIAL, reducer } from "./app/model";
import { Phone } from "./app/Phone";
import styles from "./NutraApp.module.css";

/* What shipped: the hi-fi prototype rebuilt as a working app, beside the
   ledger of the first four features the case says shipped (the owner's
   "What shipped" items, each split into a title and its line; the fifth,
   the design system, closes the section's body). A split card in the site's system: the phone
   on a sheet, the ledger on a slab. The ledger drives the phone and the
   phone drives the ledger: 01 is Home with its daily challenge, 02 the
   goal setup, 03 Save Money and its reward, 04 the Data tab. The row in
   view carries the figure's one accent mark, an 8px square; every row
   reads at full ink, at rest as on hover.

   The app inside is a product render: the app's own colours, type and
   radii (product.ts), its own demo data from Aspen's design files, its
   own words in English in both locales. Everything is a real control;
   state is one reducer, and nothing re-renders on hover.

   Below lg the ledger is a 2×2 grid of compact buttons over the phone,
   and only the row in view says its line, under the phone. The phone is
   drawn at 360×760 and scaled to its sheet by a ResizeObserver. It enters
   once on view: the phone rises 8px and fades in, Home's cards step in.
   Reduced motion: no slides or pulses, 160ms fades, rims jump. */

const COPY = {
  en: {
    kicker: "Hi-fi prototype · rebuilt in code",
    label: "Nutra app prototype",
    rows: [
      { title: "Daily challenges", text: "Based on the user's spending pattern." },
      { title: "Goal setting", text: "Personalized, manageable steps." },
      { title: "The Nut assistant", text: "Visual reward and emotional feedback." },
      { title: "Financial overview", text: "Honest data viz of habits, budgets, and progress." },
    ],
    note: "Demo data from the design files. Tap anything.",
    reset: "Reset",
    ledger: "What shipped",
  },
  cn: {
    kicker: "高保真原型 · 代码重建",
    label: "Nutra App 原型",
    rows: [
      { title: "每日挑战", text: "根据用户的消费模式而定。" },
      { title: "目标设定", text: "个性化、可执行的小步骤。" },
      { title: "Nut 助手", text: "提供视觉奖励和情绪反馈。" },
      { title: "财务概览", text: "用诚实的数据可视化呈现习惯、预算与进展。" },
    ],
    note: "演示数据来自设计稿，可以随意点击。",
    reset: "重置",
    ledger: "最终交付",
  },
};

const DESIGN_W = 360;

export function NutraApp() {
  const cn = useLocale() === "cn";
  const copy = cn ? COPY.cn : COPY.en;
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const entered = useInView(root, { once: true, amount: 0.25 });

  // The phone's scale: its sheet's inner width over the design width
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const scale = Math.min(1, entry.contentRect.width / DESIGN_W);
      el.style.setProperty("--s", scale.toFixed(4));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} data-in={entered}>
      <div className={styles.card}>
        <div ref={stage} className={styles.stage}>
          <span aria-hidden className="reg-mark tl" />
          <span aria-hidden className="reg-mark tr" />
          <span aria-hidden className="reg-mark br" />
          <span aria-hidden className="reg-mark bl" />
          <div className={styles.fit}>
            <Phone state={state} dispatch={dispatch} label={copy.label} entered={entered} />
          </div>
        </div>

        <div className={styles.slab}>
          <p className={`t-label ${styles.kicker}`}>
            <span aria-hidden className={styles.kickerMark} />
            {copy.kicker}
          </p>
          <ol className={styles.rows} aria-label={copy.ledger}>
            {copy.rows.map((r, i) => {
              const on = state.row === i;
              return (
                <li key={r.title} className={styles.item}>
                  <button
                    type="button"
                    className={styles.row}
                    data-on={on}
                    aria-current={on ? "true" : undefined}
                    onClick={() => dispatch({ type: "ledger", row: i })}
                  >
                    <span className={`t-label ${styles.idx}`} data-code="">
                      <span aria-hidden className={styles.sq} />
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.words}>
                      <span className={`t-subhead ${styles.title}`}>{hold(r.title, styles.word)}</span>
                      <span className={`t-small ${styles.titleSm}`}>{hold(r.title, styles.word)}</span>
                      <span className={`t-small ${styles.text}`}>{hold(r.text, styles.word)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {/* Below lg: the line of the row in view, under the phone */}
          <div className={styles.detail} aria-live="polite">
            {copy.rows.map((r, i) => (
              <p key={r.title} className={`t-small ${styles.detailText}`} data-on={state.row === i} aria-hidden={state.row !== i}>
                {hold(r.text, styles.word)}
              </p>
            ))}
          </div>
          <div className={styles.foot}>
            <p className={`t-small ${styles.note}`}>{hold(copy.note, styles.word)}</p>
            <button type="button" className={`t-label ${styles.reset}`} onClick={() => dispatch({ type: "reset" })}>
              {copy.reset}
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
}
