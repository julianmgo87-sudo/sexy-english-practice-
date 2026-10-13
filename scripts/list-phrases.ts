// Imprime en JSON el texto que se dice en voz alta en cada frase del libro.
// Lo usa scripts/generate-audio.py para saber qué audios generar.
import { PHRASES, spokenText } from "../lib/phrases.ts";
import { shortHash } from "../lib/hash.ts";

const rows = PHRASES.map((p) => {
  const text = spokenText(p.en);
  return { id: p.id, text, textHash: shortHash(text) };
});

console.log(JSON.stringify(rows));
