import type { Metadata } from "next";
import SplashPreviewTool from "@/components/tools/rn-flutter/splash-preview";

export const metadata: Metadata = {
  title: "Splash Screen Preview | RN & Flutter Tools",
  description: "Preview splash screen layouts for phone frames.",
};

export default function Page() {
  return <SplashPreviewTool />;
}
