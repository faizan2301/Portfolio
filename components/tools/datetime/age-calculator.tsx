"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  DateTimeToolShell,
  FieldLabel,
  OutputBlock,
  StatCard,
} from "@/components/tools/datetime/shared";
import { calculateAge } from "@/lib/tools/datetime/core";

function toDateInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function AgeCalculatorTool() {
  const [birth, setBirth] = useState("2000-01-15");
  const [asOf, setAsOf] = useState(() => toDateInput(new Date()));

  const result = useMemo(() => {
    const b = new Date(birth + "T00:00:00");
    const a = new Date(asOf + "T00:00:00");
    if (Number.isNaN(b.getTime()) || Number.isNaN(a.getTime())) {
      return { error: "Enter valid dates." as const };
    }
    return calculateAge(b, a);
  }, [birth, asOf]);

  const report =
    "error" in result
      ? ""
      : [
          `Age: ${result.years} years, ${result.months} months, ${result.days} days`,
          `Total days lived: ${result.totalDays}`,
          `Next birthday: ${result.nextBirthday.toDateString()}`,
          `Days until birthday: ${result.daysUntilBirthday}`,
        ].join("\n");

  return (
    <DateTimeToolShell
      title={
        <>
          Age <span className="neon-text">Calculator</span>
        </>
      }
      subtitle="Compute exact age in years, months, and days — plus next birthday countdown."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="birth.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="birth">Birth date</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="birth"
                  type="date"
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="mb-4">
              <FieldLabel htmlFor="asof">As of</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="asof"
                  type="date"
                  value={asOf}
                  onChange={(e) => setAsOf(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => setAsOf(toDateInput(new Date()))}
              >
                As of today
              </CyberButton>
              <CopyButton text={report} />
            </div>
            {"error" in result ? (
              <p className="font-mono text-xs text-destructive">{"> "}{result.error}</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Years" value={result.years} />
                <StatCard label="Months" value={result.months} />
                <StatCard label="Days" value={result.days} />
              </div>
            )}
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="age.out" hoverEffect={false}>
            {"error" in result ? (
              <p className="font-mono text-xs text-destructive">{"> "}{result.error}</p>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <StatCard label="Total days" value={result.totalDays} />
                  <StatCard
                    label="Days to birthday"
                    value={result.daysUntilBirthday}
                  />
                </div>
                <OutputBlock value={report} />
              </>
            )}
          </CyberCard>
        </div>
      </RevealItem>
    </DateTimeToolShell>
  );
}
