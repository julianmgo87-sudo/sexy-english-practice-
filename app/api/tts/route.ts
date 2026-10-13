import type { NextRequest } from "next/server";
import OpenAI from "openai";
import { getPhrase, spokenText } from "@/lib/phrases";
import { isLiveAIConfigured, TTS_MODEL, TTS_VOICE, VOICE_INSTRUCTIONS, TTS_VERSION } from "@/lib/config";

// Audios ya generados en esta instancia del servidor. Además, la respuesta se cachea
// en el navegador y en la CDN, así que cada frase se genera muy pocas veces.
const memoryCache = new Map<string, ArrayBuffer>();
const MAX_CACHED = 200;

let client: OpenAI | null = null;
function getClient() {
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

/**
 * Devuelve el audio de ejemplo (mp3) de una frase del libro. Solo acepta frases del
 * libro, nunca texto libre, para que nadie pueda usar la clave para generar otros audios.
 */
export async function GET(req: NextRequest) {
  const phrase = getPhrase(req.nextUrl.searchParams.get("id"));
  if (!phrase) {
    return Response.json({ error: "Frase no encontrada" }, { status: 404 });
  }
  if (!isLiveAIConfigured()) {
    return Response.json({ error: "voz_navegador" }, { status: 503 });
  }

  const key = `${phrase.id}|${phrase.en}|${TTS_VERSION}`;
  let audio = memoryCache.get(key);

  if (!audio) {
    try {
      const res = await getClient().audio.speech.create({
        model: TTS_MODEL,
        voice: TTS_VOICE,
        input: spokenText(phrase.en),
        response_format: "mp3",
        ...(TTS_MODEL.startsWith("tts-1") ? {} : { instructions: VOICE_INSTRUCTIONS }),
      });
      audio = await res.arrayBuffer();
    } catch (err) {
      console.error("TTS error", err);
      return Response.json({ error: "No se pudo generar el audio" }, { status: 502 });
    }
    if (memoryCache.size >= MAX_CACHED) {
      const oldest = memoryCache.keys().next().value;
      if (oldest) memoryCache.delete(oldest);
    }
    memoryCache.set(key, audio);
  }

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(audio.byteLength),
      // La URL incluye la versión de la frase y de la voz, así que es segura de cachear mucho tiempo.
      "Cache-Control": "public, max-age=604800, s-maxage=31536000, immutable",
    },
  });
}
