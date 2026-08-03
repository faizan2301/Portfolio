import type { Metadata } from "next";
import HttpStatusTool from "@/components/tools/network/http-status";

export const metadata: Metadata = {
  title: "HTTP Status Code Lookup | Network Tools",
  description: "Search HTTP status codes with meaning and category.",
};

export default function Page() {
  return <HttpStatusTool />;
}
