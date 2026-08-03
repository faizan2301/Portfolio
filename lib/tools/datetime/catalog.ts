import type { LucideIcon } from "lucide-react";
import {
  Baby,
  CalendarClock,
  Clock,
  Globe2,
  Hourglass,
  Timer,
} from "lucide-react";

export type DateTimeToolMeta = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const DATETIME_TOOLS: DateTimeToolMeta[] = [
  {
    slug: "unix-timestamp",
    name: "Unix Timestamp Converter",
    description: "Convert between Unix epochs (seconds/ms) and human-readable dates.",
    icon: Clock,
  },
  {
    slug: "timezone",
    name: "Time Zone Converter",
    description: "Convert a date/time across major world time zones instantly.",
    icon: Globe2,
  },
  {
    slug: "iso-formatter",
    name: "ISO Date Formatter",
    description: "Format dates as ISO-8601, RFC 3339, and common display patterns.",
    icon: CalendarClock,
  },
  {
    slug: "relative-time",
    name: "Relative Time Calculator",
    description: "Get “3 hours ago” / “in 2 days” style relative time between dates.",
    icon: Hourglass,
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age in years, months, days — plus next birthday.",
    icon: Baby,
  },
  {
    slug: "countdown",
    name: "Countdown Generator",
    description: "Live countdown to a target date with days, hours, minutes, seconds.",
    icon: Timer,
  },
];
