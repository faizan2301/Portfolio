import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Faizan Shaikh | React Native & Flutter Developer",
    description:
      "React Native & Flutter developer building iOS, Android, and web apps for clients across Oman and the Gulf.",
    siteName: "Faizan Shaikh Portfolio",
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
    title: "Faizan Shaikh | React Native & Flutter Developer",
    description:
      "React Native & Flutter developer building iOS, Android, and web apps for clients across Oman and the Gulf.",
    images: ["/og-image.png"],
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohammad Faizan Shaikh",
  alternateName: "Faizan Shaikh",
  url: siteUrl,
  image: `${siteUrl}/og-image.png`,
  jobTitle: "React Native & Flutter Developer",
  description:
    "React Native, Flutter, iOS, Android, and full stack software developer serving clients in Oman and the Gulf.",
  email: "mailto:hello@faizanshaikh.dev",
  areaServed: [
    { "@type": "Country", name: "Oman" },
    { "@type": "Place", name: "Gulf Cooperation Council" },
  ],
  sameAs: [
    "https://github.com/faizan2301",
    "https://linkedin.com/in/engineerfaizanshaikh",
  ],
  knowsAbout: [
    "React Native",
    "Flutter",
    "iOS Development",
    "Android Development",
    "Mobile App Development",
    "Full Stack Development",
    "Software Development",
    "TypeScript",
    "React.js",
    "Node.js",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Khedmah Delivery",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Dr. Babasaheb Ambedkar Marathwada University",
    location: {
      "@type": "City",
      name: "Aurangabad",
    },
    url: "https://bamua.digitaluniversity.ac/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${orbitron.variable} ${shareTech.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
