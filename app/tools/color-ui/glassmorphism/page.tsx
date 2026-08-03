import type { Metadata } from "next";
import GlassmorphismTool from "@/components/tools/color-ui/glassmorphism";

export const metadata: Metadata = {
  title: "CSS Glassmorphism Generator | Color & UI Tools",
  description: "Generate frosted-glass CSS with blur and opacity controls.",
};

export default function Page() {
  return <GlassmorphismTool />;
}
