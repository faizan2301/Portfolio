"use client";

import { Building2, Calendar, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/section-heading";
import CyberCard from "@/components/ui/cyber-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const experienceMeta = [
  {
    id: "khedmah" as const,
    technologies: ["React Native", "TypeScript", "Firebase", "REST APIs"],
    current: true,
  },
  {
    id: "moksha" as const,
    technologies: ["Flutter", "React Native", "Java", "Node.js", "MongoDB"],
    current: false,
  },
];

export default function Experience() {
  const t = useTranslations("experience");

  const experiences = experienceMeta.map((meta) => ({
    ...meta,
    title: t(`items.${meta.id}.title`),
    company: t(`items.${meta.id}.company`),
    type: t(`items.${meta.id}.type`),
    location: t(`items.${meta.id}.location`),
    period: t(`items.${meta.id}.period`),
    description: t.raw(`items.${meta.id}.description`) as string[],
  }));

  return (
    <section id="experience" className="py-20 sm:py-28 md:py-32 relative circuit-grid">
      <RevealGroup className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10" stagger={150}>
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

        <div className="relative">
          <div className="absolute start-2 md:start-1/2 top-0 bottom-0 w-px timeline-line transform md:-translate-x-1/2 rtl:md:translate-x-1/2" />

          {experiences.map((exp, index) => (
            <RevealItem key={exp.company}>
              <div
                className={`relative flex flex-col md:flex-row gap-4 sm:gap-8 mb-8 sm:mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`absolute start-2 md:start-1/2 w-3 h-3 sm:w-4 sm:h-4 timeline-dot transform -translate-x-1/2 rtl:translate-x-1/2 mt-2 sm:mt-8 z-10 cyber-chamfer-sm ${
                    exp.current ? "timeline-dot-pulse" : ""
                  }`}
                />

                <div className={`ms-6 sm:ms-8 md:ms-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:pe-8" : "md:ps-8"}`}>
                  <CyberCard hoverEffect className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-heading text-sm sm:text-lg uppercase tracking-wide mb-1">{exp.title}</h3>
                        <div className="flex items-center gap-2 text-primary font-mono text-xs sm:text-sm">
                          <Building2 size={14} strokeWidth={1.5} />
                          <span>{exp.company}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-label uppercase tracking-widest mt-1">{exp.type}</p>
                      </div>
                      {exp.current && (
                        <span className="font-label text-[10px] uppercase tracking-widest px-2 py-1 border border-primary text-primary" style={{ boxShadow: "var(--box-shadow-neon-sm)" }}>
                          {t("active")}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-mono mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} strokeWidth={1.5} />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} strokeWidth={1.5} />
                        {exp.location}
                      </span>
                    </div>

                    <ul className="space-y-2 mb-5">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground font-mono">
                          <span className="text-primary shrink-0">{">"}</span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="skill-badge px-2 py-1 text-[10px] border border-border text-muted-foreground bg-background">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CyberCard>
                </div>

                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            </RevealItem>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
