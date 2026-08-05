"use client";

import { useState } from "react";
import { ChevronRight, Apple, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/section-heading";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const projectMeta = [
  {
    id: "khedmah" as const,
    technologies: ["React Native", "TypeScript", "Firebase", "Google Maps", "REST APIs"],
    playStore: "https://play.google.com/store/apps/details?id=com.springtech.orderApp",
    appStore: "https://apps.apple.com/om/app/khedmah-delivery/id6738427748",
    accent: "#ff00ff",
    featured: true,
  },
  {
    id: "rider" as const,
    technologies: [
      "React Native",
      "TypeScript",
      "Firebase",
      "Google Maps",
      "REST APIs",
      "Live Location Tracking",
    ],
    playStore:
      "https://play.google.com/store/apps/details?id=com.Khedmah.driverAppCom&hl=en",
    accent: "#00ff88",
    featured: true,
  },
  {
    id: "attendance" as const,
    technologies: ["Java", "XML", "React Native", "iOS"],
    playStore:
      "https://play.google.com/store/apps/details?id=com.attendance.mokshasolutions",
    appStore: "https://apps.apple.com/bn/app/m-attendance/id6443842046",
    accent: "#00d4ff",
    featured: true,
  },
  {
    id: "olive" as const,
    technologies: ["Flutter", "Dart", "Node.js", "MVVM"],
    playStore: "https://play.google.com/store/apps/details?id=com.olive.olive",
    accent: "#ff00ff",
    featured: true,
  },
  {
    id: "jjm" as const,
    technologies: ["Java", "XML", "Firebase", "REST APIs"],
    playStore: "https://play.google.com/store/apps/details?id=com.jjmaurangabad",
    accent: "#00d4ff",
  },
  {
    id: "mgs" as const,
    technologies: ["React Native", "JavaScript", "Node.js", "Firebase"],
    playStore: "https://play.google.com/store/apps/details?id=com.mgsdelivery",
    accent: "#00ff88",
  },
  {
    id: "crypto" as const,
    technologies: ["Flutter", "Dart", "REST APIs"],
    accent: "#ff00ff",
  },
  {
    id: "mcrm" as const,
    technologies: ["Java", "XML", "Firebase", "SQLite"],
    accent: "#00d4ff",
  },
];

export default function Projects() {
  const t = useTranslations("projects");
  const [showAll, setShowAll] = useState(false);

  const projects = projectMeta.map((meta) => ({
    ...meta,
    title: t(`items.${meta.id}.title`),
    description: t(`items.${meta.id}.description`),
    highlights: t.raw(`items.${meta.id}.highlights`) as string[],
  }));

  const displayedProjects = showAll
    ? projects
    : projects.filter((p) => p.featured);

  return (
    <section
      id="projects"
      className="py-20 sm:py-28 md:py-32 relative overflow-hidden"
    >
      <RevealGroup
        className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
        stagger={100}
      >
        <RevealItem>
          <SectionHeading
            badge={t("badge")}
            title={
              <>
                {t("titleBefore")} <span className="neon-text">{t("titleAccent")}</span>
              </>
            }
            subtitle={t("subtitle")}
          />
        </RevealItem>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 -skew-y-1">
          {displayedProjects.map((project, index) => (
            <RevealItem key={project.id}>
              <div
                className={`project-card-wrapper group h-full ${index === 1 ? "lg:translate-y-4" : ""}`}
              >
                <div className="h-full cyber-card cyber-card-hover flex flex-col">
                  <div
                    className="project-accent-bar h-1 w-full"
                    style={{
                      background: project.accent,
                      color: project.accent,
                      boxShadow: `0 0 8px ${project.accent}`,
                    }}
                  />

                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-heading text-sm sm:text-base uppercase tracking-wide mb-1 group-hover:neon-text transition-all">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="font-label text-[10px] text-accent-secondary uppercase tracking-widest">
                            {t("featured")}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {project.playStore && (
                          <a
                            href={project.playStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 border border-border hover:border-primary text-muted-foreground hover:text-primary cyber-chamfer-sm icon-glow"
                            aria-label={t("playStore")}
                          >
                            <Play size={14} strokeWidth={1.5} />
                          </a>
                        )}
                        {"appStore" in project && project.appStore && (
                          <a
                            href={project.appStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 border border-border hover:border-primary text-muted-foreground hover:text-primary cyber-chamfer-sm icon-glow"
                            aria-label={t("appStore")}
                          >
                            <Apple size={14} strokeWidth={1.5} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3 font-mono leading-relaxed flex-1">
                      {project.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      {project.highlights.slice(0, 3).map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-2 text-xs font-mono text-muted-foreground"
                        >
                          <ChevronRight
                            size={12}
                            className="text-primary shrink-0 rtl:rotate-180"
                            strokeWidth={1.5}
                          />
                          {highlight}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 text-[10px] font-label uppercase tracking-wider border border-border text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>

        {!showAll && projects.length > 3 && (
          <RevealItem>
            <div className="text-center mt-10 skew-y-1">
              <CyberButton
                variant="outline"
                onClick={() => setShowAll(true)}
                className="px-8"
              >
                {t("viewAll")}
                <ChevronRight size={16} strokeWidth={1.5} className="rtl:rotate-180" />
              </CyberButton>
            </div>
          </RevealItem>
        )}
      </RevealGroup>
    </section>
  );
}
