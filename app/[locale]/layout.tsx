import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LocaleHtmlAttrs from "@/components/locale-html-attrs";

const siteUrl = "https://www.faizanshaikh.dev";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const ogLocale = locale === "ar" ? "ar_OM" : "en_US";

  return {
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
        "x-default": `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: `${siteUrl}/${locale}`,
      title: t("ogTitle"),
      description: t("ogDescription"),
      siteName: t("siteName"),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "metadata" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mohammad Faizan Shaikh",
    alternateName: "Faizan Shaikh",
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    jobTitle: t("jobTitle"),
    description: t("jsonLdDescription"),
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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleHtmlAttrs locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </NextIntlClientProvider>
  );
}
