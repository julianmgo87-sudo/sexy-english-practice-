"use client";

import { useState, type ReactNode } from "react";
import { setProfile, useKnownProfiles, useProfile } from "@/lib/progress";
import { Brand } from "./brand";

/** Pide el nombre de la modelo la primera vez, para guardar su progreso por separado. */
export function ProfileGate({ children }: { children: (profile: string) => ReactNode }) {
  const profile = useProfile();
  const known = useKnownProfiles();
  const [name, setName] = useState("");

  if (profile === undefined) {
    return <div className="min-h-dvh" aria-busy="true" />;
  }
  if (profile) return <>{children(profile)}</>;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-12">
      <div className="animate-rise space-y-8">
        <div className="space-y-3 text-center">
          <Brand stacked className="text-6xl" />
          <p className="text-mute">Practica las frases del libro, escucha cómo se dicen y mira cómo sube tu calificación.</p>
        </div>

        <form
          className="space-y-4 rounded-3xl border border-line bg-plum/80 p-6 backdrop-blur"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) setProfile(name);
          }}
        >
          <label htmlFor="name" className="block font-display text-xl">
            ¿Cómo te llamas, preciosa?
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre o nombre artístico"
            autoComplete="nickname"
            maxLength={40}
            className="w-full rounded-2xl border border-line bg-night px-4 py-3 text-ink placeholder:text-faint focus:border-rose focus:outline-none"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-rose to-orchid px-4 py-3 font-semibold text-white shadow-lg shadow-rose/25 transition disabled:opacity-40"
          >
            Empezar a practicar
          </button>
          <p className="text-center text-xs text-faint">Tu progreso se guarda en este dispositivo.</p>
        </form>

        <p className="rounded-2xl bg-plum-3/60 px-4 py-3 text-center text-xs text-mute">
          <b className="text-gold">+18</b> · Exclusivo para modelos mayores de edad. Respeta siempre las reglas de tu plataforma y tus propios límites.
        </p>

        {known.length > 0 && (
          <div className="space-y-2 text-center">
            <p className="text-sm text-mute">¿Ya practicaste aquí antes?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {known.map((p) => (
                <button
                  key={p}
                  onClick={() => setProfile(p)}
                  className="rounded-full border border-line bg-plum-2 px-4 py-1.5 text-sm transition hover:border-rose"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
