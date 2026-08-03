"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ClipboardCopy } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function NetworkToolShell({
  title,
  subtitle,
  children,
}: {
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="py-10 sm:py-14 md:py-16 relative overflow-hidden">
      <div
        className="absolute top-0 right-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <Link
          href="/tools/network"
          className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Network tools
        </Link>
        <RevealGroup stagger={70}>
          <RevealItem>
            <SectionHeading badge="// Network" title={title} subtitle={subtitle} />
          </RevealItem>
          {children}
        </RevealGroup>
      </div>
    </section>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <CyberButton
      type="button"
      variant="outline"
      className="text-xs px-3 py-2"
      disabled={!text}
      onClick={async () => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" /> Copied
        </>
      ) : (
        <>
          <ClipboardCopy className="w-3.5 h-3.5" strokeWidth={1.5} /> {label}
        </>
      )}
    </CyberButton>
  );
}

export function OutputBlock({
  value,
  empty = "> Output will appear here...",
  className,
}: {
  value: string;
  empty?: string;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        "min-h-[120px] max-h-[480px] overflow-auto p-3 sm:p-4 border border-border/60 bg-background/50 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words",
        !value && "text-muted-foreground",
        className
      )}
    >
      {value || empty}
    </pre>
  );
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
    >
      {children}
    </label>
  );
}
