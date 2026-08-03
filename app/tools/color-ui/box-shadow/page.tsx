import type { Metadata } from "next";
import BoxShadowTool from "@/components/tools/color-ui/box-shadow";

export const metadata: Metadata = {
  title: "Box Shadow Generator | Color & UI Tools",
  description: "Craft layered CSS box-shadows with live preview.",
};

export default function Page() {
  return <BoxShadowTool />;
}
