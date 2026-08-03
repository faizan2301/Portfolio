import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/ui/scroll-progress";
import CustomCursor from "@/components/ui/custom-cursor";
import MeshBackground from "@/components/ui/mesh-background";
import JsonToTypescriptTool from "@/components/tools/json-to-typescript";

export const metadata: Metadata = {
  title: "JSON to TypeScript | Dev Tools",
  description:
    "Convert JSON into TypeScript interfaces or type aliases. Nested objects, arrays, and mixed types supported.",
};

export default function JsonToTypescriptPage() {
  return (
    <>
      <MeshBackground />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            All tools
          </Link>
        </div>
        <JsonToTypescriptTool />
      </main>
      <Footer />
    </>
  );
}
