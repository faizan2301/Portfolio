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
import {
  SAMPLE_COMPOSE,
  validateDockerCompose,
} from "@/lib/tools/git-devops/validators";
import { cn } from "@/lib/utils";

export default function DockerComposeTool() {
  const [input, setInput] = useState(SAMPLE_COMPOSE);
  const result = useMemo(() => validateDockerCompose(input), [input]);

  const report = [
    result.valid ? "✓ Compose looks valid" : "✗ Compose has errors",
    result.summary,
    "",
    ...result.errors.map((e) => `ERROR: ${e}`),
    ...result.warnings.map((w) => `WARN: ${w}`),
    result.services.length ? `\nServices (${result.services.length}):` : "",
    ...result.services.map((s) => `  - ${s}`),
  ]
    .filter((l) => l !== "")
    .join("\n");

  return (
    <GitDevopsToolShell
      title={
        <>
          Docker Compose <span className="neon-text">Validator</span>
        </>
      }
      subtitle="Validate docker-compose YAML, catch missing image/build, and list services."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="compose.yaml" hoverEffect={false}>
            <div className="flex flex-wrap gap-2 mb-3">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => setInput(SAMPLE_COMPOSE)}
              >
                Load sample
              </CyberButton>
              <CopyButton text={input} label="Copy YAML" />
            </div>
            <FieldLabel htmlFor="compose">Compose file</FieldLabel>
            <div className="cyber-input-wrap cyber-textarea-wrap">
              <textarea
                id="compose"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={18}
                spellCheck={false}
                className="cyber-input cyber-textarea w-full text-xs font-mono resize-y min-h-[320px]"
              />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="validation.out" hoverEffect={false}>
            <p
              className={cn(
                "font-label text-[10px] uppercase tracking-widest mb-3",
                result.valid ? "text-primary" : "text-destructive"
              )}
            >
              {result.valid ? "Valid" : "Invalid"}
            </p>
            <OutputBlock value={report} className="min-h-[360px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </GitDevopsToolShell>
  );
}
