"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { getCountry } from "@/data/countries";
import { describeGuess, type StoredGuess } from "@/lib/flagGame";

const SHAKE = { x: [0, -6, 6, -3, 3, 0] };
const STILL = { x: 0 };

interface GuessHistoryProps {
  guesses: readonly StoredGuess[];
  targetCode: string;
  shakeCode?: string | null;
}

export default function GuessHistory({ guesses, targetCode, shakeCode = null }: GuessHistoryProps) {
  const reducedMotion = useReducedMotion();

  if (guesses.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">No guesses yet.</p>
    );
  }

  return (
    <div>
      <h2 className="hud-label mb-3">Previous guesses</h2>
      <ol className="space-y-2" aria-label="Previous guesses">
        {guesses.map((guess) => {
          const country = getCountry(guess.code);
          const correct = guess.code === targetCode;
          const shouldShake = !reducedMotion && !correct && guess.code === shakeCode;
          return (
            <motion.li
              key={guess.code}
              initial={false}
              animate={shouldShake ? SHAKE : STILL}
              transition={{ duration: 0.35 }}
              className="border border-border bg-background/40 px-3 py-3"
            >
              <div className="flex items-start gap-3">
                <Image
                  src={`/flags/${guess.code.toLowerCase()}.svg`}
                  alt=""
                  width={40}
                  height={30}
                  unoptimized
                  className="mt-0.5 h-6 w-9 shrink-0 border border-black/10 bg-white object-contain"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-sm text-foreground">{country?.name ?? guess.code}</p>
                    <p
                      className={
                        correct
                          ? "inline-flex shrink-0 items-center gap-1 font-label text-[10px] uppercase tracking-widest text-primary"
                          : "inline-flex shrink-0 items-center gap-1 font-label text-[10px] uppercase tracking-widest text-destructive"
                      }
                    >
                      {correct ? (
                        <Check size={12} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <X size={12} strokeWidth={2} aria-hidden="true" />
                      )}
                      {correct ? "Correct" : "Incorrect"}
                    </p>
                  </div>
                  {!correct && (
                    <p className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground">
                      {describeGuess(guess)}
                    </p>
                  )}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
