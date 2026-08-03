"use client";

import { useState } from "react";
import { ChevronRight, Apple, Play } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const projects = [
  {
    title: "Khedmah Delivery",
    description:
      "A production-ready food delivery application offering home delivery, pickup, and dine-out services. Developed and maintained core customer features, integrated real-time order tracking and notifications, and optimized performance to deliver a fast, reliable, and seamless ordering experience.",

    technologies: [
      "React Native",
      "TypeScript",
      "Firebase",
      "Google Maps",
      "REST APIs",
    ],

    playStore:
      "https://play.google.com/store/apps/details?id=com.springtech.orderApp",

    appStore: "https://apps.apple.com/om/app/khedmah-delivery/id6738427748",

    highlights: [
      "Developed customer-facing features for delivery, pickup, and dine-out services",
      "Integrated Firebase Cloud Messaging (FCM) for real-time order notifications and iOS live activity widget",
      "Enhanced app performance, responsiveness, and overall user experience",
      "Fixed production bugs and improved application stability",
      "Integrated REST APIs for orders, payments, and user management",
      "Collaborated with cross-functional teams to deliver production releases",
    ],

    accent: "#ff00ff",
    featured: true,
  },
  {
    title: "Khedmah Rider App",
    description:
      "A production-ready rider application for Khedmah's food delivery platform, enabling real-time order management, live GPS tracking, navigation, earnings monitoring, and instant delivery updates. Focused on performance optimization, reliability, and delivering a seamless experience for delivery partners.",

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

    highlights: [
      "Implemented live order tracking and background GPS location updates",
      "Integrated Firebase Push Notifications (FCM) for real-time delivery alerts",
      "Optimized app performance, reducing crashes and improving stability",
      "Built and enhanced rider workflows for order pickup and delivery",
      "Resolved production bugs and maintained high app reliability",
      "Collaborated with backend teams to integrate scalable REST APIs",
    ],

    accent: "#00ff88",
    featured: true,
  },
  {
    title: "M-Attendance",
    description:
      "Comprehensive attendance tracking application with real-time monitoring. Led code refactoring initiatives and implemented new features for enhanced functionality.",
    technologies: ["Java", "XML", "React Native", "iOS"],
    playStore:
      "https://play.google.com/store/apps/details?id=com.attendance.mokshasolutions",
    appStore: "https://apps.apple.com/bn/app/m-attendance/id6443842046",
    highlights: [
      "Code refactoring",
      "Real-time tracking",
      "Cross-platform development",
    ],
    accent: "#00d4ff",
    featured: true,
  },
  {
    title: "Olive ProHealth",
    description:
      "Healthcare platform with nearby facility locator, expert Q&A forum, prescription management, and health blogs from verified doctors.",
    technologies: ["Flutter", "Dart", "Node.js", "MVVM"],
    playStore: "https://play.google.com/store/apps/details?id=com.olive.olive",
    highlights: [
      "Healthcare integration",
      "Doctor verification",
      "Prescription management",
    ],
    accent: "#ff00ff",
    featured: true,
  },
  {
    title: "JJM Monitoring App",
    description:
      "Government project monitoring app with streamlined media upload, multi-level approval system, and intuitive dashboard for stakeholders.",
    technologies: ["Java", "XML", "Firebase", "REST APIs"],
    playStore:
      "https://play.google.com/store/apps/details?id=com.jjmaurangabad",
    highlights: [
      "Media validation system",
      "Multi-level approval",
      "Real-time monitoring",
    ],
    accent: "#00d4ff",
  },
  {
    title: "MGS Delivery",
    description:
      "Delivery management system with barcode scanner integration, order assignment, credit authorization, and Firebase notifications.",
    technologies: ["React Native", "JavaScript", "Node.js", "Firebase"],
    playStore: "https://play.google.com/store/apps/details?id=com.mgsdelivery",
    highlights: [
      "Barcode scanning",
      "Order management",
      "Real-time notifications",
    ],
    accent: "#00ff88",
  },
  {
    title: "Crypto Connars",
    description:
      "Cryptocurrency tracking application with user-friendly interface and dynamic real-time insights for market updates.",
    technologies: ["Flutter", "Dart", "REST APIs"],
    highlights: ["Real-time data", "Market insights", "Intuitive UI"],
    accent: "#ff00ff",
  },
  {
    title: "M-CRM",
    description:
      "Complete CRM solution with leads management, accounts handling, invoice management, and real-time reporting portals.",
    technologies: ["Java", "XML", "Firebase", "SQLite"],
    highlights: ["Lead management", "Invoice system", "Real-time reports"],
    accent: "#00d4ff",
  },
];

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
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
            badge="// Portfolio"
            title={
              <>
                Featured <span className="neon-text">Projects</span>
              </>
            }
            subtitle="A showcase of mobile and web applications I've built and contributed to"
          />
        </RevealItem>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 -skew-y-1">
          {displayedProjects.map((project, index) => (
            <RevealItem key={project.title}>
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
                            [Featured]
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
                            aria-label="Play Store"
                          >
                            <Play size={14} strokeWidth={1.5} />
                          </a>
                        )}
                        {project.appStore && (
                          <a
                            href={project.appStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 border border-border hover:border-primary text-muted-foreground hover:text-primary cyber-chamfer-sm icon-glow"
                            aria-label="App Store"
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
                            className="text-primary shrink-0"
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
                View All Projects
                <ChevronRight size={16} strokeWidth={1.5} />
              </CyberButton>
            </div>
          </RevealItem>
        )}
      </RevealGroup>
    </section>
  );
}
