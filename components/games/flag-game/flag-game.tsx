"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { getCountry } from "@/data/countries";
import {
  applyGuess,
  createGame,
  describeGuess,
  emptyStats,
  loadGame,
  loadRecent,
  loadStats,
  recordFinishedGame,
  rememberCountry,
  saveGame,
  saveStats,
  type GameStats,
  type SavedGame,
} from "@/lib/flagGame";
import CountrySelector from "@/components/games/flag-game/country-selector";
import FlagDisplay from "@/components/games/flag-game/flag-display";
import GameResult from "@/components/games/flag-game/game-result";
import GameStatsPanel from "@/components/games/flag-game/game-stats";
import GuessHistory from "@/components/games/flag-game/guess-history";

interface GameSnapshot {
  game: SavedGame | null;
  stats: GameStats;
}

const SERVER_SNAPSHOT: GameSnapshot = { game: null, stats: emptyStats() };

let snapshot: GameSnapshot = SERVER_SNAPSHOT;
let booted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function startGame(): SavedGame {
  const recent = loadRecent();
  const game = createGame(recent);
  rememberCountry(game.targetCode);
  saveGame(game);
  return game;
}

function bootSnapshot(): GameSnapshot {
  if (!booted) {
    booted = true;
    snapshot = {
      game: loadGame() ?? startGame(),
      stats: loadStats(),
    };
  }
  return snapshot;
}

function getSnapshot(): GameSnapshot {
  return bootSnapshot();
}

function getServerSnapshot(): GameSnapshot {
  return SERVER_SNAPSHOT;
}

function commit(next: GameSnapshot) {
  snapshot = next;
  emit();
}

function describeStatus(game: SavedGame): string {
  const name = getCountry(game.targetCode)?.name ?? game.targetCode;
  if (game.status === "won") return `Correct. The flag is ${name}.`;
  if (game.status === "lost") return `Game over. The flag was ${name}.`;
  const remaining = game.maxAttempts - game.guesses.length;
  if (game.guesses.length > 0) {
    return `Game restored. ${remaining} ${remaining === 1 ? "attempt" : "attempts"} left.`;
  }
  return `Flag loaded. You have ${game.maxAttempts} attempts.`;
}

export default function FlagGame() {
  const { game, stats } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [announcement, setAnnouncement] = useState("");
  const [shakeCode, setShakeCode] = useState<string | null>(null);
  const [focusInput, setFocusInput] = useState(false);

  const excluded = useMemo(
    () => new Set(game?.guesses.map((guess) => guess.code) ?? []),
    [game]
  );

  const handleGuess = (code: string) => {
    if (!game || game.status !== "playing") return;

    const next = applyGuess(game, code);
    if (next === game) return;

    let nextStats = stats;
    if (next.status !== "playing" && !game.statsRecorded) {
      nextStats = recordFinishedGame(loadStats(), next);
      saveStats(nextStats);
    }
    saveGame(next);
    commit({ game: next, stats: nextStats });

    const country = getCountry(code);
    const name = country?.name ?? code;
    if (next.status === "won") {
      setShakeCode(null);
      setAnnouncement(
        `Correct. The flag is ${name}. Solved in ${next.guesses.length} of ${next.maxAttempts} attempts.`
      );
    } else if (next.status === "lost") {
      setShakeCode(code);
      const answer = getCountry(next.targetCode)?.name ?? next.targetCode;
      setAnnouncement(`Game over. The flag was ${answer}.`);
    } else {
      setShakeCode(code);
      const latest = next.guesses[next.guesses.length - 1];
      const remaining = next.maxAttempts - next.guesses.length;
      setAnnouncement(
        `Incorrect. ${name} is not the flag. ${latest ? describeGuess(latest) : ""} ${remaining} ${
          remaining === 1 ? "attempt" : "attempts"
        } left.`
      );
    }
  };

  const handlePlayAgain = () => {
    const next = startGame();
    commit({ game: next, stats });
    setShakeCode(null);
    setFocusInput(true);
    setAnnouncement(`New flag loaded. You have ${next.maxAttempts} attempts.`);
  };

  const target = game ? getCountry(game.targetCode) : undefined;
  const revealed = game !== null && game.status !== "playing";
  const remaining = game ? game.maxAttempts - game.guesses.length : 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement || (game ? describeStatus(game) : "Loading flag")}
      </p>

      <GameStatsPanel stats={stats} />

      <div className="cyber-terminal">
        <div className="cyber-terminal-header">
          <span className="cyber-terminal-dot bg-[#ff3366]" />
          <span className="cyber-terminal-dot bg-[#ffcc00]" />
          <span className="cyber-terminal-dot bg-[#00ff88]" />
          <span className="ms-2 font-label text-xs uppercase tracking-widest text-muted-foreground">
            flag.sys
          </span>
        </div>
        <div className="space-y-5 p-4 sm:p-6">
          {game && target ? (
            <>
              <FlagDisplay
                code={target.alpha2}
                alt={revealed ? `Flag of ${target.name}` : "Country flag to identify"}
              />
              <p className="text-center font-mono text-sm text-foreground">
                <span className="hud-label me-2">Attempts</span>
                <span className="hud-value">
                  {game.guesses.length} / {game.maxAttempts}
                </span>
                {game.status === "playing" && (
                  <span className="mt-1 block text-xs text-muted-foreground sm:mt-0 sm:ms-3 sm:inline">
                    {remaining} remaining
                  </span>
                )}
              </p>
            </>
          ) : (
            <div
              className="mx-auto aspect-[4/3] w-full max-w-md animate-pulse border border-border bg-card"
              aria-busy="true"
            >
              <span className="sr-only">Loading flag</span>
            </div>
          )}
        </div>
      </div>

      {game && (
        <>
          <div className="relative z-20">
            {game.status === "playing" ? (
              <CountrySelector
                key={game.startedAt}
                excluded={excluded}
                autoFocus={focusInput}
                onGuess={handleGuess}
              />
            ) : (
              <GameResult game={game} onPlayAgain={handlePlayAgain} />
            )}
          </div>
          <GuessHistory
            guesses={game.guesses}
            targetCode={game.targetCode}
            shakeCode={shakeCode}
          />
        </>
      )}
    </div>
  );
}
