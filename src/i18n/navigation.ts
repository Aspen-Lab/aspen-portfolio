import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-in replacements for next/link, next/navigation, redirect.
// Use these in app code instead of importing from "next/link" or
// "next/navigation" so URLs include the active locale prefix automatically.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
