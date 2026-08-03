"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
  OutputBlock,
} from "@/components/tools/mobile/shared";
import {
  calculateVersionCode,
  type VersionStrategy,
} from "@/lib/tools/mobile/versioning";
import { cn } from "@/lib/utils";

const STRATEGIES: { id: VersionStrategy; label: string; hint: string }[] = [
  { id: "semver-packed", label: "SemVer packed", hint: "M*1e6 + m*1e3 + p" },
  { id: "major-minor-patch", label: "M/m/p compact", hint: "M*10000 + m*100 + p" },
  { id: "flutter-style", label: "Flutter-style", hint: "M*1e5 + m*1e3 + p*10 + build" },
  { id: "date-based", label: "Date-based", hint: "YYMMDD + build" },
  { id: "incremental", label: "Incremental", hint: "Manual counter" },
];

export default function VersionCodeTool() {
  const [versionName, setVersionName] = useState("1.2.3+10");
  const [strategy, setStrategy] = useState<VersionStrategy>("semver-packed");
  const [incremental, setIncremental] = useState("100");

  const result = useMemo(
    () => calculateVersionCode(versionName, strategy, Number(incremental) || 1),
    [versionName, strategy, incremental]
  );

  const output =
    "error" in result
      ? ""
      : `versionName: ${versionName}\nversionCode: ${result.versionCode}\n\n${result.explanation}`;

  return (
    <MobileToolShell
      title={
        <>
          Version <span className="neon-text">Code</span>
        </>
      }
      subtitle="Calculate Android versionCode from versionName using common packaging strategies."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="version.cfg" hoverEffect={false}>
            <div className="mb-4">
              <FieldLabel htmlFor="versionName">versionName</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="versionName"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="1.2.3+10"
                />
              </div>
            </div>
            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-2">
              Strategy
            </p>
            <div className="space-y-2 mb-4">
              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStrategy(s.id)}
                  className={cn(
                    "w-full text-left p-3 border cyber-chamfer-sm transition-all",
                    strategy === s.id
                      ? "border-primary/60 bg-primary/10"
                      : "border-border/60 hover:border-primary/30"
                  )}
                >
                  <span className="font-label text-[11px] uppercase tracking-widest block">
                    {s.label}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">{s.hint}</span>
                </button>
              ))}
            </div>
            {strategy === "incremental" && (
              <div className="mb-4">
                <FieldLabel htmlFor="inc">versionCode value</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="inc"
                    type="number"
                    value={incremental}
                    onChange={(e) => setIncremental(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
            )}
            <CopyButton text={"error" in result ? "" : String(result.versionCode)} label="Copy code" />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="version.out" hoverEffect={false}>
            {"error" in result ? (
              <p className="font-mono text-sm text-destructive">{"> "}{result.error}</p>
            ) : (
              <OutputBlock value={output} />
            )}
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
