"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  NetworkToolShell,
  OutputBlock,
} from "@/components/tools/network/shared";
import { parseUrl } from "@/lib/tools/network/core";

export default function UrlParserTool() {
  const [input, setInput] = useState(
    "https://user:pass@example.com:8443/path/to/page?q=hello&lang=en#section"
  );

  const parsed = useMemo(() => parseUrl(input), [input]);

  const report = !parsed.ok
    ? ""
    : [
        `href:      ${parsed.href}`,
        `origin:    ${parsed.origin}`,
        `protocol:  ${parsed.protocol}`,
        `username:  ${parsed.username || "(none)"}`,
        `password:  ${parsed.password || "(none)"}`,
        `host:      ${parsed.host}`,
        `hostname:  ${parsed.hostname}`,
        `port:      ${parsed.port || "(default)"}`,
        `pathname:  ${parsed.pathname}`,
        `search:    ${parsed.search || "(none)"}`,
        `hash:      ${parsed.hash || "(none)"}`,
        "",
        "Query params:",
        ...(parsed.params?.length
          ? parsed.params.map((p) => `  ${p.key} = ${p.value}`)
          : ["  (none)"]),
      ].join("\n");

  return (
    <NetworkToolShell
      title={
        <>
          URL <span className="neon-text">Parser</span>
        </>
      }
      subtitle="Split any URL into protocol, auth, host, port, path, query params, and hash."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="url.in" hoverEffect={false}>
            <FieldLabel htmlFor="url">URL</FieldLabel>
            <div className="cyber-input-wrap cyber-textarea-wrap mb-4">
              <textarea
                id="url"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={5}
                className="cyber-input cyber-textarea w-full text-xs font-mono resize-y"
              />
            </div>
            <CopyButton text={report} />
            {!parsed.ok && (
              <p className="mt-3 font-mono text-xs text-destructive">
                {"> "}{parsed.error}
              </p>
            )}
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="parts.out" hoverEffect={false}>
            {parsed.ok && parsed.params && parsed.params.length > 0 && (
              <div className="mb-4 space-y-1">
                <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-2">
                  Query params
                </p>
                {parsed.params.map((p, i) => (
                  <div
                    key={`${p.key}-${i}`}
                    className="flex gap-2 font-mono text-xs border border-border/50 px-2 py-1"
                  >
                    <span className="text-primary">{p.key}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="break-all">{p.value}</span>
                  </div>
                ))}
              </div>
            )}
            <OutputBlock value={report} className="min-h-[280px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </NetworkToolShell>
  );
}
