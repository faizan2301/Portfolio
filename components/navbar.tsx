"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { routing, type Locale } from "@/i18n/routing";

const sectionKeys = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "experience", href: "#experience" },
  { key: "projects", href: "#projects" },
  { key: "skills", href: "#skills" },
  { key: "contact", href: "#contact" },
] as const;

const socialLinks = [
  { icon: Github, href: "https://github.com/faizan2301", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/engineerfaizanshaikh", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@faizanshaikh.dev", label: "Email" },
];

function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (next: Locale) => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const isHome = routing.locales.some(
      (l) => pathname === `/${l}` || pathname === `/${l}/`
    );

    if (isHome) {
      window.location.href = `/${next}${hash || ""}`;
      return;
    }

    // On tools or other non-locale pages, go to that locale's home
    window.location.href = `/${next}`;
  };

  return (
    <div
      className={cn(
        "flex items-center border border-border cyber-chamfer-sm overflow-hidden",
        className
      )}
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "px-2 py-1.5 font-label text-[10px] uppercase tracking-widest transition-colors",
            locale === loc
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
          aria-pressed={locale === loc}
        >
          {loc === "en" ? t("switchToEn") : t("switchToAr")}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = routing.locales.some(
    (l) => pathname === `/${l}` || pathname === `/${l}/`
  );
  const isTools = pathname.startsWith("/tools");
  const homeBase = `/${locale}`;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = sectionKeys.map((link) => link.href.substring(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
    }
  }, [isHome]);

  const resolveHref = (href: string) => (isHome ? href : `${homeBase}${href}`);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHome) {
      setIsMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const isLinkActive = (href: string) => {
    if (href === "/tools") return isTools;
    if (!isHome) return false;
    return activeSection === href.substring(1);
  };

  const navItems = [
    ...sectionKeys.map((link) => ({
      name: t(link.key),
      href: resolveHref(link.href),
      isRoute: false as const,
      hash: link.href,
    })),
    { name: t("tools"), href: "/tools", isRoute: true as const, hash: "/tools" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "fixed top-0 start-0 end-0 z-50 transition-all duration-150",
          isScrolled || !isHome ? "glass-nav py-3" : "py-4 bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <motion.a
            href={isHome ? "#home" : `${homeBase}#home`}
            onClick={(e) => handleSectionClick(e, "#home")}
            className="font-heading text-xl sm:text-2xl font-black tracking-widest neon-text"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            EMF<span className="text-accent-secondary">.</span>
          </motion.a>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.hash}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 font-label text-xs uppercase tracking-[0.15em] transition-all duration-150 cyber-chamfer-sm",
                    isLinkActive(link.href)
                      ? "text-primary border border-primary/50 bg-primary/5"
                      : "text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30"
                  )}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.hash}
                  href={link.href}
                  onClick={(e) => handleSectionClick(e, link.hash)}
                  className={cn(
                    "px-3 py-2 font-label text-xs uppercase tracking-[0.15em] transition-all duration-150 cyber-chamfer-sm",
                    isLinkActive(link.hash)
                      ? "text-primary border border-primary/50 bg-primary/5"
                      : "text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30"
                  )}
                >
                  {link.name}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:flex" />

            <div className="hidden sm:flex items-center gap-1">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors icon-glow border border-transparent hover:border-primary/30 cyber-chamfer-sm"
                  aria-label={link.label}
                >
                  <link.icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>

            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-primary border border-border cyber-chamfer-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t("toggleMenu")}
            >
              {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.nav className="absolute top-16 start-4 end-4 cyber-terminal">
              <div className="cyber-terminal-header">
                <span className="cyber-terminal-dot bg-[#ff3366]" />
                <span className="cyber-terminal-dot bg-[#ffcc00]" />
                <span className="cyber-terminal-dot bg-[#00ff88]" />
                <span className="font-label text-xs text-muted-foreground ms-2 tracking-widest">{t("navSys")}</span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <div className="px-4 py-2 mb-2">
                  <LanguageSwitcher />
                </div>
                {navItems.map((link) =>
                  link.isRoute ? (
                    <Link
                      key={link.hash}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 font-label text-sm uppercase tracking-widest transition-all",
                        isLinkActive(link.href)
                          ? "text-primary border-s-2 border-primary bg-primary/5"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {"> "}
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      key={link.hash}
                      href={link.href}
                      onClick={(e) => handleSectionClick(e, link.hash)}
                      className={cn(
                        "px-4 py-3 font-label text-sm uppercase tracking-widest transition-all",
                        isLinkActive(link.hash)
                          ? "text-primary border-s-2 border-primary bg-primary/5"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {"> "}
                      {link.name}
                    </a>
                  )
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
