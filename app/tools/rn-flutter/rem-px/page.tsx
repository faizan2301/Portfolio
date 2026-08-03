import type { Metadata } from "next";
import RemPxTool from "@/components/tools/rn-flutter/rem-px";

export const metadata: Metadata = {
  title: "rem px Converter | RN & Flutter Tools",
  description: "Convert rem units to pixels with a configurable root size.",
};

export default function Page() {
  return <RemPxTool />;
}
