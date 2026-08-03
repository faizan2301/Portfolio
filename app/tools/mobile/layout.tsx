import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/ui/scroll-progress";
import CustomCursor from "@/components/ui/custom-cursor";
import MeshBackground from "@/components/ui/mesh-background";

export default function MobileToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MeshBackground />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen pt-16 sm:pt-20">{children}</main>
      <Footer />
    </>
  );
}
