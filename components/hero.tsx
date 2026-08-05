"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Terminal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import InteractiveKeyboard from "./interactive-keyboard";
import { CyberButton } from "./ui/cyber-button";
import { cn } from "@/lib/utils";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    if (prefersReducedMotion || isMobile) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particleCount = 60;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }

    const particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(0, 255, 136, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();
    window.addEventListener("resize", () => { resize(); initParticles(); });

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none hidden md:block"
      aria-hidden="true"
    />
  );
}

function TypewriterHeading() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const fullText = t("greeting");
  const nameText = t("name");
  const [displayedName, setDisplayedName] = useState("");
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    setDisplayedName("");
    setShowName(false);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Arabic cursive shaping breaks if letters are revealed one-by-one or spaced apart
    if (isArabic) {
      if (prefersReducedMotion) {
        setDisplayedName(nameText);
        setShowName(true);
        return;
      }
      const timeout = setTimeout(() => {
        setDisplayedName(nameText);
        setShowName(true);
      }, 400);
      return () => clearTimeout(timeout);
    }

    if (prefersReducedMotion) {
      setDisplayedName(nameText);
      return;
    }

    let index = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setDisplayedName(nameText.slice(0, index));
        if (index >= nameText.length) clearInterval(interval);
      }, 100);
    }, 500);

    return () => clearTimeout(startDelay);
  }, [nameText, isArabic]);

  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 font-heading leading-tight",
        isArabic ? "tracking-normal normal-case" : "uppercase tracking-widest"
      )}
      data-text={`${fullText}${displayedName}`}
    >
      <span className="text-foreground">{fullText}</span>
      <span
        className={cn(
          "gradient-text-accent inline-block",
          isArabic ? "hero-name-ar" : "cyber-glitch",
          isArabic && showName && "hero-name-ar-visible"
        )}
        data-text={displayedName}
        lang={isArabic ? "ar" : undefined}
        dir={isArabic ? "rtl" : undefined}
      >
        {displayedName}
      </span>
      {!isArabic && <span className="typewriter-cursor" />}
    </h1>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    if (isMobile) return;
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div ref={cardRef} className="will-change-transform transition-transform duration-150 ease-out">
      {children}
    </div>
  );
}

function HeroHUD() {
  const t = useTranslations("hero");
  const rows = [
    { label: t("hudRole"), value: t("hudRoleValue") },
    { label: t("hudStack"), value: t("hudStackValue") },
    { label: t("hudOnline"), value: t("hudOnlineValue") },
    { label: t("hudLoc"), value: t("hudLocValue") },
  ];

  return (
    <div className="hidden lg:block hud-panel p-4 space-y-3 text-start w-full max-w-xs">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Terminal size={14} className="text-primary" strokeWidth={1.5} />
        <span className="font-label text-xs text-primary tracking-[0.3em]">{t("hudStatus")}</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-4 font-mono text-xs">
          <span className="hud-label">{row.label}</span>
          <span className="hud-value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const techStack = ["Flutter", "React Native", "TypeScript", "Node.js", "Firebase"];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden circuit-grid">
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -start-32 w-[500px] h-[500px] opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #00ff88 0%, transparent 70%)" }} />
        <div className="absolute -bottom-32 -end-32 w-[500px] h-[500px] opacity-12 blur-3xl" style={{ background: "radial-gradient(circle, #ff00ff 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 end-1/4 w-[400px] h-[400px] opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }} />
      </div>

      <ParticleCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 sm:pt-28 pb-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 section-badge mb-6 sm:mb-8"
            >
              <span className="w-2 h-2 bg-primary animate-pulse" style={{ boxShadow: "var(--box-shadow-neon-sm)" }} />
              <span className="font-label text-xs tracking-[0.2em]">{t("available")}</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <TypewriterHeading />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="font-heading text-base sm:text-xl md:text-2xl text-muted-foreground mb-4 uppercase tracking-wide"
            >
              {t("role")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 tracking-wide leading-relaxed font-mono"
            >
              {"> "}{t("taglinePrefix")}{" "}
              <span className="neon-text">{t("taglineFlutter")}</span>,{" "}
              <span className="neon-text-tertiary">{t("taglineRn")}</span>
              {t("taglineSuffix")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4 mb-8"
            >
              <CyberButton
                href="#projects"
                variant="glitch"
                className="w-full sm:w-auto px-8"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t("viewWork")}
              </CyberButton>
              <CyberButton href="/MohammadFaizanResume.pdf" variant="outline" className="w-full sm:w-auto px-8" download>
                <Download size={16} strokeWidth={1.5} />
                {t("downloadCv")}
              </CyberButton>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + i * 0.08 }}
                  className="tech-pill px-3 py-1.5 text-muted-foreground"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 -rotate-1 lg:rotate-0">
            <HeroHUD />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="w-full flex justify-center"
            >
              <TiltCard>
                <div className="cyber-card-holo p-3 sm:p-4">
                  <InteractiveKeyboard />
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-label text-xs tracking-[0.2em] uppercase"
        aria-label={t("scrollAria")}
      >
        <span>{t("scroll")}</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown size={18} strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </section>
  );
}
