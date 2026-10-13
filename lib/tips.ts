// Consejos de pronunciación para hispanohablantes, según los sonidos de cada palabra.

interface TipRule {
  id: string;
  test: (word: string) => boolean;
  tip: string;
}

const SILENT_H = new Set(["hour", "hours", "honest", "honor", "heir"]);

const RULES: TipRule[] = [
  {
    id: "th-voiced",
    test: (w) => /^(the|this|that|these|those|there|their|they|them|then|than|though|with|together|other|mother|brother|father|weather|another|without|breathe)$/.test(w),
    tip: "La «th» de esta palabra vibra (en la pronunciación la escribimos «d»): punta de la lengua entre los dientes, haciendo vibrar la voz.",
  },
  {
    id: "th",
    test: (w) => w.includes("th"),
    tip: "Para la «th» (en la pronunciación la escribimos «z») pon la punta de la lengua entre los dientes y sopla suave. No es «t» ni «s».",
  },
  {
    id: "s-cluster",
    test: (w) => /^s[ptkmnlwc]/.test(w),
    tip: "No digas «es» al inicio: empieza directo con la «s» (s-mile, no es-mile). Alarga la «sss» antes de la siguiente letra.",
  },
  {
    id: "v",
    test: (w) => w.includes("v"),
    tip: "La «v» en inglés no es «b»: apoya los dientes de arriba sobre el labio de abajo y deja que vibre.",
  },
  {
    id: "h",
    test: (w) => w.startsWith("h") && !SILENT_H.has(w),
    tip: "La «h» suena como una «j» muy suave, solo aire saliendo de la garganta (jelóu, jápi).",
  },
  {
    id: "j",
    test: (w) => /^j|dg|ge$|gen|gy$/.test(w),
    tip: "Este sonido es como «dy» o la «y» fuerte de «yo»: junta la lengua al paladar y suéltala con fuerza.",
  },
  {
    id: "sh",
    test: (w) => w.includes("sh") || /tion|cial/.test(w),
    tip: "La «sh» es el sonido de pedir silencio: «shhh». Redondea un poco los labios.",
  },
  {
    id: "w",
    test: (w) => w.startsWith("w") || w.startsWith("wh"),
    tip: "La «w» se hace con los labios en forma de beso, como una «u» rápida: «uánt», «uélcam».",
  },
  {
    id: "y",
    test: (w) => w.startsWith("y"),
    tip: "La «y» inicial suena como una «i» rápida (iú), no como «ll» ni «sh».",
  },
  {
    id: "long-oo",
    test: (w) => /oo/.test(w) && !/book|look|good|foot|cook/.test(w),
    tip: "«oo» es una «u» larga: pon los labios redondos y estírala (ruuum, suuun).",
  },
  {
    id: "long-ee",
    test: (w) => /ee|ea/.test(w) && !/ead|eath|great|break|wear|bear|heart/.test(w),
    tip: "«ee» / «ea» es una «i» larga: sonríe un poco y estírala (swiiit, siii).",
  },
  {
    id: "short-i",
    test: (w) => /^[^aeiou]*i[^aeiou]+$/.test(w) && w.length <= 5,
    tip: "Esta «i» es corta y relajada, entre «i» y «e». No la estires.",
  },
  {
    id: "r",
    test: (w) => w.includes("r"),
    tip: "La «r» inglesa no vibra: curva la punta de la lengua hacia atrás sin tocar el paladar.",
  },
  {
    id: "z",
    test: (w) => w.includes("z") || /[bdgvmnlrwy]s$/.test(w) || /^(is|was|has|his|as|does|goes)$/.test(w),
    tip: "Cuando la «s» va al final suele sonar como una «z» que zumba, como una abejita: «bzzz».",
  },
  {
    id: "final-consonant",
    test: (w) => /[tdkpgb]$/.test(w),
    tip: "No te comas la última consonante: márcala suavemente al final de la palabra.",
  },
];

const GENERAL_TIP = "Escucha la frase en modo lento y repítela sílaba por sílaba, exagerando un poco cada sonido.";

export interface WordTip {
  word: string;
  tip: string;
}

/** Hasta `max` consejos distintos para las palabras que salieron mal. */
export function tipsForWords(words: string[], max = 3): WordTip[] {
  const used = new Set<string>();
  const tips: WordTip[] = [];
  for (const raw of words) {
    const word = raw.toLowerCase().replace(/[^a-z']/g, "");
    if (!word) continue;
    const rule = RULES.find((r) => !used.has(r.id) && r.test(word));
    if (rule) {
      used.add(rule.id);
      tips.push({ word: raw.replace(/[^\p{L}']/gu, ""), tip: rule.tip });
    }
    if (tips.length >= max) break;
  }
  if (tips.length === 0 && words.length > 0) {
    tips.push({ word: words[0].replace(/[^\p{L}']/gu, ""), tip: GENERAL_TIP });
  }
  return tips;
}
