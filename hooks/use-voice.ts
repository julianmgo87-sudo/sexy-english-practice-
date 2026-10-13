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

/**
 * Reproduce la frase de ejemplo probando las fuentes en orden (el audio con voz natural
 * pregenerado y, si está configurada, la voz de OpenAI). Si ninguna funciona, usa la
 * mejor voz femenina en inglés del dispositivo.
 */
export function useVoice({ sources }: { sources: string[] }) {
  const [state, setState] = useState<VoiceState>(IDLE);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Primera fuente que no ha fallado, para no reintentar una que ya sabemos que falla.
  const firstSourceRef = useRef(0);

  useEffect(() => {
    // Chrome carga la lista de voces de forma asíncrona: pedirla temprano hace que ya
    // esté lista si hay que usar la voz del dispositivo.
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

      const playFrom = (index: number) => {
        const src = sources[index];
        if (!src) {
          audioRef.current = null;
          speakWithBrowser(spokenText(phrase.en), slow);
          return;
        }

        const audio = new Audio(src);
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
          // Esta fuente falló (archivo faltante, sin clave, sin red...): probamos la siguiente.
          firstSourceRef.current = index + 1;
          playFrom(index + 1);
        };
        audio.play().catch((err: unknown) => {
          if (audioRef.current !== audio) return;
          if (err instanceof DOMException && err.name === "AbortError") return;
          audio.onerror?.(new Event("error"));
        });
      };

      playFrom(firstSourceRef.current);
    },
    [sources, speakWithBrowser, stop]
  );

  return { state, play, stop };
}
