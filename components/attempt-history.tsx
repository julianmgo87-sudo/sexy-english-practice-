import type { PhraseProgress } from "@/lib/progress";
import { MASTERED_SCORE } from "@/lib/scoring";
import { scoreColor, Stars } from "./score-badges";

const SHOWN = 10;

/** Barras con los últimos intentos de la frase, para ver cómo va subiendo la nota. */
export function AttemptHistory({ progress }: { progress: PhraseProgress }) {
  const attempts = progress.attempts.slice(-SHOWN);
  const first = progress.attempts[0]?.score ?? 0;
  const improvement = progress.best - first;

  return (
    <section className="rounded-3xl border border-line bg-plum/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">Tu progreso en esta frase</h3>
          <p className="text-sm text-mute">
            {progress.attempts.length} {progress.attempts.length === 1 ? "intento" : "intentos"}
            {improvement > 0 && ` · subiste ${improvement} puntos`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-mute">Mejor nota</div>
          <div className="font-display text-2xl tabular-nums" style={{ color: scoreColor(progress.best) }}>
            {progress.best}
          </div>
          <Stars score={progress.best} size={12} />
        </div>
      </div>

      <div className="relative mt-7 flex h-24 items-end gap-1.5" role="img" aria-label={`Últimos intentos: ${attempts.map((a) => a.score).join(", ")}`}>
        <div
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-good/40"
          style={{ bottom: `${MASTERED_SCORE}%` }}
        />
        {attempts.map((a, i) => (
          <div key={`${a.at}-${i}`} className="flex h-full flex-1 items-end justify-center">
            <div
              className="relative w-full max-w-8 rounded-t-md transition-all"
              style={{ height: `${Math.max(4, a.score)}%`, backgroundColor: scoreColor(a.score), opacity: i === attempts.length - 1 ? 1 : 0.55 }}
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] tabular-nums text-mute">{a.score}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-faint">La línea punteada marca la nota para dominar la frase ({MASTERED_SCORE}).</p>
    </section>
  );
}
