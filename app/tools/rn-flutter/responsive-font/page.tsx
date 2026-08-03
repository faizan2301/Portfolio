import type { Metadata } from "next";
import ResponsiveFontTool from "@/components/tools/rn-flutter/responsive-font";

export const metadata: Metadata = {
  title: "Responsive Font Size Calculator | RN & Flutter Tools",
  description: "Scale font sizes across screen widths for React Native and Flutter.",
};

export default function Page() {
  return <ResponsiveFontTool />;
}
