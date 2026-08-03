"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
  buildBoxShadowCss,
  type ShadowLayer,
} from "@/lib/tools/color-ui/color";

function newLayer(): ShadowLayer {
  return {
    id: String(Date.now()),
    x: 0,
    y: 8,
    blur: 24,
    spread: -4,
    color: "#00000066",
    inset: false,
  };
}

export default function BoxShadowTool() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    {
      id: "1",
      x: 0,
      y: 4,
      blur: 6,
      spread: -1,
      color: "#0000001A",
      inset: false,
    },
    {
      id: "2",
      x: 0,
      y: 10,
      blur: 20,
      spread: -2,
      color: "#00000033",
      inset: false,
    },
  ]);

  const shadow = useMemo(() => buildBoxShadowCss(layers), [layers]);
  const css = `box-shadow: ${shadow};`;

  const update = (id: string, patch: Partial<ShadowLayer>) => {
    setLayers((list) => list.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  return (
    <ColorUiToolShell
      title={
        <>
          Box <span className="neon-text">Shadow</span>
        </>
      }
      subtitle="Layer multiple shadows with offset, blur, spread, color, and inset options."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="shadow.cfg" hoverEffect={false}>
            <div className="flex justify-end mb-3">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-2 py-1"
                onClick={() => setLayers((l) => [...l, newLayer()])}
              >
                <Plus className="w-3.5 h-3.5" /> Layer
              </CyberButton>
            </div>
            <div className="space-y-4 max-h-[420px] overflow-auto pr-1">
              {layers.map((layer, index) => (
                <div key={layer.id} className="border border-border/60 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-[10px] uppercase tracking-widest text-primary">
                      Layer {index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={layers.length <= 1}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                      onClick={() =>
                        setLayers((list) => list.filter((l) => l.id !== layer.id))
                      }
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["x", "X", -50, 50],
                        ["y", "Y", -50, 50],
                        ["blur", "Blur", 0, 100],
                        ["spread", "Spread", -50, 50],
                      ] as const
                    ).map(([key, label, min, max]) => (
                      <div key={key}>
                        <FieldLabel>
                          {label}: {layer[key]}px
                        </FieldLabel>
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={layer[key]}
                          onChange={(e) =>
                            update(layer.id, { [key]: Number(e.target.value) })
                          }
                          className="w-full accent-primary"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={layer.color.slice(0, 7)}
                      onChange={(e) =>
                        update(layer.id, {
                          color: e.target.value + (layer.color.length > 7 ? layer.color.slice(7) : "FF"),
                        })
                      }
                      className="w-10 h-10 cursor-pointer bg-transparent border border-border"
                    />
                    <div className="cyber-input-wrap flex-1">
                      <input
                        value={layer.color}
                        onChange={(e) => update(layer.id, { color: e.target.value })}
                        className="cyber-input w-full text-xs font-mono"
                        placeholder="#00000033"
                      />
                    </div>
                    <label className="flex items-center gap-1.5 font-mono text-[11px] cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={layer.inset}
                        onChange={(e) => update(layer.id, { inset: e.target.checked })}
                        className="accent-primary"
                      />
                      inset
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <CopyButton text={css} />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="preview.out" hoverEffect={false}>
            <div className="flex items-center justify-center min-h-[220px] mb-4 bg-[repeating-conic-gradient(#1c1c2e_0%_25%,#12121a_0%_50%)] bg-[length:16px_16px]">
              <div
                className="w-40 h-40 bg-card border border-border/40"
                style={{ boxShadow: shadow }}
              />
            </div>
            <OutputBlock value={css} />
          </CyberCard>
        </div>
      </RevealItem>
    </ColorUiToolShell>
  );
}
