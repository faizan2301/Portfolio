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
  bestTextColor,
  contrastRatio,
  formatHsl,
  formatRgb,
  hexToRgb,
  normalizeHex,
  rgbToHsl,
} from "@/lib/tools/color-ui/color";

export default function ColorPickerTool() {
  const [hex, setHex] = useState("#00FF88");

  const data = useMemo(() => {
    const normalized = normalizeHex(hex);
    const rgb = normalized ? hexToRgb(normalized) : null;
    if (!rgb || !normalized) return null;
    const hsl = rgbToHsl(rgb);
    const onWhite = contrastRatio(rgb, { r: 255, g: 255, b: 255 });
    const onBlack = contrastRatio(rgb, { r: 0, g: 0, b: 0 });
    return {
      hex: normalized,
      rgb,
      hsl,
      text: bestTextColor(rgb),
      onWhite,
      onBlack,
      css: [
        `/* Selected color */`,
        `--color: ${normalized};`,
        `--color-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`,
        `background: ${normalized};`,
        `color: ${bestTextColor(rgb)};`,
        ``,
        formatRgb(rgb),
        formatHsl(hsl),
      ].join("\n"),
    };
  }, [hex]);

  return (
    <ColorUiToolShell
      title={
        <>
          Color <span className="neon-text">Picker</span>
        </>
      }
      subtitle="Pick any color and grab HEX, RGB, HSL, contrast tips, and CSS variables."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="picker.cfg" hoverEffect={false}>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div>
                <FieldLabel htmlFor="nativePicker">Picker</FieldLabel>
                <input
                  id="nativePicker"
                  type="color"
                  value={(normalizeHex(hex) ?? "#00FF88").slice(0, 7)}
                  onChange={(e) => setHex(e.target.value.toUpperCase())}
                  className="w-20 h-20 cursor-pointer bg-transparent border border-border"
                />
              </div>
              <div className="flex-1">
                <FieldLabel htmlFor="hex">HEX</FieldLabel>
                <div className="cyber-input-wrap mb-3">
                  <input
                    id="hex"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="cyber-input w-full text-sm font-mono"
                    placeholder="#00FF88"
                  />
                </div>
                {data && (
                  <ColorSwatch color={data.hex} className="h-16 w-full" />
                )}
              </div>
            </div>
            {data && (
              <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
                <div className="border border-border/60 p-2">
                  <span className="text-muted-foreground">RGB</span>
                  <p>{formatRgb(data.rgb)}</p>
                </div>
                <div className="border border-border/60 p-2">
                  <span className="text-muted-foreground">HSL</span>
                  <p>{formatHsl(data.hsl)}</p>
                </div>
                <div className="border border-border/60 p-2">
                  <span className="text-muted-foreground">vs white</span>
                  <p>{data.onWhite.toFixed(2)}:1</p>
                </div>
                <div className="border border-border/60 p-2">
                  <span className="text-muted-foreground">vs black</span>
                  <p>{data.onBlack.toFixed(2)}:1</p>
                </div>
              </div>
            )}
            <CopyButton text={data?.hex ?? ""} label="Copy HEX" />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="css.out" hoverEffect={false}>
            {data ? (
              <>
                <div
                  className="mb-4 h-24 flex items-center justify-center border border-border/60 font-heading tracking-widest text-sm"
                  style={{ background: data.hex, color: data.text }}
                >
                  Aa Preview
                </div>
                <div className="mb-3">
                  <CopyButton text={data.css} label="Copy CSS" />
                </div>
                <OutputBlock value={data.css} />
              </>
            ) : (
              <p className="font-mono text-xs text-destructive">{"> "}Invalid HEX color.</p>
            )}
          </CyberCard>
        </div>
      </RevealItem>
    </ColorUiToolShell>
  );
}
