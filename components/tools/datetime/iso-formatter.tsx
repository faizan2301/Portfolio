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
} from "@/components/tools/datetime/shared";
import {
  ISO_FORMATS,
  parseDateInput,
  toDatetimeLocalValue,
} from "@/lib/tools/datetime/core";

export default function IsoFormatterTool() {
  const [input, setInput] = useState(() => new Date().toISOString());
  const [localValue, setLocalValue] = useState(() => toDatetimeLocalValue(new Date()));

  const date = useMemo(() => {
    return parseDateInput(input) ?? parseDateInput(localValue);
  }, [input, localValue]);

  const report = useMemo(() => {
    if (!date) return "";
    return ISO_FORMATS.map((f) => `${f.label.padEnd(22)} ${f.format(date)}`).join("\n");
  }, [date]);

  return (
    <DateTimeToolShell
      title={
        <>
          ISO <span className="neon-text">Formatter</span>
        </>
      }
      subtitle="Format any date into ISO-8601, RFC 3339, HTTP, SQL, locale, and Unix forms."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="date.in" hoverEffect={false}>
            <FieldLabel htmlFor="raw">Date string / timestamp</FieldLabel>
            <div className="cyber-input-wrap mb-3">
              <input
                id="raw"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="cyber-input w-full text-sm"
                placeholder="2024-06-15T12:00:00.000Z"
              />
            </div>
            <FieldLabel htmlFor="picker">Or pick local date</FieldLabel>
            <div className="cyber-input-wrap mb-4">
              <input
                id="picker"
                type="datetime-local"
                step="1"
                value={localValue.slice(0, 19)}
                onChange={(e) => {
                  setLocalValue(e.target.value);
                  const d = new Date(e.target.value);
                  if (!Number.isNaN(d.getTime())) setInput(d.toISOString());
                }}
                className="cyber-input w-full text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => {
                  const d = new Date();
                  setInput(d.toISOString());
                  setLocalValue(toDatetimeLocalValue(d));
                }}
              >
                Use now
              </CyberButton>
              <CopyButton text={report} />
            </div>
            {!date && (
              <p className="mt-3 font-mono text-xs text-destructive">{"> "}Invalid date input.</p>
            )}
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="formats.out" hoverEffect={false}>
            <OutputBlock value={report} className="min-h-[360px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </DateTimeToolShell>
  );
}
