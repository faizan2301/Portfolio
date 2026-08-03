export type GpaMode =
  | "sgpa-to-percentage"
  | "cgpa-to-percentage"
  | "percentage-to-cgpa"
  | "percentage-to-sgpa"
  | "sgpa-to-cgpa"
  | "cgpa-to-sgpa-equiv";

export type GpaFormulaId =
  | "multiply-9.5"
  | "multiply-10"
  | "vtu"
  | "mumbai"
  | "anna"
  | "custom";

export interface GpaFormula {
  id: GpaFormulaId;
  label: string;
  description: string;
  /** Convert GPA (SGPA/CGPA) → percentage */
  toPercentage: (gpa: number, customMultiplier?: number) => number;
  /** Convert percentage → GPA */
  toGpa: (percentage: number, customMultiplier?: number) => number;
}

export const GPA_FORMULAS: GpaFormula[] = [
  {
    id: "multiply-9.5",
    label: "CGPA × 9.5",
    description: "CBSE / UGC style — Percentage = GPA × 9.5",
    toPercentage: (gpa) => gpa * 9.5,
    toGpa: (pct) => pct / 9.5,
  },
  {
    id: "multiply-10",
    label: "CGPA × 10",
    description: "Simple scale — Percentage = GPA × 10",
    toPercentage: (gpa) => gpa * 10,
    toGpa: (pct) => pct / 10,
  },
  {
    id: "vtu",
    label: "(CGPA − 0.75) × 10",
    description: "VTU / several tech universities",
    toPercentage: (gpa) => (gpa - 0.75) * 10,
    toGpa: (pct) => pct / 10 + 0.75,
  },
  {
    id: "mumbai",
    label: "7.1 × CGPA + 11",
    description: "Mumbai University approximate formula",
    toPercentage: (gpa) => 7.1 * gpa + 11,
    toGpa: (pct) => (pct - 11) / 7.1,
  },
  {
    id: "anna",
    label: "CGPA × 10 − 7.5",
    description: "Anna University style approximate",
    toPercentage: (gpa) => gpa * 10 - 7.5,
    toGpa: (pct) => (pct + 7.5) / 10,
  },
  {
    id: "custom",
    label: "Custom multiplier",
    description: "Percentage = GPA × custom multiplier",
    toPercentage: (gpa, m = 9.5) => gpa * m,
    toGpa: (pct, m = 9.5) => pct / m,
  },
];

export const GPA_MODES: { id: GpaMode; label: string; description: string }[] = [
  {
    id: "sgpa-to-percentage",
    label: "SGPA → Percentage",
    description: "Convert a semester GPA to percentage",
  },
  {
    id: "cgpa-to-percentage",
    label: "CGPA → Percentage",
    description: "Convert cumulative GPA to percentage",
  },
  {
    id: "percentage-to-cgpa",
    label: "Percentage → CGPA",
    description: "Estimate CGPA from percentage marks",
  },
  {
    id: "percentage-to-sgpa",
    label: "Percentage → SGPA",
    description: "Estimate SGPA from semester percentage",
  },
  {
    id: "sgpa-to-cgpa",
    label: "SGPA → CGPA",
    description: "Compute CGPA from semester SGPAs (optional credits)",
  },
  {
    id: "cgpa-to-sgpa-equiv",
    label: "CGPA → Grade band",
    description: "See grade letter / classification for a CGPA",
  },
];

export interface SemesterRow {
  id: string;
  sgpa: string;
  credits: string;
}

export function getFormula(id: GpaFormulaId): GpaFormula {
  return GPA_FORMULAS.find((f) => f.id === id) ?? GPA_FORMULAS[0];
}

export function round(value: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function clampGpa(value: number, max = 10): number {
  if (Number.isNaN(value)) return NaN;
  return Math.min(max, Math.max(0, value));
}

export function clampPercentage(value: number): number {
  if (Number.isNaN(value)) return NaN;
  return Math.min(100, Math.max(0, value));
}

export function gradeFromPercentage(percentage: number): {
  letter: string;
  class: string;
} {
  if (percentage >= 90) return { letter: "O / A+", class: "Outstanding" };
  if (percentage >= 80) return { letter: "A+", class: "Excellent" };
  if (percentage >= 70) return { letter: "A", class: "Very Good" };
  if (percentage >= 60) return { letter: "B+", class: "Good / First Class" };
  if (percentage >= 50) return { letter: "B", class: "Above Average / Second Class" };
  if (percentage >= 40) return { letter: "C", class: "Average / Pass" };
  return { letter: "F", class: "Fail / Below Pass" };
}

export function gradeFromCgpa(cgpa: number): {
  letter: string;
  class: string;
} {
  if (cgpa >= 9.0) return { letter: "O / A+", class: "Outstanding" };
  if (cgpa >= 8.0) return { letter: "A+", class: "Excellent" };
  if (cgpa >= 7.0) return { letter: "A", class: "Very Good / First Class Distinction" };
  if (cgpa >= 6.0) return { letter: "B+", class: "Good / First Class" };
  if (cgpa >= 5.0) return { letter: "B", class: "Second Class" };
  if (cgpa >= 4.0) return { letter: "C", class: "Pass" };
  return { letter: "F", class: "Fail" };
}

export function convertGpaToPercentage(
  gpa: number,
  formulaId: GpaFormulaId,
  customMultiplier = 9.5
): number {
  const formula = getFormula(formulaId);
  return clampPercentage(formula.toPercentage(gpa, customMultiplier));
}

export function convertPercentageToGpa(
  percentage: number,
  formulaId: GpaFormulaId,
  customMultiplier = 9.5,
  maxGpa = 10
): number {
  const formula = getFormula(formulaId);
  return clampGpa(formula.toGpa(percentage, customMultiplier), maxGpa);
}

export function computeCgpaFromSgpas(
  rows: { sgpa: number; credits: number }[]
): { cgpa: number; totalCredits: number; weightedSum: number } | null {
  const valid = rows.filter((r) => !Number.isNaN(r.sgpa) && r.sgpa >= 0);
  if (valid.length === 0) return null;

  const hasCredits = valid.some((r) => r.credits > 0);
  if (hasCredits) {
    let weightedSum = 0;
    let totalCredits = 0;
    for (const row of valid) {
      const credits = row.credits > 0 ? row.credits : 0;
      if (credits <= 0) continue;
      weightedSum += row.sgpa * credits;
      totalCredits += credits;
    }
    if (totalCredits === 0) return null;
    return {
      cgpa: weightedSum / totalCredits,
      totalCredits,
      weightedSum,
    };
  }

  // Simple average when no credits provided
  const sum = valid.reduce((acc, r) => acc + r.sgpa, 0);
  return {
    cgpa: sum / valid.length,
    totalCredits: valid.length,
    weightedSum: sum,
  };
}

export function parseNumber(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : NaN;
}
