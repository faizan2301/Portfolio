import type { Metadata } from "next";
import IpLookupTool from "@/components/tools/network/ip-lookup";

export const metadata: Metadata = {
  title: "IP Address Lookup | Network Tools",
  description: "Look up geolocation and network details for an IP.",
};

export default function Page() {
  return <IpLookupTool />;
}
