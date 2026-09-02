import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/ui/scroll-progress";
import CustomCursor from "@/components/ui/custom-cursor";

export const metadata: Metadata = {
  title: "Meta Glasses Photo Converter | Dev Tools",
  description:
    "Convert JPG or HEIC photos to 3024×4032 with Ray-Ban Meta Smart Glasses EXIF metadata. Copy Base64 or save directly — processed on your device.",
};

export default function MetaGlassesConverterPage() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-3 shrink-0">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            All tools
          </Link>
        </div>
        <iframe
          src="/tools/meta-glasses-converter/index.html"
          title="Meta Glasses Photo Converter"
          className="flex-1 w-full min-h-[calc(100vh-8rem)] border-0"
          allow="clipboard-write"
        />
      </main>
      <Footer />
    </>
  );
}
