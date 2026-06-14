"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
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
  { icon: Mail, href: "mailto:skfaizan2301@gmail.com", label: "Email" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = navLinks.map((link) => link.href.substring(1));
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-150",
          isScrolled ? "glass-nav py-3" : "py-4 bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="font-heading text-xl sm:text-2xl font-black tracking-widest neon-text"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            EMF<span className="text-accent-secondary">.</span>
          </motion.a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "px-3 py-2 font-label text-xs uppercase tracking-[0.15em] transition-all duration-150 cyber-chamfer-sm",
                  activeSection === link.href.substring(1)
                    ? "text-primary border border-primary/50 bg-primary/5"
                    : "text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30"
                )}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
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
              aria-label="Toggle menu"
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
            <motion.nav className="absolute top-16 left-4 right-4 cyber-terminal">
              <div className="cyber-terminal-header">
                <span className="cyber-terminal-dot bg-[#ff3366]" />
                <span className="cyber-terminal-dot bg-[#ffcc00]" />
                <span className="cyber-terminal-dot bg-[#00ff88]" />
                <span className="font-label text-xs text-muted-foreground ml-2 tracking-widest">NAV.SYS</span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      "px-4 py-3 font-label text-sm uppercase tracking-widest transition-all",
                      activeSection === link.href.substring(1)
                        ? "text-primary border-l-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {"> "}{link.name}
                  </a>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
