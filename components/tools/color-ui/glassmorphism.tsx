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
  buildGlassCss,
  hexToRgb,
  normalizeHex,
  type GlassOptions,
} from "@/lib/tools/color-ui/color";

export default function GlassmorphismTool() {
  const [opts, setOpts] = useState<GlassOptions>({
    bgColor: "#FFFFFF",
    opacity: 0.15,
    blur: 16,
    saturate: 140,
    borderOpacity: 0.25,
    borderWidth: 1,
    radius: 16,
  });

  const css = useMemo(() => buildGlassCss(opts), [opts]);
  const rgb = hexToRgb(normalizeHex(opts.bgColor) ?? "#FFFFFF") ?? {
    r: 255,
    g: 255,
    b: 255,
  };

  const set = <K extends keyof GlassOptions>(key: K, value: GlassOptions[K]) => {
    setOpts((o) => ({ ...o, [key]: value }));
  };

  return (
    <ColorUiToolShell
      title={
        <>
          Glass<span className="neon-text">morphism</span>
        </>
      }
      subtitle="Generate frosted-glass CSS with blur, saturation, opacity, and border controls."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="glass.cfg" hoverEffect={false}>
            <div className="mb-3 flex items-end gap-3">
              <div>
                <FieldLabel>Tint</FieldLabel>
                <input
                  type="color"
                  value={(normalizeHex(opts.bgColor) ?? "#FFFFFF").slice(0, 7)}
                  onChange={(e) => set("bgColor", e.target.value.toUpperCase())}
                  className="w-12 h-10 cursor-pointer bg-transparent border border-border"
                />
              </div>
              <div className="flex-1">
                <FieldLabel htmlFor="glassHex">HEX</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="glassHex"
                    value={opts.bgColor}
                    onChange={(e) => set("bgColor", e.target.value)}
                    className="cyber-input w-full text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {(
              [
                ["opacity", "Opacity", 0, 1, 0.01],
                ["blur", "Blur (px)", 0, 40, 1],
                ["saturate", "Saturate (%)", 50, 200, 1],
                ["borderOpacity", "Border opacity", 0, 1, 0.01],
                ["borderWidth", "Border width", 0, 4, 1],
                ["radius", "Radius (px)", 0, 48, 1],
              ] as const
            ).map(([key, label, min, max, step]) => (
              <div key={key} className="mb-3">
                <FieldLabel>
                  {label}:{" "}
                  {Number(opts[key]).toFixed(step < 1 ? 2 : 0)}
                </FieldLabel>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={opts[key] as number}
                  onChange={(e) => set(key, Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            ))}

            <CopyButton text={css} />
          </CyberCard>

          <CyberCard variant="terminal" terminalTitle="preview.out" hoverEffect={false}>
            <div
              className="relative min-h-[280px] mb-4 overflow-hidden border border-border/40 flex items-center justify-center p-6"
              style={{
                background:
                  "linear-gradient(135deg, #00ff88 0%, #00d4ff 40%, #ff00ff 100%)",
              }}
            >
              <div
                className="w-full max-w-[260px] p-6 text-center"
                style={{
                  background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opts.opacity})`,
                  backdropFilter: `blur(${opts.blur}px) saturate(${opts.saturate}%)`,
                  WebkitBackdropFilter: `blur(${opts.blur}px) saturate(${opts.saturate}%)`,
                  border: `${opts.borderWidth}px solid rgba(255, 255, 255, ${opts.borderOpacity})`,
                  borderRadius: `${opts.radius}px`,
                }}
              >
                <p className="font-heading text-sm tracking-widest text-white drop-shadow">
                  FROSTED UI
                </p>
                <p className="font-mono text-[11px] text-white/80 mt-2">
                  Glassmorphism card
                </p>
              </div>
            </div>
            <OutputBlock value={css} />
          </CyberCard>
        </div>
      </RevealItem>
    </ColorUiToolShell>
  );
}
