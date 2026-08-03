"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  DateTimeToolShell,
  FieldLabel,
  OutputBlock,
} from "@/components/tools/datetime/shared";
import {
  COMMON_TIMEZONES,
  formatInTimeZone,
  getTimeZoneOffsetLabel,
  toDatetimeLocalValue,
} from "@/lib/tools/datetime/core";

export default function TimezoneTool() {
  const [localValue, setLocalValue] = useState(() => toDatetimeLocalValue(new Date()));
  const [sourceTz, setSourceTz] = useState("UTC");
  const [filter, setFilter] = useState("");

  const sourceDate = useMemo(() => {
    // Interpret datetime-local as wall time in sourceTz by constructing via Intl is hard;
    // Treat input as absolute local browser time for simplicity, then display in zones.
    const d = new Date(localValue);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [localValue]);

  const zones = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return COMMON_TIMEZONES.filter((z) => !q || z.toLowerCase().includes(q));
  }, [filter]);

  const report = useMemo(() => {
    if (!sourceDate) return "";
    return zones
      .map((tz) => {
        const offset = getTimeZoneOffsetLabel(sourceDate, tz);
        return `${tz.padEnd(22)} ${formatInTimeZone(sourceDate, tz)}  ${offset}`;
      })
      .join("\n");
  }, [sourceDate, zones]);

  return (
    <DateTimeToolShell
      title={
        <>
          Time <span className="neon-text">Zones</span>
        </>
      }
      subtitle="Convert a moment into multiple time zones — UTC, US, EU, Asia, and more."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="zone.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="dt">Date & time</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="dt"
                  type="datetime-local"
                  step="1"
                  value={localValue.slice(0, 19)}
                  onChange={(e) => setLocalValue(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel htmlFor="srcTz">Highlight zone</FieldLabel>
              <div className="cyber-input-wrap">
                <select
                  id="srcTz"
                  value={sourceTz}
                  onChange={(e) => setSourceTz(e.target.value)}
                  className="cyber-input w-full text-sm appearance-none cursor-pointer"
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <FieldLabel htmlFor="filter">Filter zones</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="tokyo, dubai, london..."
                />
              </div>
            </div>
            {sourceDate && (
              <p className="font-mono text-xs text-muted-foreground mb-3">
                {"> "}{sourceTz}: {formatInTimeZone(sourceDate, sourceTz)}
              </p>
            )}
            <CopyButton text={report} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="zones.out" hoverEffect={false}>
            <OutputBlock value={report} className="min-h-[360px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </DateTimeToolShell>
  );
}
