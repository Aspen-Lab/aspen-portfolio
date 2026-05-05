import { Icon } from "./Icon";

type Item = {
  icon?: Parameters<typeof Icon>[0]["name"];
  label: string;
  text?: string;
};

type Props = {
  items: Item[];
  /** Two-column layout on sm+? Default true (cards stay short and scannable). */
  columns?: 1 | 2 | 3;
};

export function IconList({ items, columns = 2 }: Props) {
  const colsClass =
    columns === 1
      ? "sm:grid-cols-1"
      : columns === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <ul className={`grid grid-cols-1 ${colsClass} gap-x-8 gap-y-5 max-w-4xl`}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-3.5">
          {it.icon && (
            <span className="shrink-0 mt-[3px] text-ink/85">
              <Icon name={it.icon} size={20} />
            </span>
          )}
          <div>
            <p className="font-display text-[18px] leading-[1.2] tracking-[-0.01em] text-ink">
              {it.label}
            </p>
            {it.text && (
              <p className="mt-1.5 text-[14px] leading-[1.55] text-ink/80">
                {it.text}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
