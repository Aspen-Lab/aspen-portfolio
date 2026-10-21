"use client";

import { memo, useContext, useRef, type CSSProperties, type Dispatch } from "react";
import { ART } from "../product";
import { CATEGORIES, MONTHS, OVER_MONTH, TRANSACTIONS, art, money, progress, type Action, type Goal, type Mark } from "./model";
import { ArtLoading } from "./load";
import { Bar, Rim } from "./Rim";
import { Caret, GridIcon, MoreIcon, SearchIcon, SlidersIcon } from "./icons";
import s from "./phone.module.css";

/* The three tabs of the hi-fi prototype, drawn as the app has them (hero
   video, boards 039, 046, 047, 049): Home with the daily challenge and the
   week's goals, Goal with the progress rims, Data with the month's
   spending. Product UI: the app's colours, type and sizes. */

type D = Dispatch<Action>;

/** Raster art at a fixed height, never dimmed; lazy unless the hero asks */
function Art({ k, h, className }: { k: keyof typeof ART; h: number; className?: string }) {
  const a = ART[k];
  const loading = useContext(ArtLoading);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- product art, already sized
    <img
      className={className}
      src={a.src}
      alt=""
      width={a.w}
      height={a.h}
      style={{ height: h, width: "auto" }}
      loading={loading}
      decoding="async"
    />
  );
}

export function Amount({ g, className }: { g: Goal; className?: string }) {
  return (
    <p className={className}>
      {money(g.saved)}
      {g.target !== null && <span className={s.of}>/{g.target}</span>}
    </p>
  );
}

export function Marks({ marks }: { marks: Mark[] }) {
  if (!marks.length) return null;
  return (
    <span className={s.marks} aria-hidden>
      {marks.map((m, i) => (
        <span key={i} className={s.mark} data-m={m}>
          <span className={s.markWarm} />
        </span>
      ))}
    </span>
  );
}

// ── Home ──

const HomeCard = memo(function HomeCard({ g, i, dispatch }: { g: Goal; i: number; dispatch: D }) {
  return (
    <li className={s.homeItem} style={{ "--i": i } as CSSProperties}>
      <article className={s.hcard}>
        <div className={s.cardTop}>
          <button type="button" className={s.chip} onClick={() => dispatch({ type: "openSave", id: g.id })}>
            Save Money<span className="sr-only"> to {g.name}</span>
          </button>
          <MoreIcon size={18} className={s.more} />
        </div>
        <div className={s.hcardBody}>
          <span className={s.hcardArt}>
            <Art k={g.art} h={40} />
          </span>
          <div className={s.hcardName}>
            <p className={s.name}>{g.name}</p>
            {g.due && <p className={s.due}>{g.due.home}</p>}
          </div>
          <div className={s.hcardAmt}>
            <Amount g={g} className={s.amt} />
            <Bar p={progress(g)} warm={g.attention} target={g.target !== null} />
          </div>
        </div>
      </article>
    </li>
  );
});

export const Home = memo(function Home({ goals, pulse, dispatch }: { goals: Goal[]; pulse: number; dispatch: D }) {
  return (
    <>
      <div className={s.hero}>
        <Art k="pan" h={106} className={s.pan} />
        <p className={s.heroTitle}>
          Today,
          <br />
          Cooking At Home
        </p>
        <p className={s.heroText}>Try cooking at home instead of eating out!</p>
        <button
          type="button"
          className={s.pill}
          data-pulse={pulse === 0 ? undefined : pulse % 2 ? "a" : "b"}
          onClick={() => dispatch({ type: "openSave", id: "black-friday" })}
        >
          Save Money
        </button>
      </div>
      <p className={s.h3}>Upcoming goals this week</p>
      <ul className={s.homeList}>
        {goals.map((g, i) => (
          <HomeCard key={g.id} g={g} i={i} dispatch={dispatch} />
        ))}
      </ul>
    </>
  );
});

// ── Goal ──

export function GoalCard({ g, dispatch, rim = 96 }: { g: Goal; dispatch?: D; rim?: number }) {
  return (
    <article className={s.gcard}>
      <div className={s.gcardHead}>
        <p className={s.gname}>{g.name}</p>
        <MoreIcon size={18} className={s.more} />
      </div>
      <div className={s.gcardBody}>
        <Rim
          p={progress(g)}
          warm={g.attention}
          target={g.target !== null}
          size={rim}
          art={art(g.art)}
          artSize={Math.round(rim * 0.62)}
        />
        <div className={s.gcardSide}>
          <Amount g={g} className={s.gamt} />
          <Marks marks={g.marks} />
          {g.due && <p className={s.gdue}>{g.due.goal}</p>}
          {dispatch && (
            <button type="button" className={s.chipLg} onClick={() => dispatch({ type: "openSave", id: g.id })}>
              Save Money<span className="sr-only"> to {g.name}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

const GoalItem = memo(function GoalItem({ g, dispatch }: { g: Goal; dispatch: D }) {
  return (
    <li className={s.goalItem}>
      <GoalCard g={g} dispatch={dispatch} />
    </li>
  );
});

export const GoalTab = memo(function GoalTab({
  list,
  query,
  filterOpen,
  dispatch,
}: {
  list: Goal[];
  query: string;
  filterOpen: boolean;
  dispatch: D;
}) {
  return (
    <>
      <div className={s.searchRow}>
        <div className={s.search}>
          <SearchIcon size={18} className={s.searchIcon} />
          <input
            className={s.searchInput}
            type="search"
            value={query}
            placeholder="Search"
            aria-label="Search goals"
            onChange={(e) => dispatch({ type: "query", value: e.target.value })}
          />
          <button
            type="button"
            className={s.iconBtn}
            aria-label="Filter"
            aria-expanded={filterOpen}
            onClick={() => dispatch({ type: "openFilter" })}
          >
            <SlidersIcon size={18} />
          </button>
        </div>
        <GridIcon size={22} className={s.gridIcon} />
      </div>
      <ul className={s.goalList}>
        {list.map((g) => (
          <GoalItem key={g.id} g={g} dispatch={dispatch} />
        ))}
      </ul>
    </>
  );
});

// ── Data ──

/** An arc of the categories ring, its round caps kept inside the traced span */
function arc(cx: number, cy: number, r: number, from: number, to: number, w: number) {
  const cap = (w / 2 / r) * (180 / Math.PI);
  const a = ((from + cap) * Math.PI) / 180;
  const b = ((to - cap) * Math.PI) / 180;
  const pt = (t: number) => `${(cx + r * Math.sin(t)).toFixed(2)} ${(cy - r * Math.cos(t)).toFixed(2)}`;
  return `M${pt(a)}A${r} ${r} 0 ${b - a > Math.PI ? 1 : 0} 1 ${pt(b)}`;
}

const RING = { size: 98, r: 39 };
const ARCS = CATEGORIES.map((c) => arc(RING.size / 2, RING.size / 2, RING.r, c.from, c.to, c.w));

export const DataTab = memo(function DataTab({ card, cat, dispatch }: { card: number; cat: number; dispatch: D }) {
  const strip = useRef<HTMLDivElement>(null);
  // The card a dot asked for, while the strip glides to it: the scroll
  // events on the way still read the old card, so they are ignored until
  // the strip arrives (or the reader takes over)
  const aim = useRef<number | null>(null);

  const stepOf = (el: HTMLDivElement) =>
    (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
  const onScroll = () => {
    const el = strip.current;
    if (!el || el.children.length < 2) return;
    const step = stepOf(el);
    if (aim.current !== null) {
      if (Math.abs(el.scrollLeft - aim.current * step) > 2) return;
      aim.current = null;
    }
    dispatch({ type: "card", card: Math.round(el.scrollLeft / step) });
  };
  const go = (i: number) => {
    const el = strip.current;
    if (!el || el.children.length < 2) return;
    const step = stepOf(el);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    aim.current = Math.abs(el.scrollLeft - i * step) > 2 ? i : null;
    el.scrollTo({ left: i * step, behavior: still ? "auto" : "smooth" });
    dispatch({ type: "card", card: i });
  };
  const release = () => {
    aim.current = null;
  };
  // However the glide ended, the strip now says where it is
  const onEnd = () => {
    aim.current = null;
    onScroll();
  };

  return (
    <>
      <div className={s.savedHead}>
        <p className={s.savedLabel}>You saved this month</p>
        <p className={s.savedBig}>$101</p>
        <p className={s.savedNote}>Good Job! That’s Incredible!</p>
      </div>

      <div
        ref={strip}
        className={s.strip}
        onScroll={onScroll}
        onScrollEnd={onEnd}
        onPointerDown={release}
        onWheel={release}
        data-strip=""
      >
        <section className={s.dcard} aria-label="Total Spending">
          <div className={s.dcardHead}>
            <div>
              <p className={s.dtitle}>Total Spending</p>
              <p className={s.under}>$101 under</p>
              <p className={s.budget}>out of $1,000 budgeted</p>
            </div>
            <span className={s.monthly}>
              Monthly <Caret size={14} />
            </span>
          </div>
          <div className={s.chart} aria-hidden>
            <span className={s.lineLabel}>1,000</span>
            <span className={s.line} />
            {MONTHS.map((m, i) => (
              <span key={m} className={s.col}>
                <span className={s.pillBar} data-over={i === OVER_MONTH} />
                <span className={s.month}>{m}</span>
              </span>
            ))}
          </div>
        </section>

        <section className={s.dcard} aria-label="Categories of Spends">
          <p className={s.dtitle}>Categories of Spends</p>
          <div className={s.cats}>
            <div className={s.ring} aria-hidden>
              <svg width={RING.size} height={RING.size}>
                {CATEGORIES.map((c, i) => (
                  <path key={c.name} d={ARCS[i]} strokeWidth={c.w} className={s.ringArc} />
                ))}
                {CATEGORIES.map((c, i) => (
                  <path
                    key={c.name}
                    d={ARCS[i]}
                    strokeWidth={c.w}
                    className={s.ringLit}
                    data-over={c.over}
                    data-on={i === cat}
                  />
                ))}
              </svg>
              <span className={s.ringText}>
                <span className={s.ringBig}>$899</span>
                <span className={s.ringSmall}>/$1000</span>
              </span>
            </div>
            <ul className={s.catList}>
              {CATEGORIES.map((c, i) => (
                <li key={c.name}>
                  <button
                    type="button"
                    className={s.cat}
                    aria-pressed={i === cat}
                    data-on={i === cat}
                    onClick={() => dispatch({ type: "cat", cat: i })}
                  >
                    <span className={s.catDot} data-over={c.over} />
                    <span className={s.catName}>{c.name}</span>
                    <span className={s.catValue}>{c.value}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className={s.dots}>
        {["Total Spending", "Categories of Spends"].map((label, i) => (
          <button
            key={label}
            type="button"
            className={s.dot}
            aria-label={label}
            aria-current={card === i}
            data-on={card === i}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <p className={s.h3}>Recent Transactions</p>
      <ul className={s.tx}>
        {TRANSACTIONS.map((t, i) => (
          <li key={i} className={s.txRow}>
            <span className={s.txDisc} aria-hidden>
              {t.name[0]}
            </span>
            <span className={s.txName}>
              <span className={s.txTitle}>{t.name}</span>
              <span className={s.txWhat}>{t.what}</span>
            </span>
            <span className={s.txAmt}>
              <span className={s.txValue} data-income={t.income}>
                {t.amount}
              </span>
              <span className={s.txDate}>{t.date}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
});
