import type { Metadata } from "next";
import FcmPayloadTool from "@/components/tools/mobile/fcm-payload";

export const metadata: Metadata = {
  title: "FCM Payload Generator | Mobile Tools",
  description: "FCM Payload Generator — mobile development utility.",
};

export default function Page() {
  return <FcmPayloadTool />;
}
