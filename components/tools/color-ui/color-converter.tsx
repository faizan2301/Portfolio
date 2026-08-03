"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  ColorSwatch,
  ColorUiToolShell,
  CopyButton,
  FieldLabel,
  OutputBlock,
} from "@/components/tools/color-ui/shared";
import {
  formatHsl,
  formatRgb,
  hexToRgb,
  hslToRgb,
  normalizeHex,
  rgbToHex,
  rgbToHsl,
  type Hsl,
  type Rgb,
} from "@/lib/tools/color-ui/color";

type Source = "hex" | "rgb" | "hsl";

export default function ColorConverterTool() {
  const [hex, setHex] = useState("#00D4FF");
  const [rgb, setRgb] = useState<Rgb>({ r: 0, g: 212, b: 255 });
  const [hsl, setHsl] = useState<Hsl>({ h: 190, s: 100, l: 50 });
  const [source, setSource] = useState<Source>("hex");

  const syncFromHex = (value: string) => {
    setHex(value);
    setSource("hex");
    const n = normalizeHex(value);
    const next = n ? hexToRgb(n) : null;
    if (!next) return;
    setRgb(next);
    setHsl(rgbToHsl(next));
  };

  const syncFromRgb = (next: Rgb) => {
    setRgb(next);
    setSource("rgb");
    setHex(rgbToHex(next));
    setHsl(rgbToHsl(next));
  };

  const syncFromHsl = (next: Hsl) => {
    setHsl(next);
    setSource("hsl");
    const nextRgb = hslToRgb(next);
    setRgb(nextRgb);
    setHex(rgbToHex(nextRgb));
  };

  const valid = useMemo(() => !!normalizeHex(hex), [hex]);
  const report = valid
    ? [
        `HEX:  ${normalizeHex(hex)}`,
        `RGB:  ${formatRgb(rgb)}`,
        `HSL:  ${formatHsl(hsl)}`,
        ``,
        `/* CSS */`,
        `color: ${normalizeHex(hex)};`,
        `color: ${formatRgb(rgb)};`,
        `color: ${formatHsl(hsl)};`,
      ].join("\n")
    : "";

  return (
    <ColorUiToolShell
      title={
        <>
          HEX ↔ RGB ↔ <span className="neon-text">HSL</span>
        </>
      }
      subtitle="Convert between HEX, RGB, and HSL — edit any channel and the rest stay in sync."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="convert.cfg" hoverEffect={false}>
            <div className="mb-4">
              <FieldLabel htmlFor="hexIn">HEX {source === "hex" ? "●" : ""}</FieldLabel>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(normalizeHex(hex) ?? "#00D4FF").slice(0, 7)}
                  onChange={(e) => syncFromHex(e.target.value.toUpperCase())}
                  className="w-12 h-10 cursor-pointer bg-transparent border border-border shrink-0"
                />
                <div className="cyber-input-wrap flex-1">
                  <input
                    id="hexIn"
                    value={hex}
                    onChange={(e) => syncFromHex(e.target.value)}
                    className="cyber-input w-full text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-2">
              RGB {source === "rgb" ? "●" : ""}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["r", "g", "b"] as const).map((ch) => (
                <div key={ch}>
                  <FieldLabel>{ch.toUpperCase()}</FieldLabel>
                  <div className="cyber-input-wrap">
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb[ch]}
                      onChange={(e) =>
                        syncFromRgb({
                          ...rgb,
                          [ch]: Math.min(255, Math.max(0, Number(e.target.value) || 0)),
                        })
                      }
                      className="cyber-input w-full text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-2">
              HSL {source === "hsl" ? "●" : ""}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(
                [
                  ["h", 360],
                  ["s", 100],
                  ["l", 100],
                ] as const
              ).map(([ch, max]) => (
                <div key={ch}>
                  <FieldLabel>{ch.toUpperCase()}</FieldLabel>
                  <div className="cyber-input-wrap">
                    <input
                      type="number"
                      min={0}
                      max={max}
                      value={Math.round(hsl[ch])}
                      onChange={(e) =>
                        syncFromHsl({
                          ...hsl,
                          [ch]: Math.min(max, Math.max(0, Number(e.target.value) || 0)),
                        })
                      }
                      className="cyber-input w-full text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <ColorSwatch color={normalizeHex(hex) ?? "#000"} className="h-16 w-full mb-4" />
            <CopyButton text={report} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="values.out" hoverEffect={false}>
            {valid ? (
              <OutputBlock value={report} className="min-h-[280px]" />
            ) : (
              <p className="font-mono text-xs text-destructive">{"> "}Invalid HEX.</p>
            )}
          </CyberCard>
        </div>
      </RevealItem>
    </ColorUiToolShell>
  );
}
