const status = [
  {
    label: "Shipping",
    body: "helloaxel.com · hotel + flight repricing UX",
    detail: "Axel · Gordian YC W19",
  },
  {
    label: "Building",
    body: "Hermes v0 — 5-stage agent pipeline",
    detail: "Python · Tier 0 / 1 / 2 LLM",
  },
  {
    label: "Drawing",
    body: "2D Metroidvania w/ Skyler",
    detail: "Unity · Hollow-Knight stack",
  },
];

export function NowStatus() {
  return (
    <ul className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-7 max-w-3xl border-t border-line pt-7">
      {status.map((s) => (
        <li key={s.label} className="border-l border-line/60 pl-4">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="relative flex w-2 h-2">
              <span
                className="absolute inset-0 rounded-full opacity-60 animate-ping"
                style={{ backgroundColor: "#0BE09B" }}
              ></span>
              <span
                className="relative rounded-full w-2 h-2"
                style={{ backgroundColor: "#0BE09B" }}
              ></span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
              {s.label}
            </span>
          </div>
          <p className="text-[14px] text-ink leading-[1.45]">{s.body}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft mt-2">
            {s.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}
