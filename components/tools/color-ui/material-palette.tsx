"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  ColorUiToolShell,
  CopyButton,
  FieldLabel,
  OutputBlock,
} from "@/components/tools/color-ui/shared";
import {
  bestTextColor,
  generateMaterialPalette,
  normalizeHex,
} from "@/lib/tools/color-ui/color";

export default function MaterialPaletteTool() {
  const [seed, setSeed] = useState("#6200EE");
  const palette = useMemo(
    () => generateMaterialPalette(normalizeHex(seed) ?? "#6200EE"),
    [seed]
  );

  const css = palette
    .map((p) => `  --md-primary-${p.tone}: ${p.hex};`)
    .join("\n");

  const fullCss = `:root {\n${css}\n}`;

  return (
    <ColorUiToolShell
      title={
        <>
          Material <span className="neon-text">Palette</span>
        </>
      }
      subtitle="Generate a Material-style tonal palette (50–900) from a primary seed color."
    >
      <RevealItem>
        <CyberCard variant="terminal" terminalTitle="seed.cfg" hoverEffect={false} className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <FieldLabel htmlFor="seedColor">Seed color</FieldLabel>
              <input
                id="seedColor"
                type="color"
                value={(normalizeHex(seed) ?? "#6200EE").slice(0, 7)}
                onChange={(e) => setSeed(e.target.value.toUpperCase())}
                className="w-16 h-12 cursor-pointer bg-transparent border border-border"
              />
            </div>
            <div className="flex-1 w-full">
              <FieldLabel htmlFor="seedHex">HEX</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="seedHex"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="cyber-input w-full text-sm font-mono"
                />
              </div>
            </div>
            <CopyButton text={fullCss} label="Copy CSS vars" />
          </div>
        </CyberCard>
      </RevealItem>

      <RevealItem>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4 sm:mb-6">
          {palette.map((p) => (
            <button
              key={p.tone}
              type="button"
              className="aspect-[4/3] border border-border/60 flex flex-col items-center justify-center gap-1 cyber-chamfer-sm"
              style={{ background: p.hex, color: bestTextColor(p.rgb) }}
              onClick={() => navigator.clipboard.writeText(p.hex)}
              title="Click to copy"
            >
              <span className="font-label text-[10px] tracking-widest">{p.tone}</span>
              <span className="font-mono text-[11px]">{p.hex}</span>
            </button>
          ))}
        </div>
      </RevealItem>

      <RevealItem>
        <CyberCard variant="terminal" terminalTitle="palette.css" hoverEffect={false}>
          <OutputBlock value={fullCss} />
        </CyberCard>
      </RevealItem>
    </ColorUiToolShell>
  );
}
