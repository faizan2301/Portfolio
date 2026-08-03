import type { Metadata } from "next";
import AgeCalculatorTool from "@/components/tools/datetime/age-calculator";

export const metadata: Metadata = {
  title: "Age Calculator | Date & Time Tools",
  description: "Calculate exact age in years, months, days and next birthday.",
};

export default function Page() {
  return <AgeCalculatorTool />;
}
