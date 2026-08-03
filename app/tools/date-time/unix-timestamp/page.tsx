import type { Metadata } from "next";
import UnixTimestampTool from "@/components/tools/datetime/unix-timestamp";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter | Date & Time Tools",
  description: "Convert between Unix timestamps and human-readable dates.",
};

export default function Page() {
  return <UnixTimestampTool />;
}
