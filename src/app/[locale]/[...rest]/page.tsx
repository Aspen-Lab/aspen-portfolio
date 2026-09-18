import { notFound } from "next/navigation";

/* Any path under a locale that matches no page lands here and throws to
   [locale]/not-found.tsx — the designed 404, inside the site's nav and
   footer. Without this catch-all, Next answered unknown URLs with its
   bare default 404 page. */
export default function CatchAll() {
  notFound();
}
