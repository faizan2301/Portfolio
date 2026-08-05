import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import enMessages from "@/messages/en.json";
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

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const siteUrl = "https://www.faizanshaikh.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Faizan Shaikh | React Native & Flutter Developer in Oman & Gulf",
    template: "%s | Faizan Shaikh",
  },
  description:
    "Faizan Shaikh — React Native & Flutter developer building iOS, Android, and web apps for clients across India, Oman and the Gulf.",
  keywords: [
    "Faizan Shaikh",
    "React Native Developer",
    "Flutter Developer",
    "Mobile App Developer Aurangabad",
    "Mobile App Developer Maharashtra",
    "Mobile App Developer India",
    "Mobile App Developer Muscat",
    "Mobile App Developer Saudi Arabia",
    "Mobile App Developer Dubai",
    "Mobile App Developer Oman",
    "Mobile App Developer Qatar",
    "Mobile App Developer Bahrain",
    "Mobile App Developer Kuwait",
    "Mobile App Developer Gulf",
    "Mobile App Developer Middle East",
    "Mobile Application Developer Aurangabad",
    "Mobile Application Developer Maharashtra",
    "Mobile Application Developer India",
    "Mobile Application Developer Muscat",
    "Mobile Application Developer Saudi Arabia",
    "Mobile Application Developer Dubai",
    "Mobile Application Developer Oman",
    "Mobile Application Developer Qatar",
    "Mobile Application Developer Bahrain",
    "Mobile Application Developer Kuwait",
    "Mobile Application Developer Gulf",
    "Mobile Application Developer Middle East",
    "iOS Developer",
    "Android Developer",
    "Software Developer",
    "Full Stack Developer",
    "Frontend Engineer",
    "React Native Developer Oman",
    "Flutter Developer Oman",
    "React Native Developer Gulf",
    "Flutter Developer Gulf",
    "iOS Developer Oman",
    "Android Developer Oman",
    "Software Developer Oman",
    "Full Stack Developer Oman",
    "Mobile Developer Muscat",
    "Cross Platform Developer",
    "React.js",
    "TypeScript",
    "Node.js",
    "Mohammad Faizan Shaikh",
  ],
  authors: [{ name: "Mohammad Faizan Shaikh", url: siteUrl }],
  creator: "Mohammad Faizan Shaikh",
  publisher: "Mohammad Faizan Shaikh",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${shareTech.variable} ${jetbrainsMono.variable} ${notoSansArabic.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale="en" messages={enMessages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
