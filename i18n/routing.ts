import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
  // Locale is always in the URL — skip cookie negotiation so CDN can cache HTML
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
