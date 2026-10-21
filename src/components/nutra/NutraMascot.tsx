"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { ART, nutraFont } from "./product";
import { roveFocus, roveKeys, roveSync } from "./rove";
import styles from "./NutraMascot.module.css";

/* Why gamification, why a nut, as one split card.

   The sheet (7/12) draws Nutra's own loop, the four product strings in
   the order the app shows them (hero video, boards 030 and 023): Save
   Money → "Saving successful!" → "Check Reward" → "Nut found a pair of
   glasses in the forest!" and back to Save Money. The nodes stand in a
   2×2 ring, joined clockwise by 1px arrows; the owner's three words
   describe the whole loop, so they caption it once (Short · Visible ·
   Rewarding) rather than any one step. Node 1 is a product render (the
   app's own Save Money chip: Red Hat Text, orange on #312F36); node 3,
   the reward, carries the figure's one accent outline. The strings stay
   in the app's English; on /cn each carries its Chinese gloss under it.
   Under a rule, the precedents from board 019 (two mechanics quoted as
   printed, four more apps by name) and its market reflection. No logos,
   awards or ratings.

   The slab (5/12) says why a nut: the 3D acorn from the app on a raised
   square, and board 020's four keywords. No accent there.

   Pointing at, focusing or tapping a node writes data-node on the root:
   CSS inks that node's outgoing arrow and steps the others back. Opacity
   only (each arrow is drawn twice, grey under ink); nothing re-renders.
   The nodes are one listbox with one tab stop (arrow keys move). A phone
   stacks the nodes, joined by down arrows, with the return drawn up the
   right edge. Entrance, once: nodes rise 60ms apart, the arrows draw in
   behind them, the acorn rises last. Reduced motion: final frame, no
   idle animation. */

const COPY = {
  en: {
    loop: "The loop",
    words: ["Short", "Visible", "Rewarding"],
    precedents: "Precedents",
    also: "Also studied",
    market: "Market reflection",
    marketQuote: "“Received mostly positive review”",
    why: "Why a nut",
    acornAlt: "Nut, the app’s 3D acorn",
    keywords: ["Imply Saving", "Collecting", "Adorable", "Release Stress"],
    quotes: [
      "“The sapling will grow into a big tree if you’ve been staying focused.”",
      "“Your plants grow when you drink up!”",
    ],
    gloss: null as string[] | null,
    loopLabel: "Nutra’s save → reward loop",
  },
  cn: {
    loop: "循环",
    words: ["短", "看得见", "有回报"],
    precedents: "先例",
    also: "同样研究过",
    market: "市场反馈",
    marketQuote: "“评价大多正面”",
    why: "为什么是坚果",
    acornAlt: "Nut，App 里的 3D 橡果",
    keywords: ["寓意储蓄", "收集", "可爱", "释放压力"],
    quotes: ["“只要你保持专注，小树苗就会长成大树。”", "“你喝水，植物就会长大！”"],
    gloss: ["存钱", "存钱成功", "查看奖励", "Nut 在森林里找到了一副眼镜"],
    loopLabel: "Nutra 的存钱 → 奖励循环",
  },
};

/* The loop's product strings stay English in both locales: they are the
   app's own UI */
const NODES = ["Save Money", "“Saving successful!”", "“Check Reward”", "“Nut found a pair of glasses in the forest!”"];
const PRECEDENTS = ["Forest", "Plant Nanny"];
const ALSO = ["habitica", "headspace", "Fabulous", "Clarify"];
/** The reward: the figure's one focus */
const FOCUS = 2;

/* Arc k leaves node k. On a wide sheet the four run round the 2×2 ring
   (right, down, left, up); on a phone the first three run down between
   the nodes and the fourth returns up the right edge. */
const RING = ["r", "d", "l", "u"] as const;
const HEAD_RING = { r: "right", d: "down", l: "left", u: "up" } as const;

function Head({ dir }: { dir: "up" | "down" | "left" | "right" }) {
  const d = {
    right: "M0 0 L6 4 L0 8 Z",
    left: "M6 0 L0 4 L6 8 Z",
    down: "M0 0 H8 L4 6 Z",
    up: "M0 6 H8 L4 0 Z",
  }[dir];
  const across = dir === "left" || dir === "right";
  return (
    <svg viewBox={across ? "0 0 6 8" : "0 0 8 6"} className={styles.arrow} data-dir={dir}>
      <path d={d} />
    </svg>
  );
}

/** One arc, drawn twice: grey, and ink over it (shown while its node is
    pointed at). `kind` places the line, `head` is the arrowhead. */
function Arc({ k, kind, head }: { k: number; kind: string; head: ReactNode }) {
  return (
    <span className={styles.arc} data-arc={k} data-kind={kind} aria-hidden style={{ "--k": k } as CSSProperties}>
      <span className={styles.path}>
        <span className={styles.base}>
          <span className={styles.stroke} />
          {head}
        </span>
        <span className={styles.lit}>
          <span className={styles.stroke} />
          {head}
        </span>
      </span>
    </span>
  );
}

export function NutraMascot() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const root = useRef<HTMLElement>(null);
  const lit = useInView(root, { once: true, amount: 0.2 });
  const lastTouch = useRef(-1);
  const w = (text: string) => hold(text, styles.hold);

  const current = () => root.current?.dataset.node;
  const mark = (n: number | null) => {
    const el = root.current;
    if (!el) return;
    if (n === null) delete el.dataset.node;
    else el.dataset.node = String(n);
    roveSync(el, n === null ? null : String(n));
  };
  const onEnter = (n: number) => (e: PointerEvent) => {
    if (e.pointerType !== "touch") mark(n);
  };
  const onLeave = (n: number) => (e: PointerEvent) => {
    if (e.pointerType !== "touch" && current() === String(n)) mark(null);
  };
  const onDown = (n: number) => (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    lastTouch.current = e.timeStamp;
    mark(current() === String(n) ? null : n);
  };
  const onFocus = (n: number) => (e: FocusEvent) => {
    if (e.timeStamp - lastTouch.current < 600) return;
    mark(n);
  };
  const onBlur = (n: number) => () => {
    if (current() === String(n)) mark(null);
  };

  return (
    <figure ref={root} className={styles.root} data-lit={lit}>
      <div className={styles.box}>
        {/* ── The sheet: the loop, then the precedents ── */}
        <div className={styles.sheet}>
          <div className={styles.loopHead}>
            <p className={`t-label ${styles.title}`}>{t.loop}</p>
            <p className={`t-label ${styles.words}`}>
              {t.words.map((word, i) => (
                <span key={word} className={styles.wordItem}>
                  {i > 0 && (
                    <span aria-hidden className={styles.sep}>
                      ·
                    </span>
                  )}
                  {word}
                </span>
              ))}
            </p>
          </div>

          <div
            className={styles.loop}
            role="listbox"
            aria-label={t.loopLabel}
            onKeyDown={roveKeys}
            onFocus={roveFocus}
          >
            {NODES.map((s, n) => (
              <div
                key={s}
                role="option"
                aria-selected={false}
                data-rove={n}
                tabIndex={n === 0 ? 0 : -1}
                className={styles.node}
                data-n={n}
                data-focus={n === FOCUS || undefined}
                style={{ "--k": n } as CSSProperties}
                onPointerEnter={onEnter(n)}
                onPointerLeave={onLeave(n)}
                onPointerDown={onDown(n)}
                onFocus={onFocus(n)}
                onBlur={onBlur(n)}
              >
                <span className={`t-label ${styles.index}`} data-code="">
                  {String(n + 1).padStart(2, "0")}
                </span>
                {n === 0 ? (
                  <span className={`${nutraFont.className} ${styles.saveChip}`} lang="en">
                    {s}
                  </span>
                ) : (
                  <span className={`t-small ${styles.string}`} data-short={n < 3 || undefined} lang="en">
                    {s}
                  </span>
                )}
                {t.gloss && <span className={`t-small ${styles.gloss}`}>{w(t.gloss[n])}</span>}
              </div>
            ))}

            {/* A wide sheet: the four sides of the ring */}
            {RING.map((c, k) => (
              <Arc key={c} k={k} kind={c} head={<Head dir={HEAD_RING[c]} />} />
            ))}
            {/* A phone: three arrows down, one return up the right edge */}
            {[0, 1, 2].map((k) => (
              <Arc key={`d${k}`} k={k} kind="down" head={<Head dir="down" />} />
            ))}
            <Arc k={3} kind="return" head={<Head dir="left" />} />
          </div>

          <div className={styles.refs}>
            <p className={`t-label ${styles.title}`}>{t.precedents}</p>
            <dl className={styles.precedents}>
              {PRECEDENTS.map((name, i) => (
                <div key={name} className={styles.precedent}>
                  <dt className={`t-small ${styles.app}`}>{name}</dt>
                  <dd className={`t-small ${styles.quote}`}>{w(t.quotes[i])}</dd>
                </div>
              ))}
              <div className={styles.precedent}>
                <dt className={`t-label ${styles.refLabel}`}>{w(t.also)}</dt>
                <dd className={styles.chipsCell}>
                  <ul className={styles.chips}>
                    {ALSO.map((name) => (
                      <li key={name} className="chip">
                        {name}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className={styles.precedent}>
                <dt className={`t-label ${styles.refLabel}`}>{w(t.market)}</dt>
                <dd className={`t-small ${styles.market}`}>{w(t.marketQuote)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ── The slab: why a nut ── */}
        <div className={`slab ${styles.why}`}>
          <p className={`t-label ${styles.title}`}>{t.why}</p>
          <div className={styles.stage}>
            <div className={styles.acornSquare}>
              <Image
                src={ART.acorn.src}
                alt={t.acornAlt}
                width={ART.acorn.w}
                height={ART.acorn.h}
                sizes="96px"
                className={styles.acorn}
              />
            </div>
          </div>
          <ol className={styles.keys}>
            {t.keywords.map((word, i) => (
              <li key={word} className={styles.key}>
                <span className={`t-label ${styles.keyIndex}`} data-code="">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`t-subhead ${styles.keyWord}`}>{w(word)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </figure>
  );
}
