import type { Metadata } from "next";
import UserAgentTool from "@/components/tools/network/user-agent";

export const metadata: Metadata = {
  title: "User Agent Parser | Network Tools",
  description: "Parse browser, OS, and device from a User-Agent string.",
};

export default function Page() {
  return <UserAgentTool />;
}
