import type { Metadata } from "next";
import AdbCommandsTool from "@/components/tools/mobile/adb-commands";

export const metadata: Metadata = {
  title: "ADB Command Generator | Mobile Tools",
  description: "ADB Command Generator — mobile development utility.",
};

export default function Page() {
  return <AdbCommandsTool />;
}
