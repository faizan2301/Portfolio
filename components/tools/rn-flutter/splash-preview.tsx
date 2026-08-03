"use client";

import { useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  OutputBlock,
  RnFlutterToolShell,
} from "@/components/tools/rn-flutter/shared";

type Device = "iphone" | "android";

export default function SplashPreviewTool() {
  const [device, setDevice] = useState<Device>("iphone");
  const [bg, setBg] = useState("#0A0A0F");
  const [accent, setAccent] = useState("#00FF88");
  const [logoLabel, setLogoLabel] = useState("APP");
  const [logoSize, setLogoSize] = useState(72);
  const [showStatusBar, setShowStatusBar] = useState(true);

  const flutterSnippet = `// Flutter native splash (flutter_native_splash example)
flutter_native_splash:
  color: "${bg}"
  # image: assets/splash_logo.png
  android: true
  ios: true
`;

  const rnSnippet = `// React Native bootsplash / splash config notes
// background: ${bg}
// logo / brand mark centered
// logoSize ≈ ${logoSize}pt on design canvas
`;

  return (
    <RnFlutterToolShell
      title={
        <>
          Splash <span className="neon-text">Preview</span>
        </>
      }
      subtitle="Preview a simple splash layout for phone frames — background, logo size, and brand mark."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="splash.cfg" hoverEffect={false}>
            <div className="flex flex-wrap gap-4 mb-4">
              {(
                [
                  ["iphone", "iPhone"],
                  ["android", "Android"],
                ] as const
              ).map(([id, label]) => (
                <label key={id} className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="radio"
                    checked={device === id}
                    onChange={() => setDevice(id)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel>Background</FieldLabel>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value.toUpperCase())}
                    className="w-10 h-10 border border-border bg-transparent cursor-pointer"
                  />
                  <div className="cyber-input-wrap flex-1">
                    <input
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      className="cyber-input w-full text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>Accent</FieldLabel>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value.toUpperCase())}
                    className="w-10 h-10 border border-border bg-transparent cursor-pointer"
                  />
                  <div className="cyber-input-wrap flex-1">
                    <input
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      className="cyber-input w-full text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel htmlFor="logo">Logo text</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="logo"
                  value={logoLabel}
                  onChange={(e) => setLogoLabel(e.target.value)}
                  className="cyber-input w-full text-sm"
                  maxLength={8}
                />
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel>Logo size: {logoSize}px</FieldLabel>
              <input
                type="range"
                min={40}
                max={140}
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <label className="flex items-center gap-2 font-mono text-xs cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={showStatusBar}
                onChange={(e) => setShowStatusBar(e.target.checked)}
                className="accent-primary"
              />
              Show status bar chrome
            </label>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={flutterSnippet} label="Copy Flutter" />
              <CopyButton text={rnSnippet} label="Copy RN notes" />
            </div>
          </CyberCard>

          <CyberCard variant="terminal" terminalTitle="preview.out" hoverEffect={false}>
            <div className="flex justify-center mb-4">
              <div
                className="relative border border-border/60 overflow-hidden shadow-lg"
                style={{
                  width: device === "iphone" ? 220 : 210,
                  height: device === "iphone" ? 440 : 420,
                  borderRadius: device === "iphone" ? 36 : 24,
                  background: bg,
                }}
              >
                {showStatusBar && (
                  <div className="absolute top-0 inset-x-0 h-8 flex items-center justify-between px-5 font-mono text-[9px] text-white/70">
                    <span>9:41</span>
                    <span>●●●</span>
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div
                    className="flex items-center justify-center font-heading font-black tracking-widest"
                    style={{
                      width: logoSize,
                      height: logoSize,
                      borderRadius: logoSize * 0.22,
                      background: accent,
                      color: bg,
                      fontSize: logoSize * 0.28,
                    }}
                  >
                    {logoLabel.slice(0, 3) || "APP"}
                  </div>
                  <p
                    className="font-label text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: accent }}
                  >
                    {logoLabel || "Brand"}
                  </p>
                </div>
                <div className="absolute bottom-6 inset-x-0 flex justify-center">
                  <div
                    className="w-24 h-1 rounded-full opacity-40"
                    style={{ background: accent }}
                  />
                </div>
              </div>
            </div>
            <OutputBlock value={`${flutterSnippet}\n${rnSnippet}`} />
          </CyberCard>
        </div>
      </RevealItem>
    </RnFlutterToolShell>
  );
}
