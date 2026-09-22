/* One head for every section of the home page, now that the tab bar is
   gone and the page is read top to bottom. The same anatomy as the works
   index rows and the About page's [A-0x] heads, so the whole site counts
   in one voice: a folio numeral, the title in the display serif, and one
   mono figure on the right when the section has a number worth stating
   (a count, a version). A hairline above; the rhythm below is the
   section's own. */
export function SectionHead({
  folio,
  title,
  meta,
}: {
  folio: string;
  title: string;
  meta?: string;
}) {
  return (
    <header className="flex items-end justify-between gap-6 border-t border-line pt-5 mb-10 sm:mb-14">
      <div className="flex items-baseline gap-4 sm:gap-6">
        <span className="font-mono text-[10px] tracking-[0.2em] text-soft tabular-nums">
          {folio}
        </span>
        <h2 className="type-display text-[30px] sm:text-[36px] leading-[1.05] text-ink">
          {title}
        </h2>
      </div>
      {meta && (
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-soft tabular-nums">
          {meta}
        </span>
      )}
    </header>
  );
}
