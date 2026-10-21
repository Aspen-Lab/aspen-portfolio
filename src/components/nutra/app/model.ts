import { ART } from "../product";

/* The prototype's data and its one reducer. Every string and number here
   is the product's own demo content, read from Aspen's design files: the
   hero video, boards 006, 023, 039, 042 and 045–049. Nothing is measured
   data; the amounts are the mockups' placeholders. */

export type ArtKey = keyof typeof ART;
export const art = (k: ArtKey) => ART[k];

export type Tab = "home" | "goal" | "data";
export type SheetName = "save" | "create" | "filter" | null;
/** The reward marks under a goal's amount: o = needs attention, g = on
    track, d = not yet */
export type Mark = "o" | "g" | "d";

export type Goal = {
  id: string;
  name: string;
  saved: number;
  /** null: a goal with no target (Regular), drawn as a bare track */
  target: number | null;
  art: ArtKey;
  /** Needs attention: the rim and bar are orange until a saving lands */
  attention: boolean;
  /** The due line as Home and the Goal tab print it */
  due: { home: string; goal: string } | null;
  /** What the due line reads once today's saving is in */
  next?: { home: string; goal: string };
  marks: Mark[];
};

export const GOALS: Goal[] = [
  {
    id: "black-friday",
    name: "Black Friday",
    saved: 150,
    target: 300,
    art: "peanutChef",
    attention: true,
    due: { home: "$10 due today", goal: "$10 due today" },
    next: { home: "$10 due Tomorrow", goal: "$10 Tomorrow" },
    marks: ["o", "g", "g", "g"],
  },
  {
    id: "coffee-machine",
    name: "Coffee Machine",
    saved: 50,
    target: 120,
    art: "nutScarf",
    attention: false,
    due: null,
    marks: [],
  },
  {
    id: "regular",
    name: "Regular",
    saved: 170,
    target: null,
    art: "pistachio",
    attention: true,
    due: { home: "$50 due Wednesday", goal: "$50 due Wednesday" },
    marks: ["o", "g", "g", "g"],
  },
];

/** Home lists the week's goals in the board's order (039/049) */
export const HOME_ORDER = ["black-friday", "regular", "coffee-machine"];

export const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
export const progress = (g: Goal) => (g.target ? Math.min(1, g.saved / g.target) : 0);

/** Parse a typed amount; anything that is not a positive number is 0 */
export function amount(s: string) {
  const n = Number.parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
}

// ── Create a goal ──

export const STEPS = ["Goal Name", "Total Amount", "Deadline", "Periodic Amount"] as const;
export const INTERVALS = ["Per day", "Per week", "Per month"] as const;
export const UNITS = ["Days", "Weeks", "Months"] as const;
/** The demo answers a step takes when Next meets an empty field */
export const DEMO = { name: "NBA Ticket", total: "60", day: 1, periodic: "30" };
/** The board's calendar (042): Mon–Sun, the month opens on 27–30 */
export const LEAD_DAYS = [27, 28, 29, 30];

export type Create = {
  /** 0–3 the stepper, 4 Nut's intro, 5 dress-up, 6 created */
  step: number;
  /** the furthest step reached: rows up to it can be tapped back to */
  reached: number;
  name: string;
  total: string;
  totalNone: boolean;
  day: number | null;
  duration: string;
  unit: (typeof UNITS)[number];
  deadlineNone: boolean;
  periodic: string;
  interval: (typeof INTERVALS)[number];
  periodicNone: boolean;
  calendar: boolean;
  /** the day circled in the open calendar, kept until Done */
  pick: number;
  glasses: boolean;
  wear: 0 | 1 | 2;
};

const CREATE: Create = {
  step: 0,
  reached: 0,
  name: "",
  total: "",
  totalNone: false,
  day: null,
  duration: "",
  unit: "Days",
  deadlineNone: false,
  periodic: "",
  interval: "Per month",
  periodicNone: false,
  calendar: false,
  pick: 1,
  glasses: false,
  wear: 0,
};

/** The value each finished step shows on its stepper row */
export function stepValue(c: Create, i: number) {
  if (i === 0) return c.name;
  if (i === 1) return c.totalNone ? "—" : c.total && money(amount(c.total));
  if (i === 2) return c.deadlineNone ? "—" : c.day ? `${c.day} Dec 2025` : "";
  return c.periodicNone ? "—" : c.periodic && money(amount(c.periodic));
}

/** The goal the dress-up makes, as its card and the lists show it */
export function draft(c: Create, id: string): Goal {
  const periodic = c.periodicNone ? 0 : amount(c.periodic || DEMO.periodic);
  const day = c.deadlineNone ? null : (c.day ?? DEMO.day);
  const due = periodic && day ? `${money(periodic)} due ${day} Dec` : null;
  return {
    id,
    name: c.name.trim() || DEMO.name,
    saved: 0,
    target: c.totalNone ? null : amount(c.total || DEMO.total) || null,
    art: c.glasses ? "acornGlasses" : "acorn",
    attention: false,
    due: due ? { home: due, goal: due } : null,
    marks: ["d", "d"],
  };
}

// ── State ──

export type Save = {
  id: string;
  value: string;
  /** enter → saved → reward */
  stage: "enter" | "saved" | "reward";
  /** the share saved before this saving, and whether the goal needed
      attention then: the success rim grows from both */
  from: number;
  warm: boolean;
  /** which reward the forest gave: the glasses the first time, then none */
  found: boolean;
};

export type Filter = { status: number; has: [boolean, boolean, boolean]; sort: number };

export type State = {
  tab: Tab;
  sheet: SheetName;
  /** the ledger row in view: 0 Home, 1 Create, 2 Save, 3 Data */
  row: number;
  /** counts the ledger's "Daily check-in" taps: each one pulses Save Money */
  pulse: number;
  /** counts Resets: the phone scrolls every view back to its top */
  epoch: number;
  goals: Goal[];
  home: string[];
  rewards: number;
  save: Save;
  create: Create;
  filter: Filter;
  query: string;
  card: number;
  cat: number;
  made: number;
};

export const INITIAL: State = {
  tab: "home",
  sheet: null,
  row: 0,
  pulse: 0,
  epoch: 0,
  goals: GOALS,
  home: HOME_ORDER,
  rewards: 0,
  save: { id: "black-friday", value: "30", stage: "enter", from: 0.5, warm: true, found: false },
  create: CREATE,
  filter: { status: 0, has: [true, true, true], sort: 0 },
  query: "",
  card: 0,
  cat: 0,
  made: 0,
};

export type Action =
  | { type: "tab"; tab: Tab }
  | { type: "ledger"; row: number }
  | { type: "openSave"; id: string }
  | { type: "saveValue"; value: string }
  | { type: "save" }
  | { type: "reward" }
  | { type: "close" }
  | { type: "openCreate" }
  | { type: "field"; patch: Partial<Create> }
  | { type: "next" }
  | { type: "back"; step: number }
  | { type: "calendar"; open: boolean }
  | { type: "pick"; day: number }
  | { type: "done" }
  | { type: "openFilter" }
  | { type: "filter"; patch: Partial<Filter> }
  | { type: "query"; value: string }
  | { type: "card"; card: number }
  | { type: "cat"; cat: number }
  | { type: "reset" };

/** The ledger row a view belongs to; the Goal tab keeps the last one */
const rowFor = (tab: Tab, row: number) => (tab === "home" ? 0 : tab === "data" ? 3 : row);

function openSave(s: State, id: string): State {
  const g = s.goals.find((x) => x.id === id) ?? s.goals[0];
  return {
    ...s,
    sheet: "save",
    row: 2,
    save: {
      id: g.id,
      value: g.id === "black-friday" ? "30" : "",
      stage: "enter",
      from: progress(g),
      warm: g.attention,
      found: false,
    },
  };
}

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "tab":
      return { ...s, tab: a.tab, sheet: null, row: rowFor(a.tab, s.row) };
    case "ledger":
      if (a.row === 0) return { ...s, tab: "home", sheet: null, row: 0, pulse: s.pulse + 1 };
      if (a.row === 1) return { ...s, sheet: "create", row: 1, create: CREATE };
      if (a.row === 2) return openSave(s, "black-friday");
      return { ...s, tab: "data", sheet: null, row: 3 };
    case "openSave":
      return openSave(s, a.id);
    case "saveValue":
      return { ...s, save: { ...s.save, value: a.value.replace(/[^0-9.]/g, "").slice(0, 7) } };
    case "save": {
      const add = amount(s.save.value);
      if (!add || s.save.stage !== "enter") return s;
      const goals = s.goals.map((g) =>
        g.id === s.save.id
          ? {
              ...g,
              saved: Math.round((g.saved + add) * 100) / 100,
              attention: false,
              due: g.next ?? g.due,
              marks: g.marks.map((m) => (m === "o" ? "g" : m)),
            }
          : g,
      );
      const before = s.goals.find((g) => g.id === s.save.id);
      return {
        ...s,
        goals,
        save: { ...s.save, stage: "saved", from: before ? progress(before) : 0, warm: before?.attention ?? false },
      };
    }
    case "reward":
      return { ...s, rewards: s.rewards + 1, save: { ...s.save, stage: "reward", found: s.rewards === 0 } };
    case "close":
      return { ...s, sheet: null, row: rowFor(s.tab, s.row), create: { ...s.create, calendar: false } };
    case "openCreate":
      return { ...s, sheet: "create", row: 1, create: CREATE };
    case "field":
      return { ...s, create: { ...s.create, ...a.patch } };
    case "next": {
      const c = s.create;
      const patch: Partial<Create> = {};
      if (c.step === 0 && !c.name.trim()) patch.name = DEMO.name;
      if (c.step === 1 && !c.totalNone && !amount(c.total)) patch.total = DEMO.total;
      if (c.step === 2 && !c.deadlineNone && !c.day) patch.day = DEMO.day;
      if (c.step === 3 && !c.periodicNone && !amount(c.periodic)) patch.periodic = DEMO.periodic;
      const step = Math.min(6, c.step + 1);
      return { ...s, create: { ...c, ...patch, step, reached: Math.max(c.reached, step), calendar: false } };
    }
    case "back":
      return a.step <= s.create.reached && a.step < 4
        ? { ...s, create: { ...s.create, step: a.step, calendar: false } }
        : s;
    case "calendar":
      return { ...s, create: { ...s.create, calendar: a.open, pick: s.create.day ?? s.create.pick } };
    case "pick":
      return { ...s, create: { ...s.create, pick: a.day } };
    case "done": {
      const made = s.made + 1;
      const g = draft(s.create, `made-${made}`);
      // A new goal stands second, under the first, as on board 006
      const goals = [s.goals[0], g, ...s.goals.slice(1)];
      const home = [s.home[0], g.id, ...s.home.slice(1)];
      return { ...s, goals, home, made, sheet: null, tab: "goal", row: 1, query: "" };
    }
    case "openFilter":
      return { ...s, sheet: s.sheet === "filter" ? null : "filter" };
    case "filter":
      return { ...s, filter: { ...s.filter, ...a.patch } };
    case "query":
      return { ...s, query: a.value };
    case "card":
      return s.card === a.card ? s : { ...s, card: a.card };
    case "cat":
      return { ...s, cat: a.cat };
    case "reset":
      return { ...INITIAL, epoch: s.epoch + 1 };
  }
}

/** The Goal tab's list: searched by name, sorted as the filter says.
    Sorting by target reorders the goals that have one; a goal with no
    target (Regular) stays last. The other sorts keep the board's order. */
export function goalList(goals: Goal[], query: string, sort: number) {
  const q = query.trim().toLowerCase();
  const found = q ? goals.filter((g) => g.name.toLowerCase().includes(q)) : goals;
  if (sort < 2) return found;
  const dir = sort === 2 ? 1 : -1;
  const withTarget = found.filter((g) => g.target !== null).sort((a, b) => dir * ((a.target ?? 0) - (b.target ?? 0)));
  return [...withTarget, ...found.filter((g) => g.target === null)];
}

// ── The Data tab ──

/** Total Spending, Mar–Nov: the bars are drawn, not data (board 046:
    eight equal green bars 0.9 of the 1,000 line, Sep at 1.36 over it). */
export const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
export const OVER_MONTH = 6;

/** Categories of Spends (hero video, 3.5–11s). Each arc as the video draws
    it: degrees clockwise from 12 o'clock and a stroke; stylised, not to
    scale. */
export const CATEGORIES = [
  { name: "Car", value: "$100 over", over: true, from: 70, to: 108, w: 10 },
  { name: "Shopping", value: "$80 left", over: false, from: -52, to: 48, w: 7 },
  { name: "Grocery", value: "$123 over", over: true, from: 264, to: 298, w: 10 },
  { name: "Rent", value: "$450 left", over: false, from: 230, to: 256, w: 8 },
  { name: "Subscription", value: "$100 left", over: false, from: 120, to: 152, w: 16 },
  { name: "Other", value: "$110 left", over: false, from: 164, to: 214, w: 5 },
] as const;

export const TRANSACTIONS = [
  { name: "BoA", what: "Monthly Salary", amount: "+ $15,00", income: true, date: "18 Nov 2024" },
  { name: "Amazon", what: "E-book Purchase", amount: "$14", income: false, date: "18 Nov 2024" },
  { name: "Amazon", what: "Unknown", amount: "$14", income: false, date: "18 Nov 2024" },
] as const;
