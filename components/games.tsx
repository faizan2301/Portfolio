"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Gamepad2 } from "lucide-react";

interface Game {
  id: string;
  name: string;
  src: string;
  link: string;
  description: string;
  gradient: string;
  allow: string;
}

const games: Game[] = [
  {
    id: "clicker-heroes",
    name: "Clicker Heroes",
    src: "https://cdn.clickerheroes.com/gamebuild/index.php",
    link: "https://clickerheroes.com/",
    description: "150M+ Plays - Idle Clicker",
    gradient: "from-yellow-500 to-orange-500",
    allow: "autoplay *; payment *; fullscreen *; microphone *; focus-without-user-activation *; screen-wake-lock *; gamepad *; clipboard-read *; clipboard-write *;",
  },
  {
    id: "mr-mine",
    name: "Mr.Mine",
    src: "https://mrmine.com/game/",
    link: "https://mrmine.com/",
    description: "20M+ Plays - Mining Adventure",
    gradient: "from-blue-500 to-cyan-500",
    allow: "autoplay; payment; fullscreen; microphone; clipboard-read; focus-without-user-activation *; screen-wake-lock; gamepad; clipboard-write 'self' https://mrmine.com",
  },
  {
    id: "poker-quest",
    name: "Poker Quest",
    src: "https://playsaurus.com/kongPokerQuest63/",
    link: "https://pokerquest.com/",
    description: "Card Strategy Game",
    gradient: "from-green-500 to-emerald-500",
    allow: "autoplay; payment; fullscreen; microphone; clipboard-read; focus-without-user-activation *; screen-wake-lock; gamepad; clipboard-write 'self' https://playsaurus.com/kongPokerQuest56/",
  },
  {
    id: "grindcraft",
    name: "Grindcraft",
    src: "https://grindcraft.com/game.php",
    link: "https://grindcraft.com/",
    description: "10M+ Plays - Crafting Game",
    gradient: "from-purple-500 to-pink-500",
    allow: "autoplay; payment; fullscreen; microphone; clipboard-read; focus-without-user-activation *; screen-wake-lock; gamepad; clipboard-write 'self' https://grindcraft.com",
  },
  {
    id: "fray-fight",
    name: "Fray Fight",
    src: "https://frayfight.com/game/",
    link: "https://frayfight.com/",
    description: "Action Battle Game",
    gradient: "from-red-500 to-rose-500",
    allow: "autoplay; payment; fullscreen; microphone; clipboard-read; focus-without-user-activation *; screen-wake-lock; gamepad; clipboard-write 'self' https://frayfight.com",
  },
];

export default function Games() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedGame, setSelectedGame] = useState<Game>(games[0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

        {/* Game Selection Cards */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {games.map((game) => (
              <motion.button
                key={game.id}
                onClick={() => setSelectedGame(game)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                  selectedGame.id === game.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "glass text-muted-foreground hover:text-foreground hover:border-primary/50 border border-border"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 size={16} className="sm:w-4 sm:h-4" />
                  <span>{game.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Game Container */}
        <motion.div 
          key={selectedGame.id}
          variants={itemVariants} 
          className="glass rounded-xl sm:rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
                backgroundColor: "#ffffff",
              }}
              scrolling="no"
              allow={selectedGame.allow}
              src={selectedGame.src}
              title={selectedGame.name}
              loading="eager"
              allowFullScreen={true}
            />
          </div>

          {/* Game Info & Attribution */}
          <div className="p-4 sm:p-6 border-t border-border">
            <div className="mb-3 sm:mb-4">
              <div className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gradient-to-r ${selectedGame.gradient} text-white rounded-full mb-2`}>
                {selectedGame.description}
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              <a
                href={selectedGame.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {selectedGame.name}
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

