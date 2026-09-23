import Link from "next/link";
import { Flag } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function FlagTeaser() {
  const t = await getTranslations("playground");

  return (
    <section aria-labelledby="flag-challenge-teaser" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link href="/games/flag" className="group mx-auto block max-w-3xl">
          <div className="cyber-card cyber-card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/40 cyber-chamfer-sm"
              style={{ boxShadow: "var(--box-shadow-neon-sm)" }}
            >
              <Flag className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="hud-label mb-1">{t("badge")}</p>
              <h2
                id="flag-challenge-teaser"
                className="font-heading text-base font-bold uppercase tracking-wider transition-all group-hover:neon-text sm:text-lg"
              >
                {t("title")}
              </h2>
              <p className="mt-1 font-mono text-sm leading-relaxed text-muted-foreground">
                {t("body")}
              </p>
            </div>
            <span className="cyber-btn cyber-btn-default w-full px-4 py-2 text-xs sm:w-auto">
              {t("cta")}
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
