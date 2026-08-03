import type { Metadata } from "next";
import CountdownTool from "@/components/tools/datetime/countdown";

export const metadata: Metadata = {
  title: "Countdown Generator | Date & Time Tools",
  description: "Live countdown to a target date with days, hours, minutes, seconds.",
};

export default function Page() {
  return <CountdownTool />;
}
