import type { Metadata } from "next";
import DeepLinkTool from "@/components/tools/mobile/deep-link";

export const metadata: Metadata = {
  title: "Deep Link Generator | Mobile Tools",
  description: "Deep Link Generator — mobile development utility.",
};

export default function Page() {
  return <DeepLinkTool />;
}
