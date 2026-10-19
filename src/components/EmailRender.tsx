"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./EmailRender.module.css";

/* A render check, drawn on Latent's sheet. Left, a short Liquid template;
   right, what it sends, in Axel's dark manner: the wordmark beside a pixel
   moon (the night sky from helloaxel.com), a headline, the SEA ✈ LAX trip
   line from the flight card, a button. A toggle feeds the template event
   data or leaves the destination city out. Without the city the `default`
   filter takes over: that token is the one accent on the sheet, with a
   dashed hexagon and a boxed tag, and the headline swaps one word in place
   while the line closes up around it.

   It is an example, and says so on its edge: the route is the Seattle to
   Los Angeles search from the case study's own screenshots, the variable
   names are illustrative, nothing here is a production template. The two
   states alternate while the sheet is on screen and nobody is pointing at
   it; a choice made by hand stays put. Reduced motion holds still. */

type Kind = "d" | "k" | "v" | "s" | "h" | "t" | "o" | "miss" | "city" | "fb";
type Tok = [Kind, string];

const DWELL = 5200;
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

/* Axel's sky, a pixel at a time: m = moon, s = a star that twinkles,
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

/* A top-down plane facing +x, centred on the origin (as in RouteFlow). */
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
      {shape && (
        <svg
          aria-hidden
          className={styles.ring}
          width={shape.W + 1}
          height={shape.H + 1}
          style={{ left: -PAD_X, top: -PAD_Y }}
        >
          <polygon points={shape.points} className={styles.hex} />
          <line x1={shape.W / 2 + 0.5} x2={shape.W / 2 + 0.5} y1={0.5} y2={-LEAD} className={styles.leader} />
        </svg>
      )}
      <span aria-hidden className={styles.tag} style={{ bottom: `calc(100% + ${PAD_Y + LEAD}px)` }}>
        {tag}
      </span>
    </span>
  );
}

/* The one word the data decides. Both words share a cell; the cell's width
   follows the word in use, so the rest of the line closes up around it. */
function Slot({ words, missing }: { words: [string, string]; missing: boolean }) {
  const a = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = useState<[number, number] | null>(null);

  useEffect(() => {
    const ea = a.current;
    const eb = b.current;
    if (!ea || !eb) return;
    const measure = () => setWidths([ea.getBoundingClientRect().width, eb.getBoundingClientRect().width]);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ea);
    ro.observe(eb);
    return () => ro.disconnect();
  }, [words]);

  return (
    <span className={styles.slot} style={{ width: widths ? widths[missing ? 1 : 0] : undefined }}>
      <span ref={a} className={styles.word} data-on={!missing} aria-hidden={missing}>
        {words[0]}
      </span>
      <span ref={b} className={styles.word} data-on={missing} aria-hidden={!missing}>
        {words[1]}
      </span>
    </span>
  );
}

export function EmailRender() {
  const cn = useLocale() === "cn";
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.5 });
  const [missing, setMissing] = useState(false);
  const [held, setHeld] = useState(false);
  const [chosen, setChosen] = useState(false);
  const running = inView && !held && !chosen && !reduce;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setMissing((m) => !m), DWELL);
    return () => clearTimeout(timer);
  }, [running, missing]);

  const choose = (next: boolean) => {
    setChosen(true);
    setMissing(next);
  };

  const lines = template(cn);
  const words: [string, string] = cn ? ["洛杉矶", "下一趟"] : ["Los Angeles", "next"];
  const fallback = words[1];
  const before = cn ? "你的" : "Your ";
  const after = cn ? "航班已订好" : " flight is booked";

  return (
    <div
      ref={root}
      className={styles.wrap}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <figure
        className={styles.sheet}
        data-state={missing ? "missing" : "data"}
        aria-label={
          cn
            ? "示例：同一个 Liquid 邮件模板在有数据和缺失值时的渲染结果"
            : "Example: one Liquid email template rendered with event data and with a missing value"
        }
      >
        <span className={styles.example}>{cn ? "示例" : "Example"}</span>

        <div className={styles.bar}>
          <div className={styles.toggle} role="group" aria-label={cn ? "模板数据" : "Template data"}>
            <span aria-hidden className={styles.thumb}>
              {running && <span key={String(missing)} className={styles.run} />}
            </span>
            <button
              type="button"
              className={styles.seg}
              data-on={!missing}
              aria-pressed={!missing}
              onClick={() => choose(false)}
            >
              <span aria-hidden className={styles.glyph} data-kind="data" />
              {cn ? "有数据" : "Event data"}
            </button>
            <button
              type="button"
              className={styles.seg}
              data-on={missing}
              aria-pressed={missing}
              onClick={() => choose(true)}
            >
              <span aria-hidden className={styles.glyph} data-kind="missing" />
              {cn ? "缺失值" : "Missing value"}
            </button>
          </div>
        </div>

        <div className={styles.panes}>
          <pre className={styles.code}>
            <code className={styles.lines}>
              {lines.map((line, i) => (
                <span key={i} className={styles.row} data-focus={i === FOCUS_LINE}>
                  <span aria-hidden className={styles.num}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.src}>
                    {line.map(([kind, text], j) =>
                      kind === "fb" ? (
                        <Fallback key={j} value={text} tag={cn ? "兜底" : "Fallback"} />
                      ) : (
                        <span key={j} data-k={kind}>
                          {text}
                        </span>
                      ),
                    )}
                  </span>
                </span>
              ))}
            </code>
          </pre>

          <div className={styles.preview}>
            <div className={styles.mail}>
              <div className={styles.head}>
                <span className={styles.wordmark}>Axel</span>
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
                        <rect
                          key={`${x}-${y}`}
                          x={x * PX}
                          y={y * PX}
                          width={PX}
                          height={PX}
                          data-px={c}
                          style={{ ["--d" as string]: `${((x * 7 + y * 13) % 11) * 0.37}s` }}
                        />
                      ),
                    ),
                  )}
                </svg>
              </div>

              <p className={styles.headline}>
                <span className={styles.line}>
                  {before}
                  <Slot words={words} missing={missing} />
                  {after}
                </span>
                {/* The longer reading holds the height, so nothing below jumps */}
                <span aria-hidden className={styles.ghost}>
                  {before}
                  {words[0]}
                  {after}
                </span>
              </p>

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
      </figure>
    </div>
  );
}
