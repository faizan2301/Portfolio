import type { Metadata } from "next";
import UniversalLinksTool from "@/components/tools/mobile/universal-links";

export const metadata: Metadata = {
  title: "iOS Universal Links Validator | Mobile Tools",
  description: "iOS Universal Links Validator — mobile development utility.",
};

export default function Page() {
  return <UniversalLinksTool />;
}
