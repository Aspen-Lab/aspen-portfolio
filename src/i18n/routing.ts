import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "cn"],
  defaultLocale: "en",
  // /en/about, /cn/about — both locales always prefixed in the URL
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
