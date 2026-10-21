"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type Dispatch, type KeyboardEvent } from "react";
import { NUTRA, NUTRA_BODY, NUTRA_UI, nutraFont } from "../product";
import { goalList, type Action, type State, type Tab } from "./model";
import { DataTab, GoalTab, Home } from "./screens";
import { CreateSheet, FilterSheet, SaveSheet } from "./sheets";
import { Battery, DataIcon, GoalIcon, HomeIcon, PlusIcon, SettingIcon, Signal, Wifi } from "./icons";
import s from "./phone.module.css";

/* The phone: a site-system bezel round the app's own screen. The app
   carries its own colours, type and radii (the product-render exemption);
   they are set once here as custom properties from product.ts. */

export const PHONE_VARS = {
  "--o": NUTRA.orange,
  "--g": NUTRA.green,
  "--bg": NUTRA.bg,
  "--sf": NUTRA.surface,
  "--g700": NUTRA.grey700,
  "--g500": NUTRA.grey500,
  "--g150": NUTRA.grey150,
  "--g100": NUTRA.grey100,
  "--g50": NUTRA.grey50,
  "--card": NUTRA_UI.card,
  "--chip": NUTRA_UI.chip,
  "--field": NUTRA_UI.field,
  "--track": NUTRA_UI.track,
  "--segOn": NUTRA_UI.segOn,
  "--btn": NUTRA_UI.button,
  "--nav": NUTRA_UI.nav,
  "--rim": NUTRA_UI.rimTrack,
  "--line": NUTRA_UI.line,
  "--body": NUTRA_BODY,
} as CSSProperties;

const TABS: { tab: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { tab: "home", label: "Home", Icon: HomeIcon },
  { tab: "goal", label: "Goal", Icon: GoalIcon },
  { tab: "data", label: "Data", Icon: DataIcon },
];

export function Phone({
  state,
  dispatch,
  label,
  entered,
}: {
  state: State;
  dispatch: Dispatch<Action>;
  label: string;
  /** the figure has come into view: the entrance plays */
  entered: boolean;
}) {
  const screen = useRef<HTMLDivElement>(null);
  const panels = useRef<Record<Tab, HTMLDivElement | null>>({ home: null, goal: null, data: null });
  const sheets = useRef<Record<string, HTMLDivElement | null>>({});
  const opener = useRef<HTMLElement | null>(null);

  const homeGoals = useMemo(
    () => state.home.map((id) => state.goals.find((g) => g.id === id)).filter((g) => g !== undefined),
    [state.home, state.goals],
  );
  const list = useMemo(
    () => goalList(state.goals, state.query, state.filter.sort),
    [state.goals, state.query, state.filter.sort],
  );
  const saveGoal = state.goals.find((g) => g.id === state.save.id) ?? state.goals[0];

  // "Daily check-in": Home scrolls to its top, so the pulse is in view
  useEffect(() => {
    if (!state.pulse) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panels.current.home?.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  }, [state.pulse]);

  // A new goal lands second on the Goal tab: bring the list to its top
  useEffect(() => {
    if (state.made) panels.current.goal?.scrollTo({ top: 0 });
  }, [state.made]);

  // Reset: every view back to its top, the carousel to its first card
  useEffect(() => {
    if (!state.epoch) return;
    for (const p of Object.values(panels.current)) p?.scrollTo({ top: 0 });
    screen.current?.querySelector<HTMLElement>("[data-strip]")?.scrollTo({ left: 0 });
  }, [state.epoch]);

  // Focus follows a sheet in and back out, when the reader is in the phone
  useEffect(() => {
    const root = screen.current;
    if (!root) return;
    const active = document.activeElement as HTMLElement | null;
    if (state.sheet) {
      const sheet = sheets.current[state.sheet];
      if (active && root.contains(active) && sheet && !sheet.contains(active)) {
        opener.current = active;
        sheet.focus({ preventScroll: true });
      }
    } else if (opener.current) {
      if (!active || active === document.body || root.contains(active)) opener.current.focus({ preventScroll: true });
      opener.current = null;
    }
  }, [state.sheet]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Escape" || !state.sheet) return;
    e.stopPropagation();
    if (state.sheet === "create" && state.create.calendar) dispatch({ type: "calendar", open: false });
    else dispatch({ type: "close" });
  };

  const blocked = state.sheet !== null;

  return (
    <div className={s.device} role="group" aria-label={label} data-in={entered}>
      <div
        ref={screen}
        className={`${s.screen} ${nutraFont.className}`}
        style={PHONE_VARS}
        lang="en"
        data-sheet={state.sheet ?? "none"}
        onKeyDown={onKey}
      >
        <div className={s.status} aria-hidden>
          <span className={s.time}>9:41</span>
          <span className={s.island} />
          <span className={s.sys}>
            <Signal />
            <Wifi />
            <Battery />
          </span>
        </div>

        <div className={s.views} inert={blocked}>
          <div
            ref={(el) => {
              panels.current.home = el;
            }}
            className={s.panel}
            data-on={state.tab === "home"}
            inert={state.tab !== "home"}
            aria-hidden={state.tab !== "home"}
          >
            <Home goals={homeGoals} pulse={state.pulse} dispatch={dispatch} />
          </div>
          <div
            ref={(el) => {
              panels.current.goal = el;
            }}
            className={s.panel}
            data-on={state.tab === "goal"}
            inert={state.tab !== "goal"}
            aria-hidden={state.tab !== "goal"}
          >
            <GoalTab list={list} query={state.query} filterOpen={state.sheet === "filter"} dispatch={dispatch} />
          </div>
          <div
            ref={(el) => {
              panels.current.data = el;
            }}
            className={s.panel}
            data-on={state.tab === "data"}
            inert={state.tab !== "data"}
            aria-hidden={state.tab !== "data"}
          >
            <DataTab card={state.card} cat={state.cat} dispatch={dispatch} />
          </div>

          <nav className={s.nav} aria-label="Tabs">
            {TABS.slice(0, 2).map(({ tab, label: name, Icon }) => (
              <button
                key={tab}
                type="button"
                className={s.navItem}
                aria-current={state.tab === tab ? "page" : undefined}
                data-on={state.tab === tab}
                onClick={() => dispatch({ type: "tab", tab })}
              >
                <span className={s.navIcon}>
                  <Icon size={22} data-k="off" />
                  <Icon size={22} filled data-k="on" />
                </span>
                <span className={s.navLabel}>{name}</span>
              </button>
            ))}
            <button type="button" className={s.plus} aria-label="Create a goal" onClick={() => dispatch({ type: "openCreate" })}>
              <PlusIcon size={24} strokeWidth={2.2} />
            </button>
            {TABS.slice(2).map(({ tab, label: name, Icon }) => (
              <button
                key={tab}
                type="button"
                className={s.navItem}
                aria-current={state.tab === tab ? "page" : undefined}
                data-on={state.tab === tab}
                onClick={() => dispatch({ type: "tab", tab })}
              >
                <span className={s.navIcon}>
                  <Icon size={22} data-k="off" />
                  <Icon size={22} filled data-k="on" />
                </span>
                <span className={s.navLabel}>{name}</span>
              </button>
            ))}
            {/* Setting is drawn, not wired: the prototype has no settings */}
            <span className={s.navItem} aria-hidden>
              <span className={s.navIcon}>
                <SettingIcon size={22} />
              </span>
              <span className={s.navLabel}>Setting</span>
            </span>
          </nav>
        </div>

        <button
          type="button"
          className={s.scrim}
          data-on={blocked}
          tabIndex={-1}
          aria-hidden
          onClick={() => dispatch({ type: "close" })}
        />

        <div className={s.filterClip} data-on={state.sheet === "filter"}>
          <div
            ref={(el) => {
              sheets.current.filter = el;
            }}
            className={s.topSheet}
            role="dialog"
            aria-label="Filter"
            tabIndex={-1}
            data-on={state.sheet === "filter"}
            inert={state.sheet !== "filter"}
          >
            <FilterSheet filter={state.filter} dispatch={dispatch} />
            <button type="button" className={s.grabberBtn} aria-label="Close filter" onClick={() => dispatch({ type: "close" })}>
              <span className={s.grabber} />
            </button>
          </div>
        </div>

        <div
          ref={(el) => {
            sheets.current.save = el;
          }}
          className={`${s.sheet} ${s.saveSheet}`}
          role="dialog"
          aria-label="Save Money"
          tabIndex={-1}
          data-on={state.sheet === "save"}
          inert={state.sheet !== "save"}
        >
          <button type="button" className={s.grabberBtn} aria-label="Close" onClick={() => dispatch({ type: "close" })}>
            <span className={s.grabber} />
          </button>
          <SaveSheet save={state.save} goal={saveGoal} dispatch={dispatch} />
        </div>

        <div
          ref={(el) => {
            sheets.current.create = el;
          }}
          className={`${s.sheet} ${s.createSheet}`}
          role="dialog"
          aria-label="Create a goal"
          tabIndex={-1}
          data-on={state.sheet === "create"}
          inert={state.sheet !== "create"}
        >
          <button type="button" className={s.grabberBtn} aria-label="Close" onClick={() => dispatch({ type: "close" })}>
            <span className={s.grabber} />
          </button>
          <CreateSheet c={state.create} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}
