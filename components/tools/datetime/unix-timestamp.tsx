"use client";

import { useEffect, useMemo, useState } from "react";
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
  dateToTimestamp,
  detectTimestampUnit,
  parseDateInput,
  timestampToDate,
  toDatetimeLocalValue,
  type TimestampUnit,
} from "@/lib/tools/datetime/core";

export default function UnixTimestampTool() {
  const [now, setNow] = useState(() => new Date());
  const [input, setInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<TimestampUnit | "auto">("auto");
  const [localValue, setLocalValue] = useState(() => toDatetimeLocalValue(new Date()));

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fromTimestamp = useMemo(() => {
    const n = Number(input);
    if (!Number.isFinite(n)) return { error: "Enter a numeric timestamp." as const };
    const resolved = unit === "auto" ? detectTimestampUnit(n) : unit;
    const date = timestampToDate(n, resolved);
    if (!date) return { error: "Invalid timestamp." as const };
    return { date, unit: resolved };
  }, [input, unit]);

  const fromLocal = useMemo(() => {
    const date = parseDateInput(localValue) ?? new Date(localValue);
    if (Number.isNaN(date.getTime())) return null;
    return date;
  }, [localValue]);

  const report =
    "error" in fromTimestamp
      ? ""
      : [
          `Detected unit: ${fromTimestamp.unit}`,
          `UTC:    ${fromTimestamp.date.toUTCString()}`,
          `Local:  ${fromTimestamp.date.toLocaleString()}`,
          `ISO:    ${fromTimestamp.date.toISOString()}`,
          `Seconds: ${dateToTimestamp(fromTimestamp.date, "seconds")}`,
          `Millis:  ${dateToTimestamp(fromTimestamp.date, "milliseconds")}`,
        ].join("\n");

  return (
    <DateTimeToolShell
      title={
        <>
          Unix <span className="neon-text">Timestamp</span>
        </>
      }
      subtitle="Convert Unix epoch seconds/milliseconds to dates — and the other way around."
    >
      <RevealItem>
        <div className="grid sm:grid-cols-2 gap-3 mb-4 sm:mb-6">
          <StatCard label="Now (seconds)" value={dateToTimestamp(now, "seconds")} />
          <StatCard label="Now (milliseconds)" value={dateToTimestamp(now, "milliseconds")} />
        </div>
      </RevealItem>

      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="timestamp.in" hoverEffect={false}>
            <FieldLabel htmlFor="ts">Unix timestamp</FieldLabel>
            <div className="cyber-input-wrap mb-3">
              <input
                id="ts"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="cyber-input w-full text-sm"
                placeholder="1712345678"
              />
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {(["auto", "seconds", "milliseconds"] as const).map((u) => (
                <label key={u} className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="radio"
                    checked={unit === u}
                    onChange={() => setUnit(u)}
                    className="accent-primary"
                  />
                  {u}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => setInput(String(dateToTimestamp(new Date(), "seconds")))}
              >
                Use now (s)
              </CyberButton>
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => setInput(String(dateToTimestamp(new Date(), "milliseconds")))}
              >
                Use now (ms)
              </CyberButton>
              <CopyButton text={report} />
            </div>
            {"error" in fromTimestamp ? (
              <p className="font-mono text-xs text-destructive">{"> "}{fromTimestamp.error}</p>
            ) : (
              <OutputBlock value={report} />
            )}
          </CyberCard>

          <CyberCard variant="terminal" terminalTitle="datetime.in" hoverEffect={false}>
            <FieldLabel htmlFor="local">Date / time (local)</FieldLabel>
            <div className="cyber-input-wrap mb-4">
              <input
                id="local"
                type="datetime-local"
                step="1"
                value={localValue.slice(0, 19)}
                onChange={(e) => setLocalValue(e.target.value)}
                className="cyber-input w-full text-sm"
              />
            </div>
            {fromLocal && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <StatCard
                    label="Seconds"
                    value={dateToTimestamp(fromLocal, "seconds")}
                  />
                  <StatCard
                    label="Milliseconds"
                    value={dateToTimestamp(fromLocal, "milliseconds")}
                  />
                </div>
                <CopyButton
                  text={String(dateToTimestamp(fromLocal, "seconds"))}
                  label="Copy seconds"
                />
              </>
            )}
          </CyberCard>
        </div>
      </RevealItem>
    </DateTimeToolShell>
  );
}
