"use client";

import Image from "next/image";
import { MapPin, Briefcase, GraduationCap, Code2, Smartphone, Server } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import CountUp from "@/components/ui/count-up";
import CyberCard from "@/components/ui/cyber-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const stats = [
  { label: "Years Experience", value: "3+", icon: Briefcase },
  { label: "Projects Completed", value: "15+", icon: Code2 },
  { label: "Apps Published", value: "7+", icon: Smartphone },
  { label: "Technologies", value: "20+", icon: Server },
];

const highlights = [
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "React Native, Flutter, iOS, and Android developer delivering production apps across Oman and the Gulf.",
  },
  {
    icon: Code2,
    title: "Frontend Engineering",
    description: "Building responsive, performant web applications with React.js and modern frameworks.",
  },
  {
    icon: Server,
    title: "Full Stack Development",
    description: "Software & full stack developer skilled in Node.js, RESTful APIs, Firebase, and MongoDB.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 md:py-32 relative overflow-hidden skew-y-0">
      <RevealGroup className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10" stagger={100}>
        <RevealItem>
          <SectionHeading
            badge="// About Me"
            title={
              <>
                Turning Ideas Into{" "}
                <span className="neon-text">Reality</span>
              </>
            }
            subtitle="Passionate developer with a love for creating beautiful, functional applications"
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
                      alt="Faizan Shaikh — React Native & Flutter developer"
                      fill
                      sizes="56px"
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm sm:text-base uppercase tracking-wide">Mohammad Faizan Shaikh</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <MapPin size={12} strokeWidth={1.5} />
                      Serving Oman & Gulf // Muscat, Oman
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3 text-sm font-mono">
                  {"> "}As a <span className="text-foreground">M.E. Computer Science graduate</span> and{" "}
                  <span className="neon-text">Frontend Engineer at Khedmah Delivery</span>, I&apos;m a{" "}
                  <span className="text-foreground">React Native & Flutter developer</span> building iOS, Android, and full-stack apps for clients across Oman and the Gulf.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm font-mono">
                  {"> "}With over 4 years of experience as a mobile app, software, and full stack developer, I&apos;ve led projects from concept to deployment with cross-functional teams.
                </p>
              </CyberCard>
            </RevealItem>

            <RevealItem>
              <CyberCard variant="default">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="text-primary w-5 h-5" strokeWidth={1.5} />
                  <h3 className="font-heading text-sm uppercase tracking-wide">Education</h3>
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-start gap-2 border-b border-border pb-3">
                    <div>
                      <p className="font-medium">M.E. Computer Science & Engineering</p>
                      <p className="text-xs text-muted-foreground">Everest College of Engineering</p>
                    </div>
                    <span className="text-primary text-xs shrink-0">[2024]</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-medium">B.E. Computer Science & Engineering</p>
                      <p className="text-xs text-muted-foreground">Everest College of Engineering</p>
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
