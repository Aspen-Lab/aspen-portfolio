import { createContext } from "react";

/* How the prototype's raster art loads. The working prototype sits far
   down the page, so its art waits until it is near the viewport ("lazy");
   the hero, the first thing on the page, provides "eager". */
export const ArtLoading = createContext<"lazy" | "eager">("lazy");
