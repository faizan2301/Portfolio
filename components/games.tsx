"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Games() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="games" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-primary bg-primary/10 rounded-full mb-3 sm:mb-4">
            Entertainment
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Play{" "}
            <span className="gradient-text">Games</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Take a break and enjoy some of my favorite web games
          </p>
        </motion.div>

        {/* Game Container */}
        <motion.div variants={itemVariants} className="glass rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Game Iframe */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "0",
              }}
              scrolling="no"
              allow="autoplay *; payment *; fullscreen *; microphone *; focus-without-user-activation *; screen-wake-lock *; gamepad *; clipboard-read *; clipboard-write *;"
              src="https://cdn.clickerheroes.com/gamebuild/index.php"
              title="Clicker Heroes"
            />
          </div>

          {/* Attribution - Required by Playsaurus */}
          <div className="p-4 sm:p-6 border-t border-border">
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              <a
                href="https://clickerheroes.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Clicker Heroes
              </a>
              {" is Developed by "}
              <a
                href="https://playsaurus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Playsaurus
              </a>
              {" - an idle game development studio."}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

