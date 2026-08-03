"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
  DEFAULT_POJO_OPTIONS,
  jsonToPojo,
  SAMPLE_JSON_SCHEMA,
  SAMPLE_POJO_JSON,
  SAMPLE_YAML,
  type JsonToPojoOptions,
  type PojoAnnotationStyle,
  type PojoSourceType,
  type PojoValidation,
} from "@/lib/tools/json-to-pojo";
import { cn } from "@/lib/utils";

type CheckboxKey = keyof Pick<
  Required<JsonToPojoOptions>,
  | "generateBuilders"
  | "usePrimitives"
  | "useLongIntegers"
  | "useDoubleNumbers"
  | "useJodaDates"
  | "includeGettersSetters"
  | "includeConstructors"
  | "includeHashCodeEquals"
  | "includeToString"
  | "allowAdditionalProperties"
  | "serializable"
  | "parcelable"
  | "initializeCollections"
>;

const SOURCE_OPTIONS: { value: PojoSourceType; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "json-schema", label: "JSON Schema" },
  { value: "yaml", label: "YAML" },
  { value: "yaml-schema", label: "YAML Schema" },
];

const ANNOTATION_OPTIONS: { value: PojoAnnotationStyle; label: string }[] = [
  { value: "jackson2", label: "Jackson 2.x" },
  { value: "gson", label: "Gson" },
  { value: "moshi", label: "Moshi" },
  { value: "jsonb1", label: "JSON-B 1.x" },
  { value: "jsonb2", label: "JSON-B 2.x" },
  { value: "none", label: "None" },
];

const VALIDATION_OPTIONS: { value: PojoValidation; label: string }[] = [
  { value: "javax", label: "javax.validation" },
  { value: "jakarta", label: "jakarta.validation" },
  { value: "none", label: "None" },
];

const CHECKBOX_GROUPS: {
  title: string;
  items: { key: CheckboxKey; label: string }[];
}[] = [
  {
    title: "Code generation",
    items: [
      { key: "generateBuilders", label: "Generate builder methods" },
      { key: "includeGettersSetters", label: "Include getters and setters" },
      { key: "includeConstructors", label: "Include constructors" },
      { key: "includeHashCodeEquals", label: "Include hashCode and equals" },
      { key: "includeToString", label: "Include toString" },
      { key: "initializeCollections", label: "Initialize collections" },
    ],
  },
  {
    title: "Types & extras",
    items: [
      { key: "usePrimitives", label: "Use primitive types" },
      { key: "useLongIntegers", label: "Use long integers" },
      { key: "useDoubleNumbers", label: "Use double numbers" },
      { key: "useJodaDates", label: "Use Joda dates" },
      { key: "allowAdditionalProperties", label: "Allow additional properties" },
      { key: "serializable", label: "Make classes serializable" },
      { key: "parcelable", label: "Make classes parcelable" },
    ],
  },
];

function sampleForSource(source: PojoSourceType): string {
  switch (source) {
    case "json-schema":
      return SAMPLE_JSON_SCHEMA;
    case "yaml":
    case "yaml-schema":
      return SAMPLE_YAML;
    default:
      return SAMPLE_POJO_JSON;
  }
}

function RadioGroup<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 font-mono text-xs cursor-pointer group"
          >
            <input
              type="radio"
              name={name}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-primary w-3.5 h-3.5 cursor-pointer"
            />
            <span
              className={cn(
                "text-muted-foreground group-hover:text-foreground transition-colors",
                value === opt.value && "text-foreground"
              )}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function JsonToPojoTool() {
  const [sourceType, setSourceType] = useState<PojoSourceType>("json");
  const [jsonInput, setJsonInput] = useState(SAMPLE_POJO_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [rootName, setRootName] = useState("Root");
  const [packageName, setPackageName] = useState("com.example");
  const [annotationStyle, setAnnotationStyle] =
    useState<PojoAnnotationStyle>("jackson2");
  const [validationAnnotations, setValidationAnnotations] =
    useState<PojoValidation>("none");
  const [flags, setFlags] = useState({
    generateBuilders: DEFAULT_POJO_OPTIONS.generateBuilders,
    usePrimitives: DEFAULT_POJO_OPTIONS.usePrimitives,
    useLongIntegers: DEFAULT_POJO_OPTIONS.useLongIntegers,
    useDoubleNumbers: DEFAULT_POJO_OPTIONS.useDoubleNumbers,
    useJodaDates: DEFAULT_POJO_OPTIONS.useJodaDates,
    includeGettersSetters: DEFAULT_POJO_OPTIONS.includeGettersSetters,
    includeConstructors: DEFAULT_POJO_OPTIONS.includeConstructors,
    includeHashCodeEquals: DEFAULT_POJO_OPTIONS.includeHashCodeEquals,
    includeToString: DEFAULT_POJO_OPTIONS.includeToString,
    allowAdditionalProperties: DEFAULT_POJO_OPTIONS.allowAdditionalProperties,
    serializable: DEFAULT_POJO_OPTIONS.serializable,
    parcelable: DEFAULT_POJO_OPTIONS.parcelable,
    initializeCollections: DEFAULT_POJO_OPTIONS.initializeCollections,
  });
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const options: JsonToPojoOptions = useMemo(
    () => ({
      rootName,
      packageName,
      sourceType,
      annotationStyle,
      validationAnnotations,
      ...flags,
    }),
    [rootName, packageName, sourceType, annotationStyle, validationAnnotations, flags]
  );

  useEffect(() => {
    if (!jsonInput.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    startTransition(() => {
      const result = jsonToPojo(jsonInput, options);
      if (result.error) {
        setError(result.error);
        setOutput("");
        return;
      }
      setError(null);
      setOutput(result.code);
    });
  }, [jsonInput, options]);

  const handleSourceChange = (next: PojoSourceType) => {
    setSourceType(next);
    setJsonInput(sampleForSource(next));
  };

  const convert = () => {
    startTransition(() => {
      const result = jsonToPojo(jsonInput, options);
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
    setJsonInput(sampleForSource(sourceType));
  };

  const inputTitle =
    sourceType === "yaml" || sourceType === "yaml-schema"
      ? "input.yaml"
      : sourceType === "json-schema"
        ? "schema.json"
        : "input.json";

  return (
    <section className="py-24 sm:py-28 md:py-32 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00ff88, transparent)" }}
      />

      <RevealGroup className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10" stagger={80}>
        <RevealItem>
          <SectionHeading
            badge="// Tools"
            title={
              <>
                JSON → <span className="neon-text">POJO</span>
              </>
            }
            subtitle="Generate Java POJOs from JSON, JSON Schema, or YAML — Jackson, Gson, Moshi, and more."
          />
        </RevealItem>

        <RevealItem>
          <CyberCard variant="terminal" terminalTitle="options.cfg" hoverEffect={false}>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="pojoRootName"
                  className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
                >
                  Class Name
                </label>
                <div className="cyber-input-wrap">
                  <input
                    id="pojoRootName"
                    type="text"
                    value={rootName}
                    onChange={(e) => setRootName(e.target.value)}
                    className="cyber-input w-full text-sm"
                    placeholder="Root"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="pojoPackage"
                  className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
                >
                  Package
                </label>
                <div className="cyber-input-wrap">
                  <input
                    id="pojoPackage"
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="cyber-input w-full text-sm"
                    placeholder="com.example"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5 mb-6 pb-6 border-b border-border/60">
              <RadioGroup
                name="sourceType"
                label="Source type"
                options={SOURCE_OPTIONS}
                value={sourceType}
                onChange={handleSourceChange}
              />
              <RadioGroup
                name="annotationStyle"
                label="Annotation style"
                options={ANNOTATION_OPTIONS}
                value={annotationStyle}
                onChange={setAnnotationStyle}
              />
              <RadioGroup
                name="validation"
                label="Validation annotations"
                options={VALIDATION_OPTIONS}
                value={validationAnnotations}
                onChange={setValidationAnnotations}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
              {CHECKBOX_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
                    {group.title}
                  </p>
                  <div className="space-y-2.5">
                    {group.items.map((item) => (
                      <label
                        key={item.key}
                        className="flex items-start gap-2.5 font-mono text-xs cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={flags[item.key]}
                          onChange={(e) =>
                            setFlags((prev) => ({
                              ...prev,
                              [item.key]: e.target.checked,
                            }))
                          }
                          className="accent-primary w-3.5 h-3.5 mt-0.5 shrink-0 cursor-pointer"
                        />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                          {item.label}
                        </span>
                      </label>
                    ))}
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
              terminalTitle={inputTitle}
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
                  aria-label="Source input"
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
              terminalTitle="output.java"
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
                  Java
                </span>
              </div>
              <pre
                className={cn(
                  "flex-1 min-h-[280px] max-h-[560px] overflow-auto p-3 sm:p-4 border border-border/60 bg-background/50 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words",
                  !output && "text-muted-foreground"
                )}
                aria-label="Generated Java POJO"
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
