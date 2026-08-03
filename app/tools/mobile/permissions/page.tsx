import type { Metadata } from "next";
import PermissionFinderTool from "@/components/tools/mobile/permission-finder";

export const metadata: Metadata = {
  title: "Manifest Permission Finder | Mobile Tools",
  description: "Manifest Permission Finder — mobile development utility.",
};

export default function Page() {
  return <PermissionFinderTool />;
}
