type Market = {
  /** Country code in mono caps, e.g. "VN" */
  code: string;
  /** Full country name, e.g. "Vietnam" */
  name: string;
  /** Regulator label, e.g. "SBV — State Bank" */
  regulator: string;
  /** Optional caption, e.g. "Pay · Shop · Live" */
  scope?: string;
};

type Props = {
  items: Market[];
};

export function MarketsRow({ items }: Props) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
      {items.map((m) => (
        <li
          key={m.code}
          className="card-material px-4 py-5 flex flex-col gap-2"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-display font-light tracking-[-0.02em] text-ink leading-none text-[36px] tabular-nums">
              {m.code}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft mb-1 ml-auto whitespace-nowrap">
              {m.name}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-line/70">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/85">
              {m.regulator}
            </p>
            {m.scope && (
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-soft mt-1">
                {m.scope}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
