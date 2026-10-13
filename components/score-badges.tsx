import { Star } from "lucide-react";
import { scoreLevel } from "@/lib/scoring";

export function scoreColor(score: number): string {
  if (score >= 80) return "var(--color-good)";
  if (score >= 65) return "var(--color-rose-soft)";
  if (score >= 45) return "var(--color-close)";
  return "var(--color-bad)";
}

export function Stars({ score, size = 14 }: { score: number; size?: number }) {
  const stars = scoreLevel(score).stars;
  return (
    <span className="inline-flex gap-0.5" aria-label={`${stars} de 3 estrellas`}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < stars ? "fill-gold text-gold" : "text-faint/50"}
          strokeWidth={1.8}
        />
      ))}
    </span>
  );
}

export function ScorePill({ score }: { score: number }) {
  return (
    <span
      className="inline-flex min-w-11 justify-center rounded-full px-2 py-0.5 text-sm font-semibold tabular-nums"
      style={{ color: scoreColor(score), backgroundColor: `color-mix(in oklab, ${scoreColor(score)} 14%, transparent)` }}
    >
      {score}
    </span>
  );
}
