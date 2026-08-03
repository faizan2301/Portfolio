import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Braces, Clock, Code2, Coffee, GraduationCap, Smartphone } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/ui/scroll-progress";
import CustomCursor from "@/components/ui/custom-cursor";
import MeshBackground from "@/components/ui/mesh-background";
import SectionHeading from "@/components/ui/section-heading";
import CyberCard from "@/components/ui/cyber-card";

export const metadata: Metadata = {
  title: "Dev Tools | Mohammad Faizan Shaikh",
  description:
    "Free developer & student utilities — JSON converters, GPA, mobile, and date/time tools.",
};

const tools = [
  {
    name: "JSON → TypeScript",
    description: "Generate TypeScript interfaces or type aliases from any JSON payload.",
    href: "/tools/json-to-typescript",
    icon: Braces,
    status: "online" as const,
  },
  {
    name: "JSON → Dart",
    description:
      "Generate Flutter Dart models with toJson, copyWith, Equatable, JsonSerializable, and more.",
    href: "/tools/json-to-dart",
    icon: Code2,
    status: "online" as const,
  },
  {
    name: "JSON → POJO",
    description:
      "Generate Java POJOs from JSON, Schema, or YAML with Jackson, Gson, Moshi, builders, and validation.",
    href: "/tools/json-to-pojo",
    icon: Coffee,
    status: "online" as const,
  },
  {
    name: "GPA Converter",
    description:
      "SGPA/CGPA ↔ percentage, multi-semester SGPA → CGPA, and grade classification.",
    href: "/tools/gpa-converter",
    icon: GraduationCap,
    status: "online" as const,
  },
  {
    name: "Mobile Toolkit",
    description:
      "APK signatures, deep links, Intent URIs, Universal Links, FCM, QR, ADB, permissions, and versioning.",
    href: "/tools/mobile",
    icon: Smartphone,
    status: "online" as const,
  },
  {
    name: "Date & Time",
    description:
      "Unix timestamps, time zones, ISO formatting, relative time, age calculator, and countdowns.",
    href: "/tools/date-time",
    icon: Clock,
    status: "online" as const,
  },
];

export default function ToolsPage() {
  return (
    <>
      <MeshBackground />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen">
        <section className="py-24 sm:py-28 md:py-32 relative overflow-hidden">
          <div
            className="absolute top-20 right-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #00ff88, transparent)" }}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <SectionHeading
              badge="// Toolkit"
              title={
                <>
                  Dev <span className="neon-text">Tools</span>
                </>
              }
              subtitle="Utilities I use while building — now available in the browser."
            />

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="group block">
                  <CyberCard hoverEffect className="h-full">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 cyber-chamfer-sm border border-primary/40 flex items-center justify-center shrink-0"
                        style={{ boxShadow: "var(--box-shadow-neon-sm)" }}
                      >
                        <tool.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading text-sm sm:text-base font-bold tracking-wider uppercase group-hover:neon-text transition-all">
                            {tool.name}
                          </h3>
                          <span className="font-label text-[9px] uppercase tracking-widest text-primary border border-primary/40 px-1.5 py-0.5">
                            {tool.status}
                          </span>
                        </div>
                        <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                          {tool.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest text-primary">
                          Launch{" "}
                          <ArrowRight
                            className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                            strokeWidth={1.5}
                          />
                        </span>
                      </div>
                    </div>
                  </CyberCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
