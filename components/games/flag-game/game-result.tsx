"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getCountry } from "@/data/countries";
import { formatDuration, type SavedGame } from "@/lib/flagGame";
import { CyberButton } from "@/components/ui/cyber-button";

interface GameResultProps {
  game: SavedGame;
  onPlayAgain: () => void;
}

export default function GameResult({ game, onPlayAgain }: GameResultProps) {
  const reducedMotion = useReducedMotion();
  const country = getCountry(game.targetCode);
  const won = game.status === "won";
  const elapsed =
    game.endedAt !== null ? formatDuration(game.endedAt - game.startedAt) : null;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border border-primary/40 bg-primary/5 px-4 py-5 text-center cyber-chamfer-sm"
      role="status"
    >
      <h2 className={`font-heading text-2xl font-black tracking-widest ${won ? "neon-text" : "text-destructive"}`}>
        {won ? "Correct" : "Game over"}
      </h2>
      <p className="mt-3 font-mono text-sm text-muted-foreground">The flag was</p>
      <p className="mt-1 font-heading text-lg tracking-wider text-foreground">
        {country?.name ?? game.targetCode}
      </p>
      <p className="mt-3 font-mono text-sm text-foreground">
        {won ? "Attempts" : "Attempts used"} {game.guesses.length} / {game.maxAttempts}
        {elapsed ? ` · Time ${elapsed}` : ""}
      </p>
      <div className="mt-5">
        <CyberButton type="button" onClick={onPlayAgain}>
          Play again
        </CyberButton>
      </div>
    </motion.div>
  );
}
