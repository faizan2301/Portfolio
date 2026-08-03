import type { Metadata } from "next";
import SemverTool from "@/components/tools/mobile/semver";

export const metadata: Metadata = {
  title: "Semantic Version Generator | Mobile Tools",
  description: "Semantic Version Generator — mobile development utility.",
};

export default function Page() {
  return <SemverTool />;
}
