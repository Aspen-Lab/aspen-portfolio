import type { ReactNode } from "react";
import styles from "./Band.module.css";

/* One full-bleed band of a banded case study (Latent's rhythm: dark, then
   light, then grey). The tone's tokens live in globals.css under
   [data-tone], so everything inside, headings, body, hairlines and the
   charts' marks, flips with the ground. Dark is transparent and shows the
   page's grain; light and grey are flat fills. */
export function Band({
  tone,
  children,
  className,
  id,
}: {
  tone: "dark" | "light" | "grey";
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
