/* One head for every section of the home page, now that the tab bar is
   gone and the page is read top to bottom. The same anatomy as the works
   index rows and the About page's [A-0x] heads, so the whole site counts
   in one voice: a folio numeral, the title in the display serif, and one
   mono figure on the right when the section has a number worth stating
   (a count, a version). No rule above it (「线框我们用面」): the space
   before a section is what ends the one above; the rhythm below is the
   section's own. */
export function SectionHead({
  folio,
  title,
  meta,
  icon,
}: {
  folio: string;
  title: string;
  meta?: string;
  /** An optional glyph beside the title — the About page's heads carry one. */
  icon?: React.ReactNode;
}) {
  // The folio numeral and the count are gone (Aspen, 2026-10-25: 「这些小数字
  // 没意义」); the props stay so the call sites read the same.
  void folio;
  void meta;
  return (
    <header className="pt-5 mb-10 sm:mb-14">
      <h2 className="type-display text-[32px] sm:text-[40px] leading-[1.05] text-ink flex items-center gap-4">
        {icon && (
          <span aria-hidden className="text-mute [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-7 sm:[&>svg]:h-7 translate-y-[1px]">
            {icon}
          </span>
        )}
        {title}
      </h2>
    </header>
  );
}
