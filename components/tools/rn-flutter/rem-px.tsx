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
import { pxToRem, remToPx } from "@/lib/tools/rn-flutter/core";

export default function RemPxTool() {
  const [value, setValue] = useState(1);
  const [root, setRoot] = useState(16);
  const [mode, setMode] = useState<"rem-to-px" | "px-to-rem">("rem-to-px");

  const result = useMemo(() => {
    return mode === "rem-to-px" ? remToPx(value, root) : pxToRem(value, root);
  }, [value, root, mode]);

  const report = [
    `Root font-size: ${root}px`,
    mode === "rem-to-px"
      ? `${value} rem = ${result} px`
      : `${value} px = ${result} rem`,
    "",
    "Common sizes:",
    ...[0.75, 0.875, 1, 1.125, 1.25, 1.5, 2].map(
      (r) => `${r} rem → ${remToPx(r, root)} px`
    ),
  ].join("\n");

  return (
    <RnFlutterToolShell
      title={
        <>
          rem ↔ <span className="neon-text">px</span>
        </>
      }
      subtitle="Convert rem and px with a configurable root font size — handy for web + RN web."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="convert.cfg" hoverEffect={false}>
            <div className="flex flex-wrap gap-4 mb-4">
              {(
                [
                  ["rem-to-px", "rem → px"],
                  ["px-to-rem", "px → rem"],
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
                <FieldLabel>{mode === "rem-to-px" ? "rem" : "px"}</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    type="number"
                    step="0.125"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value) || 0)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Root (px)</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    type="number"
                    value={root}
                    onChange={(e) => setRoot(Number(e.target.value) || 1)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
            </div>
            <StatCard
              label={mode === "rem-to-px" ? "Pixels" : "rem"}
              value={result}
            />
            <div className="mt-4">
              <CopyButton text={String(result)} />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="scale.out" hoverEffect={false}>
            <OutputBlock value={report} className="min-h-[280px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </RnFlutterToolShell>
  );
}
