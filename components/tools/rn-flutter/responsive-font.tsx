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
import { scaleFont } from "@/lib/tools/rn-flutter/core";

const PRESETS = [
  { label: "iPhone SE", width: 375 },
  { label: "iPhone 14", width: 390 },
  { label: "iPhone 14 Pro Max", width: 430 },
  { label: "Pixel 7", width: 412 },
  { label: "Tablet", width: 768 },
];

export default function ResponsiveFontTool() {
  const [designSize, setDesignSize] = useState(16);
  const [designWidth, setDesignWidth] = useState(375);
  const [targetWidth, setTargetWidth] = useState(430);
  const [minSize, setMinSize] = useState(12);
  const [maxSize, setMaxSize] = useState(24);
  const [clampEnabled, setClampEnabled] = useState(true);

  const scaled = useMemo(
    () =>
      scaleFont(
        designSize,
        designWidth,
        targetWidth,
        clampEnabled ? minSize : undefined,
        clampEnabled ? maxSize : undefined
      ),
    [designSize, designWidth, targetWidth, minSize, maxSize, clampEnabled]
  );

  const table = PRESETS.map((p) => {
    const size = scaleFont(
      designSize,
      designWidth,
      p.width,
      clampEnabled ? minSize : undefined,
      clampEnabled ? maxSize : undefined
    );
    return `${p.label.padEnd(18)} ${p.width}px → ${size}`;
  }).join("\n");

  const rnSnippet = `const scale = (size: number) =>
  (size * ${targetWidth}) / ${designWidth};

const fontSize = ${clampEnabled ? `Math.min(${maxSize}, Math.max(${minSize}, scale(${designSize})))` : `scale(${designSize})`};
// => ${scaled}`;

  const flutterSnippet = `double scaleFont(double size, double screenWidth) {
  final scaled = size * screenWidth / ${designWidth};
  ${clampEnabled ? `return scaled.clamp(${minSize}, ${maxSize});` : "return scaled;"}
}

// scaleFont(${designSize}, ${targetWidth}) => ${scaled}`;

  return (
    <RnFlutterToolShell
      title={
        <>
          Responsive <span className="neon-text">Font</span>
        </>
      }
      subtitle="Scale typography from a design width to any device width — with optional min/max clamps."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="scale.cfg" hoverEffect={false}>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel>Design font size</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    type="number"
                    value={designSize}
                    onChange={(e) => setDesignSize(Number(e.target.value) || 0)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Design width (px)</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    type="number"
                    value={designWidth}
                    onChange={(e) => setDesignWidth(Number(e.target.value) || 1)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Target width (px)</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(Number(e.target.value) || 1)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clampEnabled}
                    onChange={(e) => setClampEnabled(e.target.checked)}
                    className="accent-primary"
                  />
                  Clamp min/max
                </label>
              </div>
            </div>
            {clampEnabled && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <FieldLabel>Min</FieldLabel>
                  <div className="cyber-input-wrap">
                    <input
                      type="number"
                      value={minSize}
                      onChange={(e) => setMinSize(Number(e.target.value) || 0)}
                      className="cyber-input w-full text-sm"
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Max</FieldLabel>
                  <div className="cyber-input-wrap">
                    <input
                      type="number"
                      value={maxSize}
                      onChange={(e) => setMaxSize(Number(e.target.value) || 0)}
                      className="cyber-input w-full text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setTargetWidth(p.width)}
                  className="px-2 py-1 border border-border/60 font-label text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <StatCard label="Scaled size" value={scaled} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="output.out" hoverEffect={false}>
            <div className="mb-3 flex gap-2">
              <CopyButton text={rnSnippet} label="Copy RN" />
              <CopyButton text={flutterSnippet} label="Copy Flutter" />
            </div>
            <OutputBlock
              value={`${table}\n\n// React Native\n${rnSnippet}\n\n// Flutter\n${flutterSnippet}`}
              className="min-h-[320px]"
            />
          </CyberCard>
        </div>
      </RevealItem>
    </RnFlutterToolShell>
  );
}
