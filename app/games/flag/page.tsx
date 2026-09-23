import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/ui/scroll-progress";
import CustomCursor from "@/components/ui/custom-cursor";
import MeshBackground from "@/components/ui/mesh-background";
import FlagGame from "@/components/games/flag-game/flag-game";

const pageUrl = "https://www.faizanshaikh.dev/games/flag";
const title = "Flag Challenge | Faizan Shaikh";
const description = "A fun interactive flag guessing game built by Faizan Shaikh.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: "Faizan Shaikh Portfolio",
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Faizan Shaikh — React Native & Flutter Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function FlagGamePage() {
  return (
    <>
      <MeshBackground />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen overflow-x-hidden">
        <section className="relative py-24 sm:py-28">
          <div
            className="pointer-events-none absolute top-20 right-1/4 h-96 w-96 opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #00ff88, transparent)" }}
          />
          <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
            <Link
              href="/en"
              className="mb-8 inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              Portfolio
            </Link>

            <div className="mb-8 text-center sm:mb-10">
              <span className="section-badge mb-4 inline-block sm:mb-5">{"// Flag.sys"}</span>
              <h1 className="section-heading mb-3 pb-3 font-heading text-2xl font-black uppercase tracking-widest sm:mb-4 sm:text-4xl md:text-5xl">
                Flag <span className="neon-text">Challenge</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl px-2 font-mono text-sm leading-relaxed tracking-wide text-muted-foreground sm:px-0 sm:text-base">
                {"> "}A new country every round. Name the flag before six attempts run out.
              </p>
            </div>

            <FlagGame />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
