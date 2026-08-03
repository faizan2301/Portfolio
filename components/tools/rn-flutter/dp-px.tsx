"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  OutputBlock,
  RnFlutterToolShell,
  StatCard,
} from "@/components/tools/rn-flutter/shared";
import {
  COMMON_DENSITIES,
  dpToPx,
  pxToDp,
} from "@/lib/tools/rn-flutter/core";

export default function DpPxTool() {
  const [value, setValue] = useState(16);
  const [mode, setMode] = useState<"dp-to-px" | "px-to-dp">("dp-to-px");
  const [density, setDensity] = useState(2);

  const result = useMemo(() => {
    return mode === "dp-to-px" ? dpToPx(value, density) : pxToDp(value, density);
  }, [value, mode, density]);

  const table = COMMON_DENSITIES.map((d) => {
    const out =
      mode === "dp-to-px" ? dpToPx(value, d.density) : pxToDp(value, d.density);
    return `${d.label.padEnd(16)} → ${out}`;
  }).join("\n");

  const report = [
    mode === "dp-to-px"
      ? `${value} dp × ${density} = ${result} px`
      : `${value} px ÷ ${density} = ${result} dp`,
    "",
    table,
  ].join("\n");

  return (
    <RnFlutterToolShell
      title={
        <>
          dp ↔ <span className="neon-text">px</span>
        </>
      }
      subtitle="Convert density-independent pixels to physical pixels across Android/iOS densities."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="convert.cfg" hoverEffect={false}>
            <div className="flex flex-wrap gap-4 mb-4">
              {(
                [
                  ["dp-to-px", "dp → px"],
                  ["px-to-dp", "px → dp"],
                ] as const
              ).map(([id, label]) => (
                <label key={id} className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="radio"
                    checked={mode === id}
                    onChange={() => setMode(id)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <FieldLabel>{mode === "dp-to-px" ? "dp" : "px"}</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value) || 0)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Density</FieldLabel>
                <div className="cyber-input-wrap">
                  <select
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                    className="cyber-input w-full text-sm appearance-none cursor-pointer"
                  >
                    {COMMON_DENSITIES.map((d) => (
                      <option key={d.id} value={d.density}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <StatCard
              label={mode === "dp-to-px" ? "Pixels" : "dp"}
              value={result}
            />
            <div className="mt-4">
              <CopyButton text={String(result)} />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="densities.out" hoverEffect={false}>
            <OutputBlock value={report} className="min-h-[280px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </RnFlutterToolShell>
  );
}
