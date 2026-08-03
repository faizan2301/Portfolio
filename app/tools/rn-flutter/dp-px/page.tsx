import type { Metadata } from "next";
import DpPxTool from "@/components/tools/rn-flutter/dp-px";

export const metadata: Metadata = {
  title: "dp px Converter | RN & Flutter Tools",
  description: "Convert between density-independent pixels and physical pixels.",
};

export default function Page() {
  return <DpPxTool />;
}
