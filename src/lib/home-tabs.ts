/* The home page's tab state lives in the URL hash (/en#combo deep-links
   straight to a panel). It is read as an external store so the server
   snapshot ("work") always matches the static HTML during hydration.
   Next's router changes the hash with pushState, which fires no event,
   so anything that switches tabs — the tab bar, the nav's Work link —
   goes through selectHomeTab() and announces the change itself. */

export const HOME_TABS = ["work", "system", "stack", "side", "combo"] as const;
export type HomeTab = (typeof HOME_TABS)[number];

const TAB_EVENT = "home-tabs:change";

const isHomeTab = (s: string): s is HomeTab => (HOME_TABS as readonly string[]).includes(s);

export function subscribeHomeTab(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(TAB_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(TAB_EVENT, onChange);
  };
}

export const homeTabSnapshot = (): HomeTab => {
  const h = window.location.hash.slice(1);
  return isHomeTab(h) ? h : "work";
};

export const serverHomeTabSnapshot = (): HomeTab => "work";

/** Switch tabs by rewriting the hash in place — no navigation, no jump. */
export function selectHomeTab(id: HomeTab) {
  const hash = id === "work" ? "" : `#${id}`;
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  window.dispatchEvent(new Event(TAB_EVENT));
}
