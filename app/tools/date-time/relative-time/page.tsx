import type { Metadata } from "next";
import RelativeTimeTool from "@/components/tools/datetime/relative-time";

export const metadata: Metadata = {
  title: "Relative Time Calculator | Date & Time Tools",
  description: "Calculate relative time and exact duration between two dates.",
};

export default function Page() {
  return <RelativeTimeTool />;
}
