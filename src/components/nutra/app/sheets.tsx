"use client";

import { memo, useContext, useId, type CSSProperties, type Dispatch, type ReactNode } from "react";
import { ART } from "../product";
import {
  INTERVALS,
  LEAD_DAYS,
  STEPS,
  UNITS,
  amount,
  art,
  draft,
  progress,
  stepValue,
  type Action,
  type Create,
  type Filter,
  type Goal,
  type Save,
} from "./model";
import { ArtLoading } from "./load";
import { Rim } from "./Rim";
import { Amount, GoalCard, Marks } from "./screens";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreIcon,
  NoneIcon,
  StepMark,
  SwapIcon,
  TipMark,
} from "./icons";
import s from "./phone.module.css";

/* The prototype's three sheets: Save (Save Money → reward), Create (the
   + button: four steps, Nut's intro, the dress-up, the new card) and the
   Goal tab's Filter. Each state of a sheet stays mounted and the states
   cross-fade in one grid cell, so a sheet keeps one height. */

type D = Dispatch<Action>;

/** Raster art at a fixed height or width, never dimmed */
function Img({ a, h, w, className }: { a: { src: string; w: number; h: number }; h?: number; w?: number; className?: string }) {
  const loading = useContext(ArtLoading);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- product art, already sized
    <img
      className={className}
      src={a.src}
      alt=""
      width={a.w}
      height={a.h}
      style={h ? { height: h, width: "auto" } : { width: w, height: "auto" }}
      loading={loading}
      decoding="async"
    />
  );
}

/** One state of a sheet: shown or hidden, never unmounted */
function Stage({ on, children, className }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <section className={`${s.stage} ${className ?? ""}`} data-on={on} aria-hidden={!on} inert={!on}>
      {children}
    </section>
  );
}

// ── Save Money → reward ──

export const SaveSheet = memo(function SaveSheet({ save, goal, dispatch }: { save: Save; goal: Goal; dispatch: D }) {
  const id = useId();
  const ok = amount(save.value) > 0;
  return (
    <div className={s.stages}>
      <Stage on={save.stage === "enter"}>
        <article className={s.scard}>
          <div className={s.gcardHead}>
            <p className={s.sname}>{goal.name}</p>
            <MoreIcon size={18} className={s.more} />
          </div>
          <div className={s.scardBody}>
            <Rim
              p={progress(goal)}
              warm={goal.attention}
              target={goal.target !== null}
              size={104}
              art={art(goal.art)}
              artSize={64}
            />
            <div className={s.gcardSide}>
              <Amount g={goal} className={s.samt} />
              <Marks marks={goal.marks} />
              {goal.due && <p className={s.sdue}>{goal.due.home}</p>}
            </div>
          </div>
        </article>
        <form
          className={s.saveForm}
          onSubmit={(e) => {
            e.preventDefault();
            if (ok) dispatch({ type: "save" });
          }}
        >
          <label className={s.saveLabel} htmlFor={`${id}-amt`}>
            Save to this goal:
          </label>
          <span className={s.money}>
            <span className={s.moneySign} aria-hidden>
              $
            </span>
            <input
              id={`${id}-amt`}
              className={s.field}
              inputMode="decimal"
              autoComplete="off"
              placeholder="Enter amount"
              value={save.value}
              onChange={(e) => dispatch({ type: "saveValue", value: e.target.value })}
            />
          </span>
          <button type="submit" className={s.btn} disabled={!ok}>
            Save
          </button>
        </form>
      </Stage>

      <Stage on={save.stage === "saved"} className={s.centre}>
        {save.stage !== "enter" && (
          <Rim
            key={`${save.id}-${save.from}`}
            p={progress(goal)}
            warm={goal.attention}
            target={goal.target !== null}
            size={156}
            stroke={7}
            art={art(goal.art)}
            artSize={96}
            from={save.from}
            fromWarm={save.warm}
          />
        )}
        <p className={s.bigTitle}>Saving successful!</p>
        <button type="button" className={`${s.btn} ${s.btnFoot}`} onClick={() => dispatch({ type: "reward" })}>
          Check Reward
        </button>
      </Stage>

      <Stage on={save.stage === "reward"} className={s.centre}>
        <span className={s.reward}>{save.found && <Img a={ART.glassesGreen} w={128} />}</span>
        <p className={s.bigTitle}>{save.found ? "Saving successful!" : "Oops..."}</p>
        <p className={s.rewardText}>
          {save.found
            ? "Nut found a pair of glasses in the forest! Go try them on!"
            : "It seems Nut didn’t find any rewards in the forest this time, but hopefully, they’ll find some next time!"}
        </p>
        <button type="button" className={`${s.btn} ${s.btnFoot}`} onClick={() => dispatch({ type: "close" })}>
          Okay
        </button>
      </Stage>
    </div>
  );
});

// ── Create a goal ──

function Tip({ warn, children }: { warn?: boolean; children: ReactNode }) {
  return (
    <div className={s.tip}>
      <TipMark warn={warn} />
      <p className={s.tipText}>{children}</p>
    </div>
  );
}

function Segmented({
  label,
  none,
  onChange,
}: {
  label: string;
  none: boolean;
  onChange: (none: boolean) => void;
}) {
  return (
    <div className={s.seg} role="radiogroup" aria-label={label} style={{ "--k": none ? 1 : 0 } as CSSProperties}>
      <span className={s.segThumb} aria-hidden />
      <button type="button" role="radio" aria-checked={!none} className={s.segBtn} onClick={() => onChange(false)}>
        {label}
      </button>
      <button type="button" role="radio" aria-checked={none} className={s.segBtn} onClick={() => onChange(true)}>
        I don’t have one
      </button>
    </div>
  );
}

function Select<T extends string>({
  value,
  options,
  label,
  onChange,
  disabled,
  className,
}: {
  value: T;
  options: readonly T[];
  label: string;
  onChange: (v: T) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <span className={`${s.select} ${className ?? ""}`}>
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as T)}
        className={s.selectEl}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className={s.selectIcon} />
    </span>
  );
}

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Calendar({ c, dispatch }: { c: Create; dispatch: D }) {
  return (
    <div className={s.calWrap} data-on={c.calendar} aria-hidden={!c.calendar} inert={!c.calendar}>
      <button type="button" className={s.calScrim} tabIndex={-1} aria-label="Close" onClick={() => dispatch({ type: "calendar", open: false })} />
      <div className={s.cal} role="dialog" aria-label="Select a date">
        <div className={s.calHead}>
          <ChevronLeft size={18} />
          <span>Dec</span>
          <ChevronRight size={18} />
        </div>
        <div className={s.calGrid}>
          {WEEK.map((d) => (
            <span key={d} className={s.calDow}>
              {d}
            </span>
          ))}
          {LEAD_DAYS.map((d) => (
            <span key={`p${d}`} className={s.calLead}>
              {d}
            </span>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              type="button"
              className={s.calDay}
              aria-pressed={c.pick === d}
              aria-label={`${d} Dec`}
              onClick={() => dispatch({ type: "pick", day: d })}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={s.btn}
          onClick={() => dispatch({ type: "field", patch: { day: c.pick, calendar: false } })}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Stepper({ c, dispatch }: { c: Create; dispatch: D }) {
  return (
    <ol className={s.stepper} aria-label="Goal setup">
      {STEPS.map((label, i) => {
        // Done: passed with Next, or reached before and holding a value
        const state = i === c.step ? "now" : i < c.reached || (i <= c.reached && stepValue(c, i)) ? "done" : "todo";
        const content = (
          <>
            <span className={s.stepMark} data-state={state}>
              <span data-k="todo">
                <StepMark state="todo" />
              </span>
              <span data-k="now">
                <StepMark state="now" />
              </span>
              <span data-k="done">
                <StepMark state="done" />
              </span>
            </span>
            <span className={s.stepLabel}>{label}</span>
            <span className={s.stepValue}>{state === "done" ? stepValue(c, i) : ""}</span>
          </>
        );
        return (
          <li key={label} className={s.stepItem}>
            {state === "done" ? (
              <button
                type="button"
                className={s.step}
                data-state={state}
                aria-label={`${label}: ${stepValue(c, i)}. Edit`}
                onClick={() => dispatch({ type: "back", step: i })}
              >
                {content}
              </button>
            ) : (
              <span className={s.step} data-state={state} aria-current={state === "now" ? "step" : undefined}>
                {content}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function MoneyField({
  value,
  placeholder,
  label,
  disabled,
  onChange,
}: {
  value: string;
  placeholder: string;
  label: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <span className={s.money} data-off={disabled}>
      <span className={s.moneySign} aria-hidden>
        $
      </span>
      <input
        className={s.field}
        inputMode="decimal"
        autoComplete="off"
        aria-label={label}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, "").slice(0, 7))}
      />
    </span>
  );
}

/* The glasses pattern behind Nut's intro (hero video, 11.0s): outlined
   frames on a slant, the one pair in colour over them */
function GlassesField() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg className={s.pattern} aria-hidden focusable="false">
      <defs>
        <pattern id={`${id}-g`} width="86" height="62" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <g fill="none" stroke="currentColor" strokeWidth="5">
            <circle cx="20" cy="22" r="12" />
            <circle cx="50" cy="22" r="12" />
            <path d="M32 21q3-3 6 0M8 19l-4-3M62 19l4-3" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-g)`} />
    </svg>
  );
}

export const CreateSheet = memo(function CreateSheet({ c, dispatch }: { c: Create; dispatch: D }) {
  const set = (patch: Partial<Create>) => dispatch({ type: "field", patch });
  const isNba = c.name.trim().toLowerCase() === "nba ticket";
  const warn = !c.periodicNone && amount(c.periodic) > 30;
  const preview = draft(c, "preview");
  const next = (
    <button type="button" className={`${s.btn} ${s.btnFoot}`} onClick={() => dispatch({ type: "next" })}>
      Next
    </button>
  );

  return (
    <div className={s.stages}>
      {/* 1–4: the stepper over the step in hand */}
      <Stage on={c.step <= 3} className={s.steps}>
        <Stepper c={c} dispatch={dispatch} />
        <div className={s.stages}>
          <Stage on={c.step === 0} className={s.stepBody}>
            <input
              className={`${s.field} ${s.fieldWide}`}
              aria-label="Goal Name"
              placeholder="Please enter the goal name"
              autoComplete="off"
              value={c.name}
              maxLength={24}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Stage>

          <Stage on={c.step === 1} className={s.stepBody}>
            {isNba && (
              <Tip>
                Based on your spending habits, you can set the total amount to <b>$60</b> for a NBA Ticket
              </Tip>
            )}
            <Segmented label="Total Amount" none={c.totalNone} onChange={(none) => set({ totalNone: none })} />
            <MoneyField
              label="Total Amount"
              placeholder="Enter the total amount"
              value={c.total}
              disabled={c.totalNone}
              onChange={(v) => set({ total: v })}
            />
          </Stage>

          <Stage on={c.step === 2} className={s.stepBody}>
            <Tip>
              Based on your spending habits, you can set the deadline to <b>1 Dec 2024</b> for <b>$60</b>
            </Tip>
            <Segmented label="Deadline" none={c.deadlineNone} onChange={(none) => set({ deadlineNone: none })} />
            <button
              type="button"
              className={s.dateField}
              disabled={c.deadlineNone}
              data-filled={!!c.day}
              aria-haspopup="dialog"
              aria-expanded={c.calendar}
              onClick={() => dispatch({ type: "calendar", open: true })}
            >
              <span>{c.day ? `${c.day} Dec 2025` : "Select a date"}</span>
              <CalendarIcon size={18} />
            </button>
            <SwapIcon size={18} className={s.swap} />
            <span className={s.money} data-off={c.deadlineNone}>
              <input
                className={s.field}
                inputMode="numeric"
                autoComplete="off"
                aria-label="Duration"
                placeholder="Enter the duration"
                disabled={c.deadlineNone}
                value={c.duration}
                onChange={(e) => set({ duration: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              />
              <Select
                className={s.unit}
                label="Unit"
                value={c.unit}
                options={UNITS}
                disabled={c.deadlineNone}
                onChange={(unit) => set({ unit })}
              />
            </span>
            <Calendar c={c} dispatch={dispatch} />
          </Stage>

          <Stage on={c.step === 3} className={s.stepBody}>
            <span className={s.tipSwap} data-warn={warn}>
              <span data-k="ok">
                <Tip>
                  Based on your spending habits, you can set the periodic amount to <b>$30/Month</b>
                </Tip>
              </span>
              <span data-k="warn">
                <Tip warn>It might feel a bit pushy; try setting a slightly lower amount instead~</Tip>
              </span>
            </span>
            <Segmented label="Periodic amount" none={c.periodicNone} onChange={(none) => set({ periodicNone: none })} />
            <MoneyField
              label="Periodic amount"
              placeholder="Enter the periodic amount"
              value={c.periodic}
              disabled={c.periodicNone}
              onChange={(v) => set({ periodic: v })}
            />
            <Select
              className={s.fieldWide}
              label="Interval"
              value={c.interval}
              options={INTERVALS}
              disabled={c.periodicNone}
              onChange={(interval) => set({ interval })}
            />
          </Stage>
        </div>
        {next}
      </Stage>

      {/* Nut's intro */}
      <Stage on={c.step === 4} className={s.intro}>
        <div className={s.introArt}>
          <GlassesField />
          <Img a={ART.glassesOrange} w={150} className={s.introGlasses} />
        </div>
        <p className={s.introTitle}>Custom Your Nut to Unlock Its Assistant Potential!</p>
        <p className={s.introText}>
          It will become your dedicated assistant for this goal! Certain item combinations will unlock its unique
          personality—give it a try!
        </p>
        {next}
      </Stage>

      {/* Dress-up */}
      <Stage on={c.step === 5} className={s.dress}>
        <div className={s.bubble}>
          <span className={s.bubbleSwap} data-glasses={c.glasses}>
            <span data-k="plain">I am Acorn! I will be your financial assistant, helping you achieve your saving goals!</span>
            <span data-k="glasses">
              Hello, my student! I am your teacher, here to help you achieve your goal with my knowledge and resources!
            </span>
          </span>
        </div>
        <div className={s.cast} aria-hidden>
          <Img a={ART.peanut} h={64} className={s.side} />
          <span className={s.nut} data-glasses={c.glasses}>
            <Img a={ART.acorn} h={150} className={s.nutPlain} />
            <Img a={ART.acornGlasses} h={150} className={s.nutGlasses} />
          </span>
          <Img a={ART.almond} h={64} className={s.side} />
        </div>
        <div className={s.wearTabs} role="tablist" aria-label="Accessories" style={{ "--w": c.wear } as CSSProperties}>
          {(["Eye wear", "Hat", "Scarf"] as const).map((t, i) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={c.wear === i}
              className={s.wearTab}
              onClick={() => set({ wear: i as 0 | 1 | 2 })}
            >
              {t}
            </button>
          ))}
          <span className={s.wearRule} aria-hidden>
            <span className={s.wearThumb} />
          </span>
        </div>
        <div className={s.items} role="tabpanel">
          <button
            type="button"
            className={s.item}
            aria-pressed={c.wear !== 0 || !c.glasses}
            aria-label="No item"
            onClick={() => c.wear === 0 && set({ glasses: false })}
          >
            <NoneIcon size={34} />
          </button>
          {c.wear === 0 ? (
            <button
              type="button"
              className={s.item}
              aria-pressed={c.glasses}
              aria-label="Glasses"
              onClick={() => set({ glasses: true })}
            >
              <Img a={ART.glassesYellow} w={66} />
            </button>
          ) : (
            <span className={s.slot} aria-hidden />
          )}
          <span className={s.slot} aria-hidden />
        </div>
        {next}
      </Stage>

      {/* The new card */}
      <Stage on={c.step === 6} className={s.made}>
        <div className={s.madeCard}>
          <GoalCard g={preview} rim={112} />
        </div>
        <p className={s.bigTitle}>Goal Created Successfully!</p>
        <button type="button" className={`${s.btn} ${s.btnFoot}`} onClick={() => dispatch({ type: "done" })}>
          Got it!
        </button>
      </Stage>
    </div>
  );
});

// ── Filter ──

function Radio({ on, label, onPick }: { on: boolean; label: string; onPick: () => void }) {
  return (
    <button type="button" role="radio" aria-checked={on} className={s.opt} onClick={onPick}>
      <span className={s.radio} data-on={on} aria-hidden />
      {label}
    </button>
  );
}

const STATUS = ["Show all", "In progress", "Complete", "Won’t do"];
const HAS = ["Target total amount", "Duration & deadline", "Saving frequency & amount"];
const SORTS = [
  "Sort by Duration & Deadline",
  "Sort by next save date",
  "Sort by target total amount (low to high)",
  "Sort by target total amount (high to low)",
];

export const FilterSheet = memo(function FilterSheet({ filter, dispatch }: { filter: Filter; dispatch: D }) {
  const set = (patch: Partial<Filter>) => dispatch({ type: "filter", patch });
  const id = useId();
  return (
    <div className={s.filter}>
      <p className={s.filterTitle}>Filter</p>
      <p className={s.filterHead} id={`${id}-status`}>
        Goal Name
      </p>
      <div role="radiogroup" aria-labelledby={`${id}-status`} className={s.opts}>
        {STATUS.map((t, i) => (
          <Radio key={t} on={filter.status === i} label={t} onPick={() => set({ status: i })} />
        ))}
      </div>
      <p className={s.filterHead}>Goals that have:</p>
      <div className={s.opts}>
        {HAS.map((t, i) => (
          <button
            key={t}
            type="button"
            role="checkbox"
            aria-checked={filter.has[i]}
            className={s.opt}
            onClick={() => {
              const has = [...filter.has] as Filter["has"];
              has[i] = !has[i];
              set({ has });
            }}
          >
            <span className={s.check} data-on={filter.has[i]} aria-hidden>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="m2.5 6.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {t}
          </button>
        ))}
      </div>
      <hr className={s.rule} />
      <p className={s.filterTitle} id={`${id}-sort`}>
        Sorting
      </p>
      <div role="radiogroup" aria-labelledby={`${id}-sort`} className={s.opts}>
        {SORTS.map((t, i) => (
          <Radio key={t} on={filter.sort === i} label={t} onPick={() => set({ sort: i })} />
        ))}
      </div>
    </div>
  );
});
