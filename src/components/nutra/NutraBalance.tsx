"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { ART, NUTRA, NUTRA_BODY, nutraFont } from "./product";
import { roveFocus, roveKeys, roveSync } from "./rove";
import styles from "./NutraBalance.module.css";

/* Board 039, "Why?", as a scale: two poles, Seriousness and Fun, joined
   by a beam whose knob sits at Balance. Each pole hangs its two traits
   on a rail, and each trait carries a specimen of the product itself:
   the two background tokens, the two typefaces, the two brand colours,
   the 3D acorn. The knob (a solid accent square) is the block's one
   focus mark; it slides in from the Seriousness end to the centre once,
   when the sheet comes into view. Poles and traits are raised planes,
   never outlined.

   Pointing at, tapping or focusing a trait writes data-trait / data-pole
   on the sheet; CSS fades its rail and its arrow to ink, and the trait
   and its pole keep their planes while the others let go of theirs.
   A tap keeps its trait lit until another is tapped. The four traits are
   one listbox with one tab stop (arrow keys move; the lit trait is the
   selected option). Wide,
   the poles stand side by side as the board draws them; on a phone the
   Fun rail runs down the right edge past the Seriousness group. */

type Pole = "serious" | "fun";
type Trait = { id: string; pole: Pole; en: string; cn: string };

const TRAITS: Trait[] = [
  { id: "dark", pole: "serious", en: "Dark Mode", cn: "深色模式" },
  { id: "type", pole: "serious", en: "Sharp Fonts", cn: "利落的字体" },
  { id: "color", pole: "fun", en: "High Saturation Color", cn: "高饱和色彩" },
  { id: "art", pole: "fun", en: "Cartoonish 3D Illustration", cn: "卡通 3D 插画" },
];

/* Board 043 prints the tokens without a "#" */
function Swatches({ items, round, well }: { items: string[]; round?: boolean; well?: boolean }) {
  return (
    <span className={styles.swatches} data-well={well || undefined}>
      {items.map((hex) => (
        <span key={hex} className={styles.swatch}>
          <i style={{ background: `#${hex}` }} data-round={round} />
          <span className={`t-label ${styles.hex}`} data-code>
            {hex}
          </span>
        </span>
      ))}
    </span>
  );
}

function Specimen({ id }: { id: string }) {
  if (id === "dark") return <Swatches items={[NUTRA.bg.slice(1), NUTRA.surface.slice(1)]} well />;
  if (id === "color") return <Swatches items={[NUTRA.orange.slice(1), NUTRA.green.slice(1)]} round />;
  if (id === "type")
    return (
      <span className={styles.faces}>
        <span className={`${styles.face} ${nutraFont.className}`}>
          <span className={styles.aa}>Aa</span>
          <span className={styles.faceName}>Red Hat Text</span>
        </span>
        <span className={styles.face} style={{ fontFamily: NUTRA_BODY }}>
          <span className={styles.aa}>Aa</span>
          <span className={styles.faceName}>Helvetica Neue</span>
        </span>
      </span>
    );
  return (
    <Image
      src={ART.acorn.src}
      alt=""
      aria-hidden
      width={ART.acorn.w}
      height={ART.acorn.h}
      draggable={false}
      className={styles.acorn}
    />
  );
}

/* A rail's arrow: a short stub and a solid head, drawn grey and again in
   ink above it (the ink copy fades on) */
const Stub = () => (
  <span aria-hidden className={styles.stub}>
    {["g", "k"].map((k) => (
      <svg key={k} viewBox="0 0 14 10" data-k={k}>
        <path d="M0 5h8" stroke="currentColor" strokeWidth="1" />
        <path d="M7 1.5l6 3.5-6 3.5z" fill="currentColor" />
      </svg>
    ))}
  </span>
);

export function NutraBalance() {
  const cn = useLocale() === "cn";
  const sheet = useRef<HTMLDivElement>(null);
  const inView = useInView(sheet, { amount: 0.45, once: true });

  /* The highlight is two data attributes on the sheet: no re-render */
  const mark = useCallback((t: Trait | null) => {
    const el = sheet.current;
    if (!el) return;
    if (t) {
      el.dataset.trait = t.id;
      el.dataset.pole = t.pole;
    } else {
      delete el.dataset.trait;
      delete el.dataset.pole;
    }
    roveSync(el, t ? t.id : null);
  }, []);

  const say = (en: string, zh: string) => (cn ? hold(zh, styles.word) : en);

  const group = (pole: Pole, label: string) => (
    <ul className={styles.group} data-p={pole} role="group" aria-label={label}>
      {TRAITS.filter((t) => t.pole === pole).map((t) => (
        <li
          key={t.id}
          role="option"
          aria-selected={false}
          data-rove={t.id}
          tabIndex={t.id === TRAITS[0].id ? 0 : -1}
          className={styles.trait}
          data-t={t.id}
          onPointerEnter={(e) => e.pointerType === "mouse" && mark(t)}
          onPointerLeave={(e) => e.pointerType === "mouse" && mark(null)}
          onPointerDown={(e) => e.pointerType !== "mouse" && mark(t)}
          onFocus={() => mark(t)}
          onBlur={() => mark(null)}
        >
          <span aria-hidden className={styles.seg} />
          <Stub />
          <span className={`t-small ${styles.name}`}>{say(t.en, t.cn)}</span>
          <Specimen id={t.id} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="paper-stack">
      <div ref={sheet} className={`paper ${styles.sheet}`} data-in={inView}>
        <p className={`t-label ${styles.title}`}>{say("Second pass · why dark", "第二版 · 为什么用深色")}</p>

        <div className={styles.scale}>
          <span className={`t-small ${styles.pole}`} data-p="serious">
            {say("Seriousness", "严肃")}
          </span>
          <span className={styles.beam}>
            <span className={`t-label ${styles.balance}`}>{say("Balance", "平衡")}</span>
            <span aria-hidden className={styles.run}>
              <span className={styles.knob} />
            </span>
          </span>
          <span className={`t-small ${styles.pole}`} data-p="fun">
            {say("Fun", "趣味")}
          </span>
        </div>

        <div
          className={styles.groups}
          role="listbox"
          aria-label={cn ? "四个特质" : "Four traits"}
          onKeyDown={roveKeys}
          onFocus={roveFocus}
        >
          {group("serious", cn ? "严肃" : "Seriousness")}
          {group("fun", cn ? "趣味" : "Fun")}
        </div>
      </div>
    </div>
  );
}
