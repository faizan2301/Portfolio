"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
} from "@/components/tools/mobile/shared";
import {
  filterPermissions,
  manifestSnippet,
  type PermissionLevel,
} from "@/lib/tools/mobile/permissions";
import { cn } from "@/lib/utils";

export default function PermissionFinderTool() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<PermissionLevel | "all">("all");

  const results = useMemo(() => filterPermissions(query, level), [query, level]);

  return (
    <MobileToolShell
      title={
        <>
          Permission <span className="neon-text">Finder</span>
        </>
      }
      subtitle="Search Android manifest permissions by name, group, or protection level."
    >
      <RevealItem>
        <CyberCard variant="terminal" terminalTitle="search.cfg" hoverEffect={false} className="mb-4 sm:mb-6">
          <div className="grid sm:grid-cols-[1fr_auto] gap-3">
            <div>
              <FieldLabel htmlFor="permQuery">Search</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="permQuery"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="camera, location, POST_NOTIFICATIONS..."
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="permLevel">Level</FieldLabel>
              <div className="cyber-input-wrap">
                <select
                  id="permLevel"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as PermissionLevel | "all")}
                  className="cyber-input w-full text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="normal">Normal</option>
                  <option value="dangerous">Dangerous</option>
                  <option value="signature">Signature</option>
                  <option value="special">Special</option>
                </select>
              </div>
            </div>
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {"> "}{results.length} permission(s) matched
          </p>
        </CyberCard>
      </RevealItem>

      <RevealItem>
        <div className="space-y-3">
          {results.map((p) => (
            <CyberCard key={p.name} hoverEffect className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-mono text-xs sm:text-sm text-primary break-all">
                      {p.name}
                    </h3>
                    <span
                      className={cn(
                        "font-label text-[9px] uppercase tracking-widest px-1.5 py-0.5 border",
                        p.level === "dangerous"
                          ? "border-destructive/50 text-destructive"
                          : p.level === "special"
                            ? "border-accent-tertiary/50 text-accent-tertiary"
                            : "border-primary/40 text-primary"
                      )}
                    >
                      {p.level}
                    </span>
                    {p.group && (
                      <span className="font-label text-[9px] uppercase tracking-widest text-muted-foreground">
                        {p.group}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground mb-2">
                    {p.description}
                  </p>
                  <code className="font-mono text-[11px] text-foreground/80 break-all">
                    {manifestSnippet(p.name)}
                  </code>
                </div>
                <CopyButton text={manifestSnippet(p.name)} label="Copy" />
              </div>
            </CyberCard>
          ))}
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
