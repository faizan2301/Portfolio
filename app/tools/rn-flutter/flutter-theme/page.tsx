import type { Metadata } from "next";
import FlutterThemeTool from "@/components/tools/rn-flutter/flutter-theme";

export const metadata: Metadata = {
  title: "Flutter Theme Generator | RN & Flutter Tools",
  description: "Generate Flutter ThemeData and ColorScheme from brand colors.",
};

export default function Page() {
  return <FlutterThemeTool />;
}
