import type { Metadata } from "next";
import QrDeepLinkTool from "@/components/tools/mobile/qr-deep-link";

export const metadata: Metadata = {
  title: "QR Code for Deep Links | Mobile Tools",
  description: "QR Code for Deep Links — mobile development utility.",
};

export default function Page() {
  return <QrDeepLinkTool />;
}
