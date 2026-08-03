"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  GitDevopsToolShell,
  OutputBlock,
} from "@/components/tools/git-devops/shared";
import {
  GITIGNORE_PRESETS,
  buildGitignore,
} from "@/lib/tools/git-devops/generators";
import { cn } from "@/lib/utils";

export default function GitignoreTool() {
  const [selected, setSelected] = useState<string[]>(["node", "next", "os", "ide"]);
  const [custom, setCustom] = useState("");

  const output = useMemo(
    () => buildGitignore(selected, custom),
    [selected, custom]
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <GitDevopsToolShell
      title={
        <>
          .gitignore <span className="neon-text">Generator</span>
        </>
      }
      subtitle="Combine stack presets into a clean .gitignore — Node, Flutter, Python, OS, IDE, and more."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="presets.cfg" hoverEffect={false}>
            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-3">
              Presets
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {GITIGNORE_PRESETS.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    "flex items-center gap-2 p-2 border cursor-pointer font-mono text-xs cyber-chamfer-sm",
                    selected.includes(p.id)
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/30"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    className="accent-primary"
                  />
                  {p.label}
                </label>
              ))}
            </div>
            <FieldLabel htmlFor="customIgnore">Custom rules</FieldLabel>
            <div className="cyber-input-wrap cyber-textarea-wrap mb-4">
              <textarea
                id="customIgnore"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                rows={5}
                className="cyber-input cyber-textarea w-full text-xs font-mono resize-y"
                placeholder={"secrets/\n*.local"}
              />
            </div>
            <CopyButton text={output} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle=".gitignore" hoverEffect={false}>
            <OutputBlock value={output} className="min-h-[360px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </GitDevopsToolShell>
  );
}
