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
  buildGradientCss,
  type GradientStop,
  type GradientType,
} from "@/lib/tools/color-ui/color";

export default function GradientTool() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: "1", color: "#00FF88", position: 0 },
    { id: "2", color: "#00D4FF", position: 50 },
    { id: "3", color: "#FF00FF", position: 100 },
  ]);

  const cssValue = useMemo(
    () => buildGradientCss(type, angle, stops),
    [type, angle, stops]
  );
  const cssBlock = `background: ${cssValue};`;

  return (
    <ColorUiToolShell
      title={
        <>
          Gradient <span className="neon-text">Generator</span>
        </>
      }
      subtitle="Design linear or radial gradients with multiple color stops and copy the CSS."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="gradient.cfg" hoverEffect={false}>
            <div className="flex flex-wrap gap-4 mb-4">
              {(["linear", "radial"] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="radio"
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="accent-primary"
                  />
                  {t}
                </label>
              ))}
            </div>
            {type === "linear" && (
              <div className="mb-4">
                <FieldLabel htmlFor="angle">Angle: {angle}°</FieldLabel>
                <input
                  id="angle"
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <FieldLabel>Stops</FieldLabel>
                <CyberButton
                  type="button"
                  variant="outline"
                  className="text-xs px-2 py-1"
                  onClick={() =>
                    setStops((s) => [
                      ...s,
                      {
                        id: String(Date.now()),
                        color: "#FFFFFF",
                        position: 50,
                      },
                    ])
                  }
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </CyberButton>
              </div>
              {stops.map((stop, i) => (
                <div key={stop.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-end">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) =>
                      setStops((list) =>
                        list.map((s, idx) =>
                          idx === i ? { ...s, color: e.target.value.toUpperCase() } : s
                        )
                      )
                    }
                    className="w-10 h-10 cursor-pointer bg-transparent border border-border"
                  />
                  <div>
                    <FieldLabel>HEX</FieldLabel>
                    <div className="cyber-input-wrap">
                      <input
                        value={stop.color}
                        onChange={(e) =>
                          setStops((list) =>
                            list.map((s, idx) =>
                              idx === i ? { ...s, color: e.target.value } : s
                            )
                          )
                        }
                        className="cyber-input w-full text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>{stop.position}%</FieldLabel>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) =>
                        setStops((list) =>
                          list.map((s, idx) =>
                            idx === i ? { ...s, position: Number(e.target.value) } : s
                          )
                        )
                      }
                      className="w-full accent-primary"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={stops.length <= 2}
                    className="p-2 text-muted-foreground hover:text-destructive disabled:opacity-30"
                    onClick={() => setStops((list) => list.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <CopyButton text={cssBlock} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="preview.out" hoverEffect={false}>
            <div
              className="h-48 sm:h-64 border border-border/60 mb-4"
              style={{ background: cssValue }}
            />
            <OutputBlock value={cssBlock} />
          </CyberCard>
        </div>
      </RevealItem>
    </ColorUiToolShell>
  );
}
