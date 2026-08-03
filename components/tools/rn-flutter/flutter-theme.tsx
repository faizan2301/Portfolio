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
import { buildFlutterTheme } from "@/lib/tools/rn-flutter/core";

export default function FlutterThemeTool() {
  const [primary, setPrimary] = useState("#00FF88");
  const [secondary, setSecondary] = useState("#00D4FF");
  const [background, setBackground] = useState("#0A0A0F");
  const [surface, setSurface] = useState("#12121A");
  const [error, setError] = useState("#FF3366");
  const [brightness, setBrightness] = useState<"light" | "dark">("dark");
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [useMaterial3, setUseMaterial3] = useState(true);

  const code = useMemo(
    () =>
      buildFlutterTheme({
        primary,
        secondary,
        background,
        surface,
        error,
        brightness,
        fontFamily,
        useMaterial3,
      }),
    [
      primary,
      secondary,
      background,
      surface,
      error,
      brightness,
      fontFamily,
      useMaterial3,
    ]
  );

  const ColorField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex gap-2">
        <input
          type="color"
          value={value.slice(0, 7)}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="w-10 h-10 border border-border bg-transparent cursor-pointer"
        />
        <div className="cyber-input-wrap flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="cyber-input w-full text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );

  return (
    <RnFlutterToolShell
      title={
        <>
          Flutter <span className="neon-text">Theme</span>
        </>
      }
      subtitle="Generate a ThemeData + ColorScheme starter from your brand palette."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="theme.cfg" hoverEffect={false}>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <ColorField label="Primary" value={primary} onChange={setPrimary} />
              <ColorField label="Secondary" value={secondary} onChange={setSecondary} />
              <ColorField label="Background" value={background} onChange={setBackground} />
              <ColorField label="Surface" value={surface} onChange={setSurface} />
              <ColorField label="Error" value={error} onChange={setError} />
              <div>
                <FieldLabel>Font family</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              {(
                [
                  ["dark", "Dark"],
                  ["light", "Light"],
                ] as const
              ).map(([id, label]) => (
                <label key={id} className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="radio"
                    checked={brightness === id}
                    onChange={() => setBrightness(id)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
              <label className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMaterial3}
                  onChange={(e) => setUseMaterial3(e.target.checked)}
                  className="accent-primary"
                />
                Material 3
              </label>
            </div>
            <div className="flex gap-2 mb-4 h-16 overflow-hidden border border-border/50">
              {[primary, secondary, background, surface, error].map((c) => (
                <div key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <CopyButton text={code} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="theme.dart" hoverEffect={false}>
            <OutputBlock value={code} className="min-h-[420px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </RnFlutterToolShell>
  );
}
