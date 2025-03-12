"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import Navbar from "./navbar"
import WavesBackground from "./waves-background"
import Custom3DAnimation from "./custom-3d-animation"

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <Navbar />
      <WavesBackground />

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <span className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                  Mobile Application Developer
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
              >
                Hi, I'm <span className="text-primary">Faizan Shaikh</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                A passionate mobile application developer specializing in Java, Flutter, React Native, and Node.js with
                a strong foundation in JavaScript and TypeScript.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center md:justify-start gap-4 mb-12"
              >
                <Button asChild size="lg" className="hover-effect">
                  <Link href="#contact">Get In Touch</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="hover-effect">
                  <Link href="#projects">View Projects</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center md:justify-start gap-6 mb-12"
              >
                <Link
                  href="https://github.com/faizan2301"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors hover-effect"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </Link>
                <Link
                  href="https://linkedin.com/in/engineerfaizanshaikh"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors hover-effect"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link
                  href="mailto:skfaizan2301@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors hover-effect"
                  aria-label="Email"
                >
                  <Mail className="h-6 w-6" />
                </Link>
                <Link
                  href="https://stackoverflow.com/users/19802321/shaikh-faizan"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors hover-effect"
                  aria-label="Stack Overflow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.62 9.335 1.994-.346zm-5.964 6.937l-9.746-.975-.186 2.016 9.755.879.177-1.92zm.538-2.587l-9.276-2.608-.526 1.954 9.306 2.5.496-1.846zm1.204-2.413l-8.297-4.864-1.029 1.743 8.298 4.865 1.028-1.744zm1.866-1.467l-5.339-7.829-1.672 1.14 5.339 7.829 1.672-1.14zm-2.644 4.195v8h-12v-8h-2v10h16v-10h-2z" />
                  </svg>
                </Link>
              </motion.div>
            </div>
            <div className="hidden md:block">
              <Custom3DAnimation />
            </div>
          </div>
        </div>
      </div>

      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/20 dark:from-primary/5 dark:to-background/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      </motion.div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: 0.2,
          }}
        >
          <Link href="#about" aria-label="Scroll down" className="hover-effect">
            <ArrowDown className="h-6 w-6 text-primary" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

