"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  NetworkToolShell,
} from "@/components/tools/network/shared";
import { lookupHttpStatus } from "@/lib/tools/network/core";
import { cn } from "@/lib/utils";

function categoryColor(category: string): string {
  if (category.startsWith("Informational")) return "text-accent-tertiary border-accent-tertiary/40";
  if (category.startsWith("Success")) return "text-primary border-primary/40";
  if (category.startsWith("Redirection")) return "text-accent-secondary border-accent-secondary/40";
  if (category.startsWith("Client")) return "text-destructive border-destructive/40";
  return "text-destructive border-destructive/40";
}

export default function HttpStatusTool() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => lookupHttpStatus(query), [query]);

  const copyAll = results
    .map((s) => `${s.code} ${s.phrase} — ${s.description}`)
    .join("\n");

  return (
    <NetworkToolShell
      title={
        <>
          HTTP <span className="neon-text">Status</span>
        </>
      }
      subtitle="Look up status codes by number, phrase, or category — 1xx through 5xx."
    >
      <RevealItem>
        <CyberCard variant="terminal" terminalTitle="search.cfg" hoverEffect={false} className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <FieldLabel htmlFor="q">Search</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="404, unauthorized, success..."
                />
              </div>
            </div>
            <CopyButton text={copyAll} label="Copy results" />
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {"> "}{results.length} code(s)
          </p>
        </CyberCard>
      </RevealItem>

      <RevealItem>
        <div className="space-y-3">
          {results.map((s) => (
            <CyberCard key={s.code} hoverEffect className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-heading text-xl tracking-wider neon-text">
                      {s.code}
                    </span>
                    <span className="font-mono text-sm">{s.phrase}</span>
                    <span
                      className={cn(
                        "font-label text-[9px] uppercase tracking-widest px-1.5 py-0.5 border",
                        categoryColor(s.category)
                      )}
                    >
                      {s.category}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {s.description}
                  </p>
                </div>
                <CopyButton text={`${s.code} ${s.phrase}`} label="Copy" />
              </div>
            </CyberCard>
          ))}
        </div>
      </RevealItem>
    </NetworkToolShell>
  );
}
