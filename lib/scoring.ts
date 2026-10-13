// Calificación de pronunciación.
//
// Compara lo que el reconocedor de voz entendió con la frase objetivo, palabra por
// palabra, y combina dos señales:
//   1. Precisión: ¿se entendió la palabra correcta? (con crédito parcial para palabras
//      parecidas, p. ej. "sheep" en vez de "ship").
//   2. Claridad: qué tan seguro estaba el reconocedor de cada palabra. Una palabra que se
//      entendió bien pero "a duras penas" baja la nota, porque el acento aún pesa.
//
// Este archivo no importa nada para poder probarse directamente con `node --test`.

export type WordStatus = "good" | "close" | "wrong" | "missing";

export interface HeardWord {
  word: string;
  /** 0–1. Confianza del reconocedor para esta palabra, si está disponible. */
  confidence?: number;
}

export interface RecognitionInput {
  transcript: string;
  /** Palabras con confianza individual (transcripción con IA). */
  words?: HeardWord[];
  /** Confianza global 0–1 (reconocimiento del navegador). */
  confidence?: number | null;
}

export interface WordResult {
  /** La palabra tal como aparece en la frase (con su puntuación). */
  display: string;
  status: WordStatus;
  /** 0–100 */
  score: number;
  /** Lo que se escuchó en su lugar, si fue distinto. */
  heard: string | null;
}

export interface ScoreResult {
  score: number;
  words: WordResult[];
  extraWords: string[];
  transcript: string;
}

const CONTRACTIONS: Record<string, string> = {
  "i'm": "i am",
  "you're": "you are",
  "we're": "we are",
  "they're": "they are",
  "he's": "he is",
  "she's": "she is",
  "it's": "it is",
  "that's": "that is",
  "what's": "what is",
  "there's": "there is",
  "here's": "here is",
  "where's": "where is",
  "how's": "how is",
  "who's": "who is",
  "let's": "let us",
  lets: "let us",
  "i'll": "i will",
  "you'll": "you will",
  "we'll": "we will",
  "he'll": "he will",
  "she'll": "she will",
  "they'll": "they will",
  "it'll": "it will",
  "i've": "i have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have",
  "i'd": "i would",
  "you'd": "you would",
  "he'd": "he would",
  "she'd": "she would",
  "we'd": "we would",
  "they'd": "they would",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "can't": "can not",
  "cannot": "can not",
  "won't": "will not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "wouldn't": "would not",
  "shouldn't": "should not",
  "couldn't": "could not",
  wanna: "want to",
  gonna: "going to",
  gotta: "got to",
  ok: "okay",
  alright: "all right",
  goodbye: "good bye",
  goodnight: "good night",
  // Variantes de ortografía que algunos reconocedores escriben para la misma palabra.
  tonite: "tonight",
  nite: "night",
  thru: "through",
  luv: "love",
  favourite: "favorite",
  colour: "color",
};

// Muletillas que el reconocedor a veces transcribe y que no deben penalizar.
const FILLERS = new Set(["uh", "um", "umm", "hmm", "mm", "mmm", "ah", "eh", "er", "erm"]);

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numberToWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numberToWords(n % 100) : "");
  if (n < 10000) return numberToWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + numberToWords(n % 1000) : "");
  return String(n);
}

/** Convierte una palabra cruda en uno o más tokens comparables. */
export function normalizeWord(raw: string): string[] {
  let w = raw.toLowerCase().replace(/[’‘`]/g, "'");
  w = w.replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, "");
  if (!w) return [];
  if (CONTRACTIONS[w]) return CONTRACTIONS[w].split(" ");
  if (/^\d+$/.test(w)) return numberToWords(Number(w)).split(" ");
  w = w.replace(/[^a-z0-9]/g, "");
  if (!w || FILLERS.has(w)) return [];
  return [w];
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const prev = new Array(b.length + 1).fill(0).map((_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** Similitud 0–1 entre dos palabras normalizadas. */
export function wordSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;
  return Math.max(0, 1 - levenshtein(a, b) / longest);
}

interface TargetToken {
  text: string;
  displayIndex: number;
}

interface HeardToken {
  text: string;
  confidence?: number;
}

// Costo de una palabra de más (dicha pero no está en la frase).
const INSERTION_COST = 0.6;
// Umbrales por palabra (0–1).
const GOOD_THRESHOLD = 0.85;
const CLOSE_THRESHOLD = 0.55;

/**
 * Alinea las palabras objetivo con las escuchadas (distancia de edición a nivel palabra,
 * con sustituciones de costo parcial) y devuelve, para cada palabra objetivo, el índice
 * de la palabra escuchada con la que se emparejó (o -1 si no se dijo).
 */
function align(target: TargetToken[], heard: HeardToken[]): { matches: number[]; extras: number[] } {
  const n = target.length;
  const m = heard.length;
  const cost: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) cost[i][0] = i;
  for (let j = 1; j <= m; j++) cost[0][j] = j * INSERTION_COST;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      cost[i][j] = Math.min(
        cost[i - 1][j - 1] + (1 - wordSimilarity(target[i - 1].text, heard[j - 1].text)),
        cost[i - 1][j] + 1,
        cost[i][j - 1] + INSERTION_COST
      );
    }
  }

  const matches = new Array(n).fill(-1);
  const extras: number[] = [];
  let i = n;
  let j = m;
  const eq = (x: number, y: number) => Math.abs(x - y) < 1e-9;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && eq(cost[i][j], cost[i - 1][j - 1] + (1 - wordSimilarity(target[i - 1].text, heard[j - 1].text)))) {
      matches[i - 1] = j - 1;
      i--;
      j--;
    } else if (i > 0 && eq(cost[i][j], cost[i - 1][j] + 1)) {
      i--;
    } else {
      extras.push(j - 1);
      j--;
    }
  }
  return { matches, extras: extras.reverse() };
}

/** Factor de claridad 0–1 a partir de la confianza del reconocedor. */
function clarityFactor(confidence: number | undefined | null, weight: number): number {
  if (confidence == null || !Number.isFinite(confidence) || confidence <= 0) return 1;
  return 1 - weight + weight * Math.min(1, confidence);
}

export function scorePronunciation(targetPhrase: string, input: RecognitionInput): ScoreResult {
  const displayWords = targetPhrase.split(/\s+/).filter(Boolean);
  const target: TargetToken[] = displayWords.flatMap((w, displayIndex) =>
    normalizeWord(w).map((text) => ({ text, displayIndex }))
  );

  const rawHeard: HeardWord[] =
    input.words && input.words.length > 0
      ? input.words
      : input.transcript.split(/\s+/).filter(Boolean).map((word) => ({ word }));
  const heard: HeardToken[] = rawHeard.flatMap((hw) =>
    normalizeWord(hw.word).map((text) => ({ text, confidence: hw.confidence }))
  );

  const { matches, extras } = align(target, heard);

  // Calidad 0–1 por token objetivo: qué tan parecida fue la palabra y qué tan claro se oyó.
  const tokenScores = target.map((t, i) => {
    const h = matches[i] >= 0 ? heard[matches[i]] : null;
    if (!h) return 0;
    return wordSimilarity(t.text, h.text) * clarityFactor(h.confidence, 0.4);
  });
  // Para la nota final, una palabra "parecida" vale bastante menos que una correcta
  // ("rum" en vez de "room" no puede dar una frase casi perfecta).
  const tokenCredit = target.map((t, i) => {
    const h = matches[i] >= 0 ? heard[matches[i]] : null;
    if (!h) return 0;
    return wordSimilarity(t.text, h.text) ** 2 * clarityFactor(h.confidence, 0.4);
  });

  const words: WordResult[] = displayWords.map((display, displayIndex) => {
    const idxs = target.map((t, i) => (t.displayIndex === displayIndex ? i : -1)).filter((i) => i >= 0);
    if (idxs.length === 0) return { display, status: "good" as const, score: 100, heard: null };
    const s = idxs.reduce((sum, i) => sum + tokenScores[i], 0) / idxs.length;
    const heardText = idxs
      .map((i) => (matches[i] >= 0 ? heard[matches[i]].text : null))
      .filter((x): x is string => x !== null)
      .join(" ");
    const targetText = idxs.map((i) => target[i].text).join(" ");
    const anyMatched = idxs.some((i) => matches[i] >= 0);
    const status: WordStatus = !anyMatched
      ? "missing"
      : s >= GOOD_THRESHOLD
        ? "good"
        : s >= CLOSE_THRESHOLD
          ? "close"
          : "wrong";
    return {
      display,
      status,
      score: Math.round(s * 100),
      heard: heardText && heardText !== targetText ? heardText : null,
    };
  });

  // El exponente hace que cada palabra fallada pese más: 1 de 6 mal ≈ 80, 2 de 6 ≈ 55.
  const accuracy = target.length ? (tokenCredit.reduce((a, b) => a + b, 0) / target.length) ** 1.5 : 0;
  const extraPenalty = Math.min(0.25, extras.length * 0.08);
  const globalClarity = clarityFactor(input.confidence, 0.25);
  let score = Math.round(100 * Math.max(0, Math.min(1, accuracy * globalClarity - extraPenalty)));
  // "¡Perfecta!" solo cuando todas las palabras salieron bien.
  if (words.some((w) => w.status !== "good")) score = Math.min(score, 89);

  return {
    score,
    words,
    extraWords: extras.map((j) => heard[j].text),
    transcript: input.transcript.trim(),
  };
}

export interface ScoreLevel {
  label: string;
  message: string;
  emoji: string;
  tone: "great" | "good" | "ok" | "low";
  stars: number;
}

export function scoreLevel(score: number): ScoreLevel {
  if (score >= 90) return { label: "¡Perfecta!", message: "Suenas como una nativa.", emoji: "🔥", tone: "great", stars: 3 };
  if (score >= 80) return { label: "¡Muy sexy!", message: "Casi perfecta, un detalle más.", emoji: "💋", tone: "great", stars: 2 };
  if (score >= 65) return { label: "¡Bien!", message: "Vas mejorando, sigue así.", emoji: "✨", tone: "good", stars: 1 };
  if (score >= 45) return { label: "Sigue practicando", message: "Escucha el ejemplo y repítelo despacio.", emoji: "💪", tone: "ok", stars: 0 };
  return { label: "Intenta de nuevo", message: "Escucha la frase en modo lento y vuelve a intentarlo.", emoji: "🎧", tone: "low", stars: 0 };
}

/** Una frase se considera dominada a partir de este puntaje. */
export const MASTERED_SCORE = 85;

export function starsForScore(score: number): number {
  return scoreLevel(score).stars;
}
