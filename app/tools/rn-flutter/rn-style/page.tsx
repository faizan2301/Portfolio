import type { Metadata } from "next";
import RnStyleTool from "@/components/tools/rn-flutter/rn-style";

export const metadata: Metadata = {
  title: "React Native Style Generator | RN & Flutter Tools",
  description: "Generate React Native StyleSheet snippets with live preview.",
};

export default function Page() {
  return <RnStyleTool />;
}
