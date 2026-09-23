import { formatAverageAttempts, formatWinRate, type GameStats } from "@/lib/flagGame";

interface GameStatsProps {
  stats: GameStats;
}

const items = [
  { key: "played", label: "Games played" },
  { key: "won", label: "Games won" },
  { key: "rate", label: "Win rate" },
  { key: "average", label: "Avg attempts" },
] as const;

export default function GameStatsPanel({ stats }: GameStatsProps) {
  const values: Record<(typeof items)[number]["key"], string> = {
    played: String(stats.played),
    won: String(stats.won),
    rate: formatWinRate(stats),
    average: formatAverageAttempts(stats),
  };

  return (
    <section aria-label="Game statistics">
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {items.map((item) => (
          <div key={item.key} className="border border-border bg-card px-3 py-3 cyber-chamfer-sm">
            <dt className="hud-label">{item.label}</dt>
            <dd className="hud-value mt-1 font-heading text-xl font-black tracking-wider sm:text-2xl">
              {values[item.key]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
