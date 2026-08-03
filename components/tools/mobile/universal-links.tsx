"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
  OutputBlock,
} from "@/components/tools/mobile/shared";
import {
  SAMPLE_AASA,
  matchUrlAgainstAasa,
  validateAasaJson,
} from "@/lib/tools/mobile/universal-links";
import { cn } from "@/lib/utils";

export default function UniversalLinksTool() {
  const [aasa, setAasa] = useState(SAMPLE_AASA);
  const [testUrl, setTestUrl] = useState("https://example.com/product/42");

  const validation = useMemo(() => validateAasaJson(aasa), [aasa]);
  const match = useMemo(() => matchUrlAgainstAasa(testUrl, aasa), [testUrl, aasa]);

  const report = [
    validation.valid ? "✓ AASA structure looks valid" : "✗ AASA has errors",
    "",
    ...validation.errors.map((e) => `ERROR: ${e}`),
    ...validation.warnings.map((w) => `WARN: ${w}`),
    ...validation.details.map((d) => `INFO: ${d}`),
    validation.apps.length ? `Apps: ${validation.apps.join(", ")}` : "",
    "",
    `URL match: ${match.matched ? "YES" : "NO"}`,
    ...match.messages.map((m) => `  - ${m}`),
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <MobileToolShell
      title={
        <>
          Universal <span className="neon-text">Links</span>
        </>
      }
      subtitle="Validate apple-app-site-association JSON and test whether a URL path would match."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="aasa.json" hoverEffect={false}>
            <div className="flex gap-2 mb-3">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => setAasa(SAMPLE_AASA)}
              >
                Load sample
              </CyberButton>
              <CopyButton text={aasa} label="Copy JSON" />
            </div>
            <div className="cyber-input-wrap cyber-textarea-wrap mb-3">
              <textarea
                value={aasa}
                onChange={(e) => setAasa(e.target.value)}
                rows={14}
                spellCheck={false}
                className="cyber-input cyber-textarea w-full text-xs font-mono resize-y"
              />
            </div>
            <FieldLabel htmlFor="testUrl">Test URL</FieldLabel>
            <div className="cyber-input-wrap">
              <input
                id="testUrl"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="cyber-input w-full text-sm"
              />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="validation.out" hoverEffect={false}>
            <p
              className={cn(
                "font-label text-[10px] uppercase tracking-widest mb-3",
                validation.valid ? "text-primary" : "text-destructive"
              )}
            >
              {validation.valid ? "Valid" : "Invalid"} · Match{" "}
              {match.matched ? "yes" : "no"}
            </p>
            <OutputBlock value={report} />
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
