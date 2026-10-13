"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { RecognitionInput } from "@/lib/scoring";

/**
 * - "ai": se graba el audio y lo transcribe OpenAI con confianza por palabra (más preciso).
 * - "browser": reconocimiento de voz del navegador (Chrome, Edge, Safari). Gratis.
 * - "none": este navegador no puede escuchar (p. ej. Firefox sin clave de OpenAI).
 */
export type Engine = "ai" | "browser" | "none";
export type AttemptPhase = "idle" | "listening" | "analyzing";

// Mínimo del Web Speech API que usamos (no está en los tipos estándar del DOM).
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string; confidence: number };
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
}

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function detectEngine(live: boolean): Engine {
  const canRecord = Boolean(navigator.mediaDevices?.getUserMedia) && typeof window.MediaRecorder !== "undefined";
  if (live && canRecord) return "ai";
  if (getSpeechRecognition()) return "browser";
  return "none";
}

const noopSubscribe = () => () => {};

const MAX_LISTEN_MS = 12_000;
const NO_SPEECH_MS = 7_000;
const END_SILENCE_MS = 1_300;
const SPEECH_RMS = 0.025;

const MIC_DENIED = "Necesitamos permiso para usar el micrófono. Actívalo en el candado de la barra de direcciones y vuelve a intentarlo.";
const NO_SPEECH = "No te escuchamos. Habla un poco más fuerte y cerca del micrófono.";

function micErrorMessage(err: unknown): string {
  const name = err instanceof DOMException ? err.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return MIC_DENIED;
  if (name === "NotFoundError") return "No encontramos un micrófono en este dispositivo.";
  if (name === "NotReadableError") return "El micrófono está siendo usado por otra aplicación. Ciérrala y vuelve a intentarlo.";
  return "No pudimos abrir el micrófono. Intenta de nuevo.";
}

export function usePronunciationAttempt({ live }: { live: boolean }) {
  const engine = useSyncExternalStore<Engine | "pending">(noopSubscribe, () => detectEngine(live), () => "pending");
  const [phase, setPhase] = useState<AttemptPhase>("idle");
  const [interim, setInterim] = useState("");
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => stopRef.current?.(), []);

  /** Graba con MediaRecorder, corta solo al detectar silencio y manda el audio a /api/score. */
  const listenWithAI = useCallback(async (): Promise<RecognitionInput | null> => {
    // El AudioContext se crea antes del primer `await` para que nazca dentro del toque del
    // usuario; si no, Safari lo deja suspendido y el medidor de volumen se queda en cero.
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    void ctx.resume();

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (err) {
      void ctx.close();
      setError(micErrorMessage(err));
      return null;
    }

    const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find(
      (t) => MediaRecorder.isTypeSupported?.(t)
    );
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const samples = new Float32Array(analyser.fftSize);

    // Si el medidor nunca recibe señal (algunos navegadores no lo permiten), no se puede
    // detectar el silencio: se graba hasta que toquen "terminar" y el servidor decide.
    let meterAlive = false;
    let heardSpeech = false;
    const startedAt = performance.now();
    let lastLoudAt = startedAt;

    const recorded = new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || mimeType || "audio/webm" }));
    });

    const finish = () => {
      if (recorder.state === "inactive") return;
      clearInterval(timer);
      recorder.stop();
      stream.getTracks().forEach((t) => t.stop());
      void ctx.close();
      stopRef.current = null;
      setLevel(0);
    };

    const tick = () => {
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const s of samples) sum += s * s;
      const rms = Math.sqrt(sum / samples.length);
      if (rms > 0) meterAlive = true;
      setLevel(Math.min(1, rms * 8));
      const now = performance.now();
      if (rms > SPEECH_RMS) {
        heardSpeech = true;
        lastLoudAt = now;
      }
      const elapsed = now - startedAt;
      const silentTooLong = meterAlive && (heardSpeech ? now - lastLoudAt > END_SILENCE_MS : elapsed > NO_SPEECH_MS);
      if (elapsed > MAX_LISTEN_MS || silentTooLong) finish();
    };

    recorder.start();
    setPhase("listening");
    const timer = setInterval(tick, 50);
    stopRef.current = finish;

    const blob = await recorded;
    if (meterAlive && !heardSpeech) {
      setError(NO_SPEECH);
      return null;
    }

    setPhase("analyzing");
    const form = new FormData();
    form.append("audio", blob, "intento");
    try {
      const res = await fetch("/api/score", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No pudimos calificar este intento. Intenta de nuevo.");
        return null;
      }
      if (!String(data.transcript ?? "").trim()) {
        setError(NO_SPEECH);
        return null;
      }
      return { transcript: data.transcript, words: data.words };
    } catch {
      setError("Sin conexión. Revisa tu internet e intenta de nuevo.");
      return null;
    }
  }, []);

  /** Reconocimiento de voz del navegador, mostrando lo que va entendiendo en vivo. */
  const listenWithBrowser = useCallback((): Promise<RecognitionInput | null> => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) return Promise.resolve(null);

    return new Promise((resolve) => {
      const rec = new Ctor();
      rec.lang = "en-US";
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      let finalText = "";
      let latestInterim = "";
      const confidences: number[] = [];
      let errorCode: string | undefined;
      const timeout = setTimeout(() => rec.stop(), MAX_LISTEN_MS);

      rec.onresult = (e) => {
        let pending = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            finalText += " " + r[0].transcript;
            if (r[0].confidence > 0) confidences.push(r[0].confidence);
          } else {
            pending += " " + r[0].transcript;
          }
        }
        latestInterim = pending;
        setInterim((finalText + pending).trim());
      };
      rec.onerror = (e) => {
        errorCode = e.error;
      };
      rec.onend = () => {
        clearTimeout(timeout);
        stopRef.current = null;
        const transcript = (finalText || latestInterim).trim();
        if (!transcript) {
          if (errorCode === "not-allowed" || errorCode === "service-not-allowed") setError(MIC_DENIED);
          else if (errorCode === "network") setError("El reconocimiento de voz necesita internet. Revisa tu conexión.");
          else if (errorCode === "audio-capture") setError("No encontramos un micrófono en este dispositivo.");
          else setError(NO_SPEECH);
          resolve(null);
          return;
        }
        const confidence = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : null;
        resolve({ transcript, confidence });
      };

      stopRef.current = () => rec.stop();
      try {
        rec.start();
        setPhase("listening");
      } catch {
        clearTimeout(timeout);
        stopRef.current = null;
        setError("No pudimos iniciar el micrófono. Intenta de nuevo.");
        resolve(null);
      }
    });
  }, []);

  /** Escucha un intento. Devuelve lo reconocido, o null si no se pudo (con `error` explicando por qué). */
  const listen = useCallback(async (): Promise<RecognitionInput | null> => {
    if (phase !== "idle" || engine === "pending" || engine === "none") return null;
    setError(null);
    setInterim("");
    try {
      return engine === "ai" ? await listenWithAI() : await listenWithBrowser();
    } finally {
      setPhase("idle");
      setLevel(0);
    }
  }, [engine, phase, listenWithAI, listenWithBrowser]);

  return { engine, phase, interim, level, error, listen, stop };
}
