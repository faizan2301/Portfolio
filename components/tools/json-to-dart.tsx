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
  DEFAULT_DART_OPTIONS,
  jsonToDart,
  SAMPLE_JSON,
  type JsonToDartOptions,
} from "@/lib/tools/json-to-dart";
import { cn } from "@/lib/utils";

type CheckboxKey = keyof Omit<Required<JsonToDartOptions>, "rootName">;

const OPTION_GROUPS: {
  title: string;
  items: { key: CheckboxKey; label: string }[];
}[] = [
  {
    title: "Methods",
    items: [
      { key: "generateFromJson", label: "Generate fromJson" },
      { key: "generateToJson", label: "Generate toJson method" },
      { key: "generateCopyWith", label: "Generate copyWith method" },
      { key: "generateToString", label: "Generate toString method" },
      { key: "generateEquality", label: "Generate == / hashCode" },
    ],
  },
  {
    title: "Serialization",
    items: [
      { key: "generateJsonKeys", label: "Generate JSON keys" },
      { key: "useJsonSerializable", label: "Use JsonSerializable" },
      { key: "useEquatable", label: "Use Equatable" },
      { key: "generateJsonComment", label: "Generate JSON as comment" },
    ],
  },
  {
    title: "Types & Fields",
    items: [
      { key: "alwaysUseNum", label: "Always use num for numbers" },
      { key: "useDefaultValue", label: "Use default values" },
      { key: "makeFieldsFinal", label: "Make fields final" },
      { key: "nullSafety", label: "Null safety" },
    ],
  },
];

export default function JsonToDartTool() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [rootName, setRootName] = useState("Root");
  const [options, setOptions] = useState<Required<JsonToDartOptions>>({
    ...DEFAULT_DART_OPTIONS,
  });
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const setOption = (key: CheckboxKey, value: boolean) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: value };
      // Equatable replaces manual equality
      if (key === "useEquatable" && value) {
        next.generateEquality = false;
      }
      // JsonSerializable still needs from/to stubs
      return next;
    });
  };

  useEffect(() => {
    if (!jsonInput.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    startTransition(() => {
      const result = jsonToDart(jsonInput, { ...options, rootName });
      if (result.error) {
        setError(result.error);
        setOutput("");
        return;
      }
      setError(null);
      setOutput(result.code);
    });
  }, [jsonInput, rootName, options]);

  const convert = () => {
    startTransition(() => {
      const result = jsonToDart(jsonInput, { ...options, rootName });
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

  return (
    <section className="py-24 sm:py-28 md:py-32 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00ff88, transparent)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #ff00ff, transparent)" }}
      />

      <RevealGroup className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10" stagger={80}>
        <RevealItem>
          <SectionHeading
            badge="// Tools"
            title={
              <>
                JSON → <span className="neon-text">Dart</span>
              </>
            }
            subtitle="Generate Flutter-ready Dart model classes from JSON with full control."
          />
        </RevealItem>

        <RevealItem>
          <CyberCard variant="terminal" terminalTitle="options.cfg" hoverEffect={false}>
            <div className="mb-5 max-w-xs">
              <label
                htmlFor="dartRootName"
                className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
              >
                Root Class Name
              </label>
              <div className="cyber-input-wrap">
                <input
                  id="dartRootName"
                  type="text"
                  value={rootName}
                  onChange={(e) => setRootName(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="Root"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {OPTION_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
                    {group.title}
                  </p>
                  <div className="space-y-2.5">
                    {group.items.map((item) => {
                      const disabled =
                        item.key === "generateEquality" && options.useEquatable;
                      return (
                        <label
                          key={item.key}
                          className={cn(
                            "flex items-start gap-2.5 font-mono text-xs cursor-pointer group",
                            disabled && "opacity-40 pointer-events-none"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={options[item.key]}
                            disabled={disabled}
                            onChange={(e) => setOption(item.key, e.target.checked)}
                            className="accent-primary w-3.5 h-3.5 mt-0.5 shrink-0 cursor-pointer"
                          />
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                            {item.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                <CyberButton
                  type="button"
                  variant="glitch"
                  onClick={convert}
                  className="text-xs px-3 py-2"
                >
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
                <CyberButton
                  type="button"
                  variant="outline"
                  onClick={handleLoadSample}
                  className="text-xs px-3 py-2"
                >
                  <Braces className="w-3.5 h-3.5" strokeWidth={1.5} /> Sample
                </CyberButton>
                <CyberButton
                  type="button"
                  variant="secondary"
                  onClick={handleClear}
                  className="text-xs px-3 py-2"
                >
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
                  {"> "}Error: {error}
                </p>
              )}
            </CyberCard>
          </RevealItem>

          <RevealItem>
            <CyberCard
              variant="terminal"
              terminalTitle="output.dart"
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
                  Dart
                </span>
              </div>
              <pre
                className={cn(
                  "flex-1 min-h-[280px] max-h-[560px] overflow-auto p-3 sm:p-4 border border-border/60 bg-background/50 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words",
                  !output && "text-muted-foreground"
                )}
                aria-label="Generated Dart"
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
