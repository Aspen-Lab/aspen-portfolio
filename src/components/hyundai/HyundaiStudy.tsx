"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import styles from "./HyundaiStudy.module.css";

/* The two test environments, side by side, with the study's own photos
   as the evidence: people driving the IONIQ 6 and the simulator rig. The
   photos are crops of Aspen's composite boards (03, 04, 05), cut at their
   seams (pixel-scanned; each internal edge inset 2px so no neighbouring
   photo bleeds in) and never dimmed, overlaid or linked: board 03's full
   image carries an unqualified user count, so only one of its photos is
   used, from below its stat band.

   Under the simulator, what the rig adds on a slab (board 04's caption;
   the steering rig, highway rendering, surround sound and the three
   measures are already in the section's paragraph, so the figure does not
   repeat them). Last, the printed scope from board 03: 2 environments,
   8 tasks, 9 points of data collection; never its '10 Users'. The accent
   is the square before 'Environments', the section's claim.

   A statement: nothing answers a pointer. Once, on view: the columns
   rise, the photos fade in, the numbers fade up 60ms apart and the accent
   square lands last. Reduced motion shows the final frame. */

type Board = { src: string; W: number; H: number };

const B03: Board = { src: "/work/hyundai/03-747fVSg38mokrReOL40M47r00s.png", W: 1920, H: 954 };
const B04: Board = { src: "/work/hyundai/04-8FkhskjBGQnEpOUP2OMu9twWG8.png", W: 1638, H: 670 };
const B05: Board = { src: "/work/hyundai/05-0xdgD29FFB4fkF1yq9QCiy3TUSo.png", W: 1997, H: 967 };

type PhotoKey = "carRear" | "carDriver" | "carTobii" | "simSession" | "simWheel" | "simRig";

/* Source rects in board px. Seams found by a pixel scan: board 05 splits
   at x 1137|1138 and, on the right, y 484|485; board 03's bottom row
   starts at y 692 (below the stat band) and its Tobii photo spans x
   929–1376; board 04's photos split at x 838|839 and end at y 466, above
   the white caption band. fx/fy: where a photo is anchored when its box
   is taller than the crop (0.5 = centred). Crops of one board share one
   `sizes`, so the browser fetches that board once, not once per crop. */
const S05 = "(max-width: 1023px) 220vw, 1400px";
const CROPS: Record<PhotoKey, { b: Board; x: number; y: number; w: number; h: number; fx: number; fy: number; sizes: string }> = {
  carRear: { b: B05, x: 0, y: 0, w: 1136, h: 967, fx: 0.5, fy: 0.5, sizes: S05 },
  carDriver: { b: B05, x: 1140, y: 0, w: 857, h: 483, fx: 0.5, fy: 0.5, sizes: S05 },
  carTobii: { b: B03, x: 931, y: 694, w: 444, h: 260, fx: 0.5, fy: 0.5, sizes: "(max-width: 1023px) 190vw, 1300px" },
  simSession: { b: B05, x: 1140, y: 487, w: 857, h: 480, fx: 0.5, fy: 0.5, sizes: S05 },
  simWheel: { b: B04, x: 3, y: 0, w: 834, h: 465, fx: 0.5, fy: 0.5, sizes: "(max-width: 1023px) 90vw, 600px" },
  simRig: { b: B04, x: 841, y: 0, w: 797, h: 465, fx: 0.5, fy: 0.5, sizes: "(max-width: 1023px) 90vw, 600px" },
};

type Copy = {
  aria: string;
  real: string;
  sim: string;
  rig: string;
  rigItems: string[];
  scope: { n: string; label: string }[];
  alts: Record<PhotoKey, string>;
};

const COPY: Record<"en" | "cn", Copy> = {
  en: {
    aria: "Two test environments: a real vehicle and a simulator",
    real: "Real vehicle",
    sim: "Unreal Engine simulator",
    rig: "Simulator rig",
    rigItems: [
      "Buttons that correspond to semi‑autonomous functionality",
      "Centering force tension in corrective modes",
    ],
    scope: [
      // A soft hyphen: a 360px phone breaks it "Environ-ments"; wider screens never show it
      { n: "2", label: "Environ\u00adments" },
      { n: "8", label: "Tasks" },
      { n: "9", label: "Points of data collection" },
    ],
    alts: {
      carRear: "A real-driving session recorded from the back seat",
      carDriver: "A participant driving the IONIQ 6, an observer beside them",
      carTobii: "A participant wearing Tobii eye-tracking glasses",
      simSession: "A participant at the simulator",
      simWheel: "The simulator wheel and its HDA button",
      simRig: "The simulator rig",
    },
  },
  cn: {
    aria: "两种测试环境：实车与模拟器",
    real: "实车",
    sim: "Unreal Engine 模拟器",
    rig: "模拟器装置",
    rigItems: ["对应半自动驾驶功能的按键", "纠偏模式下的回正力"],
    scope: [
      { n: "2", label: "种测试环境" },
      { n: "8", label: "项任务" },
      { n: "9", label: "个数据采集点" },
    ],
    alts: {
      carRear: "从后排记录的实车测试",
      carDriver: "参与者驾驶 IONIQ 6，观察员在旁",
      carTobii: "佩戴 Tobii 眼动眼镜的参与者",
      simSession: "在模拟器上测试的参与者",
      simWheel: "模拟器方向盘及其 HDA 按键",
      simRig: "模拟驾驶装置",
    },
  },
};

/* One photo cut from a board: the box holds the crop's proportion (or
   more, when a column stretches it), the board image is scaled to cover
   it and shifted so only the crop shows. All of it is CSS (container
   units on the box), so nothing is measured in script. */
function Crop({ k, alt, role }: { k: PhotoKey; alt: string; role: "large" | "small" }) {
  const c = CROPS[k];
  return (
    <div
      className={styles.crop}
      data-role={role}
      style={
        {
          "--ar": c.w / c.h,
          "--cw": c.w,
          "--ch": c.h,
          "--cx": c.x,
          "--cy": c.y,
          "--W": c.b.W,
          "--H": c.b.H,
          "--fx": c.fx,
          "--fy": c.fy,
        } as CSSProperties
      }
    >
      <div className={styles.board}>
        <Image src={c.b.src} alt={alt} fill sizes={c.sizes} className={styles.img} />
      </div>
    </div>
  );
}

export function HyundaiStudy() {
  const cn = useLocale() === "cn";
  const copy = cn ? COPY.cn : COPY.en;
  const w = styles.word;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <figure ref={ref} className={styles.root} data-in={inView} aria-label={copy.aria}>
      <div className={styles.columns}>
        {/* ── Real vehicle ── */}
        <div className={`${styles.env} ${styles.envReal}`} style={{ "--i": 0 } as CSSProperties}>
          <p className={`t-label ${styles.envHead}`}>
            <span>{hold(copy.real, w)}</span>
          </p>
          <Crop k="carRear" alt={copy.alts.carRear} role="large" />
          <div className={styles.pair}>
            <Crop k="carDriver" alt={copy.alts.carDriver} role="small" />
            <Crop k="carTobii" alt={copy.alts.carTobii} role="small" />
          </div>
        </div>

        {/* ── Simulator, its rig under it ── */}
        <div className={styles.simCol} style={{ "--i": 1 } as CSSProperties}>
          <div className={styles.env}>
            <p className={`t-label ${styles.envHead}`}>
              <span>{hold(copy.sim, w)}</span>
            </p>
            <Crop k="simSession" alt={copy.alts.simSession} role="large" />
            <div className={styles.pair}>
              <Crop k="simWheel" alt={copy.alts.simWheel} role="small" />
              <Crop k="simRig" alt={copy.alts.simRig} role="small" />
            </div>
          </div>
          <div className={`slab ${styles.rig}`}>
            <p className={`t-label ${styles.slabHead}`}>
              <span aria-hidden className={styles.kSq} />
              <span>{hold(copy.rig, w)}</span>
            </p>
            <ul className={styles.rigList}>
              {copy.rigItems.map((item) => (
                <li key={item} className={`t-small ${styles.rigItem}`}>
                  <span aria-hidden className={styles.sq} />
                  <span>{hold(item, w)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── The printed scope (board 03) ── */}
      <ul className={styles.scope}>
        {copy.scope.map((s, i) => (
          <li key={s.n} className={styles.stat} style={{ "--i": i } as CSSProperties}>
            <span className={`t-figure ${styles.statN}`}>{s.n}</span>
            <span className={`t-small ${styles.statLabel}`}>
              <span aria-hidden className={styles.statSq} data-focus={i === 0} />
              <span>{hold(s.label, w)}</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
