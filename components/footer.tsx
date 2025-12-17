"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp, Github, Linkedin, Mail, ExternalLink } from "lucide-react";

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
  { icon: ExternalLink, href: "https://engineer-faizan-shaikh.vercel.app", label: "Portfolio" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative py-8 sm:py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="inline-block">
              <span className="text-xl sm:text-2xl font-bold">
                <span className="gradient-text">MF</span>
                <span className="text-foreground">.</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Frontend Engineer & Mobile Developer crafting seamless digital experiences with modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-sm sm:text-base">Quick Links</h4>
            <nav className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-sm sm:text-base">Connect</h4>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={link.label}
                >
                  <link.icon size={16} className="sm:w-4.5 sm:h-4.5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Copyright */}
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 text-center sm:text-left">
              © {new Date().getFullYear()} Mohammad Faizan Shaikh. Built with{" "}
              <Heart size={12} className="sm:w-3.5 sm:h-3.5 text-red-500 inline" fill="currentColor" /> using Next.js
            </p>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to top
              <ArrowUp size={14} className="sm:w-4 sm:h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}

