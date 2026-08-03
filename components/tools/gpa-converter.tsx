"use client";

import { useMemo, useState } from "react";
import { Calculator, Plus, Trash2 } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import {
  GPA_FORMULAS,
  GPA_MODES,
  computeCgpaFromSgpas,
  convertGpaToPercentage,
  convertPercentageToGpa,
  gradeFromCgpa,
  gradeFromPercentage,
  parseNumber,
  round,
  type GpaFormulaId,
  type GpaMode,
  type SemesterRow,
} from "@/lib/tools/gpa-converter";
import { cn } from "@/lib/utils";

function newSemester(index: number): SemesterRow {
  return {
    id: `sem-${Date.now()}-${index}`,
    sgpa: "",
    credits: "",
  };
}

function ResultStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border border-border/60 bg-background/40 p-4 cyber-chamfer-sm">
      <p className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p className="font-heading text-2xl sm:text-3xl font-black tracking-wider neon-text">
        {value}
      </p>
      {hint && (
        <p className="font-mono text-xs text-muted-foreground mt-2 leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

export default function GpaConverterTool() {
  const [mode, setMode] = useState<GpaMode>("cgpa-to-percentage");
  const [formulaId, setFormulaId] = useState<GpaFormulaId>("multiply-9.5");
  const [customMultiplier, setCustomMultiplier] = useState("9.5");
  const [gpaInput, setGpaInput] = useState("8.5");
  const [percentageInput, setPercentageInput] = useState("80");
  const [semesters, setSemesters] = useState<SemesterRow[]>([
    { id: "sem-1", sgpa: "8.2", credits: "22" },
    { id: "sem-2", sgpa: "8.6", credits: "24" },
    { id: "sem-3", sgpa: "8.4", credits: "22" },
  ]);

  const formula = GPA_FORMULAS.find((f) => f.id === formulaId)!;
  const customM = parseNumber(customMultiplier) || 9.5;

  const result = useMemo(() => {
    if (mode === "sgpa-to-percentage" || mode === "cgpa-to-percentage") {
      const gpa = parseNumber(gpaInput);
      if (Number.isNaN(gpa)) return { error: "Enter a valid GPA value." };
      if (gpa < 0 || gpa > 10) return { error: "GPA should be between 0 and 10." };
      const percentage = convertGpaToPercentage(gpa, formulaId, customM);
      const grade = gradeFromPercentage(percentage);
      return {
        primary: `${round(percentage)}%`,
        primaryLabel: "Percentage",
        secondary: grade.letter,
        secondaryLabel: "Grade",
        hint: `${mode.startsWith("sgpa") ? "SGPA" : "CGPA"} ${gpa} → ${round(percentage)}% · ${grade.class}`,
        formulaNote: formula.description,
      };
    }

    if (mode === "percentage-to-cgpa" || mode === "percentage-to-sgpa") {
      const pct = parseNumber(percentageInput);
      if (Number.isNaN(pct)) return { error: "Enter a valid percentage." };
      if (pct < 0 || pct > 100) return { error: "Percentage should be between 0 and 100." };
      const gpa = convertPercentageToGpa(pct, formulaId, customM);
      const label = mode === "percentage-to-cgpa" ? "CGPA" : "SGPA";
      const grade = gradeFromCgpa(gpa);
      return {
        primary: `${round(gpa, 3)}`,
        primaryLabel: label,
        secondary: grade.letter,
        secondaryLabel: "Grade",
        hint: `${pct}% → ${label} ${round(gpa, 3)} · ${grade.class}`,
        formulaNote: formula.description,
      };
    }

    if (mode === "sgpa-to-cgpa") {
      const rows = semesters.map((s) => ({
        sgpa: parseNumber(s.sgpa),
        credits: parseNumber(s.credits) || 0,
      }));
      const computed = computeCgpaFromSgpas(rows);
      if (!computed) return { error: "Add at least one valid SGPA." };
      const percentage = convertGpaToPercentage(computed.cgpa, formulaId, customM);
      const grade = gradeFromCgpa(computed.cgpa);
      const usedCredits = rows.some((r) => r.credits > 0);
      return {
        primary: `${round(computed.cgpa, 3)}`,
        primaryLabel: "CGPA",
        secondary: `${round(percentage)}%`,
        secondaryLabel: "≈ Percentage",
        tertiary: grade.letter,
        tertiaryLabel: "Grade",
        hint: usedCredits
          ? `Credit-weighted from ${semesters.filter((s) => s.sgpa).length} semester(s) · ${computed.totalCredits} total credits`
          : `Simple average of ${semesters.filter((s) => s.sgpa).length} semester(s) (no credits entered)`,
        formulaNote: formula.description,
      };
    }

    // cgpa-to-sgpa-equiv — grade band
    const gpa = parseNumber(gpaInput);
    if (Number.isNaN(gpa)) return { error: "Enter a valid CGPA." };
    if (gpa < 0 || gpa > 10) return { error: "CGPA should be between 0 and 10." };
    const percentage = convertGpaToPercentage(gpa, formulaId, customM);
    const grade = gradeFromCgpa(gpa);
    return {
      primary: grade.letter,
      primaryLabel: "Grade letter",
      secondary: grade.class,
      secondaryLabel: "Classification",
      tertiary: `${round(percentage)}%`,
      tertiaryLabel: "≈ Percentage",
      hint: `CGPA ${gpa} maps to ${grade.class}`,
      formulaNote: formula.description,
    };
  }, [mode, gpaInput, percentageInput, semesters, formulaId, customM, formula.description]);

  const updateSemester = (id: string, key: "sgpa" | "credits", value: string) => {
    setSemesters((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const needsGpaInput =
    mode === "sgpa-to-percentage" ||
    mode === "cgpa-to-percentage" ||
    mode === "cgpa-to-sgpa-equiv";
  const needsPercentageInput =
    mode === "percentage-to-cgpa" || mode === "percentage-to-sgpa";
  const needsSemesters = mode === "sgpa-to-cgpa";

  return (
    <section className="py-24 sm:py-28 md:py-32 relative overflow-hidden">
      <div
        className="absolute top-0 right-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00ff88, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }}
      />

      <RevealGroup className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10" stagger={80}>
        <RevealItem>
          <SectionHeading
            badge="// Tools"
            title={
              <>
                GPA <span className="neon-text">Converter</span>
              </>
            }
            subtitle="SGPA ↔ percentage, CGPA ↔ percentage, multi-semester SGPA → CGPA, and grade bands."
          />
        </RevealItem>

        <RevealItem>
          <CyberCard variant="terminal" terminalTitle="mode.select" hoverEffect={false}>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
              Conversion mode
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {GPA_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "text-left p-3 border transition-all cyber-chamfer-sm",
                    mode === m.id
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  <span className="font-label text-[11px] uppercase tracking-widest block mb-1">
                    {m.label}
                  </span>
                  <span className="font-mono text-[11px] leading-snug opacity-80">
                    {m.description}
                  </span>
                </button>
              ))}
            </div>
          </CyberCard>
        </RevealItem>

        <RevealItem>
          <CyberCard variant="terminal" terminalTitle="formula.cfg" hoverEffect={false}>
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
                Percentage formula
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                {GPA_FORMULAS.map((f) => (
                  <label
                    key={f.id}
                    className="flex items-center gap-2 font-mono text-xs cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="gpa-formula"
                      checked={formulaId === f.id}
                      onChange={() => setFormulaId(f.id)}
                      className="accent-primary w-3.5 h-3.5 cursor-pointer"
                    />
                    <span
                      className={cn(
                        "text-muted-foreground group-hover:text-foreground transition-colors",
                        formulaId === f.id && "text-foreground"
                      )}
                    >
                      {f.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="font-mono text-xs text-muted-foreground mb-3">
                {"> "}{formula.description}
              </p>
              {formulaId === "custom" && (
                <div className="max-w-[160px]">
                  <label
                    htmlFor="customMultiplier"
                    className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
                  >
                    Multiplier
                  </label>
                  <div className="cyber-input-wrap">
                    <input
                      id="customMultiplier"
                      type="number"
                      step="0.1"
                      min="1"
                      max="20"
                      value={customMultiplier}
                      onChange={(e) => setCustomMultiplier(e.target.value)}
                      className="cyber-input w-full text-sm"
                    />
                  </div>
                </div>
              )}
            </CyberCard>
          </RevealItem>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mt-2">
          <RevealItem>
            <CyberCard
              variant="terminal"
              terminalTitle="input.dat"
              hoverEffect={false}
              className="h-full"
            >
              {needsGpaInput && (
                <div>
                  <label
                    htmlFor="gpaValue"
                    className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
                  >
                    {mode === "sgpa-to-percentage" ? "SGPA" : "CGPA"} (0 – 10)
                  </label>
                  <div className="cyber-input-wrap">
                    <input
                      id="gpaValue"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={gpaInput}
                      onChange={(e) => setGpaInput(e.target.value)}
                      className="cyber-input w-full text-sm"
                      placeholder="8.50"
                    />
                  </div>
                </div>
              )}

              {needsPercentageInput && (
                <div>
                  <label
                    htmlFor="pctValue"
                    className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block"
                  >
                    Percentage (0 – 100)
                  </label>
                  <div className="cyber-input-wrap">
                    <input
                      id="pctValue"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={percentageInput}
                      onChange={(e) => setPercentageInput(e.target.value)}
                      className="cyber-input w-full text-sm"
                      placeholder="80"
                    />
                  </div>
                </div>
              )}

              {needsSemesters && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
                      Semesters
                    </p>
                    <CyberButton
                      type="button"
                      variant="outline"
                      className="text-xs px-3 py-1.5"
                      onClick={() =>
                        setSemesters((prev) => [...prev, newSemester(prev.length + 1)])
                      }
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add
                    </CyberButton>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {"> "}Credits optional — if omitted, a simple average is used.
                  </p>
                  <div className="space-y-2">
                    {semesters.map((row, index) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-end"
                      >
                        <span className="font-label text-[10px] text-muted-foreground pb-2.5 w-10">
                          S{index + 1}
                        </span>
                        <div>
                          {index === 0 && (
                            <label className="font-label text-[9px] uppercase tracking-widest text-muted-foreground mb-1 block">
                              SGPA
                            </label>
                          )}
                          <div className="cyber-input-wrap">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="10"
                              value={row.sgpa}
                              onChange={(e) =>
                                updateSemester(row.id, "sgpa", e.target.value)
                              }
                              className="cyber-input w-full text-sm"
                              placeholder="8.0"
                              aria-label={`Semester ${index + 1} SGPA`}
                            />
                          </div>
                        </div>
                        <div>
                          {index === 0 && (
                            <label className="font-label text-[9px] uppercase tracking-widest text-muted-foreground mb-1 block">
                              Credits
                            </label>
                          )}
                          <div className="cyber-input-wrap">
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={row.credits}
                              onChange={(e) =>
                                updateSemester(row.id, "credits", e.target.value)
                              }
                              className="cyber-input w-full text-sm"
                              placeholder="22"
                              aria-label={`Semester ${index + 1} credits`}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={semesters.length <= 1}
                          onClick={() =>
                            setSemesters((prev) => prev.filter((s) => s.id !== row.id))
                          }
                          className="p-2 mb-0.5 text-muted-foreground hover:text-destructive disabled:opacity-30 border border-transparent hover:border-destructive/40 cyber-chamfer-sm"
                          aria-label={`Remove semester ${index + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CyberCard>
          </RevealItem>

          <RevealItem>
            <CyberCard
              variant="terminal"
              terminalTitle="result.out"
              hoverEffect={false}
              className="h-full"
            >
              {"error" in result && result.error ? (
                <p className="font-mono text-sm text-destructive" role="alert">
                  {"> "}{result.error}
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Calculator className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-label text-[10px] uppercase tracking-widest">
                      Result
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <ResultStat
                      label={result.primaryLabel!}
                      value={result.primary!}
                      hint={result.hint}
                    />
                    {result.secondary && (
                      <ResultStat
                        label={result.secondaryLabel!}
                        value={result.secondary}
                      />
                    )}
                    {result.tertiary && (
                      <ResultStat
                        label={result.tertiaryLabel!}
                        value={result.tertiary}
                      />
                    )}
                  </div>
                  {result.formulaNote && (
                    <p className="font-mono text-[11px] text-muted-foreground border-t border-border/50 pt-3">
                      {"> "}Formula: {result.formulaNote}
                    </p>
                  )}
                  <p className="font-mono text-[11px] text-muted-foreground/80 leading-relaxed">
                    {"> "}Formulas vary by university. Confirm with your institution before
                    official use.
                  </p>
                </div>
              )}
            </CyberCard>
          </RevealItem>
        </div>
      </RevealGroup>
    </section>
  );
}
