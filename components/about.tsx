"use client";

import Image from "next/image";
import { MapPin, Briefcase, GraduationCap, Code2, Smartphone, Server } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/section-heading";
import CountUp from "@/components/ui/count-up";
import CyberCard from "@/components/ui/cyber-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { label: t("stats.years"), value: "3+", icon: Briefcase },
    { label: t("stats.projects"), value: "15+", icon: Code2 },
    { label: t("stats.apps"), value: "7+", icon: Smartphone },
    { label: t("stats.tech"), value: "20+", icon: Server },
  ];

  const highlights = [
    {
      icon: Smartphone,
      title: t("highlights.mobileTitle"),
      description: t("highlights.mobileDesc"),
    },
    {
      icon: Code2,
      title: t("highlights.frontendTitle"),
      description: t("highlights.frontendDesc"),
    },
    {
      icon: Server,
      title: t("highlights.fullstackTitle"),
      description: t("highlights.fullstackDesc"),
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 md:py-32 relative overflow-hidden skew-y-0">
      <RevealGroup className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10" stagger={100}>
        <RevealItem>
          <SectionHeading
            badge={t("badge")}
            title={
              <>
                {t("titleBefore")}{" "}
                <span className="neon-text">{t("titleAccent")}</span>
              </>
            }
            subtitle={t("subtitle")}
          />
        </RevealItem>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start mb-12 sm:mb-16">
          <div className="space-y-4 sm:space-y-6 -mt-4 lg:-mt-8">
            <RevealItem>
              <CyberCard variant="terminal" terminalTitle="profile.dat">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="relative w-14 h-14 shrink-0 overflow-hidden cyber-chamfer-sm border border-primary/50"
                    style={{ boxShadow: "var(--box-shadow-neon)" }}
                  >
                    <Image
                      src="/og-image.png"
                      alt={t("imageAlt")}
                      fill
                      sizes="56px"
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm sm:text-base uppercase tracking-wide">{t("name")}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <MapPin size={12} strokeWidth={1.5} />
                      {t("location")}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3 text-sm font-mono">
                  {"> "}{t("bio1Before")} <span className="text-foreground">{t("bio1Degree")}</span>{" "}
                  {t("bio1And")}{" "}
                  <span className="neon-text">{t("bio1Role")}</span>
                  {t("bio1Mid")}{" "}
                  <span className="text-foreground">{t("bio1Dev")}</span>{" "}
                  {t("bio1After")}
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm font-mono">
                  {"> "}{t("bio2")}
                </p>
              </CyberCard>
            </RevealItem>

            <RevealItem>
              <CyberCard variant="default">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="text-primary w-5 h-5" strokeWidth={1.5} />
                  <h3 className="font-heading text-sm uppercase tracking-wide">{t("education")}</h3>
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-start gap-2 border-b border-border pb-3">
                    <div>
                      <p className="font-medium">{t("meDegree")}</p>
                      <p className="text-xs text-muted-foreground">{t("college")}</p>
                    </div>
                    <span className="text-primary text-xs shrink-0">[2024]</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-medium">{t("beDegree")}</p>
                      <p className="text-xs text-muted-foreground">{t("college")}</p>
                    </div>
                    <span className="text-primary text-xs shrink-0">[2022]</span>
                  </div>
                </div>
              </CyberCard>
            </RevealItem>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <RevealItem key={stat.label}>
                  <CyberCard variant="holographic" className={`text-center ${index % 2 === 1 ? "lg:translate-y-3" : ""}`}>
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary icon-glow" strokeWidth={1.5} />
                    <div className="text-2xl sm:text-3xl font-heading font-black neon-text mb-1">
                      <CountUp value={stat.value} />
                    </div>
                    <div className="font-label text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  </CyberCard>
                </RevealItem>
              ))}
            </div>

            <div className="space-y-3">
              {highlights.map((item) => (
                <RevealItem key={item.title}>
                  <CyberCard hoverEffect className="flex gap-4 items-start p-4">
                    <div className="w-10 h-10 cyber-chamfer-sm border border-primary/40 flex items-center justify-center shrink-0" style={{ boxShadow: "var(--box-shadow-neon-sm)" }}>
                      <item.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-heading text-xs sm:text-sm uppercase tracking-wide mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">{item.description}</p>
                    </div>
                  </CyberCard>
                </RevealItem>
              ))}
            </div>
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}
