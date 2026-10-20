"use client";

import { memo, useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import type { NonstopRouteData } from "@/lib/work";
import { hold } from "@/lib/hold";
import styles from "./NonstopRoute.module.css";

/* Axel §01, "My handoff is a pull request", drawn as the pull request
   itself: one split card on the chart sheet (the global .paper-stack >
   .paper, two back sheets behind it), whose structure is the section's
   two claims.

   Left, on the sheet, the PR. First its owner lane: one row, Aspen's, and
   in it one solid grey block that holds the whole route (Problem, Design,
   Build, Test, PR), each step an ink word. The column lines stand above
   and below the block as 1px posts, so the block is seen to cross every
   one of them: one pair of hands, no handoff. Beside the preview the
   block runs on through the sheet's margin to the slab's edge, level with
   the preview's tab, so the route reads straight into the working
   preview. Under it, what the PR carries, as a checklist, led by ink
   check squares, each line with a grey arrow toward the preview.

   Right, on the slab (a fine dot grid, crop marks in its corners, as on
   §04's proof), the last thing the PR carries, not listed but running:
   Axel's flight card (the traveller's "Seattle to LA, Friday morning",
   SEA to LAX, Nonstop, Book) inside the figure's one accent mark, a 1.5px
   frame with its name on a solid tab. It behaves. Book books it: the
   headline becomes "Your Los Angeles flight is booked", the plane flies
   SEA to LAX and leaves a solid line behind it, and the button becomes
   View trip, which settles the plane back to SEA. The button has its
   hover veil, press squeeze and focus ring.

   The checklist is the preview's legend. Pointing at a line, focusing it
   or tapping it shows that line in the preview while the others step
   back: the card's reusable parts are outlined; the frame narrows to a
   phone's width and the same card reflows (a container query, not a
   second design); the button runs through its states; the plane flies.
   A line writes data-show on the figure and data-on and aria-pressed on
   itself, straight to the DOM, and CSS does the rest, so a pointer never
   re-renders React. A mouse opens a line by moving onto it (a page
   scrolled under a resting mouse opens nothing), keeps what it opened
   while it travels to the preview (crossing another line, it switches
   only once it rests there) and closes it on leaving the figure; the
   keyboard closes it on leaving the line; a tap toggles it.

   The two loops, the flight and the button's states, run in CSS on their
   own attributes (data-fly, data-press) and are never cut mid-cycle:
   closing one lets it run on to the next moment at which it matches the
   card at rest, then drops the attribute, so nothing jumps.

   It plays once, when a third of it is in view: the block runs left to
   right, the steps arrive in it, the checks fill, the preview comes last,
   all in CSS keyed on data-in, so the server's markup and the browser's
   agree. Then the legend shows itself, once, when the reader can see the
   whole route the plane flies: the Motion line lights and the plane flies
   SEA to LAX, inks its line, lands and settles back, so a reader who
   never points still sees that the preview runs. It waits for an idle
   figure, and a pointer moving, a click or focus in the figure ends it
   (scrolling does not). Reduced motion shows the final frame and skips
   it, and its demos are swaps or 160ms fades. Every move is a transform
   or an opacity.

   Every word is the section's, the route's, or already printed on the
   Axel page: §02 quotes the search and names Book, §04's email says the
   flight is booked and links View trip. */

/* A top-down plane facing +x, centred on the origin (Axel's outline). */
const PLANE =
  "M12 0 L4 -1.6 L-2 -9 L-4.6 -9 L-1.2 -1.6 L-7 -1.4 L-9.6 -4.6 L-11.2 -4.6 L-9.8 0 L-11.2 4.6 L-9.6 4.6 L-7 1.4 L-1.2 1.6 L-4.6 9 L-2 9 L4 1.6 Z";

/* What each checklist line shows in the preview, in the route's order:
   reusable components, responsive layouts, interaction states, motion */
const DEMOS = ["parts", "narrow", "states", "motion"] as const;
type Demo = (typeof DEMOS)[number];
const MOTION = DEMOS.indexOf("motion");

/* One cycle of either loop: the fly and press keyframes, 2400ms */
const CYCLE = 2400;
/* The fly cycle, as its keyframes (fly, open, hold) set it: the plane
   lands at 30% (720ms, --t-3) and holds at LAX, its line drawn, until
   76.67% (1840ms); the cycle ends back at SEA */
const LANDED = 0.3;
const LEAVES = 0.7667;
/* The press cycle (press, veil, ring) rests until its hover veil begins
   at 18%, and again from its release at 64.67% until its focus ring
   begins at 66.67% */
const HOVERS = 0.18;
const RELEASED = 0.6467;
const FOCUSES = 0.6667;

/* The legend's one showing: no sooner than the preview has arrived after
   the entrance, and a beat (--t-2) after the plane's whole route is in
   view */
const SHOW_AT = 1100;
const SEEN = 360;

/* A mouse already showing a line moves to another only after resting on
   it this long, so it can cross lines on its way to the preview */
const SETTLE = 120;

type Via = "mouse" | "key" | "tap";
type Words = NonstopRouteData["preview"];
type Loop = "fly" | "press";

/* The elements each loop animates, to find its running animations */
const PARTS: Record<Loop, string[]> = {
  fly: [styles.flight, styles.window, styles.hold],
  press: [styles.button, styles.ring],
};

/* Where a closed loop may end without a jump: the first moment, from
   phase p of iteration n, at which it matches the card at rest. Over a
   booked card the plane rests anywhere it holds at LAX; over an open
   card, only where a cycle ends, back at SEA. The button rests until its
   hover begins, between its release and its focus ring, and where a
   cycle ends; a press it has begun, it finishes. */
function restAt(loop: Loop, booked: boolean, n: number, p: number) {
  if (loop === "press") {
    if (p <= HOVERS || (p >= RELEASED && p <= FOCUSES)) return n + p;
    return p < RELEASED ? n + RELEASED : n + 1;
  }
  if (!booked) return n + 1;
  if (p < LANDED) return n + LANDED;
  return p <= LEAVES ? n + p : n + 1 + LANDED;
}

/* An opening quote hangs in the margin, so both lines start on one edge */
const OPENS = /^[“‘]/;

/* Two held lines; a space between them only where the script uses one */
const Lines = ({ lines }: { lines: readonly string[] }) => (
  <>
    {lines.map((line, i) => (
      <span key={i} className={styles.line}>
        {i > 0 && /^[A-Za-z]/.test(line) ? " " : null}
        {OPENS.test(line) ? (
          <>
            <span className={styles.hang}>{line[0]}</span>
            {line.slice(1)}
          </>
        ) : (
          line
        )}
      </span>
    ))}
  </>
);

const Check = () => (
  <span aria-hidden className={styles.check}>
    <svg viewBox="0 0 16 16" width="16" height="16">
      <path d="M4 8.4 L6.8 11 L12 5.2" />
    </svg>
  </span>
);

/* Axel's flight card. Two copies run in the frame: the one at the
   frame's width, and the same component at a phone's width, which the
   legend's "responsive layouts" fades in. */
function App({
  words,
  nonstop,
  booked,
  onToggle,
  narrow,
}: {
  words: Words;
  nonstop: string;
  booked: boolean;
  onToggle: () => void;
  narrow?: boolean;
}) {
  return (
    <div className={styles.app} data-v={narrow ? "narrow" : "wide"} aria-hidden={narrow || undefined}>
      <span className={styles.brand} data-part="">
        Axel
      </span>
      <p
        className={`t-subhead ${styles.title}`}
        data-part=""
        data-hang={OPENS.test(words.query[0]) || undefined}
        aria-live={narrow ? undefined : "polite"}
      >
        <span className={styles.swap} data-on={!booked} aria-hidden={booked}>
          <Lines lines={words.query} />
        </span>
        <span className={styles.swap} data-on={booked} aria-hidden={!booked}>
          <Lines lines={words.booked} />
        </span>
      </p>
      <div className={styles.trip} data-part="">
        <span className={styles.iata}>SEA</span>
        <span aria-hidden className={styles.route}>
          <svg className={styles.dots}>
            <line x1="1" x2="100%" y1="50%" y2="50%" />
          </svg>
          <span className={styles.window}>
            <span className={styles.hold}>
              <svg className={styles.flown}>
                <line x1="0" x2="100%" y1="50%" y2="50%" />
              </svg>
            </span>
          </span>
          <span className={styles.flight}>
            <svg className={styles.plane} viewBox="-13 -11 26 22" width="20" height="17">
              <path d={PLANE} />
            </svg>
          </span>
        </span>
        <span className={styles.iata}>LAX</span>
      </div>
      <div className={styles.foot}>
        <span className={`t-label ${styles.nonstop}`} data-part="">
          {nonstop}
        </span>
        <button
          type="button"
          className={styles.button}
          data-part=""
          tabIndex={narrow ? -1 : undefined}
          // The phone copy is hidden from assistive tech, so a click on it
          // books the card without taking focus into it
          onMouseDown={narrow ? (e) => e.preventDefault() : undefined}
          onClick={onToggle}
        >
          <span aria-hidden className={styles.ring} />
          <span className={styles.swap} data-on={!booked} aria-hidden={booked}>
            {words.book}
          </span>
          <span className={styles.swap} data-on={booked} aria-hidden={!booked}>
            {words.view}
          </span>
        </button>
      </div>
    </div>
  );
}

/* The working preview: the accent frame and the running card. Only this
   re-renders, and only on a click. The frame is drawn as a surface and
   four edges, so it can narrow to the phone copy by transforms alone; the
   sizes are measured when the layout changes, never per frame. */
const Preview = memo(function Preview({
  id,
  words,
  nonstop,
  label,
  onBook,
}: {
  id: string;
  words: Words;
  nonstop: string;
  label: string;
  onBook: (booked: boolean) => void;
}) {
  const [booked, setBooked] = useState(false);
  const state = useRef(false);
  const device = useRef<HTMLDivElement>(null);
  const toggle = useCallback(() => {
    state.current = !state.current;
    onBook(state.current);
    setBooked(state.current);
  }, [onBook]);

  useEffect(() => {
    const box = device.current;
    const wide = box?.querySelector<HTMLElement>('[data-v="wide"]');
    const narrow = box?.querySelector<HTMLElement>('[data-v="narrow"]');
    if (!box || !wide || !narrow) return;
    // A nudge of under a pixel that puts the box on whole device pixels,
    // so the narrowed frame's edges (drawn through transforms, which are
    // not snapped) stay as crisp as the resting ones. It is a relative
    // offset, not a transform, so the card itself is still snapped.
    let nx = 0;
    let ny = 0;
    const measure = () => {
      const W = box.offsetWidth;
      const H = box.offsetHeight;
      const w = narrow.offsetWidth;
      const h = narrow.offsetHeight;
      if (!W || !H) return;
      const px = window.devicePixelRatio || 1;
      const snap = (v: number) => Math.round(v * px) / px;
      // Where layout put the box, without the nudge or the entrance's rise
      const at = box.getBoundingClientRect();
      const rise = new DOMMatrixReadOnly(getComputedStyle(box).transform);
      const x = at.left - rise.e - nx + window.scrollX;
      const y = at.top - rise.f - ny + window.scrollY;
      nx = snap(x) - x;
      ny = snap(y) - y;
      box.style.left = `${nx.toFixed(3)}px`;
      box.style.top = `${ny.toFixed(3)}px`;
      box.style.setProperty("--sx", (w / W).toFixed(4));
      box.style.setProperty("--sy", (h / H).toFixed(4));
      box.style.setProperty("--ox", `${snap((W - w) / 2)}px`);
      box.style.setProperty("--dy", `${h - H}px`);
    };
    measure();
    // The box moves when anything above it changes height, when the fonts
    // land, and (by its ancestors' rise) until the entrance has played
    const ro = new ResizeObserver(measure);
    ro.observe(wide);
    ro.observe(narrow);
    ro.observe(document.body);
    void document.fonts?.ready.then(measure);
    const settled = (e: TransitionEvent) => e.target === box && e.propertyName === "transform" && measure();
    box.addEventListener("transitionend", settled);
    return () => {
      ro.disconnect();
      box.removeEventListener("transitionend", settled);
    };
  }, []);

  return (
    <div ref={device} id={id} className={styles.device} data-booked={booked}>
      <span aria-hidden className={styles.surface} />
      {(["t", "r", "b", "l"] as const).map((e) => (
        <span key={e} aria-hidden className={styles.edge} data-e={e} />
      ))}
      <span className={`t-label ${styles.tag}`}>{hold(label, styles.word)}</span>
      <App words={words} nonstop={nonstop} booked={booked} onToggle={toggle} />
      <App words={words} nonstop={nonstop} booked={booked} onToggle={toggle} narrow />
    </div>
  );
});

export function NonstopRoute({ meta, from, to, stops, cargoLabel, cargo, preview, caption }: NonstopRouteData) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const previewId = useId();

  const [owner, ...rest] = meta.split(" · ");
  const nonstop = rest.join(" · ");
  const steps = [from, ...stops, to];
  // The last item is the working preview: it is shown running, not listed
  const listed = cargo.slice(0, -1);
  const label = cargo[cargo.length - 1];
  // The lines map to the demos by position. Should the cargo ever change
  // shape, the list stays a plain checklist rather than show wrong parts.
  const legend = listed.length === DEMOS.length;

  /* The card's state, as the loops need it; the card itself keeps it */
  const booked = useRef(false);
  /* Bumped by every call for a loop, so an earlier stop forgets itself */
  const calls = useRef<Record<Loop, number>>({ fly: 0, press: 0 });

  /* Starts a loop, keeps a running one going, or closes it: it then runs
     on to its next rest (restAt) and drops its attribute there. The fly
     loop starts where the card rests, at SEA or (data-fly="lax") at LAX. */
  const loop = useCallback((kind: Loop, on: boolean, start: "sea" | "lax" = "sea") => {
    const root = ref.current;
    if (!root) return;
    const token = ++calls.current[kind];
    const running = root.dataset[kind] !== undefined;
    if (on && !running) {
      root.dataset[kind] = kind === "fly" ? start : "";
      return;
    }
    if (!running) return;
    // getAnimations() brings the styles up to date first; there are none
    // under reduced motion
    const parts = root.getAnimations({ subtree: true }).filter((a) => {
      const target = (a.effect as KeyframeEffect | null)?.target;
      return "animationName" in a && !!target && PARTS[kind].some((c) => target.classList.contains(c));
    });
    if (on) {
      parts.forEach((a) => a.effect?.updateTiming({ iterations: Infinity }));
      return;
    }
    const t = parts[0]?.effect?.getComputedTiming();
    if (t?.progress == null || t.currentIteration == null) {
      delete root.dataset[kind];
      return;
    }
    const iterations = restAt(kind, booked.current, t.currentIteration, t.progress);
    parts.forEach((a) => a.effect?.updateTiming({ iterations }));
    const drop = () => {
      if (calls.current[kind] === token) delete root.dataset[kind];
    };
    void Promise.all(parts.map((a) => a.finished)).then(drop, drop);
  }, []);

  /* Book and View trip. Booking flies the plane by a transition; un-booking
     plays the end of one flight (a fade at LAX, back in at SEA), never a
     rewind. A flight already in the air carries on; if it was closing, it
     now closes where the new state rests. */
  const onBook = useCallback(
    (next: boolean) => {
      booked.current = next;
      const root = ref.current;
      if (!root) return;
      if (root.dataset.fly !== undefined) {
        if (root.dataset.show !== "motion") loop("fly", false);
      } else if (!next) {
        loop("fly", true, "lax");
        loop("fly", false);
      }
    },
    [loop],
  );

  /* The legend: a line writes what to show straight to the DOM, and how
     it was opened decides what closes it */
  const via = useRef<Via | null>(null);
  const press = useRef<string | null>(null);
  /* A mouse moving to another line: the line, and the wait to rest there */
  const next = useRef(-1);
  const settle = useRef(0);
  const show = useCallback(
    (i: number | null, how: Via | null = null) => {
      const root = ref.current;
      if (!root) return;
      window.clearTimeout(settle.current);
      next.current = -1;
      via.current = i === null ? null : how;
      const demo: Demo | undefined = i === null ? undefined : DEMOS[i];
      if (demo) root.dataset.show = demo;
      else delete root.dataset.show;
      root.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        const on = Number(row.dataset.row) === i;
        row.dataset.on = String(on);
        row.setAttribute("aria-pressed", String(on));
      });
      loop("fly", demo === "motion", booked.current ? "lax" : "sea");
      loop("press", demo === "states");
    },
    [loop],
  );
  const shown = () => DEMOS.indexOf(ref.current?.dataset.show as Demo);

  /* The Motion line shows itself once: after the entrance, a beat after
     the plane's whole route is in view, and only on an idle figure. A
     mouse moving in the figure stops it starting, and once it plays, the
     first line the mouse reaches takes over from it; a click or focus in
     the figure ends it. Scrolling and resting do neither. Ending it only
     lets the line step back: the flight runs on to the end of its cycle.
     Reduced motion skips it. matchMedia is read only here, so the markup
     never depends on it. */
  useEffect(() => {
    const root = ref.current;
    const row = root?.querySelector<HTMLElement>(`[data-row="${MOTION}"]`);
    const trip = root?.querySelector<HTMLElement>(`[data-v="wide"] .${CSS.escape(styles.trip)}`);
    if (!inView || !root || !row || !trip) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ready = performance.now() + SHOW_AT;
    const EVENTS = ["pointermove", "click", "focusin"] as const;
    let start = 0;
    let end = 0;
    let playing = false;
    const io = new IntersectionObserver(seen, { threshold: 0.98 });
    io.observe(trip);
    EVENTS.forEach((type) => root.addEventListener(type, intent, { passive: true }));

    function seen(entries: IntersectionObserverEntry[]) {
      if (!entries.some((e) => e.intersectionRatio >= 0.98)) return;
      io.disconnect();
      start = window.setTimeout(play, Math.max(ready - performance.now(), SEEN));
    }
    function play() {
      if (!root || !row) return;
      if (root.dataset.show || via.current || root.matches(":focus-within")) return done();
      playing = true;
      root.dataset.show = "motion-once";
      row.dataset.on = "true";
      loop("fly", true, booked.current ? "lax" : "sea");
      loop("fly", false);
      end = window.setTimeout(done, CYCLE);
    }
    function intent(e: Event) {
      const p = e as PointerEvent;
      if (e.type === "pointermove") {
        // A mouse that moves; a page scrolled under a resting one does not.
        // While it plays, a line the mouse reaches replaces it directly, so
        // the other lines never brighten and step back again on the way.
        if (p.pointerType !== "mouse" || (!p.movementX && !p.movementY) || playing) return;
      }
      done();
    }
    function done() {
      window.clearTimeout(start);
      window.clearTimeout(end);
      io.disconnect();
      if (!root || !row) return;
      EVENTS.forEach((type) => root.removeEventListener(type, intent));
      if (root.dataset.show !== "motion-once") return;
      delete root.dataset.show;
      row.dataset.on = "false";
    }
    return done;
  }, [inView, loop]);

  const line = (item: string, i: number): ReactNode => {
    const content = (
      <>
        <Check />
        <span className={styles.itemText}>{hold(item, styles.word)}</span>
      </>
    );
    if (!legend) return <span className={`t-subhead ${styles.item}`}>{content}</span>;
    return (
      <button
        type="button"
        className={`t-subhead ${styles.item}`}
        data-row={i}
        data-on="false"
        aria-pressed={false}
        aria-controls={previewId}
        onPointerDown={(e) => {
          press.current = e.pointerType;
        }}
        onPointerMove={(e) => {
          // A mouse moving over a line shows it; a page scrolled under a
          // resting one does not
          if (e.pointerType !== "mouse" || (!e.movementX && !e.movementY)) return;
          if (via.current === "mouse" && shown() === i) return;
          // Nothing open by the mouse yet: show it now. Otherwise only once
          // the pointer rests here, so passing over a line changes nothing.
          if (via.current !== "mouse" || shown() === -1) return show(i, "mouse");
          if (next.current === i) return;
          window.clearTimeout(settle.current);
          next.current = i;
          settle.current = window.setTimeout(() => show(i, "mouse"), SETTLE);
        }}
        onPointerLeave={() => {
          window.clearTimeout(settle.current);
          next.current = -1;
        }}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && show(i, "key")}
        onBlur={() => via.current === "key" && show(null)}
        onClick={(e) => {
          // Enter or Space (a click with no detail) toggles it, and so does
          // a tap; a mouse is already showing it
          const how = e.detail === 0 ? "key" : press.current === "mouse" ? null : "tap";
          press.current = null;
          if (how) show(shown() === i ? null : i, how);
        }}
      >
        {content}
        <span aria-hidden className={styles.arrow}>
          →
        </span>
      </button>
    );
  };

  return (
    <figure
      ref={ref}
      className={styles.root}
      data-in={inView}
      onPointerLeave={(e) => e.pointerType === "mouse" && via.current === "mouse" && show(null)}
    >
      <div className="paper-stack">
        <div className={`paper ${styles.sheet}`}>
          <div className={styles.doc}>
            {/* The owner lane: one row, Aspen's; the five steps are printed
                inside one solid block that crosses every column line */}
            <div className={styles.lane} aria-hidden style={{ "--n": steps.length } as CSSProperties}>
              <span className={`t-label ${styles.owner}`}>{owner}</span>
              <span className={styles.run}>
                {steps.map((step, i) => (
                  <span
                    key={step}
                    className={styles.post}
                    data-last={i === steps.length - 1 || undefined}
                    style={{ gridColumn: i + 1 } as CSSProperties}
                  />
                ))}
                <span className={styles.bar} />
                {steps.map((step, i) => (
                  <span
                    key={step}
                    className={`t-small ${styles.step}`}
                    style={{ "--i": i, gridColumn: i + 1 } as CSSProperties}
                  >
                    <span className={styles.stop} />
                    {step}
                  </span>
                ))}
              </span>
            </div>

            <div className={styles.list}>
              <p className={`t-label ${styles.label}`}>{cargoLabel}</p>
              <ul className={styles.items}>
                {listed.map((item, i) => (
                  <li key={item} style={{ "--i": i } as CSSProperties}>
                    {line(item, i)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.stage}>
            {(["tl", "tr", "br", "bl"] as const).map((c) => (
              <span key={c} aria-hidden className={`reg-mark ${c}`} />
            ))}
            <Preview id={previewId} words={preview} nonstop={nonstop} label={label} onBook={onBook} />
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}
