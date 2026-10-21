"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { NUTRA_BODY, NUTRA_UI, nutraFont } from "./product";
import { NutraBalance } from "./NutraBalance";
import { NutraRim } from "./NutraRim";
import styles from "./NutraDirection.module.css";

/* Visual direction, in three blocks 56px apart.
   A, the first pass: the light NutSave render (board 038, kept as the
   picture it is) on a tile, beside a slab that names what it was made
   of: the two colours and the two typefaces board 037 prints.
   B, the second pass: why the app went dark (NutraBalance, board 039).
   C, the goal card: its five versions and the colour of its rim
   (NutraRim, boards 047 and 045).
   A is still; B and C carry the motion and the one accent mark each. */

/* Board 037's two colours, names and hexes as printed */
const FIRST = [
  { name: "Enchanted Mint Green", hex: NUTRA_UI.mint },
  { name: "Mystic Twilight Purple", hex: NUTRA_UI.purple },
];

export function NutraDirection() {
  const cn = useLocale() === "cn";
  const say = (en: string, zh: string) => (cn ? hold(zh, styles.word) : en);

  return (
    <figure className={styles.direction}>
      <div className={styles.first}>
        <div className={styles.media}>
          <Image
            src="/work/nutra/images/038_U1IP9FWWdtoZ1YniN5wmod3Wk.png"
            alt={cn ? "NutSave 浅色第一版，三部手机效果图" : "NutSave, the light first pass, on three phones"}
            fill
            sizes="(max-width: 1023px) 100vw, 720px"
            className={styles.mediaImg}
          />
          <span aria-hidden className="reg-mark tl" />
          <span aria-hidden className="reg-mark tr" />
          <span aria-hidden className="reg-mark br" />
          <span aria-hidden className="reg-mark bl" />
        </div>
        <div className={`slab ${styles.note}`}>
          <p className={`t-label ${styles.label}`}>{say("First pass · NutSave", "第一版 · NutSave")}</p>
          <ul className={styles.swatches}>
            {FIRST.map((s) => (
              <li key={s.hex} className={styles.swatch}>
                <i aria-hidden style={{ background: s.hex }} />
                <span className={styles.swatchText}>
                  <span className="t-small">{s.name}</span>
                  <span className="t-label" data-code>
                    {s.hex}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className={`${styles.typeLine} ${nutraFont.className}`}>
            <span>Red Hat Text</span>
            <span aria-hidden className={styles.dot}>
              ·
            </span>
            <span style={{ fontFamily: NUTRA_BODY }}>Helvetica Neue</span>
          </p>
          <p className={`t-small ${styles.caption}`}>
            {say("The first branded pass: light, mint and purple.", "第一轮品牌化：浅色，薄荷绿配紫色。")}
          </p>
        </div>
      </div>

      <NutraBalance />

      <NutraRim />
    </figure>
  );
}
