"use client";

import { Fragment, memo, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./EmailRender.module.css";

/* A render check in two blocks under two of Latent's numbered tabs. Left,
   a short Liquid template on a slab; right, what it sends, laid on the
   dark chart sheet like a print proof with crop marks: Axel's card, the
   wordmark beside a pixel moon (the night sky from helloaxel.com), a
   headline, the SEA ✈ LAX trip line from the flight card, a button. The
   tabs feed the template event data or leave the destination city out.
   Without the city the `default` filter takes over: that token becomes a
   solid accent chip inside a dashed hexagon, with a boxed tag, and the
   headline swaps one word in place, underlined in ink, while the line
   closes up around it. The chip is the chart's one focus mark; with event
   data the blocks carry no accent at all.

   It is an example, and the caption under the sheet says so: the route is
   the Seattle to Los Angeles search from the case study's own screenshots,
   the variable names are illustrative, nothing here is a production
   template. Once half the sheet is on screen the second tab's underline
   fills, over 5s, and when it is full the sheet switches to the missing
   value, once, and holds there. The fill pauses while the pointer or the
   keyboard focus is in the sheet and while it is scrolled away; a touch
   inside or a choice made by hand ends it. Reduced motion never switches
   by itself, and its swaps are plain 160ms fades.
   Every change of state is a fade or a transform: the chip and the
   hexagon fade in at once, the tag and the underline follow; the line
   around the fallback opens by sliding the closing braces, and the
   headline closes up by sliding the words after the slot from where they
   stood (measured once per change, never per frame). */

type Kind = "d" | "k" | "v" | "s" | "h" | "t" | "o" | "miss" | "city" | "fb";
type Tok = [Kind, string];

const FOCUS_LINE = 3;

function template(cn: boolean): Tok[][] {
  return [
    [["d", "{%"], ["k", " assign "], ["v", "city"], ["o", " = "], ["miss", "event.destination_city"], ["d", " %}"]],
    [],
    [["h", "<h1>"]],
    [["t", cn ? "  你的" : "  Your "], ["d", "{{ "], ["city", "city"], ["o", " | "], ["fb", cn ? "下一趟" : "next"], ["d", " }}"]],
    [["t", cn ? "  航班已订好" : "  flight is booked"]],
    [["h", "</h1>"]],
    [["h", "<p>"], ["d", "{{ "], ["v", "event.origin"], ["d", " }}"], ["t", " → "], ["d", "{{ "], ["v", "event.destination"], ["d", " }}"], ["h", "</p>"]],
    [["h", '<a href="'], ["d", "{{ "], ["v", "event.trip_url"], ["d", " }}"], ["h", '">'], ["t", cn ? "查看行程" : "View trip"], ["h", "</a>"]],
  ];
}

/* Axel's sky, a pixel at a time: m = moon, s = a faint star,
   p = a brighter star. */
const SKY = [
  "........p..........mmm..",
  "..s....ppp........mm....",
  "........p........mm.....",
  ".............s...mm.....",
  "s................mm.....",
  "......s...........mm....",
  "...................mmm..",
];
const PX = 2.5;

/* A top-down plane facing +x, centred on the origin (as on Axel's flight card). */
const PLANE =
  "M12 0 L4 -1.6 L-2 -9 L-4.6 -9 L-1.2 -1.6 L-7 -1.4 L-9.6 -4.6 L-11.2 -4.6 L-9.8 0 L-11.2 4.6 L-9.6 4.6 L-7 1.4 L-1.2 1.6 L-4.6 9 L-2 9 L4 1.6 Z";

/* The ring is drawn to the token's measured box: a hexagon stretched
   along the line, its two points at the ends, and a leader up to the tag
   in the blank lines above. */
const PAD_X = 9;
const PAD_Y = 4;
const LEAD = 10;

function ring(w: number, h: number) {
  const W = w + PAD_X * 2;
  const H = h + PAD_Y * 2;
  const k = H / (2 * Math.sqrt(3));
  const pts = [
    [0, H / 2],
    [k, 0],
    [W - k, 0],
    [W, H / 2],
    [W - k, H],
    [k, H],
  ];
  return { W, H, points: pts.map(([x, y]) => `${(x + 0.5).toFixed(1)},${(y + 0.5).toFixed(1)}`).join(" ") };
}

function Fallback({ value, tag }: { value: string; tag: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox((b) => (b && Math.abs(b.w - r.width) < 0.5 && Math.abs(b.h - r.height) < 0.5 ? b : { w: r.width, h: r.height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shape = box && ring(box.w, box.h);

  return (
    <span ref={ref} className={styles.fallback}>
      <span data-k="f">default</span>
      <span data-k="o">: </span>
      <span data-k="s">&quot;{value}&quot;</span>
      {/* The token as the focus chip, faded in over the syntax colours */}
      <span aria-hidden className={styles.lit}>
        default: &quot;{value}&quot;
      </span>
      {shape && (
        <>
          <svg
            aria-hidden
            className={styles.ring}
            width={shape.W + 1}
            height={shape.H + 1}
            style={{ left: -PAD_X, top: -PAD_Y }}
          >
            <polygon points={shape.points} className={styles.hex} />
          </svg>
          <svg
            aria-hidden
            className={styles.lead}
            width="1"
            height={LEAD}
            style={{ left: shape.W / 2 - PAD_X, top: -PAD_Y - LEAD + 0.5 }}
          >
            <line x1="0.5" x2="0.5" y1="0" y2={LEAD} className={styles.leader} />
          </svg>
        </>
      )}
      <span aria-hidden className={`boxed-tag ${styles.tag}`} style={{ bottom: `calc(100% + ${PAD_Y + LEAD}px)` }}>
        {tag}
      </span>
    </span>
  );
}

const ARRIVE = "cubic-bezier(0.16, 1, 0.3, 1)"; // --ease-arrive
const CLOSE = { duration: 360, easing: ARRIVE }; // --t-2

/** A transform's horizontal and vertical shift as it is seen right now. */
function shift(el: HTMLElement) {
  const t = getComputedStyle(el).transform;
  const m = t && t !== "none" ? new DOMMatrixReadOnly(t) : null;
  return { x: m?.m41 ?? 0, y: m?.m42 ?? 0 };
}

/* The headline, and the one word in it the data decides. Both words share
   a slot; the one in use sets its width and the other stands over it while
   it fades. When the word changes the slot takes the new width at once,
   and then everything moves by transform alone, measured once per change:
   the words after the slot slide from where they stood to where they now
   stand, and each word in the slot is seen through a window whose edge
   travels with them (the window slides one way and the word inside it the
   other way), so the old word is wiped away, or the new one wiped in, at
   the pace the line closes up. A word that changes line fades in on its
   new line instead of crossing the others. */
function Headline({
  before,
  words,
  after,
  missing,
  still,
}: {
  before: string;
  words: [string, string];
  after: string;
  missing: boolean;
  still: boolean;
}) {
  const line = useRef<HTMLSpanElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  // The slot's width and where the words after it stood, as last laid out
  const stood = useRef<{ w: number; at: { x: number; y: number }[] } | null>(null);
  const parts = after.split(/(\s+)/).filter(Boolean);

  const measure = () => {
    const pieces = [...line.current!.querySelectorAll<HTMLElement>("[data-part]")];
    return { pieces, w: slot.current!.offsetWidth, at: pieces.map((p) => ({ x: p.offsetLeft, y: p.offsetTop })) };
  };

  useEffect(() => {
    const el = line.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { w, at } = measure();
      stood.current = { w, at };
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!line.current || !slot.current) return;
    const { pieces, w, at } = measure();
    const was = stood.current;
    stood.current = { w, at };
    if (!was || still || was.at.length !== at.length) return;
    // Where the line's moving edge is seen now, a slide still running included
    const lead = pieces.findIndex((_, k) => Math.abs(was.at[k].y - at[k].y) < 1);
    const from = was.w + (lead >= 0 ? shift(pieces[lead]).x : 0);

    pieces.forEach((p, k) => {
      const seen = shift(p);
      p.getAnimations().forEach((a) => a.cancel());
      const dy = was.at[k].y - at[k].y;
      if (Math.abs(dy) >= 1) {
        p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 60, easing: ARRIVE, fill: "backwards" });
        return;
      }
      const dx = was.at[k].x + seen.x - at[k].x;
      if (Math.abs(dx) >= 0.5) p.animate([{ transform: `translateX(${dx}px)` }, { transform: "translateX(0)" }], CLOSE);
    });

    slot.current.querySelectorAll<HTMLElement>("[data-window]").forEach((win) => {
      const hold = win.firstElementChild as HTMLElement;
      win.getAnimations().forEach((a) => a.cancel());
      hold.getAnimations().forEach((a) => a.cancel());
      if (Math.abs(from - w) < 0.5) return;
      const ww = win.offsetWidth;
      win.animate([{ transform: `translateX(${from - ww}px)` }, { transform: `translateX(${w - ww}px)` }], CLOSE);
      hold.animate([{ transform: `translateX(${ww - from}px)` }, { transform: `translateX(${ww - w}px)` }], CLOSE);
    });
  }, [missing, still]);

  return (
    <p className={styles.headline}>
      <span ref={line} className={styles.line}>
        {before}
        <span ref={slot} className={styles.slot}>
          {words.map((word, k) => {
            const on = (k === 1) === missing;
            return (
              <span key={k} data-window className={styles.window} data-on={on}>
                <span className={styles.hold}>
                  <span className={styles.word} data-on={on} data-fallback={k === 1} aria-hidden={!on}>
                    {word}
                  </span>
                </span>
              </span>
            );
          })}
        </span>
        {parts.map((part, k) =>
          /^\s+$/.test(part) ? (
            part
          ) : (
            <span key={k} data-part className={styles.part}>
              {part}
            </span>
          ),
        )}
      </span>
      {/* The longer reading holds the height, so nothing below jumps */}
      <span aria-hidden className={styles.ghost}>
        {before}
        {words[0]}
        {after}
      </span>
    </p>
  );
}

/* The template never changes with the state (the sheet's data-state
   restyles it), so pointing at the sheet never re-renders it. */
const Template = memo(function Template({ cn }: { cn: boolean }) {
  const lines = template(cn);
  return (
    <pre className={styles.code}>
      <code className={styles.lines}>
        {lines.map((line, i) => {
          // The tokens after the fallback slide over as the line opens round it
          const fb = line.findIndex(([kind]) => kind === "fb");
          return (
            <span key={i} className={styles.row} data-focus={i === FOCUS_LINE}>
              <span aria-hidden className={styles.num}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.src}>
                {line.map(([kind, text], j) =>
                  kind === "fb" ? (
                    <Fallback key={j} value={text} tag={cn ? "兜底" : "Fallback"} />
                  ) : fb >= 0 && j > fb ? (
                    // A sliding token keeps its leading space outside its box,
                    // so on a phone the line can break there and the braces
                    // start the next line at the indent
                    <Fragment key={j}>
                      {text.match(/^\s*/)![0]}
                      <span data-k={kind} data-after="">
                        {text.trimStart()}
                      </span>
                    </Fragment>
                  ) : (
                    <span key={j} data-k={kind} data-t={kind === "miss" ? text : undefined}>
                      {text}
                    </span>
                  ),
                )}
              </span>
            </span>
          );
        })}
      </code>
    </pre>
  );
});

const Sky = memo(function Sky() {
  return (
    <svg
      aria-hidden
      className={styles.sky}
      viewBox={`0 0 ${SKY[0].length * PX} ${SKY.length * PX}`}
      width={SKY[0].length * PX * 1.2}
      height={SKY.length * PX * 1.2}
    >
      {SKY.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : (
            <rect key={`${x}-${y}`} x={x * PX} y={y * PX} width={PX} height={PX} data-px={c} />
          ),
        ),
      )}
    </svg>
  );
});

/* The reader's motion setting, read without a hydration mismatch: the
   server and the hydrating render both say "no preference", then React
   renders again with the real answer. */
const REDUCE = "(prefers-reduced-motion: reduce)";
const onReduceChange = (cb: () => void) => {
  const m = window.matchMedia(REDUCE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useReduce = () =>
  useSyncExternalStore(onReduceChange, () => window.matchMedia(REDUCE).matches, () => false);

const TABS = {
  en: ["Event data", "Missing value"],
  cn: ["事件数据", "缺失值"],
};

export function EmailRender() {
  const cn = useLocale() === "cn";
  const reduce = useReduce();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sheet = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(sheet, { amount: 0.5 });
  const [missing, setMissing] = useState(false);
  // Until the one switch happens, or a hand makes the choice
  const [auto, setAuto] = useState(true);
  // The second tab's underline fills while the sheet is half on screen;
  // when it is full, the sheet switches (onAnimationEnd below)
  const running = auto && !reduce;
  // A touch inside the sheet ends the autoplay, as a choice would
  const touched = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" && auto) setAuto(false);
  };

  const choose = (next: boolean) => {
    setAuto(false);
    setMissing(next);
  };
  const filled = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget || !auto) return;
    setAuto(false);
    setMissing(true);
  };
  // Arrow keys move between the two tabs; Home and End jump
  const key = (e: React.KeyboardEvent) => {
    const k = missing ? 1 : 0;
    let next = k;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (k + 1) % 2;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (k + 1) % 2;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 1;
    else return;
    e.preventDefault();
    choose(next === 1);
    tabs.current[next]?.focus();
  };

  const words: [string, string] = cn ? ["洛杉矶", "下一趟"] : ["Los Angeles", "next"];
  const fallback = words[1];
  const before = cn ? "你的" : "Your ";
  const after = cn ? "航班已订好" : " flight is booked";
  const labels = cn ? TABS.cn : TABS.en;
  const active = missing ? 1 : 0;

  return (
    <div>
      <figure
        ref={sheet}
        className={styles.sheet}
        data-state={missing ? "missing" : "data"}
        data-cn={cn}
        data-auto={running}
        data-run={inView}
        onPointerDown={touched}
        aria-label={
          cn
            ? "示例：同一个 Liquid 邮件模板在有数据和缺失值时的渲染结果"
            : "Example: one Liquid email template rendered with event data and with a missing value"
        }
      >
        <div className={styles.tabs} role="tablist" aria-label={cn ? "模板数据" : "Template data"}>
          {labels.map((label, k) => (
            <button
              key={k}
              ref={(el) => {
                tabs.current[k] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${k}`}
              aria-selected={active === k}
              aria-controls={`${uid}-panel`}
              tabIndex={active === k ? 0 : -1}
              className={styles.tab}
              data-on={active === k}
              onClick={() => choose(k === 1)}
              onKeyDown={key}
            >
              <span className={`t-label ${styles.tabNum}`} data-code="">
                {String(k + 1).padStart(2, "0")}
              </span>
              <span className={`t-small ${styles.tabLabel}`}>{label}</span>
              <span aria-hidden className={styles.fill} data-k={k} onAnimationEnd={k === 1 ? filled : undefined} />
            </button>
          ))}
        </div>

        <div className={styles.panes} role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active}`}>
          <div className={`slab ${styles.codeSlab}`}>
            <Template cn={cn} />
          </div>

          <div className={`paper-stack ${styles.proofStack}`}>
            <div className={`paper ${styles.proof}`}>
              {(["tl", "tr", "br", "bl"] as const).map((c) => (
                <span key={c} aria-hidden className={`reg-mark ${c}`} />
              ))}
              <div className={styles.mail}>
                <div className={styles.head}>
                  <span className={styles.wordmark}>Axel</span>
                  <Sky />
                </div>

                <Headline before={before} words={words} after={after} missing={missing} still={reduce} />

                <div className={styles.trip}>
                  <span className={styles.iata}>SEA</span>
                  <span aria-hidden className={styles.route}>
                    <svg className={styles.dots} height="4">
                      <line x1="2" x2="100%" y1="2" y2="2" />
                    </svg>
                    <svg className={styles.plane} viewBox="-13 -11 26 22" width="22" height="19">
                      <path d={PLANE} />
                    </svg>
                  </span>
                  <span className={styles.iata}>LAX</span>
                </div>

                <span className={styles.button}>{cn ? "查看行程" : "View trip"}</span>
              </div>
              <span className="sr-only">
                {cn
                  ? missing
                    ? `城市缺失时，default 过滤器兜底为“${fallback}”。`
                    : "城市来自事件数据。"
                  : missing
                    ? `With the city missing, the default filter falls back to “${fallback}”.`
                    : "The city comes from the event data."}
              </span>
            </div>
          </div>
        </div>
      </figure>
      <p className={`t-small ${styles.caption}`}>
        {cn ? "示例模板，已简化。" : "Example template, simplified."}
      </p>
    </div>
  );
}
