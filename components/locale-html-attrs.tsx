"use client";

import { useEffect } from "react";

export default function LocaleHtmlAttrs({
  locale,
}: {
  locale: string;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const dir = locale === "ar" ? "rtl" : "ltr";
    html.lang = locale;
    html.dir = dir;
    html.classList.toggle("locale-ar", locale === "ar");

    return () => {
      html.lang = "en";
      html.dir = "ltr";
      html.classList.remove("locale-ar");
    };
  }, [locale]);

  return null;
}
