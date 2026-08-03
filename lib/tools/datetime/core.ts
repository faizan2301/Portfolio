export type TimestampUnit = "seconds" | "milliseconds";

export function detectTimestampUnit(value: number): TimestampUnit {
  // 10-digit ~ seconds, 13-digit ~ ms (rough heuristic)
  return Math.abs(value) < 1e12 ? "seconds" : "milliseconds";
}

export function timestampToDate(value: number, unit?: TimestampUnit): Date | null {
  if (!Number.isFinite(value)) return null;
  const resolved = unit ?? detectTimestampUnit(value);
  const ms = resolved === "seconds" ? value * 1000 : value;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function dateToTimestamp(date: Date, unit: TimestampUnit): number {
  const ms = date.getTime();
  return unit === "seconds" ? Math.floor(ms / 1000) : ms;
}

export function parseDateInput(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Pure numeric → unix
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return timestampToDate(Number(trimmed));
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

export const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

export function formatInTimeZone(
  date: Date,
  timeZone: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
      ...options,
    }).format(date);
  } catch {
    return "Invalid time zone";
  }
}

export function getTimeZoneOffsetLabel(date: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    }).formatToParts(date);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}

export type IsoFormatId =
  | "iso"
  | "iso-date"
  | "iso-time"
  | "rfc3339"
  | "http"
  | "sql"
  | "locale-long"
  | "locale-short"
  | "unix-s"
  | "unix-ms";

export const ISO_FORMATS: {
  id: IsoFormatId;
  label: string;
  format: (date: Date) => string;
}[] = [
  { id: "iso", label: "ISO-8601 (full)", format: (d) => d.toISOString() },
  {
    id: "iso-date",
    label: "ISO date",
    format: (d) => d.toISOString().slice(0, 10),
  },
  {
    id: "iso-time",
    label: "ISO time (UTC)",
    format: (d) => d.toISOString().slice(11, 19) + "Z",
  },
  {
    id: "rfc3339",
    label: "RFC 3339",
    format: (d) => d.toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  {
    id: "http",
    label: "HTTP / RFC 7231",
    format: (d) => d.toUTCString(),
  },
  {
    id: "sql",
    label: "SQL datetime (UTC)",
    format: (d) => d.toISOString().slice(0, 19).replace("T", " "),
  },
  {
    id: "locale-long",
    label: "Locale long",
    format: (d) =>
      d.toLocaleString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
  },
  {
    id: "locale-short",
    label: "Locale short",
    format: (d) => d.toLocaleString(),
  },
  {
    id: "unix-s",
    label: "Unix (seconds)",
    format: (d) => String(Math.floor(d.getTime() / 1000)),
  },
  {
    id: "unix-ms",
    label: "Unix (milliseconds)",
    format: (d) => String(d.getTime()),
  },
];

export interface DurationParts {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  past: boolean;
}

export function diffDuration(from: Date, to: Date): DurationParts {
  const totalMs = to.getTime() - from.getTime();
  const past = totalMs < 0;
  const start = past ? to : from;
  const end = past ? from : to;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalMs,
    past,
  };
}

export function formatRelative(from: Date, to: Date = new Date()): string {
  const diffMs = to.getTime() - from.getTime();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  for (const [unit, ms] of divisions) {
    if (abs >= ms || unit === "second") {
      const value = Math.round(diffMs / ms);
      // RelativeTimeFormat: negative = past from "now" perspective when from < to... 
      // We want: if from is in the past relative to to → "x ago"
      // rtf.format(-1, 'day') => "1 day ago"
      // So pass -(to - from)/ms wait: diffMs = to - from. If from is past, to > from, diffMs > 0.
      // We want "x ago" which is negative value: -diffMs/ms
      return rtf.format(-Math.round(diffMs / ms), unit);
    }
  }
  return rtf.format(0, "second");
}

export function calculateAge(birthDate: Date, asOf: Date = new Date()) {
  if (birthDate > asOf) {
    return { error: "Birth date cannot be in the future." as const };
  }
  const duration = diffDuration(birthDate, asOf);
  const nextBirthday = new Date(asOf);
  nextBirthday.setFullYear(asOf.getFullYear());
  nextBirthday.setMonth(birthDate.getMonth());
  nextBirthday.setDate(birthDate.getDate());
  if (nextBirthday <= asOf) {
    nextBirthday.setFullYear(asOf.getFullYear() + 1);
  }
  const untilBirthday = diffDuration(asOf, nextBirthday);
  const totalDays = Math.floor(
    (asOf.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years: duration.years,
    months: duration.months,
    days: duration.days,
    totalDays,
    nextBirthday,
    daysUntilBirthday: Math.floor(untilBirthday.totalMs / (1000 * 60 * 60 * 24)),
  };
}

export interface CountdownState {
  expired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function getCountdown(target: Date, now: Date = new Date()): CountdownState {
  const totalMs = target.getTime() - now.getTime();
  if (totalMs <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs };
  }
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { expired: false, days, hours, minutes, seconds, totalMs };
}

export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function fromDatetimeLocalValue(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
