import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const shareTech = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohammad Faizan Shaikh | Frontend Engineer & Mobile Developer",
  description:
    "Portfolio of Mohammad Faizan Shaikh - A passionate Frontend Engineer and Mobile Developer specializing in Flutter, React Native, and modern web technologies. Building seamless digital experiences.",
  keywords: [
    "Frontend Engineer",
    "Mobile Developer",
    "Flutter Developer",
    "React Native Developer",
    "React.js",
    "TypeScript",
    "Node.js",
    "Full Stack Developer",
    "Mohammad Faizan Shaikh",
  ],
  authors: [{ name: "Mohammad Faizan Shaikh" }],
  creator: "Mohammad Faizan Shaikh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://engineer-faizan-shaikh.vercel.app",
    title: "Mohammad Faizan Shaikh | Frontend Engineer & Mobile Developer",
    description:
      "Portfolio of Mohammad Faizan Shaikh - A passionate Frontend Engineer and Mobile Developer specializing in Flutter, React Native, and modern web technologies.",
    siteName: "Mohammad Faizan Shaikh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Faizan Shaikh | Frontend Engineer & Mobile Developer",
    description:
      "Portfolio of Mohammad Faizan Shaikh - Building seamless digital experiences with Flutter, React Native, and modern web technologies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${shareTech.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
