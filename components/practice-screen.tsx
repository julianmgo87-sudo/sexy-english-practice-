"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Ear, Lightbulb, Snail, Trophy, Volume2 } from "lucide-react";
import { getNeighbors, getPhrase } from "@/lib/phrases";
import { recordAttempt, useProgress } from "@/lib/progress";
import { MASTERED_SCORE, scoreLevel, scorePronunciation, type ScoreResult, type WordResult } from "@/lib/scoring";
import { tipsForWords } from "@/lib/tips";
import { useVoice } from "@/hooks/use-voice";
import { usePronunciationAttempt } from "@/hooks/use-attempt";
import { ProfileGate } from "./profile-gate";
import { MicButton } from "./mic-button";
import { ScoreRing } from "./score-ring";
import { AttemptHistory } from "./attempt-history";

interface PracticeScreenProps {
  phraseId: string;
  live: boolean;
  ttsVersion: string;
}

export function PracticeScreen(props: PracticeScreenProps) {
  return <ProfileGate>{(profile) => <Practice {...props} profile={profile} />}</ProfileGate>;
}

interface AttemptResult extends ScoreResult {
  previous?: number;
  previousBest?: number;
}

function Practice({ phraseId, live, ttsVersion, profile }: PracticeScreenProps & { profile: string }) {
  const phrase = getPhrase(phraseId)!;
  const { prev, next } = getNeighbors(phraseId);
  const progress = useProgress(profile)[phrase.id];
  const voice = useVoice({ live, version: ttsVersion });
  const attempt = usePronunciationAttempt({ live });
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [showSounds, setShowSounds] = useState(false);

  const start = async () => {
    voice.stop();
    setResult(null);
    const heard = await attempt.listen();
    if (!heard) return;
    const scored = scorePronunciation(phrase.en, heard);
    const { before } = recordAttempt(profile, phrase.id, scored.score);
    setResult({ ...scored, previous: before?.attempts.at(-1)?.score, previousBest: before?.best });
  };

  const playingNormal = voice.state.status !== "idle" && !voice.state.slow;
  const playingSlow = voice.state.status !== "idle" && voice.state.slow;
  const busy = attempt.phase !== "idle";

  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-5 sm:px-6">
      <nav className="flex items-center justify-between gap-3 text-sm">
        <Link href="/" className="flex items-center gap-1.5 rounded-full px-2 py-1 text-mute transition hover:text-ink">
          <ArrowLeft className="size-4" />
          Lecciones
        </Link>
        <span className="truncate text-mute">
          {phrase.lessonTitle} · {phrase.number}/{phrase.lessonSize}
        </span>
      </nav>

      <section className="mt-4 animate-rise rounded-3xl border border-line bg-plum/80 p-6 text-center shadow-2xl shadow-black/30">
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">{phrase.en}</h1>
        <p className="mt-3 text-mute">{phrase.es}</p>

        <button
          onClick={() => setShowSounds((s) => !s)}
          className="mx-auto mt-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-rose-soft transition hover:bg-plum-2"
          aria-expanded={showSounds}
        >
          <Ear className="size-4" />
          {showSounds ? phrase.sounds : "¿Cómo suena?"}
        </button>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => (playingNormal ? voice.stop() : voice.play(phrase))}
            disabled={busy}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-rose/50 bg-rose/10 px-5 py-2.5 font-medium text-rose-soft transition hover:bg-rose/20 disabled:opacity-40"
          >
            <Volume2 className={`size-5 ${playingNormal ? "animate-pulse" : ""}`} />
            {playingNormal && voice.state.status === "loading" ? "Cargando…" : "Escuchar"}
          </button>
          <button
            onClick={() => (playingSlow ? voice.stop() : voice.play(phrase, true))}
            disabled={busy}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-plum-2 px-4 py-2.5 font-medium text-mute transition hover:text-ink disabled:opacity-40"
            aria-label="Escuchar despacio"
          >
            <Snail className={`size-5 ${playingSlow ? "animate-pulse" : ""}`} />
            Lento
          </button>
        </div>
      </section>

      <section className="mt-6 flex flex-col items-center text-center">
        {attempt.engine === "none" ? (
          <p className="rounded-2xl border border-close/30 bg-close/10 p-4 text-sm text-close">
            Este navegador no puede escucharte. Abre el link en <b>Google Chrome</b> (Android o computador) o en <b>Safari</b> (iPhone) para que califiquemos tu pronunciación.
          </p>
        ) : (
          <>
            <MicButton
              phase={attempt.phase}
              level={attempt.level}
              disabled={attempt.engine === "pending"}
              onStart={start}
              onStop={attempt.stop}
            />
            <p className="mt-2 min-h-6 text-sm text-mute" aria-live="polite">
              {attempt.phase === "listening"
                ? "Te escucho… di la frase (toca para terminar)"
                : attempt.phase === "analyzing"
                  ? "Calificando tu pronunciación…"
                  : result
                    ? "Toca para intentarlo otra vez"
                    : "Toca el micrófono y di la frase en inglés"}
            </p>
            {attempt.phase === "listening" && attempt.interim && (
              <p className="mt-1 max-w-sm text-lg italic text-ink/80">“{attempt.interim}”</p>
            )}
            {attempt.error && attempt.phase === "idle" && (
              <p className="mt-3 max-w-sm rounded-2xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad" role="alert">
                {attempt.error}
              </p>
            )}
          </>
        )}
      </section>

      {result && <ResultCard result={result} nextHref={next ? `/frase/${next.id}` : "/"} />}

      {progress && (
        <div className="mt-6">
          <AttemptHistory progress={progress} />
        </div>
      )}

      <nav className="mt-8 flex items-center justify-between gap-3">
        {prev ? (
          <Link href={`/frase/${prev.id}`} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-mute transition hover:bg-plum-2 hover:text-ink">
            <ChevronLeft className="size-4" />
            Anterior
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/frase/${next.id}`} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-mute transition hover:bg-plum-2 hover:text-ink">
            Siguiente
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-mute transition hover:bg-plum-2 hover:text-ink">
            Volver a las lecciones
            <ChevronRight className="size-4" />
          </Link>
        )}
      </nav>

      <p className="mt-6 text-center text-xs text-faint">
        {live ? "Voz y calificación con IA" : "Voz y reconocimiento de tu dispositivo"}
        {attempt.engine === "browser" && live ? " · calificando con el navegador" : ""}
      </p>
    </main>
  );
}

function ResultCard({ result, nextHref }: { result: AttemptResult; nextHref: string }) {
  const level = scoreLevel(result.score);
  const isRecord = result.previousBest !== undefined && result.score > result.previousBest;
  const delta = result.previous !== undefined ? result.score - result.previous : null;
  const toImprove = result.words.filter((w) => w.status !== "good");
  const tips = tipsForWords(toImprove.map((w) => w.display));

  return (
    <section className="mt-6 animate-rise rounded-3xl border border-line bg-plum/80 p-6" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <ScoreRing score={result.score} />
        <div className="flex-1">
          <p className="font-display text-2xl">
            {level.label} <span aria-hidden>{level.emoji}</span>
          </p>
          <p className="mt-1 text-mute">{level.message}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            {result.previousBest === undefined ? (
              <Chip>¡Primer intento!</Chip>
            ) : isRecord ? (
              <Chip highlight>
                <Trophy className="size-3.5" /> ¡Nuevo récord! +{result.score - result.previousBest}
              </Chip>
            ) : null}
            {delta !== null && delta !== 0 && !isRecord && (
              <Chip>
                {delta > 0 ? `+${delta}` : delta} vs. tu intento anterior
              </Chip>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-wider text-faint">Palabra por palabra</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {result.words.map((w, i) => (
            <WordChip key={i} word={w} />
          ))}
        </div>
        <p className="mt-3 text-sm text-mute">
          Escuchamos: <span className="italic text-ink/90">“{result.transcript || "…"}”</span>
        </p>
      </div>

      {tips.length > 0 && (
        <div className="mt-5 space-y-2 rounded-2xl bg-night/60 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-gold">
            <Lightbulb className="size-4" /> Consejos para mejorar
          </p>
          <ul className="space-y-2 text-sm text-ink/90">
            {tips.map((t) => (
              <li key={t.word + t.tip}>
                <b className="text-rose-soft">{t.word}:</b> {t.tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.score >= MASTERED_SCORE && (
        <Link
          href={nextHref}
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose to-orchid px-4 py-3 font-semibold text-white shadow-lg shadow-rose/25 transition hover:brightness-110"
        >
          ¡Dominada! Siguiente frase
          <ChevronRight className="size-4" />
        </Link>
      )}
    </section>
  );
}

const WORD_STYLES: Record<WordResult["status"], string> = {
  good: "border-good/40 bg-good/10 text-good",
  close: "border-close/40 bg-close/10 text-close",
  wrong: "border-bad/40 bg-bad/10 text-bad",
  missing: "border-bad/30 bg-transparent text-bad/80 line-through",
};

const WORD_TITLES: Record<WordResult["status"], string> = {
  good: "Bien dicha",
  close: "Casi: revisa esta palabra",
  wrong: "Se entendió otra palabra",
  missing: "No se escuchó",
};

function WordChip({ word }: { word: WordResult }) {
  return (
    <span className={`flex flex-col items-center rounded-xl border px-2.5 py-1 ${WORD_STYLES[word.status]}`} title={WORD_TITLES[word.status]}>
      <span className="font-medium">{word.display}</span>
      {word.heard && word.status !== "good" && <span className="text-[11px] opacity-80 no-underline">oímos “{word.heard}”</span>}
    </span>
  );
}

function Chip({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
        highlight ? "bg-gold/15 text-gold" : "bg-plum-3 text-mute"
      }`}
    >
      {children}
    </span>
  );
}
