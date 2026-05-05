import type { SVGProps } from "react";

/**
 * Editorial monochrome icon set.
 * Stroke-only, currentColor, 24x24 viewbox. Add new ones as needed.
 */
type Glyph =
  | "globe"
  | "shield"
  | "layers"
  | "id"
  | "users"
  | "briefcase"
  | "gauge"
  | "check"
  | "arrow-up-right"
  | "workflow"
  | "user"
  | "building"
  | "compass"
  | "scale"
  | "spark"
  | "lock"
  | "split"
  | "merge"
  | "loop"
  | "flag"
  | "code"
  | "eye";

type Props = SVGProps<SVGSVGElement> & {
  name: Glyph;
  size?: number;
};

export function Icon({ name, size = 18, strokeWidth = 1.5, ...rest }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...rest,
  };

  switch (name) {
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3z" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13l9 5 9-5" />
          <path d="M3 18l9 5 9-5" />
        </svg>
      );
    case "id":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="12" r="2.5" />
          <path d="M14 11h5M14 15h3" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3.5" />
          <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <circle cx="17" cy="8" r="2.5" />
          <path d="M21 16.5c0-2.2-1.8-4-4-4" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
          <path d="M3 13h18" />
        </svg>
      );
    case "gauge":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1118 0" />
          <path d="M12 12l4-3" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5 12l5 5 9-11" />
        </svg>
      );
    case "arrow-up-right":
      return (
        <svg {...common}>
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      );
    case "workflow":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="9" width="6" height="6" rx="1" />
          <rect x="3" y="15" width="6" height="6" rx="1" />
          <path d="M9 6h3v9h3M12 18h3" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16" />
          <path d="M15 9h2a2 2 0 012 2v10" />
          <path d="M5 21h14" />
          <path d="M9 7h2M9 11h2M9 15h2" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-2 6-6 2 2-6 6-2z" />
        </svg>
      );
    case "scale":
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M5 7h14" />
          <path d="M5 7l-2 6h6l-2-6M19 7l-2 6h6l-2-6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 018 0v4" />
        </svg>
      );
    case "split":
      return (
        <svg {...common}>
          <path d="M5 3v6a4 4 0 004 4h10" />
          <path d="M5 21v-6a4 4 0 014-4" />
          <path d="M16 9l3-3-3-3M16 17l3-3-3-3" />
        </svg>
      );
    case "merge":
      return (
        <svg {...common}>
          <path d="M19 21v-6a4 4 0 00-4-4H5" />
          <path d="M19 3v6a4 4 0 01-4 4" />
          <path d="M8 7L5 4l3-3M8 17l-3-3 3-3" />
        </svg>
      );
    case "loop":
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 11-3-6.7" />
          <path d="M21 4v5h-5" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V4l8 3 7-2v9l-7 2-8-3v-2" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path d="M9 8l-5 4 5 4M15 8l5 4-5 4M13 5l-2 14" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return null;
  }
}
