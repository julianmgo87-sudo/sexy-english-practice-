"use client";

import { useSyncExternalStore } from "react";
import { MASTERED_SCORE } from "./scoring";

// Progreso de cada modelo, guardado en este dispositivo (localStorage). Se separa por
// nombre para que varias modelos puedan compartir el mismo computador del estudio.

export interface Attempt {
  score: number;
  at: number;
}

export interface PhraseProgress {
  best: number;
  attempts: Attempt[];
}

export type Progress = Record<string, PhraseProgress>;

const PROFILE_KEY = "se:perfil";
const PROFILES_KEY = "se:perfiles";
const MAX_ATTEMPTS_KEPT = 30;
const progressKey = (profile: string) => `se:progreso:${profile.trim().toLowerCase()}`;

// Si el navegador bloquea localStorage (modo privado, etc.) se usa memoria: la app
// funciona igual, solo que el progreso no sobrevive a recargar la página.
const memory = new Map<string, string>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function writeRaw(key: string, value: string | null) {
  if (value === null) memory.delete(key);
  else memory.set(key, value);
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Sin localStorage: queda en memoria.
  }
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// useSyncExternalStore exige que la misma lectura devuelva el mismo objeto.
const parsed = new Map<string, { raw: string | null; value: unknown }>();

function readJSON<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  const hit = parsed.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  parsed.set(key, { raw, value });
  return value;
}

const EMPTY_PROGRESS: Progress = {};
const NO_PROFILES: string[] = [];

/** `undefined` mientras se hidrata la página; `null` si aún no ha dicho su nombre. */
export function useProfile(): string | null | undefined {
  return useSyncExternalStore(subscribe, () => readRaw(PROFILE_KEY), () => undefined);
}

export function useKnownProfiles(): string[] {
  return useSyncExternalStore(subscribe, () => readJSON(PROFILES_KEY, NO_PROFILES), () => NO_PROFILES);
}

export function useProgress(profile: string): Progress {
  return useSyncExternalStore(subscribe, () => readJSON(progressKey(profile), EMPTY_PROGRESS), () => EMPTY_PROGRESS);
}

export function setProfile(name: string | null) {
  if (!name) {
    writeRaw(PROFILE_KEY, null);
    return;
  }
  const clean = name.trim().replace(/\s+/g, " ").slice(0, 40);
  const known = readJSON(PROFILES_KEY, NO_PROFILES).filter((p) => p.toLowerCase() !== clean.toLowerCase());
  writeRaw(PROFILES_KEY, JSON.stringify([clean, ...known].slice(0, 20)));
  writeRaw(PROFILE_KEY, clean);
}

/** Guarda un intento y devuelve el progreso de la frase antes y después. */
export function recordAttempt(profile: string, phraseId: string, score: number) {
  const key = progressKey(profile);
  const all = readJSON(key, EMPTY_PROGRESS);
  const before = all[phraseId];
  const after: PhraseProgress = {
    best: Math.max(before?.best ?? 0, score),
    attempts: [...(before?.attempts ?? []), { score, at: Date.now() }].slice(-MAX_ATTEMPTS_KEPT),
  };
  writeRaw(key, JSON.stringify({ ...all, [phraseId]: after }));
  return { before, after };
}

export function isMastered(p: PhraseProgress | undefined) {
  return (p?.best ?? 0) >= MASTERED_SCORE;
}
