import type { Metadata } from "next";
import AppIconSizesTool from "@/components/tools/rn-flutter/app-icon-sizes";

export const metadata: Metadata = {
  title: "App Icon Size Generator | RN & Flutter Tools",
  description: "List required iOS and Android app icon dimensions.",
};

export default function Page() {
  return <AppIconSizesTool />;
}
