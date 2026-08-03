import type { Metadata } from "next";
import ColorPickerTool from "@/components/tools/color-ui/color-picker";

export const metadata: Metadata = {
  title: "Color Picker | Color & UI Tools",
  description: "Pick colors and copy HEX, RGB, HSL, and CSS variables.",
};

export default function Page() {
  return <ColorPickerTool />;
}
