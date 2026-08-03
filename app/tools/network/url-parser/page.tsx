import type { Metadata } from "next";
import UrlParserTool from "@/components/tools/network/url-parser";

export const metadata: Metadata = {
  title: "URL Parser | Network Tools",
  description: "Break a URL into protocol, host, path, query, and hash.",
};

export default function Page() {
  return <UrlParserTool />;
}
