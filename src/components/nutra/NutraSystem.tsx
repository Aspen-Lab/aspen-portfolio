"use client";

import {
  memo,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { Calendar, Check, ChevronLeft, ChevronRight, Lightbulb, Plus, Search, SlidersVertical, Star, TriangleAlert } from "lucide-react";
import { hold } from "@/lib/hold";
import { NUTRA, NUTRA_BODY, NUTRA_UI, nutraFont } from "./product";
import styles from "./NutraSystem.module.css";

/* Nutra's design system, live (s-10). Three numbered tabs over one sheet
   on two back planes; each tab is a split card, a render on the board's
   own #1E1E1E ground beside a slab that reads it out, told apart by tone,
   never by an outline. A chosen swatch or face is shown by a plane lifting
   (or the other face stepping back), not by a ring.

   01 Colour: the tokens laid out as board 043 lays them (Brand, Background,
   Grey; the board's Gradient swatch is left out). Labels are the board's,
   without "#". Pointing at a disc previews its readout (a data attribute
   on the panel, CSS swaps the mounted readouts, nothing re-renders);
   a click, a tap or the arrow keys commit it.
   02 Type: the two faces and the board's seven-row ladder, each specimen at
   0.75 of the board's relative size. Sizes are never printed: the board
   prints none. A face (card or slab row) lights the rows it sets.
   03 Components: the app's parts from boards 042 and 048 and the hero video
   as working specimens, each keeping its own small state.

   Everything inside a render is the product's (product.ts: colours, Red Hat
   Text, Helvetica Neue for the components, radii as drawn); everything
   around it is the site's dark system, with no site accent. Tabs cross-fade;
   the cells step in once, on view; reduced motion shows the last frame and
   keeps 160ms fades. Interactions move transform and opacity only. */

const PRODUCT_VARS = {
  "--n-orange": NUTRA.orange,
  "--n-green": NUTRA.green,
  "--n-bg": NUTRA.bg,
  "--n-surface": NUTRA.surface,
  "--n-700": NUTRA.grey700,
  "--n-500": NUTRA.grey500,
  "--n-150": NUTRA.grey150,
  "--n-100": NUTRA.grey100,
  "--n-50": NUTRA.grey50,
  "--n-25": NUTRA.grey25,
  "--n-card": NUTRA_UI.card,
  "--n-field": NUTRA_UI.field,
  "--n-track": NUTRA_UI.track,
  "--n-seg-on": NUTRA_UI.segOn,
  "--n-button": NUTRA_UI.button,
  "--n-nav": NUTRA_UI.nav,
  "--n-ground": NUTRA_UI.ground,
  "--n-off": "#838385", // 042: toggle off track and the sheet grabber
  "--n-edge": "#4C4C4B", // 042: field outline, radio and checkbox rings
  "--n-rht": nutraFont.style.fontFamily,
  "--n-hv": NUTRA_BODY,
} as CSSProperties;

const TABS = {
  en: ["Colour", "Type", "Components"],
  cn: ["色彩", "字体", "组件"],
};

// ── 01 Colour ────────────────────────────────────────────────────────────

type Group = "brand" | "bg" | "grey";
type Token = { key: string; group: Group; label: string; hex: string; note: [string, string] };

const GROUP_NAME: Record<Group, [string, string]> = {
  brand: ["Brand", "品牌色"],
  bg: ["Background", "背景色"],
  grey: ["Grey", "灰阶"],
};
// The board's own headings, inside the render
const BOARD_GROUP: Record<Group, string> = { brand: "Brand", bg: "Background", grey: "Grey" };

const GREY_NOTE: [string, string] = ["Values sampled from the design file.", "色值取自设计稿。"];

const TOKENS: Token[] = [
  {
    key: "orange",
    group: "brand",
    label: "FF901A",
    hex: NUTRA.orange,
    note: ["“Save Money”, the + button, a goal that needs attention", "“Save Money”、加号按钮、需要关注的目标"],
  },
  {
    key: "green",
    group: "brand",
    label: "3CC65B",
    hex: NUTRA.green,
    note: ["A goal on track, toggles on, income", "目标正常推进、开关打开、收入"],
  },
  { key: "bg", group: "bg", label: "0A0E11", hex: NUTRA.bg, note: ["App background", "App 背景"] },
  { key: "surface", group: "bg", label: "242728", hex: NUTRA.surface, note: ["Second background step", "第二级背景"] },
  { key: "g1000", group: "grey", label: "1000", hex: NUTRA.grey1000, note: GREY_NOTE },
  { key: "g700", group: "grey", label: "700", hex: NUTRA.grey700, note: GREY_NOTE },
  { key: "g500", group: "grey", label: "500", hex: NUTRA.grey500, note: GREY_NOTE },
  { key: "g150", group: "grey", label: "150", hex: NUTRA.grey150, note: GREY_NOTE },
  { key: "g100", group: "grey", label: "100", hex: NUTRA.grey100, note: GREY_NOTE },
  { key: "g50", group: "grey", label: "50", hex: NUTRA.grey50, note: GREY_NOTE },
  { key: "g25", group: "grey", label: "25", hex: NUTRA.grey25, note: GREY_NOTE },
];

/* The entrance sweeps down the board as laid out at desktop: each row of
   discs (and the heading level with it) steps in together. */
const ENTER: Record<string, number> = {
  orange: 1,
  green: 2,
  bg: 5,
  surface: 6,
  g1000: 1,
  g700: 2,
  g500: 3,
  g150: 4,
  g100: 5,
  g50: 6,
  g25: 7,
};
const ENTER_BG_HEAD = 4; // the Background heading sits level with Grey 150

const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

/** Moves a roving choice with the arrow keys, Home and End. */
function rove(e: KeyboardEvent, at: number, n: number, onMove: (next: number) => void, rowLen = 1) {
  const next =
    e.key === "ArrowRight" || (e.key === "ArrowDown" && rowLen === 1)
      ? at + 1
      : e.key === "ArrowLeft" || (e.key === "ArrowUp" && rowLen === 1)
        ? at - 1
        : e.key === "ArrowDown"
          ? at + rowLen
          : e.key === "ArrowUp"
            ? at - rowLen
            : e.key === "Home"
              ? 0
              : e.key === "End"
                ? n - 1
                : null;
  if (next === null) return;
  e.preventDefault();
  onMove(Math.min(n - 1, Math.max(0, next)));
}

const ColourPanel = memo(function ColourPanel({ cn }: { cn: boolean }) {
  const lang = cn ? 1 : 0;
  const [tok, setTok] = useState("orange");
  const panel = useRef<HTMLDivElement>(null);
  const discs = useRef<(HTMLButtonElement | null)[]>([]);
  const at = TOKENS.findIndex((t) => t.key === tok);

  // A mouse pointing at a disc previews its readout: one attribute on the
  // panel, the readouts are all mounted and CSS shows the one it names
  const peek = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const key = (e.target as HTMLElement).closest<HTMLElement>("[data-tok]")?.dataset.tok;
    const el = panel.current;
    if (!el) return;
    if (key) el.dataset.peek = key;
    else delete el.dataset.peek;
  };
  const unpeek = () => {
    if (panel.current) delete panel.current.dataset.peek;
  };
  const move = (i: number) => {
    setTok(TOKENS[i].key);
    discs.current[i]?.focus();
  };

  const groups: Group[] = ["brand", "bg", "grey"];
  return (
    <div ref={panel} className={`${styles.card} ${styles.split}`} data-colour="">
      <div className={`${styles.render} ${nutraFont.className}`}>
        <div className={`${styles.ground} ${styles.colourGround}`}>
          <div
            role="radiogroup"
            aria-label={cn ? "色彩 token" : "Colour tokens"}
            className={styles.swatches}
            onPointerOver={peek}
            onPointerLeave={unpeek}
          >
            {groups.map((g) => (
              <div key={g} className={styles.group} data-g={g}>
                <p
                  className={`${styles.gname} ${styles.step}`}
                  style={{ "--i": g === "bg" ? ENTER_BG_HEAD : 0 } as CSSProperties}
                >
                  {BOARD_GROUP[g]}
                </p>
                <div className={styles.discs}>
                  {TOKENS.map((t, i) =>
                    t.group !== g ? null : (
                      <button
                        key={t.key}
                        ref={(el) => {
                          discs.current[i] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={t.key === tok}
                        aria-label={`${GROUP_NAME[g][lang]} ${t.label}`}
                        tabIndex={t.key === tok ? 0 : -1}
                        data-tok={t.key}
                        className={`${styles.disc} ${styles.step}`}
                        style={{ "--c": t.hex, "--i": ENTER[t.key] } as CSSProperties}
                        onClick={() => setTok(t.key)}
                        onFocus={() => setTok(t.key)}
                        onKeyDown={(e) => rove(e, at, TOKENS.length, move)}
                      >
                        <span aria-hidden className={styles.dot} />
                        <span aria-hidden className={styles.dlab}>
                          {t.label}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`slab ${styles.slab}`}>
        <p className={`t-label ${styles.kicker}`}>
          <span aria-hidden className={styles.kmark} />
          {cn ? "色彩 token" : "Colour tokens"}
        </p>
        <div className={styles.reads}>
          {TOKENS.map((t) => (
            <div key={t.key} className={styles.read} data-read={t.key} data-on={t.key === tok} aria-hidden={t.key !== tok}>
              <p className={`t-subhead ${styles.readName}`}>
                {GROUP_NAME[t.group][lang]} {t.label}
              </p>
              <p className={`t-label ${styles.readHex}`} data-code="">
                {t.hex.toUpperCase()}
                <span aria-hidden className={styles.sep}>
                  ·
                </span>
                RGB {rgb(t.hex)}
              </p>
              <p className={`t-small ${styles.readNote}`}>{cn ? hold(t.note[1], styles.word) : t.note[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ── 02 Type ──────────────────────────────────────────────────────────────

type Face = "rht" | "hv";
const LADDER: { name: string; face: Face; cls: string; text: 0 | 1 }[] = [
  { name: "Heading 1", face: "rht", cls: styles.h1, text: 0 },
  { name: "Heading 2", face: "rht", cls: styles.h2, text: 0 },
  { name: "Heading 3", face: "rht", cls: styles.h3, text: 0 },
  { name: "Heading 4", face: "hv", cls: styles.h4, text: 1 },
  { name: "Body 1", face: "hv", cls: styles.b1, text: 1 },
  { name: "Body 2", face: "hv", cls: styles.b2, text: 1 },
  { name: "Annotation", face: "hv", cls: styles.ann, text: 1 },
];
const SPECIMEN = [
  "Upcoming goals this week",
  "Today, try cooking at home instead of eating out! Save the money put it toward this goal",
];
const FACES: { key: Face; name: string; rows: string }[] = [
  { key: "rht", name: "Red Hat Text", rows: "Heading 1 · Heading 2 · Heading 3" },
  { key: "hv", name: "Helvetica Neue", rows: "Heading 4 · Body 1 · Body 2 · Annotation" },
];

const TypePanel = memo(function TypePanel({ cn }: { cn: boolean }) {
  const [face, setFace] = useState<Face | null>(null);
  const toggle = (f: Face) => setFace((was) => (was === f ? null : f));
  return (
    <div className={`${styles.card} ${styles.split}`} data-type="" data-face={face ?? undefined}>
      <div className={`${styles.render} ${nutraFont.className}`}>
        <div className={`${styles.ground} ${styles.typeGround}`}>
          <div className={styles.faces}>
            {FACES.map((f, i) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={face === f.key}
                data-face-btn={f.key}
                className={`${styles.faceCard} ${styles.step}`}
                style={{ "--i": i } as CSSProperties}
                onClick={() => toggle(f.key)}
              >
                <span className={styles.aa} data-f={f.key}>
                  Aa
                </span>
                <span className={styles.faceName} data-f={f.key}>
                  {f.name}
                </span>
              </button>
            ))}
          </div>
          <div className={styles.ladder}>
            {LADDER.map((row, i) => (
              <div key={row.name} className={`${styles.lrow} ${styles.step}`} data-row-face={row.face} style={{ "--i": i + 2 } as CSSProperties}>
                <span className={`t-label ${styles.lname}`} data-code="">
                  {row.name}
                </span>
                <span className={`${styles.spec} ${row.cls}`}>{SPECIMEN[row.text]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`slab ${styles.slab}`}>
        <p className={`t-label ${styles.kicker}`}>
          <span aria-hidden className={styles.kmark} />
          {cn ? "两款字体" : "Two typefaces"}
        </p>
        <div className={styles.slabFoot}>
          <ul className={styles.faceRows}>
            {FACES.map((f) => (
              <li key={f.key}>
                <button
                  type="button"
                  aria-pressed={face === f.key}
                  data-face-btn={f.key}
                  className={styles.faceRow}
                  onClick={() => toggle(f.key)}
                >
                  <span className={`t-subhead ${styles.faceRowName}`}>{f.name}</span>
                  <span className={`t-small ${styles.faceRowRows}`}>{f.rows}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

// ── 03 Components ────────────────────────────────────────────────────────

const STEPS: [string, string][] = [
  ["Goal Name", "NBA Ticket"],
  ["Total Amount", "$60"],
  ["Deadline", "1 Nov 2025"],
  ["Periodic Amount", ""],
];

function Stepper() {
  const [cur, setCur] = useState(2);
  return (
    <div className={styles.stepper} style={{ "--cur": cur } as CSSProperties}>
      <span aria-hidden className={styles.stepPill} />
      <span aria-hidden className={styles.stepLine} />
      <ol className={styles.stepList} aria-label="Goal setup">
      {STEPS.map(([name, value], i) => {
        const state = i < cur ? "done" : i === cur ? "now" : "next";
        return (
          <li key={name}>
            <button
              type="button"
              className={styles.stepRow}
              data-state={state}
              aria-current={i === cur ? "step" : undefined}
              onClick={() => setCur(i)}
            >
              <span aria-hidden className={styles.stepIcon}>
                <span className={styles.stepRing} />
                <span className={styles.stepDone}>
                  <Check size={13} strokeWidth={2.6} />
                </span>
                <span className={styles.stepNow}>
                  <Star size={11} strokeWidth={0} fill="currentColor" />
                </span>
              </span>
              <span className={styles.stepName}>{name}</span>
              {value && <span className={styles.stepValue}>{value}</span>}
            </button>
          </li>
        );
      })}
      </ol>
    </div>
  );
}

function Inputs() {
  return (
    <div className={styles.inputs}>
      <div className={styles.field}>
        <Search aria-hidden size={18} strokeWidth={1.7} className={styles.fieldIcon} />
        <span className={styles.ph} data-tone="ink">
          Search
        </span>
        <SlidersVertical aria-hidden size={17} strokeWidth={1.7} className={styles.fieldIcon} />
      </div>
      <div className={styles.field}>
        <span aria-hidden className={styles.dollar}>
          $
        </span>
        <span className={styles.ph}>Please enter the goal name</span>
        <span className={styles.unit}>Days</span>
        <Calendar aria-hidden size={17} strokeWidth={1.8} className={styles.fieldIcon} />
      </div>
    </div>
  );
}

function Segmented() {
  const [on, setOn] = useState(0);
  const opts = ["Total Amount", "I don’t have one"];
  return (
    <div className={styles.seg} role="radiogroup" aria-label="Total Amount" style={{ "--seg": on } as CSSProperties}>
      <span aria-hidden className={styles.segThumb} />
      {opts.map((o, i) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={on === i}
          tabIndex={on === i ? 0 : -1}
          className={styles.segOpt}
          onClick={() => setOn(i)}
          onKeyDown={(e) => rove(e, on, 2, setOn)}
        >
          <span className={styles.segOff}>{o}</span>
          <span aria-hidden className={styles.segOnText}>
            {o}
          </span>
        </button>
      ))}
    </div>
  );
}

function Selection() {
  const [radio, setRadio] = useState(1);
  const [checks, setChecks] = useState([false, true]);
  const [toggles, setToggles] = useState([true, false]);
  return (
    <div className={styles.selection}>
      <div className={styles.selRow} role="radiogroup" aria-label="Radio">
        {[0, 1].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={radio === i}
            aria-label={`Radio ${i + 1}`}
            tabIndex={radio === i ? 0 : -1}
            className={styles.radio}
            onClick={() => setRadio(i)}
            onKeyDown={(e) => rove(e, radio, 2, setRadio)}
          >
            <span aria-hidden className={styles.radioDot} />
          </button>
        ))}
        {[0, 1].map((i) => (
          <button
            key={i}
            type="button"
            role="checkbox"
            aria-checked={checks[i]}
            aria-label={`Checkbox ${i + 1}`}
            className={styles.check}
            onClick={() => setChecks((c) => c.map((v, k) => (k === i ? !v : v)))}
          >
            <span aria-hidden className={styles.checkFill}>
              <Check size={14} strokeWidth={2.2} />
            </span>
          </button>
        ))}
      </div>
      <div className={styles.toggles}>
        {[0, 1].map((i) => (
          <button
            key={i}
            type="button"
            role="switch"
            aria-checked={toggles[i]}
            aria-label={`Toggle ${i + 1}`}
            className={styles.toggle}
            onClick={() => setToggles((c) => c.map((v, k) => (k === i ? !v : v)))}
          >
            <span aria-hidden className={styles.toggleOn} />
            <span aria-hidden className={styles.knob} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Chips() {
  const [eye, setEye] = useState([true, false]);
  return (
    <div className={styles.chips}>
      <div className={styles.eyeRow}>
        {[0, 1].map((i) => (
          <button
            key={i}
            type="button"
            aria-pressed={eye[i]}
            className={styles.eye}
            onClick={() => setEye((c) => c.map((v, k) => (k === i ? !v : v)))}
          >
            <span aria-hidden className={styles.eyeFill} />
            <span className={styles.eyeText}>Eye wear</span>
            <span aria-hidden className={styles.eyeBold}>
              Eye wear
            </span>
          </button>
        ))}
      </div>
      <div className={styles.saves}>
        {(["l", "m", "s"] as const).map((s) => (
          <button key={s} type="button" className={styles.save} data-size={s}>
            Save Money
          </button>
        ))}
      </div>
    </div>
  );
}

function Tips() {
  return (
    <div className={styles.tips}>
      <div className={styles.tip}>
        <span aria-hidden className={styles.tipIcon} data-kind="bulb">
          <Lightbulb size={15} strokeWidth={1.8} />
        </span>
        <p className={styles.tipBubble}>
          Based on your spending habits, you can set the total amount to <b>$100</b> for a coffee machine
        </p>
      </div>
      <div className={styles.tip}>
        <span aria-hidden className={styles.tipIcon} data-kind="warn">
          <TriangleAlert size={14} strokeWidth={1.9} />
        </span>
        <p className={styles.tipBubble}>It might feel a bit pushy; try setting a slightly lower amount instead~</p>
      </div>
    </div>
  );
}

/* The nav's four icons, drawn as on board 042: outline at rest, filled
   when the tab is active (the two layers cross-fade). */
function NavIcon({ kind, filled }: { kind: string; filled: boolean }) {
  const p = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: filled ? 1.2 : 1.5,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  if (kind === "home")
    return (
      <svg {...p}>
        <path d="M3.5 10.6 12 3.8l8.5 6.8v9.1a.8.8 0 0 1-.8.8h-4.9v-6.1H9.2v6.1H4.3a.8.8 0 0 1-.8-.8z" />
      </svg>
    );
  if (kind === "goal")
    return (
      <svg {...p}>
        <path d="M5 21V4.2c2.6-1.3 4.8-.9 7 .2s4.4 1.5 7 .2v9.6c-2.6 1.3-4.8.9-7-.2s-4.4-1.5-7-.2" fillRule="evenodd" />
      </svg>
    );
  if (kind === "data")
    return (
      <svg {...p}>
        <rect x="3.8" y="12.5" width="4.2" height="8" rx="1.1" />
        <rect x="9.9" y="8" width="4.2" height="12.5" rx="1.1" />
        <rect x="16" y="3.5" width="4.2" height="17" rx="1.1" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" fill={filled ? "var(--n-nav)" : "none"} />
    </svg>
  );
}

const NAV = [
  { key: "home", label: "Home" },
  { key: "goal", label: "Goal" },
  { key: "plus", label: "+" },
  { key: "data", label: "Data" },
  { key: "setting", label: "Setting" },
];

function NavBar() {
  const [on, setOn] = useState("home");
  return (
    <nav className={styles.nav} aria-label="Nutra">
      {NAV.map((n) =>
        n.key === "plus" ? (
          <button key={n.key} type="button" className={styles.fab} aria-label="Add">
            <Plus size={20} strokeWidth={2} />
          </button>
        ) : (
          <button
            key={n.key}
            type="button"
            className={styles.navItem}
            aria-current={on === n.key ? "page" : undefined}
            onClick={() => setOn(n.key)}
          >
            <span aria-hidden className={styles.navIcon}>
              <span className={styles.navOutline}>
                <NavIcon kind={n.key} filled={false} />
              </span>
              <span className={styles.navFilled}>
                <NavIcon kind={n.key} filled />
              </span>
            </span>
            <span className={styles.navLabel}>{n.label}</span>
          </button>
        ),
      )}
    </nav>
  );
}

function Transaction() {
  return (
    <div className={styles.tx}>
      <span aria-hidden className={styles.txDisc} />
      <span className={styles.txMain}>
        <span className={styles.txName}>BoA</span>
        <span className={styles.txSub}>Monthly Salary</span>
      </span>
      <span className={styles.txSide}>
        <span className={styles.txAmount}>+ $15,00</span>
        <span className={styles.txSub}>18 Nov 2024</span>
      </span>
    </div>
  );
}

function SheetHeader() {
  return (
    <div className={styles.sheetHead}>
      <button type="button" className={styles.sheetCancel}>
        Cancel
      </button>
      <span aria-hidden className={styles.grabber} />
      <button type="button" className={styles.sheetSave}>
        Save
      </button>
    </div>
  );
}

function RadioList({ items, start, label }: { items: string[]; start: number; label: string }) {
  const [on, setOn] = useState(start);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => {
    setOn(i);
    refs.current[i]?.focus();
  };
  return (
    <div className={styles.list} role="radiogroup" aria-label={label}>
      {items.map((it, i) => (
        <button
          key={it}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={on === i}
          tabIndex={on === i ? 0 : -1}
          className={styles.listRow}
          onClick={() => setOn(i)}
          onKeyDown={(e) => rove(e, on, items.length, move)}
        >
          <span aria-hidden className={styles.radio} data-static="">
            <span className={styles.radioDot} />
          </span>
          <span className={styles.listText}>{it}</span>
        </button>
      ))}
    </div>
  );
}

const SORTS = [
  "Sort by Duration & Deadline",
  "Sort by next save date",
  "Sort by target total amount (low to high)",
  "Sort by target total amount (high to low)",
];
const STATUSES = ["Show all", "In progress", "Complete", "Won’t do"];
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LEAD = [27, 28, 29, 30]; // the month before, as the board shows it

/* Tapping a day moves an outline to it; Done slides the selected disc
   there, as the app's picker commits a deadline. */
function CalendarSpec() {
  const [day, setDay] = useState(1);
  const [set, setSet] = useState(1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const at = (d: number) => {
    const c = LEAD.length + d - 1;
    return { "--col": c % 7, "--row": Math.floor(c / 7) } as CSSProperties;
  };
  const move = (i: number) => {
    setDay(i + 1);
    refs.current[i]?.focus();
  };
  return (
    <div className={styles.cal}>
      <div className={styles.calHead}>
        <ChevronLeft aria-hidden size={20} strokeWidth={1.8} />
        <span className={styles.calMonth}>Dec</span>
        <ChevronRight aria-hidden size={20} strokeWidth={1.8} />
      </div>
      <div className={styles.calWeek} aria-hidden>
        {WEEK.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className={styles.calGrid} role="radiogroup" aria-label="Dec">
        <span aria-hidden className={styles.calSel} style={at(set)} />
        <span aria-hidden className={styles.calPick} data-on={day !== set} style={at(day)} />
        {LEAD.map((d) => (
          <span key={`p${d}`} aria-hidden className={styles.calDay}>
            {d}
          </span>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
          <button
            key={d}
            ref={(el) => {
              refs.current[d - 1] = el;
            }}
            type="button"
            role="radio"
            aria-checked={d === day}
            aria-label={`${d} Dec`}
            tabIndex={d === day ? 0 : -1}
            className={styles.calDay}
            onClick={() => setDay(d)}
            onKeyDown={(e) => rove(e, day - 1, 31, move, 7)}
          >
            {d}
          </button>
        ))}
      </div>
      <button type="button" className={styles.done} onClick={() => setSet(day)}>
        Done
      </button>
    </div>
  );
}

type Cell = { key: string; cap: [string, string]; node: ReactNode };

const ComponentsPanel = memo(function ComponentsPanel({ cn }: { cn: boolean }) {
  const lang = cn ? 1 : 0;
  // Three columns at 1024px and up; the order reads down each column
  const cols: Cell[][] = [
    [
      { key: "stepper", cap: ["Stepper", "步骤条"], node: <Stepper /> },
      { key: "inputs", cap: ["Inputs", "输入框"], node: <Inputs /> },
      { key: "seg", cap: ["Segmented control", "分段控件"], node: <Segmented /> },
      { key: "sel", cap: ["Selection", "选择控件"], node: <Selection /> },
      { key: "sheet", cap: ["Sheet header", "面板标题栏"], node: <SheetHeader /> },
    ],
    [
      { key: "tips", cap: ["Tips", "提示"], node: <Tips /> },
      { key: "chips", cap: ["Chips", "标签"], node: <Chips /> },
      { key: "nav", cap: ["Navigation", "导航栏"], node: <NavBar /> },
      { key: "tx", cap: ["Transaction", "交易记录"], node: <Transaction /> },
    ],
    [
      { key: "sort", cap: ["Sort", "排序"], node: <RadioList items={SORTS} start={2} label="Sort" /> },
      { key: "status", cap: ["Status", "状态"], node: <RadioList items={STATUSES} start={0} label="Status" /> },
      { key: "cal", cap: ["Calendar", "日历"], node: <CalendarSpec /> },
    ],
  ];
  return (
    <div className={`${styles.card} ${styles.stack}`} data-components="">
      <div className={`${styles.render} ${nutraFont.className}`}>
        <div className={styles.masonry}>
          {cols.map((col, c) => (
            <div key={c} className={styles.col}>
              {col.map((cell, r) => (
                // a diagonal sweep: down each column, one step later per column
                <div key={cell.key} className={`${styles.cell} ${styles.step}`} style={{ "--i": r + c } as CSSProperties}>
                  <div className={styles.plate} data-cell={cell.key}>
                    {cell.node}
                  </div>
                  <p className={`t-label ${styles.cap}`}>{cell.cap[lang]}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={`slab ${styles.slab} ${styles.slabStrip}`}>
        <p className={`t-label ${styles.kicker}`}>
          <span aria-hidden className={styles.kmark} />
          {cn ? "颜色的用法" : "Colour in use"}
        </p>
        <ul className={styles.uses}>
          {TOKENS.slice(0, 2).map((t) => (
            <li key={t.key} className={styles.use}>
              <span className={`t-label ${styles.useHex}`} data-code="">
                {t.label}
              </span>
              <span className={`t-small ${styles.useNote}`}>{cn ? hold(t.note[1], styles.word) : t.note[0]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

// ── The figure ───────────────────────────────────────────────────────────

export function NutraSystem() {
  const cn = useLocale() === "cn";
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const root = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const seen = useInView(root, { once: true, amount: 0.2 });
  const [tab, setTab] = useState(0);
  const labels = cn ? TABS.cn : TABS.en;

  const choose = (i: number, focus = false) => {
    setTab(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  const panels = [<ColourPanel key="c" cn={cn} />, <TypePanel key="t" cn={cn} />, <ComponentsPanel key="k" cn={cn} />];

  return (
    <figure
      ref={root}
      className={styles.root}
      data-tab={tab}
      data-in={seen}
      data-cn={cn}
      style={PRODUCT_VARS}
      aria-label={cn ? "Nutra 设计系统：色彩、字体与组件" : "Nutra’s design system: colour, type and components"}
    >
      <div className={styles.tabs} role="tablist" aria-label={cn ? "设计系统" : "Design system"}>
        {labels.map((label, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={tab === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={tab === i ? 0 : -1}
            className={styles.tab}
            onClick={() => choose(i)}
            onKeyDown={(e) => rove(e, tab, labels.length, (k) => choose(k, true))}
          >
            <span className={`t-label ${styles.tabNum}`} data-code="">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={`t-small ${styles.tabLabel}`}>{label}</span>
            <span aria-hidden className={styles.fill} />
          </button>
        ))}
      </div>

      <div className="paper-stack">
        <div className={`paper ${styles.stage}`}>
          {panels.map((p, i) => (
            <div
              key={i}
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              className={styles.panel}
              data-k={i}
              inert={tab !== i}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
