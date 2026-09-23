import {
  COUNTRIES,
  getCountry,
  type Country,
} from "@/data/countries";

export const MAX_ATTEMPTS = 6;
export const RECENT_LIMIT = 24;

export type GameStatus = "playing" | "won" | "lost";
export type Compass = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export interface StoredGuess {
  code: string;
  sameContinent: boolean;
  distanceKm: number;
  direction: Compass;
}

export interface SavedGame {
  targetCode: string;
  guesses: StoredGuess[];
  status: GameStatus;
  startedAt: number;
  endedAt: number | null;
  maxAttempts: number;
  statsRecorded: boolean;
}

export interface GameStats {
  played: number;
  won: number;
  wonAttempts: number;
}

const GAME_KEY = "flag-game:current";
const STATS_KEY = "flag-game:stats";
const RECENT_KEY = "flag-game:recent";

const EMPTY_STATS: GameStats = { played: 0, won: 0, wonAttempts: 0 };

const DIRECTION_LABEL: Record<Compass, string> = {
  N: "north",
  NE: "northeast",
  E: "east",
  SE: "southeast",
  S: "south",
  SW: "southwest",
  W: "west",
  NW: "northwest",
};

let memoryGame: SavedGame | null = null;
let memoryStats: GameStats = { ...EMPTY_STATS };
let memoryRecent: string[] = [];

function canUseStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const probe = "__flag_game_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJson(key: string): unknown {
  const storage = canUseStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  const storage = canUseStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or privacy mode: keep the in-memory copy and continue.
  }
}

function randomIndex(length: number): number {
  if (length <= 1) return 0;
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % length;
  }
  return Math.floor(Math.random() * length);
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function distanceKm(from: Country, to: Country): number {
  const earthRadius = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function bearingDirection(from: Country, to: Country): Compass {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLng = toRadians(to.lng - from.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  const normalized = (bearing + 360) % 360;
  const directions: Compass[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(normalized / 45) % 8];
}

export function directionLabel(direction: Compass): string {
  return DIRECTION_LABEL[direction];
}

export function formatDistance(km: number): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(km))} km`;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function emptyStats(): GameStats {
  return { ...EMPTY_STATS };
}

export function winRate(stats: GameStats): number | null {
  if (stats.played <= 0) return null;
  return stats.won / stats.played;
}

export function averageAttempts(stats: GameStats): number | null {
  if (stats.won <= 0) return null;
  return stats.wonAttempts / stats.won;
}

export function formatWinRate(stats: GameStats): string {
  const rate = winRate(stats);
  if (rate === null) return "—";
  return `${Math.round(rate * 100)}%`;
}

export function formatAverageAttempts(stats: GameStats): string {
  const average = averageAttempts(stats);
  if (average === null) return "—";
  return average.toFixed(1);
}

function isCompass(value: unknown): value is Compass {
  return (
    value === "N" ||
    value === "NE" ||
    value === "E" ||
    value === "SE" ||
    value === "S" ||
    value === "SW" ||
    value === "W" ||
    value === "NW"
  );
}

function isStoredGuess(value: unknown): value is StoredGuess {
  if (!value || typeof value !== "object") return false;
  const guess = value as Partial<StoredGuess>;
  return (
    typeof guess.code === "string" &&
    Boolean(getCountry(guess.code)) &&
    typeof guess.sameContinent === "boolean" &&
    typeof guess.distanceKm === "number" &&
    Number.isFinite(guess.distanceKm) &&
    isCompass(guess.direction)
  );
}

export function parseGame(value: unknown): SavedGame | null {
  if (!value || typeof value !== "object") return null;
  const game = value as Partial<SavedGame>;
  if (typeof game.targetCode !== "string" || !getCountry(game.targetCode)) return null;
  if (!Array.isArray(game.guesses) || !game.guesses.every(isStoredGuess)) return null;
  if (game.status !== "playing" && game.status !== "won" && game.status !== "lost") return null;
  if (typeof game.startedAt !== "number" || !Number.isFinite(game.startedAt)) return null;
  if (game.endedAt !== null && (typeof game.endedAt !== "number" || !Number.isFinite(game.endedAt))) {
    return null;
  }
  if (typeof game.maxAttempts !== "number" || game.maxAttempts < 1 || game.maxAttempts > 12) {
    return null;
  }
  if (typeof game.statsRecorded !== "boolean") return null;
  if (game.guesses.length > game.maxAttempts) return null;

  const codes = new Set<string>();
  for (const guess of game.guesses) {
    if (codes.has(guess.code)) return null;
    codes.add(guess.code);
  }

  const last = game.guesses[game.guesses.length - 1];
  const won = Boolean(last && last.code === game.targetCode);
  if (game.status === "won" && !won) return null;
  if (game.status === "lost" && (won || game.guesses.length < game.maxAttempts)) return null;
  if (game.status === "playing" && (won || game.guesses.length >= game.maxAttempts)) return null;

  return {
    targetCode: game.targetCode,
    guesses: game.guesses.map((guess) => ({
      code: guess.code.toUpperCase(),
      sameContinent: guess.sameContinent,
      distanceKm: guess.distanceKm,
      direction: guess.direction,
    })),
    status: game.status,
    startedAt: game.startedAt,
    endedAt: game.endedAt,
    maxAttempts: game.maxAttempts,
    statsRecorded: game.statsRecorded,
  };
}

export function parseStats(value: unknown): GameStats {
  if (!value || typeof value !== "object") return emptyStats();
  const stats = value as Partial<GameStats>;
  const played = stats.played;
  const won = stats.won;
  const wonAttempts = stats.wonAttempts;
  if (
    typeof played !== "number" ||
    typeof won !== "number" ||
    typeof wonAttempts !== "number" ||
    !Number.isFinite(played) ||
    !Number.isFinite(won) ||
    !Number.isFinite(wonAttempts) ||
    played < 0 ||
    won < 0 ||
    wonAttempts < 0 ||
    won > played
  ) {
    return emptyStats();
  }
  return {
    played: Math.floor(played),
    won: Math.floor(won),
    wonAttempts: Math.floor(wonAttempts),
  };
}

export function pickCountry(exclude: readonly string[]): Country {
  const blocked = new Set(exclude.map((code) => code.toUpperCase()));
  const pool = COUNTRIES.filter((country) => !blocked.has(country.alpha2));
  const source = pool.length > 0 ? pool : COUNTRIES;
  return source[randomIndex(source.length)];
}

export function createGame(exclude: readonly string[] = [], now = Date.now()): SavedGame {
  const country = pickCountry(exclude);
  return {
    targetCode: country.alpha2,
    guesses: [],
    status: "playing",
    startedAt: now,
    endedAt: null,
    maxAttempts: MAX_ATTEMPTS,
    statsRecorded: false,
  };
}

export function clueForGuess(guessCode: string, targetCode: string): StoredGuess | null {
  const guess = getCountry(guessCode);
  const target = getCountry(targetCode);
  if (!guess || !target) return null;
  return {
    code: guess.alpha2,
    sameContinent: guess.continent === target.continent,
    distanceKm: guess.alpha2 === target.alpha2 ? 0 : distanceKm(guess, target),
    direction: guess.alpha2 === target.alpha2 ? "N" : bearingDirection(guess, target),
  };
}

export function applyGuess(game: SavedGame, code: string, now = Date.now()): SavedGame {
  if (game.status !== "playing") return game;
  const normalized = code.toUpperCase();
  if (!getCountry(normalized)) return game;
  if (game.guesses.some((guess) => guess.code === normalized)) return game;

  const clue = clueForGuess(normalized, game.targetCode);
  if (!clue) return game;

  const guesses = [...game.guesses, clue];
  const correct = normalized === game.targetCode;
  const lost = !correct && guesses.length >= game.maxAttempts;
  const status: GameStatus = correct ? "won" : lost ? "lost" : "playing";

  return {
    ...game,
    guesses,
    status,
    endedAt: status === "playing" ? null : now,
    statsRecorded: status === "playing" ? game.statsRecorded : true,
  };
}

export function recordFinishedGame(stats: GameStats, game: SavedGame): GameStats {
  if (game.status === "playing") return stats;
  return {
    played: stats.played + 1,
    won: stats.won + (game.status === "won" ? 1 : 0),
    wonAttempts: stats.wonAttempts + (game.status === "won" ? game.guesses.length : 0),
  };
}

export function loadGame(): SavedGame | null {
  const parsed = parseGame(readJson(GAME_KEY));
  if (parsed) {
    memoryGame = parsed;
    return parsed;
  }
  return memoryGame ? parseGame(memoryGame) : null;
}

export function saveGame(game: SavedGame): void {
  memoryGame = game;
  writeJson(GAME_KEY, game);
}

export function loadStats(): GameStats {
  const parsed = parseStats(readJson(STATS_KEY));
  const fromStorage = readJson(STATS_KEY);
  if (fromStorage) {
    memoryStats = parsed;
    return parsed;
  }
  return { ...memoryStats };
}

export function saveStats(stats: GameStats): void {
  memoryStats = stats;
  writeJson(STATS_KEY, stats);
}

export function loadRecent(): string[] {
  const stored = readJson(RECENT_KEY);
  if (Array.isArray(stored)) {
    const codes = stored.filter(
      (code): code is string => typeof code === "string" && Boolean(getCountry(code))
    );
    memoryRecent = codes.slice(0, RECENT_LIMIT);
    return [...memoryRecent];
  }
  return [...memoryRecent];
}

export function rememberCountry(code: string): void {
  const normalized = code.toUpperCase();
  if (!getCountry(normalized)) return;
  const next = [normalized, ...memoryRecent.filter((item) => item !== normalized)].slice(
    0,
    RECENT_LIMIT
  );
  memoryRecent = next;
  writeJson(RECENT_KEY, next);
}

export function describeGuess(guess: StoredGuess): string {
  if (guess.distanceKm === 0) return "Correct";
  const continent = guess.sameContinent ? "Same continent" : "Different continent";
  return `${continent} · ${formatDistance(guess.distanceKm)} ${directionLabel(guess.direction)}`;
}
