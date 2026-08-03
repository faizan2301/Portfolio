import type { Metadata } from "next";
import ApkSignatureTool from "@/components/tools/mobile/apk-signature";

export const metadata: Metadata = {
  title: "APK Signature Generator | Mobile Tools",
  description: "APK Signature Generator — mobile development utility.",
};

export default function Page() {
  return <ApkSignatureTool />;
}
