"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Seg } from "@/components/nutra/Seg";
import { ClusterStage } from "./cluster/Stage";
import { ORIGINAL, ORIGINAL_BOX, OriginalCluster, type OriginalHda } from "./original/OriginalCluster";
import styles from "./HyundaiHandoff.module.css";

/* The problem in the product itself (boards 01 and 14): Hyundai's
   original IONIQ 6 cluster, redrawn flat, with HDA off, on, or turned
   grey. Engaging HDA swaps one small row at the top for the HDA strip and
   tints the lane lines; turning grey only greys the strip's word, badge
   and icons. Beside it, board 14's list of the four ways HDA disabled
   itself, each with its own cue.

   A split card in the site's system: the cluster on a sheet (dot grid,
   corner marks), the switch and the list on a slab. In ON and Turned grey
   a 1.5px accent outline frames the HDA strip: the handoff cue, the
   figure's one focus mark. A 1px ink outline frames the lane lines. Each
   carries a boxed 'Changes' tag; HDA off shows neither.

   The switch is a radio group (arrow keys). 'Pressing Brake — Turn grey'
   is the one row that is a control: it toggles Turned grey, because board
   14 draws that cue; the other three causes stay text. State lives in
   React (a click); the render crossfades its layers in CSS.

   Entrance, once on view: the screen rises 8px and fades in, the rows
   step in 60ms apart, the outlines land last. Reduced motion: the final
   frame, 160ms fades. On a phone the stage is a window on the cluster's
   middle (design x 374–1374: the speed, the strip, the road and the
   car). */

const COPY = {
  en: {
    aria: "The original IONIQ 6 cluster with HDA off, on, or turned grey",
    kicker: "Original IONIQ 6 cluster",
    off: "HDA off",
    on: "HDA on",
    grey: "Turned grey",
    head: "HDA Auto Disabled by",
    changes: "Changes",
    rows: [
      { cause: "Traffic Jam", cue: "Only smart cruise on" },
      { cause: "Pressing Brake", cue: "Turn grey" },
      { cause: "Accelerating", cue: "Flashing White" },
      { cause: "Collision Avoidance", cue: "Off temporarily" },
    ],
  },
  cn: {
    aria: "原有 IONIQ 6 仪表：HDA 关闭、开启或变灰",
    kicker: "原有 IONIQ 6 仪表",
    off: "HDA 关闭",
    on: "HDA 开启",
    grey: "变灰",
    head: "HDA 自动退出的情形",
    changes: "变化",
    rows: [
      { cause: "交通拥堵", cue: "仅保留智能巡航" },
      { cause: "踩下刹车", cue: "变为灰色" },
      { cause: "加速", cue: "白色闪烁" },
      { cause: "碰撞规避", cue: "暂时关闭" },
    ],
  },
};

/** The row that is a control: Pressing Brake turns HDA grey (board 14) */
const BRAKE = 1;

/** A design-px box as the custom properties the overlay places it by */
const place = (b: { x: number; y: number; w: number; h: number }) =>
  ({ "--bx": b.x, "--by": b.y, "--bw": b.w, "--bh": b.h }) as CSSProperties;

export function HyundaiHandoff() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const [hda, setHda] = useState<OriginalHda>("on");
  const root = useRef<HTMLElement>(null);
  const seen = useInView(root, { once: true, amount: 0.3 });
  const w = (text: string) => hold(text, styles.word);

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} data-in={seen} data-hda={hda} aria-label={t.aria}>
      <div className={styles.card}>
        <div className={styles.stage}>
          <span aria-hidden className="reg-mark tl" />
          <span aria-hidden className="reg-mark tr" />
          <span aria-hidden className="reg-mark br" />
          <span aria-hidden className="reg-mark bl" />
          <div className={styles.screen}>
            <ClusterStage designW={ORIGINAL.w} designH={ORIGINAL.h} mobileWindow={1000} cx={874}>
              <OriginalCluster hda={hda} />
            </ClusterStage>
            {/* The marks, in CSS px over the scaled render */}
            <div className={styles.marks} aria-hidden>
              <span className={`${styles.mark} ${styles.lanes}`} style={place(ORIGINAL_BOX.lanes)}>
                <span className={styles.box} />
                <span className={`boxed-tag ${styles.tag}`}>{t.changes}</span>
              </span>
              <span className={`${styles.mark} ${styles.strip}`} style={place(ORIGINAL_BOX.strip)}>
                <span className={styles.box} />
                <span className={`boxed-tag ${styles.tag}`}>{t.changes}</span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.slab}>
          <p className={`t-label ${styles.kicker}`}>
            <span aria-hidden className={styles.kickerMark} />
            {t.kicker}
          </p>
          <Seg
            className={styles.seg}
            label={t.kicker}
            value={hda}
            onChange={setHda}
            options={[
              { value: "off", label: t.off },
              { value: "on", label: t.on },
              { value: "grey", label: t.grey },
            ]}
          />
          <div className={styles.list}>
            <p className={`t-label ${styles.head}`}>{t.head}</p>
            <ul className={styles.rows}>
              {t.rows.map((r, i) => {
                const words = (
                  <>
                    <span className={`t-small ${styles.cause}`}>{w(r.cause)}</span>
                    <span className={`t-small ${styles.cue}`}>{w(r.cue)}</span>
                  </>
                );
                return (
                  <li key={r.cause} className={styles.item} style={{ "--i": i } as CSSProperties}>
                    {i === BRAKE ? (
                      <button
                        type="button"
                        className={`${styles.row} ${styles.toggle}`}
                        aria-pressed={hda === "grey"}
                        data-ring="inset"
                        onClick={() => setHda(hda === "grey" ? "on" : "grey")}
                      >
                        {words}
                        <span aria-hidden className={styles.check} />
                      </button>
                    ) : (
                      <div className={styles.row}>{words}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </figure>
  );
}
