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
import { getCountdown, toDatetimeLocalValue } from "@/lib/tools/datetime/core";

export default function CountdownTool() {
  const [targetValue, setTargetValue] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(0, 0, 0, 0);
    return toDatetimeLocalValue(d);
  });
  const [label, setLabel] = useState("Launch day");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, []);

  const target = useMemo(() => new Date(targetValue), [targetValue]);
  const valid = !Number.isNaN(target.getTime());
  const countdown = valid ? getCountdown(target, now) : null;

  const report =
    valid && countdown
      ? [
          `Event: ${label || "(untitled)"}`,
          `Target: ${target.toString()}`,
          `ISO: ${target.toISOString()}`,
          ``,
          countdown.expired
            ? "Status: EXPIRED"
            : [
                `Status: LIVE`,
                `Days:    ${countdown.days}`,
                `Hours:   ${countdown.hours}`,
                `Minutes: ${countdown.minutes}`,
                `Seconds: ${countdown.seconds}`,
              ].join("\n"),
        ].join("\n")
      : "";

  const snippet =
    valid && countdown && !countdown.expired
      ? `${label}: ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
      : "";

  return (
    <DateTimeToolShell
      title={
        <>
          Countdown <span className="neon-text">Generator</span>
        </>
      }
      subtitle="Live countdown to any target date — days, hours, minutes, and seconds."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="target.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="label">Event label</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="Product launch"
                />
              </div>
            </div>
            <div className="mb-4">
              <FieldLabel htmlFor="target">Target date & time</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="target"
                  type="datetime-local"
                  step="1"
                  value={targetValue.slice(0, 19)}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  d.setHours(0, 0, 0, 0);
                  setTargetValue(toDatetimeLocalValue(d));
                  setLabel("Tomorrow");
                }}
              >
                Tomorrow
              </CyberButton>
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => {
                  const d = new Date();
                  d.setMonth(d.getMonth() + 1);
                  setTargetValue(toDatetimeLocalValue(d));
                }}
              >
                +1 month
              </CyberButton>
              <CopyButton text={snippet} label="Copy countdown" />
            </div>
            {!valid && (
              <p className="font-mono text-xs text-destructive">{"> "}Invalid target date.</p>
            )}
          </CyberCard>

          <CyberCard variant="terminal" terminalTitle="countdown.out" hoverEffect={false}>
            {countdown?.expired ? (
              <p className="font-heading text-2xl font-black tracking-wider text-destructive mb-4">
                COUNTDOWN ENDED
              </p>
            ) : countdown ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <StatCard label="Days" value={countdown.days} />
                <StatCard label="Hours" value={countdown.hours} />
                <StatCard label="Minutes" value={countdown.minutes} />
                <StatCard label="Seconds" value={countdown.seconds} />
              </div>
            ) : null}
            <OutputBlock value={report} />
          </CyberCard>
        </div>
      </RevealItem>
    </DateTimeToolShell>
  );
}
