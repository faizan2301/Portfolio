import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased noise`}
      >
        {children}
      </body>
    </html>
  );
}
