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
import {
  diffDuration,
  formatRelative,
  toDatetimeLocalValue,
} from "@/lib/tools/datetime/core";

export default function RelativeTimeTool() {
  const [fromValue, setFromValue] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() - 3);
    return toDatetimeLocalValue(d);
  });
  const [toValue, setToValue] = useState(() => toDatetimeLocalValue(new Date()));

  const from = useMemo(() => new Date(fromValue), [fromValue]);
  const to = useMemo(() => new Date(toValue), [toValue]);

  const valid =
    !Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime());

  const duration = valid ? diffDuration(from, to) : null;
  const relative = valid ? formatRelative(from, to) : "";

  const report =
    valid && duration
      ? [
          `Relative: ${relative}`,
          ``,
          `Direction: ${duration.past ? "from is after to" : "from is before to"}`,
          `Years:   ${duration.years}`,
          `Months:  ${duration.months}`,
          `Days:    ${duration.days}`,
          `Hours:   ${duration.hours}`,
          `Minutes: ${duration.minutes}`,
          `Seconds: ${duration.seconds}`,
          ``,
          `Total ms: ${duration.totalMs}`,
          `From: ${from.toISOString()}`,
          `To:   ${to.toISOString()}`,
        ].join("\n")
      : "";

  return (
    <DateTimeToolShell
      title={
        <>
          Relative <span className="neon-text">Time</span>
        </>
      }
      subtitle="Calculate human-friendly relative time and exact duration between two moments."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="range.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="from">From</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="from"
                  type="datetime-local"
                  step="1"
                  value={fromValue.slice(0, 19)}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="mb-4">
              <FieldLabel htmlFor="to">To</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="to"
                  type="datetime-local"
                  step="1"
                  value={toValue.slice(0, 19)}
                  onChange={(e) => setToValue(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => setToValue(toDatetimeLocalValue(new Date()))}
              >
                To = now
              </CyberButton>
              <CopyButton text={relative} label="Copy relative" />
            </div>
            {valid && (
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Relative" value={relative} />
                <StatCard
                  label="Total days"
                  value={Math.floor(Math.abs(duration!.totalMs) / 86400000)}
                />
              </div>
            )}
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="relative.out" hoverEffect={false}>
            {!valid ? (
              <p className="font-mono text-xs text-destructive">{"> "}Invalid date range.</p>
            ) : (
              <OutputBlock value={report} className="min-h-[320px]" />
            )}
          </CyberCard>
        </div>
      </RevealItem>
    </DateTimeToolShell>
  );
}
