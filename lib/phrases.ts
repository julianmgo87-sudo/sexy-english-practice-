// Frases del libro Sexy English, organizadas por lección.
//
// Para cambiar o agregar frases edita solo este archivo:
//   - `id`: identificador único y estable (el progreso de cada modelo se guarda con él,
//     así que no lo cambies una vez publicado).
//   - `en`: la frase en inglés tal como se debe pronunciar.
//   - `es`: la traducción al español.
//   - `sounds`: cómo suena, escrito "a la española" para guiar a quien está aprendiendo.

export interface Phrase {
  id: string;
  en: string;
  es: string;
  sounds: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  phrases: Phrase[];
}

export const LESSONS: Lesson[] = [
  {
    id: "saludos",
    title: "Saludos y bienvenida",
    subtitle: "Recibe a cada visitante como si fuera el único",
    emoji: "👋",
    phrases: [
      { id: "hi-baby-welcome", en: "Hi baby, welcome to my room!", es: "¡Hola bebé, bienvenido a mi sala!", sounds: "jái béibi, uélcom tu mái rum" },
      { id: "hello-handsome", en: "Hello handsome, how are you today?", es: "Hola guapo, ¿cómo estás hoy?", sounds: "jelóu jánsom, jáu ar iú tudéi" },
      { id: "where-are-you-from", en: "Where are you from?", es: "¿De dónde eres?", sounds: "uér ar iú from" },
      { id: "happy-to-see-you", en: "I'm so happy to see you here.", es: "Estoy muy feliz de verte aquí.", sounds: "áim sóu jápi tu sí iú jíer" },
      { id: "thank-you-for-coming", en: "Thank you for coming to see me.", es: "Gracias por venir a verme.", sounds: "thénk iú for cáming tu sí mi" },
      { id: "make-yourself-comfortable", en: "Make yourself comfortable.", es: "Ponte cómodo.", sounds: "méik iorsélf cámfortabol" },
    ],
  },
  {
    id: "coqueteo",
    title: "Halagos y coqueteo",
    subtitle: "Frases para que se sienta especial",
    emoji: "💋",
    phrases: [
      { id: "beautiful-smile", en: "You have a beautiful smile.", es: "Tienes una sonrisa hermosa.", sounds: "iú jav a biúriful smáil" },
      { id: "you-make-me-blush", en: "You make me blush.", es: "Me haces sonrojar.", sounds: "iú méik mi blash" },
      { id: "love-your-voice", en: "I love your voice.", es: "Me encanta tu voz.", sounds: "ái lav iór vóis" },
      { id: "you-are-so-sweet", en: "You are so sweet.", es: "Eres muy dulce.", sounds: "iú ar sóu suít" },
      { id: "thinking-about-you", en: "I was thinking about you.", es: "Estaba pensando en ti.", sounds: "ái uós thínkin abáut iú" },
      { id: "look-sexy-tonight", en: "You look really sexy tonight.", es: "Te ves muy sexy esta noche.", sounds: "iú luk ríli séksi tunáit" },
    ],
  },
  {
    id: "conversacion",
    title: "Conversación casual",
    subtitle: "Rompe el hielo y mantén la charla viva",
    emoji: "💬",
    phrases: [
      { id: "what-do-you-like", en: "What do you like to do for fun?", es: "¿Qué te gusta hacer para divertirte?", sounds: "uát du iú láik tu du for fan" },
      { id: "tell-me-about-you", en: "Tell me something about you.", es: "Cuéntame algo de ti.", sounds: "tel mi sámthin abáut iú" },
      { id: "what-time-is-it", en: "What time is it there?", es: "¿Qué hora es allá?", sounds: "uát táim is it dher" },
      { id: "from-colombia", en: "I'm from Colombia, have you ever been there?", es: "Soy de Colombia, ¿alguna vez has ido?", sounds: "áim from colómbia, jav iú éver bin dher" },
      { id: "love-to-dance", en: "I love to dance salsa.", es: "Me encanta bailar salsa.", sounds: "ái lav tu dans sálsa" },
      { id: "how-was-your-day", en: "How was your day?", es: "¿Cómo estuvo tu día?", sounds: "jáu uós iór déi" },
    ],
  },
  {
    id: "propinas",
    title: "Propinas y metas",
    subtitle: "Agradece y motiva sin perder el encanto",
    emoji: "💖",
    phrases: [
      { id: "thanks-for-the-tip", en: "Thank you so much for the tip, baby!", es: "¡Muchas gracias por la propina, bebé!", sounds: "thénk iú sóu mach for dha tip, béibi" },
      { id: "so-generous", en: "You are so generous.", es: "Eres muy generoso.", sounds: "iú ar sóu yéneros" },
      { id: "reach-the-goal", en: "Let's reach the goal together.", es: "Lleguemos juntos a la meta.", sounds: "lets rich dha góul tuguéder" },
      { id: "fifty-tokens-left", en: "Only fifty tokens left for the goal.", es: "Solo faltan cincuenta tokens para la meta.", sounds: "óunli fífti tókens left for dha góul" },
      { id: "tip-me-if-you-like", en: "Tip me if you like what you see.", es: "Dame propina si te gusta lo que ves.", sounds: "tip mi if iú láik uát iú sí" },
      { id: "every-tip-smile", en: "Every tip makes me smile.", es: "Cada propina me hace sonreír.", sounds: "évri tip méiks mi smáil" },
    ],
  },
  {
    id: "privado",
    title: "Show privado",
    subtitle: "Invita con seguridad y elegancia",
    emoji: "🔥",
    phrases: [
      { id: "go-private", en: "Do you want to go private with me?", es: "¿Quieres ir a privado conmigo?", sounds: "du iú uánt tu góu práivet uíth mi" },
      { id: "fun-in-private", en: "Let's have some fun in private.", es: "Divirtámonos en privado.", sounds: "lets jav sam fan in práivet" },
      { id: "know-you-better", en: "I want to know you better.", es: "Quiero conocerte mejor.", sounds: "ái uánt tu nóu iú béter" },
      { id: "tell-me-what-you-like", en: "Tell me what you like.", es: "Dime qué te gusta.", sounds: "tel mi uát iú láik" },
      { id: "something-special", en: "I'll do something special for you.", es: "Haré algo especial para ti.", sounds: "áil du sámthin spéshal for iú" },
      { id: "my-favorite", en: "You are my favorite.", es: "Eres mi favorito.", sounds: "iú ar mái féivorit" },
    ],
  },
  {
    id: "despedidas",
    title: "Despedidas",
    subtitle: "Haz que quiera volver mañana",
    emoji: "🌙",
    phrases: [
      { id: "leaving-already", en: "Are you leaving already?", es: "¿Ya te vas?", sounds: "ar iú lívin olrédi" },
      { id: "come-back-soon", en: "Please come back soon.", es: "Por favor vuelve pronto.", sounds: "plís cam bak sun" },
      { id: "miss-you", en: "I'm going to miss you.", es: "Te voy a extrañar.", sounds: "áim góuin tu mis iú" },
      { id: "follow-me", en: "Don't forget to follow me.", es: "No olvides seguirme.", sounds: "dóunt forguét tu fálou mi" },
      { id: "sweet-dreams", en: "Sweet dreams, baby.", es: "Dulces sueños, bebé.", sounds: "suít drims, béibi" },
      { id: "see-you-tomorrow", en: "See you tomorrow, kisses!", es: "¡Nos vemos mañana, besos!", sounds: "sí iú tumórou, kísis" },
    ],
  },
];

export interface PhraseWithLesson extends Phrase {
  lessonId: string;
  lessonTitle: string;
  /** Posición (1-based) dentro de su lección. */
  number: number;
  lessonSize: number;
}

export const PHRASES: PhraseWithLesson[] = LESSONS.flatMap((lesson) =>
  lesson.phrases.map((p, i) => ({
    ...p,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    number: i + 1,
    lessonSize: lesson.phrases.length,
  }))
);

export function getPhrase(id: string | null | undefined): PhraseWithLesson | undefined {
  if (!id) return undefined;
  return PHRASES.find((p) => p.id === id);
}

export function getNeighbors(id: string): { prev?: PhraseWithLesson; next?: PhraseWithLesson } {
  const idx = PHRASES.findIndex((p) => p.id === id);
  return { prev: idx > 0 ? PHRASES[idx - 1] : undefined, next: idx >= 0 ? PHRASES[idx + 1] : undefined };
}
