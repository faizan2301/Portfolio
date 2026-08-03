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
import { buildRnStyle } from "@/lib/tools/rn-flutter/core";

export default function RnStyleTool() {
  const [padding, setPadding] = useState(16);
  const [margin, setMargin] = useState(8);
  const [borderRadius, setBorderRadius] = useState(12);
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState<"400" | "500" | "600" | "700">("600");
  const [backgroundColor, setBackgroundColor] = useState("#12121A");
  const [color, setColor] = useState("#E0E0E0");
  const [shadow, setShadow] = useState(true);
  const [shadowOpacity, setShadowOpacity] = useState(0.25);
  const [shadowRadius, setShadowRadius] = useState(8);
  const [elevation, setElevation] = useState(4);

  const code = useMemo(
    () =>
      buildRnStyle({
        padding,
        margin,
        borderRadius,
        fontSize,
        fontWeight,
        backgroundColor,
        color,
        shadow,
        shadowOpacity,
        shadowRadius,
        elevation,
      }),
    [
      padding,
      margin,
      borderRadius,
      fontSize,
      fontWeight,
      backgroundColor,
      color,
      shadow,
      shadowOpacity,
      shadowRadius,
      elevation,
    ]
  );

  return (
    <RnFlutterToolShell
      title={
        <>
          RN <span className="neon-text">Style</span>
        </>
      }
      subtitle="Generate a React Native StyleSheet snippet with spacing, type, colors, and shadows."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="style.cfg" hoverEffect={false}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {(
                [
                  ["Padding", padding, setPadding],
                  ["Margin", margin, setMargin],
                  ["Radius", borderRadius, setBorderRadius],
                  ["Font size", fontSize, setFontSize],
                ] as const
              ).map(([label, val, setter]) => (
                <div key={label}>
                  <FieldLabel>
                    {label}: {val}
                  </FieldLabel>
                  <input
                    type="range"
                    min={0}
                    max={label === "Font size" ? 48 : 48}
                    value={val}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel>Font weight</FieldLabel>
                <div className="cyber-input-wrap">
                  <select
                    value={fontWeight}
                    onChange={(e) =>
                      setFontWeight(e.target.value as typeof fontWeight)
                    }
                    className="cyber-input w-full text-sm appearance-none cursor-pointer"
                  >
                    {["400", "500", "600", "700"].map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shadow}
                    onChange={(e) => setShadow(e.target.checked)}
                    className="accent-primary"
                  />
                  Include shadow
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel>Background</FieldLabel>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value.toUpperCase())}
                    className="w-10 h-10 border border-border bg-transparent cursor-pointer"
                  />
                  <div className="cyber-input-wrap flex-1">
                    <input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="cyber-input w-full text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>Text color</FieldLabel>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value.toUpperCase())}
                    className="w-10 h-10 border border-border bg-transparent cursor-pointer"
                  />
                  <div className="cyber-input-wrap flex-1">
                    <input
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="cyber-input w-full text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
            {shadow && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <FieldLabel>Opacity {shadowOpacity}</FieldLabel>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={shadowOpacity}
                    onChange={(e) => setShadowOpacity(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <FieldLabel>Radius {shadowRadius}</FieldLabel>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={shadowRadius}
                    onChange={(e) => setShadowRadius(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <FieldLabel>Elevation {elevation}</FieldLabel>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={elevation}
                    onChange={(e) => setElevation(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            )}
            <div
              className="mb-4 p-4 border border-border/50"
              style={{
                background: backgroundColor,
                borderRadius,
                padding,
                margin,
                color,
                fontSize,
                fontWeight: Number(fontWeight),
                boxShadow: shadow
                  ? `0 2px ${shadowRadius}px rgba(0,0,0,${shadowOpacity})`
                  : undefined,
              }}
            >
              Style preview
            </div>
            <CopyButton text={code} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="stylesheet.ts" hoverEffect={false}>
            <OutputBlock value={code} className="min-h-[420px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </RnFlutterToolShell>
  );
}
