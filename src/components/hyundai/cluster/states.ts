/* The Green UI's states as data. A ClusterState is everything the cluster
   shows at one moment; Cluster draws it and animates between two of them
   (transform and opacity only). PRESETS are the states the boards and the
   three prototype videos show, each named after where it was read:

     video 38 "LKA Demo"            lf-*   (Lane Following Assist)
     video 39 "Following Distance"  fd-*
     video 40 "HDA"                 hda-*
     board 24 / board 25            dir-green / dir-blue (round-2 directions)

   Strings are the HMI's own, as the boards and videos print them, and
   stay English in both locales ("Steering Assist" is the videos' and
   boards 24/25's wording; boards 34/37 say "Steering Assistance"). */

/** A mark's state colour: green = assistance active, white = available
    or paused, amber = the driver's attention is needed, grey = off. */
export type Tone = "green" | "white" | "amber" | "grey";

/** Board 22's four component icons */
export type IconKey = "distance" | "laneChange" | "steering" | "lane";

export type IconSpec = { k: IconKey; tone: Tone };

/** The status panel (the pill at the top centre). After a change it
    expands with a title and sub-label, then folds back to icons. */
export type Panel =
  /** folded: the speed-limit sign and the icons, no outline */
  | { kind: "icons"; icons: IconSpec[] }
  /** expanded: an outlined pill with title / sub-label and one icon;
      `after` is a second, darker pill beside it holding more icons */
  | { kind: "expanded"; outline: "green" | "white"; title: string; sub: string; icon: IconSpec; after?: IconSpec[] }
  /** HDA engaged: "HDA" / "Active" and the features it runs; `trail`
      ends the pill on the word HDA instead (Blue UI, board 25) */
  | { kind: "hda"; outline: "green" | "cyan"; sub: "Active"; icons: IconSpec[]; trail?: "HDA" }
  /** HDA paused: a white-outlined sub-pill "HDA" / "Paused" holding
      `held`, then a darker pill with the features that stay on */
  | { kind: "hdaPaused"; held: IconSpec[]; after: IconSpec[] };

/** The centre illustration */
export type Scene = {
  /** left and right lane lines */
  lanes: [Tone, Tone];
  lead: "none" | "white" | "green" | "grey";
  /** distance bars between the lead car and the ego car, stacked up from
      the ego car; the topmost is drawn bright, the rest dimmer */
  bars: 0 | 1 | 2 | 3 | 4;
  barTone: "green" | "white";
  /** the ego car drifting toward a lane line (−1 left, 1 right) */
  drift: -1 | 0 | 1;
  /** the neighbouring cars */
  traffic: boolean;
  /** "ring": board 21's HDA "(Glowing Effect)", drawn as a flat ring */
  halo?: "plain" | "ring";
  /** Following-distance setting (board 21, Distance 1–4): the lead car
      sits further ahead as it grows. Unset, the lead car keeps its place
      (the videos change only the bars). Set by withGap. */
  gap?: 1 | 2 | 3 | 4;
};

/** The steering-assist indicator. The label takes the ring's tone; a
    grey ring takes white text (`text: "white"` forces white). `big` is
    the takeover size (1.49×); `arc` is Reconnecting's spinning arc. */
export type Ring = {
  tone: "grey" | "green" | "amber" | "white";
  label: "Manual Driving" | "Steering Assist" | "Steering Assistance" | "Hand On Steering Wheel" | "Reconnecting";
  text?: "tone" | "white";
  big?: boolean;
  arc?: boolean;
};

export type ClusterState = {
  speed: number;
  /** the speed-limit sign */
  limit: number;
  /** the cruise row over the speed: a CRUISE chip over "mph", the set
      speed beside it when `set` is given, and the rule under it */
  cruise: { tone: "green" | "grey" | "cyan"; set?: number } | null;
  panel: Panel;
  scene: Scene;
  ring: Ring;
};

export type PresetKey =
  | "hda-active"
  | "hda-paused"
  | "hda-resume"
  | "lf-manual"
  | "lf-activated-open"
  | "lf-activated"
  | "lf-handson"
  | "lf-deactivated-open"
  | "lf-deactivated"
  | "lf-recentred"
  | "fd-off"
  | "fd-activated-open"
  | "fd-activated"
  | "fd-deactivated-open"
  | "dir-green"
  | "dir-blue";

const g = (k: IconKey): IconSpec => ({ k, tone: "green" });
const tone = (k: IconKey, t: Tone): IconSpec => ({ k, tone: t });

const SCENE: Scene = {
  lanes: ["green", "green"],
  lead: "white",
  bars: 0,
  barTone: "green",
  drift: 0,
  traffic: true,
};

/* ── Video 40, "HDA" ── speed 55, limit 40, green cruise chip */
const HDA_ACTIVE: ClusterState = {
  speed: 55,
  limit: 40,
  cruise: { tone: "green" },
  panel: { kind: "hda", outline: "green", sub: "Active", icons: [g("distance"), g("laneChange"), g("steering"), g("lane")] },
  scene: { ...SCENE, lead: "white", bars: 4 },
  ring: { tone: "green", label: "Steering Assist" },
};

/* ── Video 38, "LKA Demo" ── speed 55, limit 40, grey cruise chip */
const LF_MANUAL: ClusterState = {
  speed: 55,
  limit: 40,
  cruise: { tone: "grey" },
  panel: { kind: "icons", icons: [g("lane")] },
  scene: { ...SCENE, lead: "white", bars: 0 },
  ring: { tone: "grey", label: "Manual Driving" },
};
const HANDSON_SCENE: Scene = { ...LF_MANUAL.scene, lanes: ["amber", "green"], drift: -1 };
const HANDSON_RING: Ring = { tone: "amber", label: "Hand On Steering Wheel", big: true };

/* ── Video 39, "Following Distance" ── speed 55, limit 40, grey cruise
   chip, the ring grey "Steering Assist" throughout */
const FD_OFF: ClusterState = {
  speed: 55,
  limit: 40,
  cruise: { tone: "grey" },
  panel: { kind: "icons", icons: [] },
  scene: { ...SCENE, lead: "white", bars: 0 },
  ring: { tone: "grey", label: "Steering Assist" },
};

export const PRESETS: Record<PresetKey, ClusterState> = {
  // 40, 0–3 s
  "hda-active": HDA_ACTIVE,
  // 40, 3.3–4.5 s: the sub-pill turns white and holds the paused features
  "hda-paused": {
    ...HDA_ACTIVE,
    panel: {
      kind: "hdaPaused",
      held: [tone("distance", "grey"), tone("laneChange", "grey")],
      after: [g("steering"), g("lane")],
    },
    scene: { ...HDA_ACTIVE.scene, barTone: "white" },
    ring: { tone: "white", label: "Reconnecting", arc: true },
  },
  // 40, 4.55–6 s: HDA active again while the ring still reconnects
  "hda-resume": {
    ...HDA_ACTIVE,
    scene: { ...HDA_ACTIVE.scene, barTone: "white" },
    ring: { tone: "white", label: "Reconnecting", arc: true },
  },

  // 38, 0 s
  "lf-manual": LF_MANUAL,
  // 38, 0.5 s
  "lf-activated-open": {
    ...LF_MANUAL,
    panel: {
      kind: "expanded",
      outline: "green",
      title: "Lane Following Assist",
      sub: "Activated",
      icon: g("steering"),
      after: [g("lane")],
    },
  },
  // 38, 1.2–3 s
  "lf-activated": {
    ...LF_MANUAL,
    panel: { kind: "icons", icons: [g("steering"), g("lane")] },
    ring: { tone: "green", label: "Steering Assist" },
  },
  // 38, 3.5 s: the car drifts left, the left line and the lane icon turn amber
  "lf-handson": {
    ...LF_MANUAL,
    panel: { kind: "icons", icons: [g("steering"), tone("lane", "amber")] },
    scene: HANDSON_SCENE,
    ring: HANDSON_RING,
  },
  // 38, 4.3 s
  "lf-deactivated-open": {
    ...LF_MANUAL,
    panel: {
      kind: "expanded",
      outline: "white",
      title: "Lane Following Assist",
      sub: "Deactivated",
      icon: tone("steering", "grey"),
      after: [tone("lane", "amber")],
    },
    scene: HANDSON_SCENE,
    ring: HANDSON_RING,
  },
  // 38, 4.75–6 s
  "lf-deactivated": {
    ...LF_MANUAL,
    panel: { kind: "icons", icons: [tone("steering", "grey"), tone("lane", "amber")] },
    scene: HANDSON_SCENE,
    ring: HANDSON_RING,
  },
  // 38, 6.8–8.3 s
  "lf-recentred": {
    ...LF_MANUAL,
    panel: { kind: "icons", icons: [tone("steering", "grey"), g("lane")] },
  },

  // 39, 0 s: the sign alone
  "fd-off": FD_OFF,
  // 39, 0.45–1 s
  "fd-activated-open": {
    ...FD_OFF,
    panel: { kind: "expanded", outline: "green", title: "Following Distance", sub: "Activated", icon: g("distance") },
  },
  // 39, 1.25–3.4 s: the lead car turns green, four bars
  "fd-activated": {
    ...FD_OFF,
    panel: { kind: "icons", icons: [g("distance")] },
    scene: { ...FD_OFF.scene, lead: "green", bars: 4 },
  },
  // 39, 6.8 s
  "fd-deactivated-open": {
    ...FD_OFF,
    panel: {
      kind: "expanded",
      outline: "white",
      title: "Following Distance",
      sub: "Deactivated",
      icon: tone("distance", "grey"),
    },
  },

  // Board 24 (draw with palette "round2"): as hda-active
  "dir-green": HDA_ACTIVE,
  // Board 25 (draw with palette "blue"): speed and limit swapped, cyan HDA marks
  "dir-blue": {
    speed: 40,
    limit: 55,
    cruise: { tone: "cyan" },
    panel: { kind: "hda", outline: "cyan", sub: "Active", icons: [], trail: "HDA" },
    scene: { ...SCENE, lead: "green", bars: 4 },
    ring: { tone: "green", label: "Steering Assist", text: "white" },
  },
};

/** A state at following-distance setting `gap` (board 21, Distance 1–4):
    that many bars, and the lead car further ahead the larger the gap. */
export function withGap(s: ClusterState, gap: 1 | 2 | 3 | 4): ClusterState {
  return { ...s, scene: { ...s.scene, bars: gap, gap } };
}
