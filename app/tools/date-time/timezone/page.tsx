import type { Metadata } from "next";
import TimezoneTool from "@/components/tools/datetime/timezone";

export const metadata: Metadata = {
  title: "Time Zone Converter | Date & Time Tools",
  description: "Convert a date and time across major world time zones.",
};

export default function Page() {
  return <TimezoneTool />;
}
