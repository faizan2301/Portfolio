import type { Metadata } from "next";
import GradientTool from "@/components/tools/color-ui/gradient";

export const metadata: Metadata = {
  title: "Gradient Generator | Color & UI Tools",
  description: "Build linear and radial CSS gradients with live preview.",
};

export default function Page() {
  return <GradientTool />;
}
