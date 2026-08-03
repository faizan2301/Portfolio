import type { Metadata } from "next";
import VersionCodeTool from "@/components/tools/mobile/version-code";

export const metadata: Metadata = {
  title: "Version Code Calculator | Mobile Tools",
  description: "Version Code Calculator — mobile development utility.",
};

export default function Page() {
  return <VersionCodeTool />;
}
