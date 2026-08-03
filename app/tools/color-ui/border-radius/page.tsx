import type { Metadata } from "next";
import BorderRadiusTool from "@/components/tools/color-ui/border-radius";

export const metadata: Metadata = {
  title: "Border Radius Generator | Color & UI Tools",
  description: "Generate CSS border-radius with per-corner control.",
};

export default function Page() {
  return <BorderRadiusTool />;
}
