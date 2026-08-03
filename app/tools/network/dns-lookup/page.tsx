import type { Metadata } from "next";
import DnsLookupTool from "@/components/tools/network/dns-lookup";

export const metadata: Metadata = {
  title: "DNS Record Checker | Network Tools",
  description: "Query DNS records via DNS-over-HTTPS.",
};

export default function Page() {
  return <DnsLookupTool />;
}
