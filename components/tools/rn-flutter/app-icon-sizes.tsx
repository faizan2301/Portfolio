"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  OutputBlock,
  RnFlutterToolShell,
} from "@/components/tools/rn-flutter/shared";
import {
  buildIconSizeMarkdown,
  generateIconSizes,
} from "@/lib/tools/rn-flutter/core";

export default function AppIconSizesTool() {
  const [base, setBase] = useState(1024);
  const [platform, setPlatform] = useState<"All" | "iOS" | "Android" | "Web">("All");

  const sizes = useMemo(() => {
    const all = generateIconSizes(base);
    if (platform === "All") return all;
    return all.filter((s) => s.platform === platform || s.name.includes("Master"));
  }, [base, platform]);

  const markdown = useMemo(() => buildIconSizeMarkdown(base), [base]);

  return (
    <RnFlutterToolShell
      title={
        <>
          App Icon <span className="neon-text">Sizes</span>
        </>
      }
      subtitle="Required iOS, Android, and web icon dimensions — export from a square master asset."
    >
      <RevealItem>
        <CyberCard variant="terminal" terminalTitle="icon.cfg" hoverEffect={false} className="mb-4 sm:mb-6">
          <div className="grid sm:grid-cols-3 gap-3 items-end">
            <div>
              <FieldLabel htmlFor="base">Master size (px)</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="base"
                  type="number"
                  value={base}
                  onChange={(e) => setBase(Number(e.target.value) || 1024)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="plat">Platform</FieldLabel>
              <div className="cyber-input-wrap">
                <select
                  id="plat"
                  value={platform}
                  onChange={(e) =>
                    setPlatform(e.target.value as typeof platform)
                  }
                  className="cyber-input w-full text-sm appearance-none cursor-pointer"
                >
                  {["All", "iOS", "Android", "Web"].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <CopyButton text={markdown} label="Copy markdown" />
          </div>
        </CyberCard>
      </RevealItem>

      <RevealItem>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 sm:mb-6">
          {sizes.map((s) => (
            <CyberCard key={`${s.platform}-${s.name}`} hoverEffect className="p-4">
              <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-1">
                {s.platform}
              </p>
              <p className="font-mono text-sm mb-1">{s.name}</p>
              <p className="font-heading text-lg tracking-wider neon-text">
                {s.size}×{s.size}
              </p>
              {s.idiom && (
                <p className="font-mono text-[11px] text-muted-foreground mt-1">
                  {s.idiom}
                </p>
              )}
            </CyberCard>
          ))}
        </div>
      </RevealItem>

      <RevealItem>
        <CyberCard variant="terminal" terminalTitle="sizes.md" hoverEffect={false}>
          <OutputBlock value={markdown} />
        </CyberCard>
      </RevealItem>
    </RnFlutterToolShell>
  );
}
