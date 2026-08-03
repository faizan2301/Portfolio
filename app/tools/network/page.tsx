import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import CyberCard from "@/components/ui/cyber-card";
import { NETWORK_TOOLS } from "@/lib/tools/network/catalog";

export const metadata: Metadata = {
  title: "Network Tools | Dev Tools",
  description:
    "HTTP status codes, MIME types, DNS lookup, IP geolocation, user-agent parser, and URL parser.",
};

export default function NetworkToolsHubPage() {
  return (
    <section className="py-10 sm:py-14 md:py-16 relative overflow-hidden">
      <div
        className="absolute top-10 left-1/3 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          All tools
        </Link>

        <SectionHeading
          badge="// Network"
          title={
            <>
              Network <span className="neon-text">Tools</span>
            </>
          }
          subtitle="Status codes, MIME types, DNS, IP intel, user agents, and URL anatomy."
        />

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {NETWORK_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/network/${tool.slug}`}
              className="group block"
            >
              <CyberCard hoverEffect className="h-full">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 cyber-chamfer-sm border border-primary/40 flex items-center justify-center shrink-0"
                    style={{ boxShadow: "var(--box-shadow-neon-sm)" }}
                  >
                    <tool.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-sm font-bold tracking-wider uppercase group-hover:neon-text transition-all mb-1">
                      {tool.name}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-3">
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
  );
}
