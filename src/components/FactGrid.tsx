type Fact = {
  text: string;
  /** Optional small mono prefix, e.g. a year or tag. */
  hint?: string;
};

type Block = {
  label: string;
  facts: Fact[];
};

const BLOCKS: Block[] = [
  {
    label: "Now",
    facts: [
      { text: "Sole Designer · Axel" },
      { text: "Reports to CEO" },
      { hint: "100% mine", text: "helloaxel.com" },
    ],
  },
  {
    label: "Track record",
    facts: [
      { hint: "'25", text: "TikTok Pay · KYC" },
      { hint: "'25", text: "Hyundai · HMI" },
      { hint: "'23", text: "CDC NWSS · CryoSave" },
      { hint: "co-founder", text: "XING Art · $300K, 1K+ users" },
    ],
  },
  {
    label: "Origin",
    facts: [
      { hint: "age 19", text: "Started building" },
      { text: "GT — ID + Psych dual major" },
      { hint: "PR", text: "No sponsorship needed" },
    ],
  },
  {
    label: "Awards",
    facts: [
      { hint: "2025", text: "iF Design" },
      { hint: "2025", text: "Red Dot" },
      { hint: "MiraclePlus '25", text: "$300K pre-seed" },
    ],
  },
];

export function FactGrid() {
  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-4xl">
      {BLOCKS.map((b) => (
        <div key={b.label}>
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft mb-4 pb-3 border-b border-line">
            {b.label}
          </dt>
          <dd>
            <ul className="space-y-2.5">
              {b.facts.map((f, i) => (
                <li
                  key={i}
                  className="text-[13.5px] leading-[1.45] text-ink/90 flex flex-col"
                >
                  {f.hint && (
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-soft mb-0.5 tabular-nums">
                      {f.hint}
                    </span>
                  )}
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
