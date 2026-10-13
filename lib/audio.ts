import audioManifest from "./audio-manifest.json";
import { spokenText, type Phrase } from "./phrases";
import { shortHash } from "./hash";

// Audios de ejemplo pregenerados con voz natural (ver scripts/generate-audio.py).
// El manifiesto guarda, por frase, el hash del texto con el que se generó el audio: si la
// frase cambió y aún no se regeneró, no se usa el audio viejo.

interface AudioEntry {
  text: string;
  v: string;
}

const entries = audioManifest.phrases as Record<string, AudioEntry | undefined>;

export function staticAudioUrl(phrase: Phrase): string | null {
  const entry = entries[phrase.id];
  if (!entry || entry.text !== shortHash(spokenText(phrase.en))) return null;
  return `/audio/${phrase.id}.mp3?v=${entry.v}`;
}
