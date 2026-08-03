"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  ColorUiToolShell,
  CopyButton,
  FieldLabel,
  OutputBlock,
} from "@/components/tools/color-ui/shared";
import {
  buildBorderRadiusCss,
  type RadiusValues,
} from "@/lib/tools/color-ui/color";

export default function BorderRadiusTool() {
  const [linked, setLinked] = useState(true);
  const [radius, setRadius] = useState<RadiusValues>({
    tl: 16,
    tr: 16,
    br: 16,
    bl: 16,
  });

  const css = useMemo(() => buildBorderRadiusCss(radius), [radius]);

  const setAll = (value: number) => {
    setRadius({ tl: value, tr: value, br: value, bl: value });
  };

  const setCorner = (key: keyof RadiusValues, value: number) => {
    if (linked) {
      setAll(value);
      return;
    }
    setRadius((r) => ({ ...r, [key]: value }));
  };

  return (
    <ColorUiToolShell
      title={
        <>
          Border <span className="neon-text">Radius</span>
        </>
      }
      subtitle="Adjust all corners together or individually and copy production-ready CSS."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="radius.cfg" hoverEffect={false}>
            <label className="flex items-center gap-2 font-mono text-xs cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={linked}
                onChange={(e) => setLinked(e.target.checked)}
                className="accent-primary"
              />
              Link all corners
            </label>

            {(
              [
                ["tl", "Top left"],
                ["tr", "Top right"],
                ["br", "Bottom right"],
                ["bl", "Bottom left"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="mb-3">
                <FieldLabel>
                  {label}: {radius[key]}px
                </FieldLabel>
                <input
                  type="range"
                  min={0}
                  max={120}
                  value={radius[key]}
                  onChange={(e) => setCorner(key, Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            ))}

            <div className="flex flex-wrap gap-2 mt-2">
              {[0, 8, 16, 24, 999].map((v) => (
                <CyberButton
                  key={v}
                  type="button"
                  variant="outline"
                  className="text-xs px-3 py-1.5"
                  onClick={() => {
                    setLinked(true);
                    setAll(v);
                  }}
                >
                  {v === 999 ? "Pill" : `${v}px`}
                </CyberButton>
              ))}
              <CopyButton text={css} />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="preview.out" hoverEffect={false}>
            <div className="flex items-center justify-center min-h-[240px] mb-4 bg-background/40 border border-border/40">
              <div
                className="w-48 h-48 bg-primary/80 border border-primary/40"
                style={{
                  borderRadius: `${radius.tl}px ${radius.tr}px ${radius.br}px ${radius.bl}px`,
                }}
              />
            </div>
            <OutputBlock value={css} />
          </CyberCard>
        </div>
      </RevealItem>
    </ColorUiToolShell>
  );
}
