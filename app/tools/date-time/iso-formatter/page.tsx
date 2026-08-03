import type { Metadata } from "next";
import IsoFormatterTool from "@/components/tools/datetime/iso-formatter";

export const metadata: Metadata = {
  title: "ISO Date Formatter | Date & Time Tools",
  description: "Format dates as ISO-8601, RFC 3339, SQL, HTTP, and more.",
};

export default function Page() {
  return <IsoFormatterTool />;
}
