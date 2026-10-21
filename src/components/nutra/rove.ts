import type { FocusEvent, KeyboardEvent } from "react";

/* One tab stop for a set of highlight items (a figure's tiles, rows or
   nodes that light up when pointed at or focused). Each item carries
   data-rove="<its key>" and starts with tabIndex 0 on the first item and
   -1 on the rest; the set's container takes onKeyDown={roveKeys} and
   onFocus={roveFocus}. Arrow keys and Home/End move focus along the set
   in document order; the tab stop follows focus. Everything is written
   to the DOM, so nothing re-renders.

   roveSync mirrors the lit item into the items' ARIA state (aria-selected
   for a listbox's options, aria-pressed for toggle buttons), so a screen
   reader hears what the eye sees. */

const ITEM = "[data-rove]";

export function roveKeys(e: KeyboardEvent<HTMLElement>) {
  const step =
    e.key === "ArrowRight" || e.key === "ArrowDown"
      ? 1
      : e.key === "ArrowLeft" || e.key === "ArrowUp"
        ? -1
        : e.key === "Home"
          ? -Infinity
          : e.key === "End"
            ? Infinity
            : 0;
  if (!step) return;
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(ITEM));
  if (!items.length) return;
  const at = items.findIndex((el) => el.contains(document.activeElement));
  const next =
    step === -Infinity ? 0 : step === Infinity ? items.length - 1 : Math.max(0, Math.min(items.length - 1, at + step));
  e.preventDefault();
  items[next]?.focus();
}

export function roveFocus(e: FocusEvent<HTMLElement>) {
  const item = (e.target as HTMLElement).closest<HTMLElement>(ITEM);
  if (!item || !e.currentTarget.contains(item)) return;
  e.currentTarget.querySelectorAll<HTMLElement>(ITEM).forEach((el) => {
    el.tabIndex = el === item ? 0 : -1;
  });
}

export function roveSync(scope: Element | null, lit: string | null, attr: "aria-selected" | "aria-pressed" = "aria-selected") {
  scope?.querySelectorAll<HTMLElement>(ITEM).forEach((el) => {
    el.setAttribute(attr, String(el.dataset.rove === lit));
  });
}
