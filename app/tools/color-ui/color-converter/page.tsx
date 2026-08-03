import type { Metadata } from "next";
import ColorConverterTool from "@/components/tools/color-ui/color-converter";

export const metadata: Metadata = {
  title: "HEX RGB HSL Converter | Color & UI Tools",
  description: "Convert between HEX, RGB, and HSL color formats.",
};

export default function Page() {
  return <ColorConverterTool />;
}
