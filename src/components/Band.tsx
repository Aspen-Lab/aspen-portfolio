import type { ReactNode } from "react";
import styles from "./Band.module.css";

/* One full-bleed band of a banded case study. Every band is the dark
   ground now (one system, no light or grey bands), so a page is a hero
   band and one content band; the band is transparent and shows the
   page's grain. Mass comes from the planes laid on it (globals.css:
   .paper-stack/.paper, .slab, .tile), never from a change of ground. */
export function Band({
  tone = "dark",
  children,
  className,
  id,
}: {
  tone?: "dark";
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div data-tone={tone} id={id} className={`${styles.band} ${className ?? ""}`}>
      <div className="container-fluid">{children}</div>
    </div>
  );
}

export const bandStyles = styles;
