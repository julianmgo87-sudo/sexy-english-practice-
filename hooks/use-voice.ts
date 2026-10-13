"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { spokenText } from "@/lib/phrases";

export interface VoiceState {
  status: "idle" | "loading" | "playing";
  slow: boolean;
}

const IDLE: VoiceState = { status: "idle", slow: false };

// Voces femeninas en inglés, de mejor a peor, según lo que suele traer cada sistema
// (iPhone/Mac, Windows/Edge, Android/Chrome).
const PREFERRED_VOICES = [
  "Ava",
  "Samantha",
  "Allison",
  "Susan",
  "Microsoft Aria",
  "Microsoft Jenny",
  "Microsoft Ava",
  "Microsoft Emma",
  "Microsoft Michelle",
  "Google US English",
  "Victoria",
  "Karen",
  "Moira",
  "Tessa",
  "Serena",
  "Google UK English Female",
  "Microsoft Zira",
];

function pickBrowserVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
  if (voices.length === 0) return null;
  const quality = (v: SpeechSynthesisVoice) => (/natural|online|premium|enhanced|neural/i.test(v.name) ? 0 : 1);
  for (const name of PREFERRED_VOICES) {
    const matches = voices.filter((v) => v.name.includes(name)).sort((a, b) => quality(a) - quality(b));
    if (matches.length) return matches[0];
  }
  return (
    voices.find((v) => /female|woman/i.test(v.name)) ??
    voices.find((v) => v.lang.toLowerCase() === "en-us") ??
    voices[0]
  );
}

interface UseVoiceOptions {
  /** Hay voz premium (OpenAI) disponible en el servidor. */
  live: boolean;
  /** Versión de la voz, para que el navegador no use audios viejos. */
  version: string;
}

/**
 * Reproduce la frase de ejemplo: con la voz premium del servidor si está configurada,
 * o con la mejor voz femenina en inglés del dispositivo si no.
 */
export function useVoice({ live, version }: UseVoiceOptions) {
  const [state, setState] = useState<VoiceState>(IDLE);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const liveFailedRef = useRef(false);

  useEffect(() => {
    // Chrome carga la lista de voces de forma asíncrona: pedirla temprano hace que ya
    // esté lista cuando toquen "Escuchar".
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setState(IDLE);
  }, []);

  useEffect(() => stop, [stop]);

  const speakWithBrowser = useCallback((text: string, slow: boolean) => {
    if (!("speechSynthesis" in window)) {
      setState(IDLE);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickBrowserVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "en-US";
    utterance.rate = slow ? 0.65 : 0.9;
    utterance.pitch = 0.95;
    utterance.onstart = () => setState({ status: "playing", slow });
    utterance.onend = () => setState(IDLE);
    utterance.onerror = () => setState(IDLE);
    setState({ status: "loading", slow });
    synth.speak(utterance);
  }, []);

  const play = useCallback(
    (phrase: { id: string; en: string }, slow = false) => {
      stop();
      if (!live || liveFailedRef.current) {
        speakWithBrowser(spokenText(phrase.en), slow);
        return;
      }

      const audio = new Audio(`/api/tts?id=${encodeURIComponent(phrase.id)}&v=${version}`);
      audio.defaultPlaybackRate = slow ? 0.75 : 1;
      audio.playbackRate = slow ? 0.75 : 1;
      audio.preservesPitch = true;
      audioRef.current = audio;
      setState({ status: "loading", slow });

      audio.onplaying = () => {
        if (audioRef.current === audio) setState({ status: "playing", slow });
      };
      audio.onended = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
          setState(IDLE);
        }
      };
      audio.onerror = () => {
        if (audioRef.current !== audio) return;
        // La voz premium falló (sin clave, sin saldo, sin red...): seguimos con la del dispositivo.
        liveFailedRef.current = true;
        audioRef.current = null;
        speakWithBrowser(spokenText(phrase.en), slow);
      };
      audio.play().catch((err: unknown) => {
        if (audioRef.current !== audio) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        audio.onerror?.(new Event("error"));
      });
    },
    [live, version, speakWithBrowser, stop]
  );

  return { state, play, stop };
}
