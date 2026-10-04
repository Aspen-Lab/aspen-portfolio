"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Hash, Pause } from "lucide-react";
import { Reveal } from "../Reveal";
import { AboutFacts } from "./AboutFacts";
import { DitherPortrait } from "./DitherPortrait";
import styles from "./AboutHero.module.css";

type Box = { x: number; y: number; w: number; h: number; size: number; lead: number };

/** The About hero as a frame on a canvas. The headline is real type and the
    inspect layer on top of it is measured from the browser: point at a line
    and the selection moves there with that line's live size and type spec,
    plus the redline to the frame's edge. The caret on line two and the
    collaborator's cursor on line three say where the words go next.
    Inspect hides the whole layer for a clean read. */
export function AboutHero({ cn }: { cn: boolean }) {
  const [inspect, setInspect] = useState(true);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [frameSize, setFrameSize] = useState<string | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);

  const measure = useCallback(() => {
    const host = frame.current;
    if (!host) return;
    const origin = host.getBoundingClientRect();
    setFrameSize(`${Math.round(origin.width)} × ${Math.round(origin.height)}`);
    setBoxes(
      lines.current.flatMap((line) => {
        if (!line) return [];
        const rect = line.getBoundingClientRect();
        const style = getComputedStyle(line);
        return [{
          x: rect.left - origin.left,
          y: rect.top - origin.top,
          w: rect.width,
          h: rect.height,
          size: Math.round(parseFloat(style.fontSize)),
          lead: Math.round(parseFloat(style.lineHeight)),
        }];
      }),
    );
  }, []);

  useEffect(() => {
    const host = frame.current;
    if (!host) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  const words = cn
    ? ["设计有章法，", "代码能落地，", "好奇不设限。"]
    : ["Design with intent.", "Build with care.", "Stay curious."];
  const faces = cn
    ? ["Geist Light", "Geist Light", "Geist Light Italic"]
    : ["Newsreader Light", "Newsreader Light", "Newsreader Italic"];
  const box = boxes[active];
  const pad = 6;

  return (
    <div className={styles.hero}>
      <Reveal>
        <div className={styles.canvas} data-inspect={inspect ? "on" : "off"} data-active={active}>
          <div className={styles.bar}>
            <p className={styles.frameName}>
              <Hash size={11} strokeWidth={1.75} aria-hidden />
              ASPEN W. <span>/</span> {cn ? "创始设计工程师" : "FOUNDING DESIGN ENGINEER"}
            </p>
            <div className={styles.barEnd}>
              {frameSize && <span className={`${styles.frameSize} ${styles.anno}`} aria-hidden>{frameSize}</span>}
              <button type="button" className={styles.inspect} aria-pressed={inspect} onClick={() => setInspect((on) => !on)}>
                <span className={styles.switch} aria-hidden><span /></span>
                {cn ? "标注" : "Inspect"}
              </button>
            </div>
          </div>

          <div ref={frame} className={styles.frame} onPointerLeave={() => setHovering(false)}>
            <h1 className={`type-display ${styles.headline}`}>
              {words.map((text, index) => (
                <span key={text} className={`${styles.line} ${index === 2 ? "italic font-normal" : ""}`}>
                  <span
                    ref={(node) => { lines.current[index] = node; }}
                    className={styles.word}
                    onPointerEnter={() => { setActive(index); setHovering(true); }}
                  >
                    {/[，。]$/.test(text) ? <>{text.slice(0, -1)}<span className={styles.punct}>{text.slice(-1)}</span></> : text}
                    {index === 1 && (
                      <>
                        <span className={`${styles.caret} ${styles.anno}`} aria-hidden />
                        <span className={`${styles.comment} ${styles.anno}`} aria-hidden>{cn ? "// 以 PR 交付" : "// ships as a PR"}</span>
                      </>
                    )}
                    {index === 2 && (
                      <span className={`${styles.cursor} ${styles.anno}`} aria-hidden>
                        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 1.5 14 7.2l-5.3 1.5L6.4 14z" /></svg>
                        <span>Aspen</span>
                      </span>
                    )}
                  </span>
                </span>
              ))}
            </h1>

            {box && (
              <div className={`${styles.overlay} ${styles.anno}`} aria-hidden>
                <div
                  className={styles.selection}
                  style={{ left: box.x - pad, top: box.y - 2, width: box.w + pad * 2, height: box.h + 4 }}
                >
                  <i /><i /><i /><i />
                  <span className={styles.specTag}>H1 · {faces[active]} · {box.size}/{box.lead}</span>
                  <span className={styles.sizeTag} data-place={active === 2 ? "below" : "right"}>{Math.round(box.w)} × {Math.round(box.h)}</span>
                </div>
                <div
                  className={styles.measure}
                  data-show={hovering ? "on" : "off"}
                  style={{ top: box.y + box.h / 2, width: Math.max(0, box.x - pad) }}
                >
                  <span className={styles.redTag}>{Math.round(box.x - pad)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <div className={styles.story}>
        <Reveal delay={0.04}>
          <figure className={styles.portrait}>
            <figcaption className={styles.portraitBar}>
              <span>portrait.png</span>
              <span>1-bit · Atkinson</span>
            </figcaption>
            <DitherPortrait
              src="/about/aspen-avatar.png"
              label={cn ? "Aspen 的肖像，以点阵抖动呈现" : "Portrait of Aspen, set as a 1-bit dither"}
              className={styles.portraitCanvas}
            />
          </figure>
        </Reveal>

        <Reveal delay={0.1} className={styles.storyText}>
          <div>
            <p className={`type-display ${styles.lead}`}>
              {cn ? "在 Axel，把设计写成前端 PR，也把工程反馈带回设计。" : "At Axel, I turn design into frontend PRs and bring engineering feedback back into design."}
            </p>
            <p className={styles.sub}>
              {cn ? "从产品体验到品牌、广告和邮件，亲手构思、实现、测试。" : "From product to brand, campaigns, and email — I design, build, and test."}
            </p>
          </div>

          <div>
            <div className={styles.decision}>
              <p className={styles.decisionHead}>{cn ? "决定记录" : "DECISION LOG"}</p>
              <ol className={styles.track} data-date="2025.12">
                <li className={styles.stop}>
                  <span className={styles.node} aria-hidden><Pause size={11} strokeWidth={2} /></span>
                  <div>
                    <p className={styles.stopTitle}>
                      {cn ? "心理学 · Georgia Tech" : "Psychology · Georgia Tech"}
                      <span className={styles.badge}>{cn ? "暂停" : "Paused"}</span>
                    </p>
                    <p className={styles.stopMeta}>{cn ? "学士 · 2023 入学" : "BS · started 2023"}</p>
                  </div>
                </li>
                <li className={styles.stop}>
                  <span className={`${styles.node} ${styles.nodeNow}`} aria-hidden><ArrowRight size={11} strokeWidth={2} /></span>
                  <div>
                    <p className={styles.stopTitle}>
                      Axel · YC{"\u00A0"}W19
                      <span className={`${styles.badge} ${styles.badgeNow}`}>{cn ? "至今" : "Now"}</span>
                    </p>
                    <p className={styles.stopMeta}>{cn ? "创始设计工程师 · 全职" : "Founding Design Engineer · full-time"}</p>
                  </div>
                </li>
              </ol>
            </div>
            <a href="#about-capabilities" className={styles.explore}>
              {cn ? "认识我的不同面" : "A few sides of me"}
              <ArrowDown size={15} aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12} className={styles.factsRow}><AboutFacts cn={cn} /></Reveal>
    </div>
  );
}
