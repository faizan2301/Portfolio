import type { Metadata } from "next";
import MaterialPaletteTool from "@/components/tools/color-ui/material-palette";

export const metadata: Metadata = {
  title: "Material Color Palette Generator | Color & UI Tools",
  description: "Generate Material-style tonal palettes from a seed color.",
};

export default function Page() {
  return <MaterialPaletteTool />;
}
