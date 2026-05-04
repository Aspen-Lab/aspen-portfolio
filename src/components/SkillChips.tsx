const skills = [
  { name: "Production React", detail: "Figma → tokens → PR, no translation loss" },
  { name: "Design tokens", detail: "Tailwind + CSS vars, opacity ladders" },
  { name: "Customer.io", detail: "Liquid templating, 28+ transactional templates" },
  { name: "Conversational UI", detail: "Three-region layout for AI agent UX" },
  { name: "Cog Sci × craft", detail: "Behavioral design + iF / Red Dot visual" },
  { name: "AI tooling", detail: "Cursor + Claude Code + Figma / unity / Customer.io MCP" },
];

export function SkillChips() {
  return (
    <ul className="mt-10 flex flex-wrap items-center gap-2">
      {skills.map((s) => (
        <li key={s.name} className="group relative">
          <span className="inline-block px-3 py-1.5 rounded-full border border-line text-[10.5px] font-mono uppercase tracking-[0.18em] text-mute group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-colors duration-300 cursor-default">
            {s.name}
          </span>
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-ink text-paper text-[11px] font-sans normal-case tracking-normal whitespace-nowrap rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {s.detail}
          </span>
        </li>
      ))}
    </ul>
  );
}
