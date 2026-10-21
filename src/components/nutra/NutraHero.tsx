"use client";

import { useEffect, useRef, type Dispatch, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { nutraFont } from "./product";
import { INITIAL, goalList, type Action, type Tab } from "./app/model";
import { PHONE_VARS } from "./app/Phone";
import { DataTab, GoalTab, Home } from "./app/screens";
import { ArtLoading } from "./app/load";
import { Battery, DataIcon, GoalIcon, HomeIcon, PlusIcon, SettingIcon, Signal, Wifi } from "./app/icons";
import s from "./app/phone.module.css";
import styles from "./NutraHero.module.css";

/* The case's hero: the app itself, three of its screens side by side as
   board 049 composes them (Home with the daily challenge, Goal with the
   progress rims, Data with the month's spending), drawn by the same code
   as the working prototype in "What shipped". A product render on the
   site's dark tile: inside each phone the app's own colours, type and
   radii; around them the hero frame's tile, edge and corner marks.

   It is a picture, not a control: one img role with the owner's line for
   the launch-page hero as its name, everything inside inert. The phones
   are drawn at 360 × 760 and scaled to the frame by a ResizeObserver,
   which writes --s on the stage (media fallbacks hold the first paint).
   No motion of its own: the page's entrance carries it. */

const LABEL = {
  en: "Hero composition for the launch page — Nut, dashboard, daily challenge, all visible in a single read.",
  cn: "发布页的主视觉构图：Nut、仪表盘和每日挑战，一眼就能看全。",
};

/* Three phones and two gaps, in the phones' own pixels */
const PHONE_W = 360;
const PHONE_H = 760;
const GAP = 56;
const ROW_W = PHONE_W * 3 + GAP * 2;

const still: Dispatch<Action> = () => {};
const GOALS = INITIAL.home.map((id) => INITIAL.goals.find((g) => g.id === id)).filter((g) => g !== undefined);
const LIST = goalList(INITIAL.goals, "", INITIAL.filter.sort);

const TABS: { tab: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { tab: "home", label: "Home", Icon: HomeIcon },
  { tab: "goal", label: "Goal", Icon: GoalIcon },
  { tab: "data", label: "Data", Icon: DataIcon },
];

/** The app's bottom bar as drawn, the given tab current */
function Nav({ tab }: { tab: Tab }) {
  const item = ({ tab: t, label, Icon }: (typeof TABS)[number]) => (
    <span key={t} className={s.navItem} data-on={t === tab}>
      <span className={s.navIcon}>
        <Icon size={22} data-k="off" />
        <Icon size={22} filled data-k="on" />
      </span>
      <span className={s.navLabel}>{label}</span>
    </span>
  );
  return (
    <span className={s.nav}>
      {TABS.slice(0, 2).map(item)}
      <span className={s.plus}>
        <PlusIcon size={24} strokeWidth={2.2} />
      </span>
      {TABS.slice(2).map(item)}
      <span className={s.navItem}>
        <span className={s.navIcon}>
          <SettingIcon size={22} />
        </span>
        <span className={s.navLabel}>Setting</span>
      </span>
    </span>
  );
}

function Still({ tab, children }: { tab: Tab; children: ReactNode }) {
  return (
    <div className={styles.fit}>
      <div className={s.device}>
        <div className={`${s.screen} ${nutraFont.className}`} style={PHONE_VARS} lang="en">
          <div className={s.status}>
            <span className={s.time}>9:41</span>
            <span className={s.island} />
            <span className={s.sys}>
              <Signal />
              <Wifi />
              <Battery />
            </span>
          </div>
          <div className={s.views}>
            <div className={`${s.panel} ${styles.panel}`} data-on="true">
              {children}
            </div>
            <Nav tab={tab} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NutraHero() {
  const cn = useLocale() === "cn";
  const stage = useRef<HTMLDivElement>(null);

  // The phones' scale: the stage's inner box over the row's drawn size
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / ROW_W, height / PHONE_H);
      if (scale > 0) el.style.setProperty("--s", scale.toFixed(4));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={styles.root} role="img" aria-label={cn ? LABEL.cn : LABEL.en}>
      <div ref={stage} className={styles.stage} inert>
        <ArtLoading.Provider value="eager">
          <div className={styles.row}>
            <Still tab="home">
              <Home goals={GOALS} pulse={0} dispatch={still} />
            </Still>
            <Still tab="goal">
              <GoalTab list={LIST} query="" filterOpen={false} dispatch={still} />
            </Still>
            <Still tab="data">
              <DataTab card={0} cat={0} dispatch={still} />
            </Still>
          </div>
        </ArtLoading.Provider>
      </div>
    </div>
  );
}
