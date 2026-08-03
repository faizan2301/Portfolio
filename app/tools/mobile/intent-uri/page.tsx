import type { Metadata } from "next";
import IntentUriTool from "@/components/tools/mobile/intent-uri";

export const metadata: Metadata = {
  title: "Android Intent URI Generator | Mobile Tools",
  description: "Android Intent URI Generator — mobile development utility.",
};

export default function Page() {
  return <IntentUriTool />;
}
