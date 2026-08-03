"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Braces,
  Check,
  ClipboardCopy,
  Eraser,
  FileCode2,
  Loader2,
  Sparkles,
} from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import {
  jsonToTypeScript,
  SAMPLE_JSON,
  type OutputStyle,
} from "@/lib/tools/json-to-typescript";
import { cn } from "@/lib/utils";

export default function JsonToTypescriptTool() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [rootName, setRootName] = useState("Root");
  const [style, setStyle] = useState<OutputStyle>("interface");
  const [exportTypes, setExportTypes] = useState(true);
  const [useOptionalProps, setUseOptionalProps] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!jsonInput.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    startTransition(() => {
      const result = jsonToTypeScript(jsonInput, {
        rootName,
        style,
        exportTypes,
        useOptionalProps,
      });

      if (result.error) {
        setError(result.error);
        setOutput("");
        return;
      }

      setError(null);
      setOutput(result.code);
    });
  }, [rootName, style, exportTypes, useOptionalProps, jsonInput]);

  const convert = () => {
    startTransition(() => {
      const result = jsonToTypeScript(jsonInput, {
        rootName,
        style,
        exportTypes,
        useOptionalProps,
      });

      if (result.error) {
        setError(result.error);
        setOutput("");
        return;
      }

      setError(null);
      setOutput(result.code);
    });
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setJsonInput("");
    setOutput("");
    setError(null);
  };

  const handleLoadSample = () => {
    setJsonInput(SAMPLE_JSON);
  };

  const checkboxClass =
    "accent-primary w-3.5 h-3.5 shrink-0 cursor-pointer";

  return (
    <section className="py-24 sm:py-28 md:py-32 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00ff88, transparent)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }}
      />

      <RevealGroup className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10" stagger={80}>
        <RevealItem>
          <SectionHeading
            badge="// Tools"
            title={
              <>
                JSON →{" "}
                <span className="neon-text">TypeScript</span>
              </>
            }
            subtitle="Paste JSON and generate interfaces or type aliases instantly."
          />
        </RevealItem>

        <RevealItem>
          <CyberCard variant="terminal" terminalTitle="options.cfg" hoverEffect={false}>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-end">
              <div className="flex-1 min-w-[140px]">
                <label
                  htmlFor="rootName"
                  className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
                >
                  Root Name
                </label>
                <div className="cyber-input-wrap">
                  <input
                    id="rootName"
                    type="text"
                    value={rootName}
                    onChange={(e) => setRootName(e.target.value)}
                    className="cyber-input w-full text-sm"
                    placeholder="Root"
                  />
                </div>
              </div>

              <div className="min-w-[140px]">
                <label
                  htmlFor="style"
                  className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
                >
                  Style
                </label>
                <div className="cyber-input-wrap">
                  <select
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value as OutputStyle)}
                    className="cyber-input w-full text-sm appearance-none cursor-pointer"
                  >
                    <option value="interface">interface</option>
                    <option value="type">type alias</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={exportTypes}
                  onChange={(e) => setExportTypes(e.target.checked)}
                  className={checkboxClass}
                />
                Export
              </label>

              <label className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={useOptionalProps}
                  onChange={(e) => setUseOptionalProps(e.target.checked)}
                  className={checkboxClass}
                />
                Optional missing / null
              </label>
            </div>
          </CyberCard>
        </RevealItem>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <RevealItem>
            <CyberCard
              variant="terminal"
              terminalTitle="input.json"
              hoverEffect={false}
              className="h-full flex flex-col"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <CyberButton type="button" variant="glitch" onClick={() => convert()} className="text-xs px-3 py-2">
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Converting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} /> Generate
                    </>
                  )}
                </CyberButton>
                <CyberButton type="button" variant="outline" onClick={handleLoadSample} className="text-xs px-3 py-2">
                  <Braces className="w-3.5 h-3.5" strokeWidth={1.5} /> Sample
                </CyberButton>
                <CyberButton type="button" variant="secondary" onClick={handleClear} className="text-xs px-3 py-2">
                  <Eraser className="w-3.5 h-3.5" strokeWidth={1.5} /> Clear
                </CyberButton>
              </div>
              <div className="cyber-input-wrap cyber-textarea-wrap flex-1">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  spellCheck={false}
                  rows={18}
                  className="cyber-input cyber-textarea w-full text-xs sm:text-sm font-mono resize-y min-h-[280px]"
                  placeholder='{ "hello": "world" }'
                  aria-label="JSON input"
                />
              </div>
              {error && (
                <p className="mt-3 font-mono text-xs text-destructive" role="alert">
                  {"> "}Parse error: {error}
                </p>
              )}
            </CyberCard>
          </RevealItem>

          <RevealItem>
            <CyberCard
              variant="terminal"
              terminalTitle="output.ts"
              hoverEffect={false}
              className="h-full flex flex-col"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <CyberButton
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!output}
                  className="text-xs px-3 py-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-3.5 h-3.5" strokeWidth={1.5} /> Copy
                    </>
                  )}
                </CyberButton>
                <span className="font-label text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 ml-auto">
                  <FileCode2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  TypeScript
                </span>
              </div>
              <pre
                className={cn(
                  "flex-1 min-h-[280px] max-h-[520px] overflow-auto p-3 sm:p-4 border border-border/60 bg-background/50 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words",
                  !output && "text-muted-foreground"
                )}
                aria-label="Generated TypeScript"
              >
                {output || "> Output will appear here after generation..."}
              </pre>
            </CyberCard>
          </RevealItem>
        </div>
      </RevealGroup>
    </section>
  );
}
