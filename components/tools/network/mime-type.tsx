"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  NetworkToolShell,
} from "@/components/tools/network/shared";
import { lookupMime } from "@/lib/tools/network/core";

export default function MimeTypeTool() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => lookupMime(query), [query]);

  return (
    <NetworkToolShell
      title={
        <>
          MIME <span className="neon-text">Types</span>
        </>
      }
      subtitle="Find content types by extension (.png) or MIME string (image/png)."
    >
      <RevealItem>
        <CyberCard variant="terminal" terminalTitle="search.cfg" hoverEffect={false} className="mb-4 sm:mb-6">
          <FieldLabel htmlFor="mimeQ">Search extension or MIME</FieldLabel>
          <div className="cyber-input-wrap">
            <input
              id="mimeQ"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="cyber-input w-full text-sm"
              placeholder="json, .webp, text/html..."
            />
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {"> "}{results.length} type(s)
          </p>
        </CyberCard>
      </RevealItem>

      <RevealItem>
        <div className="space-y-3">
          {results.map((m) => (
            <CyberCard key={m.mime} hoverEffect className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-sm text-primary break-all mb-1">
                    {m.mime}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mb-1">
                    {m.description}
                  </p>
                  {m.extensions.length > 0 && (
                    <p className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.extensions.join("  ")}
                    </p>
                  )}
                </div>
                <CopyButton text={m.mime} label="Copy MIME" />
              </div>
            </CyberCard>
          ))}
        </div>
      </RevealItem>
    </NetworkToolShell>
  );
}
