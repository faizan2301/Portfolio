import type { Metadata } from "next";
import MimeTypeTool from "@/components/tools/network/mime-type";

export const metadata: Metadata = {
  title: "MIME Type Lookup | Network Tools",
  description: "Find MIME types by file extension or content type.",
};

export default function Page() {
  return <MimeTypeTool />;
}
