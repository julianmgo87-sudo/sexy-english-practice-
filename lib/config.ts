import { shortHash } from "./hash";

// Configuración del lado del servidor. La voz de ejemplo viene pregrabada (public/audio).
// Con OPENAI_API_KEY la calificación usa transcripción con IA (más precisa) y las frases
// que aún no tengan audio pregrabado se generan con la voz de OpenAI.

export function isLiveAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export const TTS_MODEL = process.env.OPENAI_TTS_MODEL?.trim() || "gpt-4o-mini-tts";
export const TTS_VOICE = process.env.OPENAI_TTS_VOICE?.trim() || "marin";
export const TRANSCRIBE_MODEL = process.env.OPENAI_TRANSCRIBE_MODEL?.trim() || "gpt-4o-mini-transcribe";

/** Estilo de la voz de ejemplo (solo lo usan los modelos gpt-4o-*-tts). */
export const VOICE_INSTRUCTIONS = [
  "Voice: a confident, sexy young American woman with a warm, velvety, slightly breathy tone.",
  "Tone: flirty, playful and intimate, like you're smiling while you speak to someone you like.",
  "Pacing: relaxed and unhurried. Leave tiny pauses at the commas.",
  "Pronunciation: very clear, natural standard American English. English learners will imitate you, so articulate every word fully and never add, skip or change words.",
].join(" ");

/** Cambia cuando cambia la voz, para que el navegador y la CDN no sirvan audios viejos. */
export const TTS_VERSION = shortHash(`${TTS_MODEL}|${TTS_VOICE}|${VOICE_INSTRUCTIONS}`);
