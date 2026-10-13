"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Check, Sparkles } from "lucide-react";
import { LESSONS, PHRASES } from "@/lib/phrases";
import { isMastered, setProfile, useProgress } from "@/lib/progress";
import { Brand } from "./brand";
import { ProfileGate } from "./profile-gate";
import { ScorePill, Stars } from "./score-badges";

export function HomeScreen() {
  return <ProfileGate>{(profile) => <Lessons profile={profile} />}</ProfileGate>;
}

function Lessons({ profile }: { profile: string }) {
  const progress = useProgress(profile);

  const practiced = PHRASES.filter((p) => progress[p.id]).length;
  const mastered = PHRASES.filter((p) => isMastered(progress[p.id])).length;
  const bests = PHRASES.map((p) => progress[p.id]?.best).filter((b): b is number => b !== undefined);
  const average = bests.length ? Math.round(bests.reduce((a, b) => a + b, 0) / bests.length) : null;
  const next = PHRASES.find((p) => !isMastered(progress[p.id])) ?? PHRASES[0];
  const masteredPct = Math.round((mastered / PHRASES.length) * 100);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <Brand className="text-3xl" />
        <button
          onClick={() => setProfile(null)}
          className="flex items-center gap-2 rounded-full border border-line bg-plum/70 py-1 pl-1 pr-3 text-sm transition hover:border-rose"
          title="Cambiar de perfil"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-rose to-orchid text-xs font-bold uppercase text-white">
            {profile.slice(0, 1)}
          </span>
          <span className="max-w-28 truncate">{profile}</span>
        </button>
      </header>

      <section className="mt-6 animate-rise overflow-hidden rounded-3xl border border-line bg-plum/80 p-5 sm:p-6">
        <p className="text-mute">Hola, {profile} 💋</p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl">
          {practiced === 0 ? "¿Lista para tu primera frase?" : mastered === PHRASES.length ? "¡Dominaste todo el libro!" : "Sigue así, cada intento suma"}
        </h1>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat value={`${mastered}/${PHRASES.length}`} label="dominadas" />
          <Stat value={String(practiced)} label="practicadas" />
          <Stat value={average === null ? "—" : String(average)} label="promedio" />
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-night" role="progressbar" aria-valuenow={masteredPct} aria-valuemin={0} aria-valuemax={100} aria-label="Frases dominadas">
          <div className="h-full rounded-full bg-gradient-to-r from-rose to-orchid transition-all" style={{ width: `${masteredPct}%` }} />
        </div>

        <Link
          href={`/frase/${next.id}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose to-orchid px-4 py-3.5 font-semibold text-white shadow-lg shadow-rose/25 transition hover:brightness-110"
        >
          <Sparkles className="size-4" />
          {practiced === 0 ? "Empezar a practicar" : "Continuar practicando"}
        </Link>
      </section>

      <section className="mt-8 space-y-4">
        {LESSONS.map((lesson, lessonIndex) => {
          const done = lesson.phrases.filter((p) => isMastered(progress[p.id])).length;
          const containsNext = lesson.phrases.some((p) => p.id === next.id);
          const newPart = lessonIndex === 0 || LESSONS[lessonIndex - 1].part !== lesson.part;
          return (
            <Fragment key={lesson.id}>
              {newPart && <h2 className={`px-1 font-display text-xl text-gold ${lessonIndex > 0 ? "pt-4" : ""}`}>{lesson.part}</h2>}
              <details open={containsNext} className="group rounded-3xl border border-line bg-plum/60">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-plum-3 text-xl" aria-hidden>
                    {lesson.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{lesson.title}</span>
                    <span className="block truncate text-sm text-mute">{lesson.subtitle}</span>
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-mute">
                    {done}/{lesson.phrases.length}
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-faint transition group-open:rotate-180" />
                </summary>
                {lesson.tip && (
                  <p className="mx-4 mb-2 rounded-2xl bg-night/60 px-4 py-3 text-sm text-mute sm:mx-5">
                    <span className="font-semibold text-gold">Consejo del libro: </span>
                    {lesson.tip}
                  </p>
                )}
                <ul className="space-y-1 px-2 pb-3 sm:px-3">
                  {lesson.phrases.map((phrase, i) => {
                    const p = progress[phrase.id];
                    return (
                      <li key={phrase.id}>
                        <Link
                          href={`/frase/${phrase.id}`}
                          className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-plum-2 sm:px-3"
                        >
                          <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                              isMastered(p) ? "bg-good/15 text-good" : "bg-plum-3 text-mute"
                            }`}
                          >
                            {isMastered(p) ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 font-medium">{phrase.en}</span>
                            <span className="line-clamp-2 text-sm text-mute">{phrase.es}</span>
                          </span>
                          {p ? (
                            <span className="flex shrink-0 flex-col items-end gap-1">
                              <ScorePill score={p.best} />
                              <Stars score={p.best} size={11} />
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs text-faint">nueva</span>
                          )}
                          <ChevronRight className="size-4 shrink-0 text-faint" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </Fragment>
          );
        })}
      </section>

      <footer className="mt-12 text-center text-xs text-faint">
        Sexy English · Clases personalizadas <span className="text-mute">@solucionesbilingues</span>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-night/60 px-2 py-3">
      <div className="font-display text-2xl tabular-nums">{value}</div>
      <div className="text-xs text-mute">{label}</div>
    </div>
  );
}
