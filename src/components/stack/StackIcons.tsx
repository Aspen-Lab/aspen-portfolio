import {
  BrainCircuit,
  Braces,
  CodeXml,
  Database,
  Gamepad2,
  Gem,
  Highlighter,
  Mail,
  Network,
  PanelsTopLeft,
  PenTool,
  PlugZap,
  Presentation,
  Shapes,
  ShieldCheck,
  TextSearch,
  Waves,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  siAnthropic,
  siClaude,
  siCursor,
  siDocker,
  siFigma,
  siFramer,
  siGoogle,
  siLucide,
  siNextdotjs,
  siOllama,
  siPostgresql,
  siPython,
  siReact,
  siRhinoceros,
  siSqlite,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siUnity,
  siYaml,
} from "simple-icons";
import type { StackIcon } from "@/lib/work";

const categoryIcons: Record<StackIcon, LucideIcon> = {
  frontend: PanelsTopLeft,
  email: Mail,
  backend: Database,
  ai: BrainCircuit,
  game: Gamepad2,
  design: PenTool,
  tooling: Workflow,
};

type ToolMark = { path: string } | { icon: LucideIcon };

// Keep each row aligned with its category's original items in lib/work.ts.
// Missing brands use a semantic Lucide symbol, never an invented logo.
const toolMarks: Record<StackIcon, readonly (readonly ToolMark[])[]> = {
  frontend: [
    [{ path: siNextdotjs.path }],
    [{ path: siReact.path }, { path: siTypescript.path }],
    [{ path: siTailwindcss.path }],
    [{ icon: Waves }],
    [{ icon: Highlighter }, { path: siLucide.path }],
  ],
  email: [
    [{ icon: Mail }],
    [{ icon: Braces }],
    [{ icon: ShieldCheck }],
    [{ icon: CodeXml }],
  ],
  backend: [
    [{ path: siPython.path }],
    [{ path: siSqlite.path }, { path: siYaml.path }],
    [{ path: siDocker.path }],
    [{ path: siPostgresql.path }, { path: siSupabase.path }],
  ],
  ai: [
    [{ path: siAnthropic.path }],
    [{ path: siGoogle.path }],
    [{ path: siOllama.path }],
    [{ icon: TextSearch }],
  ],
  game: [
    [{ path: siUnity.path }, { icon: Braces }],
    [{ icon: Network }],
    [{ icon: Gamepad2 }],
  ],
  design: [
    [{ path: siFigma.path }, { icon: PlugZap }],
    [{ path: siFramer.path }],
    [{ path: siRhinoceros.path }, { icon: Gem }],
    [{ icon: Shapes }],
  ],
  tooling: [
    [{ path: siCursor.path }],
    [{ path: siClaude.path }],
    [{ path: siUnity.path }, { icon: PlugZap }],
    [{ icon: Mail }],
    [{ icon: Presentation }],
  ],
};

export function StackCategoryIcon({
  kind,
  size = 20,
}: {
  kind: StackIcon;
  size?: number;
}) {
  const Icon = categoryIcons[kind];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" focusable="false" />;
}

export function StackToolIcon({ kind, index }: { kind: StackIcon; index: number }) {
  const marks = toolMarks[kind][index] ?? [{ icon: categoryIcons[kind] }];

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: 36,
        minWidth: 36,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 4,
      }}
    >
      {marks.map((mark, i) => {
        if ("path" in mark) {
          return (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d={mark.path} />
            </svg>
          );
        }
        const Icon = mark.icon;
        return <Icon key={i} size={16} strokeWidth={1.5} aria-hidden="true" focusable="false" />;
      })}
    </span>
  );
}
