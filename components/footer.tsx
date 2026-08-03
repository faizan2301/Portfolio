"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart, ArrowUp, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { CyberButton } from "./ui/cyber-button";

const sectionLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/faizan2301", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/engineerfaizanshaikh", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@faizanshaikh.dev", label: "Email" },
  { icon: ExternalLink, href: "https://engineer-faizan-shaikh.vercel.app", label: "Portfolio" },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHome) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    ...sectionLinks.map((link) => ({
      name: link.name,
      href: isHome ? link.href : `/${link.href}`,
      hash: link.href,
      isRoute: false as const,
    })),
    { name: "Tools", href: "/tools", hash: "/tools", isRoute: true as const },
  ];

  return (
    <footer className="relative py-10 sm:py-14 border-t border-border footer-circuit">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <a
              href={isHome ? "#home" : "/#home"}
              onClick={(e) => handleSectionClick(e, "#home")}
              className="inline-block font-heading text-xl font-black tracking-widest neon-text"
            >
              EMF<span className="text-accent-secondary">.</span>
            </a>
            <p className="text-xs text-muted-foreground max-w-xs font-mono leading-relaxed">
              {"> "}Frontend Engineer & Mobile Developer crafting seamless digital experiences.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-label text-xs uppercase tracking-[0.2em] text-primary">Quick Links</h4>
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-label text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleSectionClick(e, link.hash)}
                    className="font-label text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                )
              )}
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-label text-xs uppercase tracking-[0.2em] text-primary">Connect</h4>
            <div className="flex gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 cyber-chamfer-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all icon-glow"
                  aria-label={link.label}
                >
                  <link.icon size={15} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground flex items-center gap-1 text-center sm:text-left">
            © {new Date().getFullYear()} Mohammad Faizan Shaikh. Built with{" "}
            <Heart size={12} className="text-destructive inline" fill="currentColor" /> Next.js
          </p>

          <CyberButton variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-xs px-4 py-2">
            Back to top
            <ArrowUp size={14} strokeWidth={1.5} />
          </CyberButton>
        </div>
      </div>
    </footer>
  );
}
