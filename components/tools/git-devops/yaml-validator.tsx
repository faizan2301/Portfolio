"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  GitDevopsToolShell,
  OutputBlock,
} from "@/components/tools/git-devops/shared";
import { SAMPLE_YAML, validateYaml } from "@/lib/tools/git-devops/validators";
import { cn } from "@/lib/utils";

export default function YamlValidatorTool() {
  const [input, setInput] = useState(SAMPLE_YAML);
  const result = useMemo(() => validateYaml(input), [input]);

  const report = result.valid
    ? [
        "✓ YAML is valid",
        ...result.warnings.map((w) => `WARN: ${w}`),
        "",
        "JSON preview:",
        result.jsonPreview,
      ].join("\n")
    : ["✗ YAML is invalid", ...result.errors.map((e) => `ERROR: ${e}`)].join("\n");

  return (
    <GitDevopsToolShell
      title={
        <>
          YAML <span className="neon-text">Validator</span>
        </>
      }
      subtitle="Parse YAML documents, surface syntax errors, and preview the normalized JSON."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="input.yaml" hoverEffect={false}>
            <div className="flex flex-wrap gap-2 mb-3">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => setInput(SAMPLE_YAML)}
              >
                Load sample
              </CyberButton>
              <CopyButton text={input} label="Copy YAML" />
            </div>
            <FieldLabel htmlFor="yaml">YAML</FieldLabel>
            <div className="cyber-input-wrap cyber-textarea-wrap">
              <textarea
                id="yaml"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={18}
                spellCheck={false}
                className="cyber-input cyber-textarea w-full text-xs font-mono resize-y min-h-[320px]"
              />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="result.out" hoverEffect={false}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <p
                className={cn(
                  "font-label text-[10px] uppercase tracking-widest",
                  result.valid ? "text-primary" : "text-destructive"
                )}
              >
                {result.valid ? "Valid" : "Invalid"}
              </p>
              {result.valid && (
                <CopyButton text={result.jsonPreview} label="Copy JSON" />
              )}
            </div>
            <OutputBlock value={report} className="min-h-[360px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </GitDevopsToolShell>
  );
}
