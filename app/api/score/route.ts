import OpenAI from "openai";
import { isLiveAIConfigured, TRANSCRIBE_MODEL } from "@/lib/config";
import type { HeardWord } from "@/lib/scoring";

const MAX_AUDIO_BYTES = 2_000_000; // ~1 minuto de audio comprimido; un intento dura segundos.
const MIN_AUDIO_BYTES = 1_000;

let client: OpenAI | null = null;
function getClient() {
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

function extensionFor(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mp4") || mime.includes("m4a") || mime.includes("aac")) return "mp4";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  return "webm";
}

/**
 * Agrupa los tokens de la transcripción en palabras y calcula la confianza de cada una
 * (media geométrica de la probabilidad de sus tokens). Los signos de puntuación no
 * cuentan: el modelo puede dudar de una coma sin que eso diga nada de la pronunciación.
 */
function wordsFromLogprobs(logprobs: { token?: string; logprob?: number }[]): HeardWord[] {
  const words: { text: string; lps: number[] }[] = [];
  for (const { token = "", logprob } of logprobs) {
    const startsWord = words.length === 0 || /^\s/.test(token);
    if (startsWord) words.push({ text: "", lps: [] });
    const current = words[words.length - 1];
    current.text += token;
    if (typeof logprob === "number" && /[\p{L}\p{N}]/u.test(token)) current.lps.push(logprob);
  }
  return words
    .map(({ text, lps }) => ({
      word: text.trim(),
      confidence: lps.length ? Math.exp(lps.reduce((a, b) => a + b, 0) / lps.length) : undefined,
    }))
    .filter((w) => /[\p{L}\p{N}]/u.test(w.word));
}

/**
 * Transcribe un intento de pronunciación. No se le pasa la frase objetivo al modelo a
 * propósito: si la conociera, "corregiría" lo que oye y la nota saldría inflada.
 */
export async function POST(req: Request) {
  if (!isLiveAIConfigured()) {
    return Response.json({ error: "reconocimiento_navegador" }, { status: 503 });
  }

  const form = await req.formData().catch(() => null);
  const audio = form?.get("audio");
  if (!(audio instanceof File)) {
    return Response.json({ error: "Falta el audio" }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return Response.json({ error: "La grabación es demasiado larga" }, { status: 413 });
  }
  if (audio.size < MIN_AUDIO_BYTES) {
    return Response.json({ error: "No te escuchamos, intenta hablar más cerca del micrófono" }, { status: 400 });
  }

  const mime = audio.type || "audio/webm";
  const file = new File([await audio.arrayBuffer()], `intento.${extensionFor(mime)}`, { type: mime });
  const withLogprobs = !TRANSCRIBE_MODEL.startsWith("whisper");

  try {
    const result = await getClient().audio.transcriptions.create({
      file,
      model: TRANSCRIBE_MODEL,
      language: "en",
      response_format: "json",
      ...(withLogprobs ? { include: ["logprobs" as const] } : {}),
    });
    return Response.json({
      transcript: result.text ?? "",
      words: result.logprobs?.length ? wordsFromLogprobs(result.logprobs) : undefined,
    });
  } catch (err) {
    console.error("Transcription error", err);
    return Response.json({ error: "No pudimos analizar tu voz, intenta de nuevo" }, { status: 502 });
  }
}
