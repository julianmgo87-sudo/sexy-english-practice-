import { LoaderCircle, Mic, Square } from "lucide-react";
import type { AttemptPhase } from "@/hooks/use-attempt";

export function MicButton({
  phase,
  level,
  disabled,
  onStart,
  onStop,
}: {
  phase: AttemptPhase;
  level: number;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
}) {
  const listening = phase === "listening";
  const analyzing = phase === "analyzing";

  return (
    <div className="relative flex size-28 items-center justify-center">
      {listening && (
        <>
          <span className="absolute inset-2 animate-pulse-ring rounded-full bg-rose/40" />
          <span
            className="absolute inset-2 rounded-full bg-rose/25 transition-transform duration-100"
            style={{ transform: `scale(${1 + level * 0.5})` }}
          />
        </>
      )}
      <button
        type="button"
        onClick={listening ? onStop : onStart}
        disabled={disabled || analyzing}
        aria-label={listening ? "Terminar de hablar" : "Hablar"}
        className={`relative flex size-24 items-center justify-center rounded-full text-white shadow-xl transition active:scale-95 disabled:opacity-50 ${
          listening ? "bg-rose shadow-rose/40" : "bg-gradient-to-br from-rose to-orchid shadow-rose/30 hover:brightness-110"
        }`}
      >
        {analyzing ? (
          <LoaderCircle className="size-9 animate-spin" />
        ) : listening ? (
          <Square className="size-7 fill-white" />
        ) : (
          <Mic className="size-10" />
        )}
      </button>
    </div>
  );
}
