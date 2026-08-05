"use client";

import {
  Smartphone,
  Globe,
  Server,
  Database,
  GitBranch,
  Layers,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/section-heading";
import CyberCard from "@/components/ui/cyber-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const categoryMeta = [
  {
    key: "mobile" as const,
    icon: Smartphone,
    accent: "#00ff88",
    skills: ["Flutter", "Dart", "React Native", "Java", "Expo", "React Native CLI"],
  },
  {
    key: "frontend" as const,
    icon: Globe,
    accent: "#00d4ff",
    skills: ["React.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux", "Redux Toolkit"],
  },
  {
    key: "backend" as const,
    icon: Server,
    accent: "#ff00ff",
    skills: ["Node.js", "RESTful APIs", "Express.js", "Socket.io"],
  },
  {
    key: "database" as const,
    icon: Database,
    accent: "#00ff88",
    skills: ["MongoDB", "Firebase", "Firestore", "Cloud Functions"],
  },
  {
    key: "tools" as const,
    icon: GitBranch,
    accent: "#00d4ff",
    skills: ["Git", "GitHub", "Postman", "CI/CD", "Firebase Notifications"],
  },
  {
    key: "architecture" as const,
    icon: Layers,
    accent: "#ff00ff",
    skills: ["MVVM", "MVC", "MVP", "System Architecture", "State Management"],
  },
];

const extraKeys = ["maps", "push", "uiux", "agile", "product", "responsive", "collab"] as const;

export default function Skills() {
  const t = useTranslations("skills");

  const skillCategories = categoryMeta.map((cat) => ({
    ...cat,
    title: t(`categories.${cat.key}`),
  }));

  const additionalSkills = extraKeys.map((key) => t(`extra.${key}`));

  return (
    <section id="skills" className="py-20 sm:py-28 md:py-32 relative circuit-grid">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {skillCategories.map((category, index) => (
            <RevealItem key={category.key}>
              <CyberCard hoverEffect className={`p-4 sm:p-6 h-full ${index % 3 === 1 ? "lg:-translate-y-2" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 cyber-chamfer-sm flex items-center justify-center border"
                    style={{ borderColor: category.accent, boxShadow: `0 0 8px ${category.accent}40` }}
                  >
                    <category.icon size={18} className="text-primary" strokeWidth={1.5} style={{ color: category.accent }} />
                  </div>
                  <h3 className="font-heading text-xs sm:text-sm uppercase tracking-wide">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <span key={skill} className="skill-badge px-2 py-1 text-[10px] sm:text-xs border border-border text-muted-foreground bg-background">
                      {skill}
                    </span>
                  ))}
                </div>
              </CyberCard>
            </RevealItem>
          ))}
        </div>

        <RevealItem>
          <CyberCard variant="terminal" terminalTitle="skills.ext">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-primary w-5 h-5" strokeWidth={1.5} />
              <h3 className="font-heading text-sm uppercase tracking-wide">{t("additional")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {additionalSkills.map((skill) => (
                <span key={skill} className="skill-badge px-3 py-1.5 text-xs font-label uppercase tracking-wider border border-border text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </CyberCard>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
