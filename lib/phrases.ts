// Frases del libro "Sexy English – Inglés + poses que generan más dinero" (edición 2026),
// con la pronunciación "a la española" y la traducción tal como aparecen en el libro.
//
// Para cambiar o agregar frases edita solo este archivo. Cada frase es:
//   [inglés, pronunciación, traducción, contexto opcional]
// El contexto se muestra encima de la frase (p. ej. lo que escribió el usuario en el chat).
//
// El id de cada frase es `<id de la lección>-<posición>` y con él se guarda el progreso de
// cada modelo: agrega frases nuevas AL FINAL de su lección para no mover las demás.
//
// "[name]" se muestra tal cual; la voz de ejemplo dice un nombre de muestra y al calificar
// se acepta cualquier nombre en ese lugar.

type PhraseRow = [en: string, sounds: string, es: string, context?: string];

interface LessonData {
  id: string;
  part: string;
  title: string;
  subtitle: string;
  emoji: string;
  /** Consejo del libro para esta lección. */
  tip?: string;
  phrases: PhraseRow[];
}

const LESSON_DATA: LessonData[] = [
  {
    id: "top15",
    part: "Empieza aquí",
    title: "Las 15 frases más rentables",
    subtitle: "Domina estas primero",
    emoji: "💰",
    tip: "No memorices todo. Domina primero estas 15 frases: con eso ya trabajas mejor que la mayoría.",
    phrases: [
      ["Hey [name], welcome!", "jéi [neim], uélcam", "¡Hola [nombre], bienvenido!", "Para qué sirve: retener al que entra"],
      ["Do you like what you see?", "du iu láik uát iu sii", "¿Te gusta lo que ves?", "Para qué sirve: abrir el flirteo"],
      ["Check my tip menu, baby.", "chek mái tip méniu, béibi", "Mira mi menú de tips.", "Para qué sirve: primer tip"],
      ["50 tokens and I'll do it slowly.", "fífti tóukens and áil du it slóuli", "50 tokens y lo hago lento.", "Para qué sirve: tip con oferta concreta"],
      ["My toy vibrates with your tips.", "mái tói váibreits uiz iór tips", "Mi juguete vibra con tus tips.", "Para qué sirve: tips repetidos"],
      ["Make me feel it.", "méik mi fiil it", "Hazme sentirlo.", "Para qué sirve: tips con juguete"],
      ["Only 100 tokens left!", "óunli uán jándred tóukens left", "¡Solo faltan 100 tokens!", "Para qué sirve: cerrar la meta"],
      ["Who's going to be my hero?", "jus góuin tu bi mái jírou", "¿Quién será mi héroe?", "Para qué sirve: activar a la sala"],
      ["Want more? Take me private.", "uánt mor? téik mi práivet", "¿Quieres más? Llévame a privado.", "Para qué sirve: vender privado"],
      ["In private, it's just you and me.", "in práivet, its yast iu and mi", "En privado, solo tú y yo.", "Para qué sirve: exclusividad"],
      ["Tell me your fantasy.", "tel mi iór fántasi", "Cuéntame tu fantasía.", "Para qué sirve: vender customs"],
      ["Thank you, that felt amazing!", "zénk iu, dat felt améisin", "¡Gracias, se sintió increíble!", "Para qué sirve: que el tip se repita"],
      ["You're my favorite tonight.", "iór mái féivorit tunáit", "Eres mi favorito esta noche.", "Para qué sirve: fidelizar"],
      ["Last chance before I go!", "last chans bifór ái góu", "¡Última oportunidad antes de irme!", "Para qué sirve: urgencia final"],
      ["Same time tomorrow?", "séim táim tumórou", "¿Mañana a la misma hora?", "Para qué sirve: cliente recurrente"],
    ],
  },

  // ---------------------------------------------------------------- Parte 1
  {
    id: "saludos",
    part: "Parte 1 · Inglés que vende",
    title: "Saludos y primeras impresiones",
    subtitle: "Los 30 segundos de oro",
    emoji: "👋",
    tip: "Di su nombre de usuario en voz alta en los primeros 10 segundos, sonríe y mira al lente, no a la pantalla.",
    phrases: [
      ["Hey [name], welcome to my room!", "jéi [neim], uélcam tu mái rum", "¡Hola [nombre], bienvenido a mi sala!"],
      ["Hi handsome, I'm so glad you're here.", "jái jánsam, áim sóu glad iúr jíar", "Hola guapo, me alegra mucho que estés aquí."],
      ["You came at the perfect time.", "iu kéim at da pérfect táim", "Llegaste en el momento perfecto."],
      ["Make yourself comfortable, baby.", "méik iorsélf kámfortabol, béibi", "Ponte cómodo, bebé."],
      ["Say hi in the chat so I know you're here.", "séi jái in da chat sóu ái nóu iúr jíar", "Saluda en el chat para saber que estás aquí."],
      ["Where are you from?", "uér ar iu fram", "¿De dónde eres?"],
      ["What should I call you?", "uát shud ái kol iu", "¿Cómo te llamo?"],
    ],
  },
  {
    id: "small-talk",
    part: "Parte 1 · Inglés que vende",
    title: "Small talk y rapport",
    subtitle: "Que se sienta cómodo antes de gastar",
    emoji: "💬",
    tip: "Responde siempre con una pregunta de vuelta. «I'm good, and you?» mantiene la conversación viva; «I'm good» la mata.",
    phrases: [
      ["How's your day going?", "jáus iór déi góuin", "¿Cómo va tu día?"],
      ["Is it day or night where you are?", "is it déi or náit uér iu ar", "¿Allá es de día o de noche?"],
      ["What do you do for fun?", "uát du iu du for fan", "¿Qué haces para divertirte?"],
      ["Tell me something about you.", "tel mi sámzin abáut iu", "Cuéntame algo de ti."],
      ["No way! Tell me more.", "nóu uéi! tel mi mor", "¡No puede ser! Cuéntame más."],
      ["I love that.", "ái lav dat", "Me encanta eso."],
      ["You're funny, I like you.", "iór fáni, ái láik iu", "Eres gracioso, me caes bien."],
      ["I'm from Colombia. Have you ever been there?", "áim fram kolómbia. jav iu éver bin dér", "Soy de Colombia. ¿Has ido alguna vez?"],
    ],
  },
  {
    id: "flirteo",
    part: "Parte 1 · Inglés que vende",
    title: "Flirteo y seducción",
    subtitle: "El puente entre la charla y el tip",
    emoji: "💋",
    tip: "Baja la voz, habla más lento y mantén contacto visual con el lente.",
    phrases: [
      ["You're making me blush.", "iór méikin mi blash", "Me estás haciendo sonrojar."],
      ["I like the way you talk to me.", "ái láik da uéi iu tok tu mi", "Me gusta cómo me hablas."],
      ["You're trouble, aren't you?", "iór trábol, árent iu", "Eres un peligro, ¿verdad?"],
      ["I've been thinking about you.", "áiv bin zínkin abáut iu", "He estado pensando en ti."],
      ["Come closer...", "kam klóuser", "Acércate..."],
      ["I think you're my favorite tonight.", "ái zink iór mái féivorit tunáit", "Creo que eres mi favorito esta noche."],
      ["I want to hear what you're thinking.", "ái uánt tu jíar uát iór zínkin", "Quiero saber qué estás pensando."],
      ["Are you trying to get me in trouble?", "ar iu tráin tu guet mi in trábol", "¿Me quieres meter en problemas?"],
    ],
  },
  {
    id: "pedidos",
    part: "Parte 1 · Inglés que vende",
    title: "Pedidos y control",
    subtitle: "Tú diriges el show",
    emoji: "👑",
    tip: "El usuario propone; tú decides cómo, cuándo y a qué precio.",
    phrases: [
      ["Tell me what you want to see.", "tel mi uát iu uánt tu sii", "Dime qué quieres ver."],
      ["Slow or fast? You decide.", "slóu or fast? iu disáid", "¿Lento o rápido? Tú decides."],
      ["Patience, baby. Good things take time.", "péishens, béibi. gud zings téik táim", "Paciencia, bebé. Lo bueno toma tiempo."],
      ["That's not on my menu, but you'll love this instead.", "dats nat on mái méniu, bat iul lav dis instéd", "Eso no está en mi menú, pero esto te va a encantar."],
      ["Be nice, or you're out.", "bi náis, or iór áut", "Pórtate bien o te vas."],
    ],
  },
  {
    id: "dirty-talk",
    part: "Parte 1 · Inglés que vende",
    title: "Dirty talk",
    subtitle: "De suave a intenso",
    emoji: "🔥",
    tip: "Habla despacio y más grave de lo normal: una voz lenta y baja suena segura y sexy.",
    phrases: [
      ["You're making me so hot.", "iór méikin mi sóu jat", "Me estás poniendo muy caliente."],
      ["I love it when you watch me.", "ái lav it uén iu uách mi", "Me encanta cuando me miras."],
      ["I'm getting so wet for you.", "áim guétin sóu uet for iu", "Me estoy mojando mucho por ti."],
      ["Are you touching yourself?", "ar iu táchin iorsélf", "¿Te estás tocando?"],
      ["I want you so bad.", "ái uánt iu sóu bad", "Te deseo muchísimo."],
      ["Don't stop, I'm so close.", "dóunt stap, áim sóu klóus", "No pares, estoy muy cerca."],
    ],
  },
  {
    id: "roleplay",
    part: "Parte 1 · Inglés que vende",
    title: "Roleplay",
    subtitle: "Novia, jefe, vecina, desconocidos en un hotel",
    emoji: "🎭",
    tip: "Nunca hagas roleplay de personajes menores de edad ni de contextos escolares: es una línea roja en todas las plataformas.",
    phrases: [
      ["Welcome home, babe. I missed you.", "uélcam jóum, béib. ái mist iu", "Bienvenido a casa, amor. Te extrañé."],
      ["Yes, boss. Whatever you say.", "iés, bos. uatéver iu séi", "Sí, jefe. Lo que usted diga."],
      ["Hi neighbor, can I borrow some sugar?", "jái néibor, kan ái bárou sam shúgar", "Hola vecino, ¿me prestas azúcar?"],
      ["Let's pretend we just met.", "lets priténd ui yast met", "Finjamos que nos acabamos de conocer."],
    ],
  },
  {
    id: "tips",
    part: "Parte 1 · Inglés que vende",
    title: "Pedir tips",
    subtitle: "Siempre con una oferta",
    emoji: "💖",
    tip: "Nunca pidas un tip sin decir qué recibe a cambio. «Please tip» suena a súplica; «50 tokens and I'll...» suena a oferta.",
    phrases: [
      ["Check my tip menu, baby.", "chek mái tip méniu, béibi", "Mira mi menú de tips, bebé."],
      ["50 tokens and I'll do it slowly for you.", "fífti tóukens and áil du it slóuli for iu", "50 tokens y lo hago lento para ti."],
      ["My toy vibrates with your tips.", "mái tói váibreits uiz iór tips", "Mi juguete vibra con tus tips."],
      ["Make me feel it.", "méik mi fiil it", "Hazme sentirlo."],
      ["We're only 100 tokens away from the goal!", "uír óunli uán jándred tóukens auéi fram da góul", "¡Solo nos faltan 100 tokens para la meta!"],
      ["Who's going to be my hero tonight?", "jus góuin tu bi mái jírou tunáit", "¿Quién va a ser mi héroe esta noche?"],
      ["Thank you, baby, that felt amazing!", "zénk iu, béibi, dat felt améisin", "¡Gracias, bebé, eso se sintió increíble!"],
    ],
  },
  {
    id: "privados",
    part: "Parte 1 · Inglés que vende",
    title: "Privados",
    subtitle: "Llévalo a privado con naturalidad",
    emoji: "🔒",
    phrases: [
      ["Want more? Take me private.", "uánt mor? téik mi práivet", "¿Quieres más? Llévame a privado."],
      ["In private, it's just you and me.", "in práivet, its yast iu and mi", "En privado somos solo tú y yo."],
      ["I'm much naughtier in private.", "áim mach nótier in práivet", "En privado soy mucho más traviesa."],
      ["I can't show that here... but in private I can.", "ái kant shóu dat jíar... bat in práivet ái kan", "Eso no lo puedo mostrar aquí... pero en privado sí."],
    ],
  },
  {
    id: "customs",
    part: "Parte 1 · Inglés que vende",
    title: "Customs",
    subtitle: "Videos y fotos personalizados",
    emoji: "🎬",
    phrases: [
      ["I make custom videos.", "ái méik kástom vídious", "Hago videos personalizados."],
      ["Tell me your fantasy.", "tel mi iór fántasi", "Cuéntame tu fantasía."],
      ["I'll say your name in the video.", "áil séi iór néim in da vídiou", "Diré tu nombre en el video."],
      ["Send me a message with the details.", "send mi a mésesh uiz da díteils", "Mándame un mensaje con los detalles."],
    ],
  },
  {
    id: "vocab-cuerpo",
    part: "Parte 1 · Inglés que vende",
    title: "Vocabulario: cuerpo",
    subtitle: "Palabras esenciales",
    emoji: "📖",
    phrases: [
      ["lips", "lips", "labios"],
      ["neck", "nek", "cuello"],
      ["shoulders", "shóulders", "hombros"],
      ["chest", "chest", "pecho"],
      ["boobs", "bubs", "senos"],
      ["waist", "uéist", "cintura"],
      ["hips", "jips", "caderas"],
      ["butt", "bat", "trasero"],
      ["booty", "búti", "cola"],
      ["ass", "as", "culo"],
      ["thighs", "záis", "muslos"],
      ["legs", "legs", "piernas"],
      ["feet", "fiit", "pies"],
    ],
  },
  {
    id: "vocab-acciones",
    part: "Parte 1 · Inglés que vende",
    title: "Vocabulario: acciones",
    subtitle: "Lo que haces en el show",
    emoji: "📖",
    phrases: [
      ["tease", "tiiz", "provocar"],
      ["touch", "tach", "tocar"],
      ["kiss", "kis", "besar"],
      ["bite my lip", "báit mái lip", "morderme el labio"],
      ["arch my back", "arch mái bak", "arquear la espalda"],
      ["bend over", "bend óuver", "inclinarse"],
      ["spread my legs", "spred mái legs", "abrir las piernas"],
      ["shake", "shéik", "mover"],
      ["twerk", "tuerk", "hacer twerk"],
      ["spank", "spank", "dar nalgadas"],
      ["undress", "andrés", "desvestirse"],
    ],
  },
  {
    id: "vocab-sensaciones",
    part: "Parte 1 · Inglés que vende",
    title: "Vocabulario: sensaciones",
    subtitle: "Adjetivos que calientan el chat",
    emoji: "📖",
    phrases: [
      ["hot", "jat", "caliente / sexy"],
      ["naughty", "nóti", "traviesa"],
      ["shy", "shái", "tímida"],
      ["horny", "jórni", "excitada"],
      ["turned on", "ternd on", "excitada"],
      ["wet", "uet", "mojada"],
      ["close", "klóus", "a punto (de llegar)"],
      ["slowly", "slóuli", "despacio"],
      ["deep", "diip", "profundo"],
      ["soft", "soft", "suave"],
    ],
  },
  {
    id: "cierre",
    part: "Parte 1 · Inglés que vende",
    title: "Cerrar la sesión",
    subtitle: "Crea clientes recurrentes",
    emoji: "🌙",
    tip: "Di tu horario en la hora del público. «Eastern» es la hora de Nueva York; «Pacific», la de California (3 horas menos).",
    phrases: [
      ["I'm leaving in 10 minutes. Last chance!", "áim líivin in ten mínits. last chans", "Me voy en 10 minutos. ¡Última oportunidad!"],
      ["Thank you for tonight, you made my day.", "zénk iu for tunáit, iu méid mái déi", "Gracias por esta noche, me alegraste el día."],
      ["Follow me so you know when I'm online.", "fálou mi sóu iu nóu uén áim onláin", "Sígueme para que sepas cuándo estoy conectada."],
      ["I'm online Monday to Friday at 9 pm Eastern.", "áim onláin mándei tu fráidei at náin pi em íistern", "Me conecto de lunes a viernes a las 9 pm hora del Este."],
      ["Send me a message, I always reply.", "send mi a mésesh, ái ólueis ripláí", "Mándame un mensaje, siempre respondo."],
      ["Same time tomorrow?", "séim táim tumórou", "¿Mañana a la misma hora?"],
      ["Don't forget me, okay?", "dóunt forguét mi, okéi", "No me olvides, ¿sí?"],
    ],
  },

  // ---------------------------------------------------------------- Parte 2
  {
    id: "pose-1",
    part: "Parte 2 · Poses + frases que generan dinero",
    title: "Pose 1 · Mirada por encima del hombro",
    subtitle: "Over-the-shoulder",
    emoji: "1️⃣",
    tip: "Momento ideal: al iniciar el show, cuando entra un usuario con tokens y como transición entre dos poses.",
    phrases: [
      ["Did you miss me?", "did iu mis mi", "¿Me extrañaste?"],
      ["I caught you looking.", "ái kot iu lúkin", "Te pillé mirando."],
      ["Like the view from back here?", "láik da viú fram bak jíar", "¿Te gusta la vista desde aquí atrás?"],
      ["Want me to turn around?", "uánt mi tu tern aráund", "¿Quieres que me dé la vuelta?"],
      ["Tip 25 and I'll turn around slowly.", "tip tuénti-fáiv and áil tern aráund slóuli", "Da 25 y me doy la vuelta despacio."],
    ],
  },
  {
    id: "pose-2",
    part: "Parte 2 · Poses + frases que generan dinero",
    title: "Pose 2 · Arqueo de espalda",
    subtitle: "Pecho hacia la cámara",
    emoji: "2️⃣",
    tip: "Momento ideal: cuando la meta está cerca y justo antes de quitarte una prenda.",
    phrases: [
      ["Do you like it when I arch my back?", "du iu láik it uén ái arch mái bak", "¿Te gusta cuando arqueo la espalda?"],
      ["I can feel you watching.", "ái kan fiil iu uáchin", "Siento que me estás mirando."],
      ["Closer to the camera?", "klóuser tu da kámera", "¿Más cerca de la cámara?"],
      ["Breathe with me...", "briid uiz mi", "Respira conmigo..."],
      ["50 tokens and the top comes off.", "fífti tóukens and da tap kams of", "50 tokens y me quito el top."],
    ],
  },
  {
    id: "pose-3",
    part: "Parte 2 · Poses + frases que generan dinero",
    title: "Pose 3 · En cuatro",
    subtitle: "Doggy view",
    emoji: "3️⃣",
    tip: "Momento ideal: en el pico de espectadores, durante juegos con juguete interactivo y en privados.",
    phrases: [
      ["Is this the view you wanted?", "is dis da viú iu uánted", "¿Esta es la vista que querías?"],
      ["Every tip makes me shake it.", "évri tip méiks mi shéik it", "Cada tip me hace moverla."],
      ["Spank me with your tips.", "spank mi uiz iór tips", "Dame nalgadas con tus tips."],
      ["Slow or fast? Tip and choose.", "slóu or fast? tip and chuuz", "¿Lento o rápido? Da tip y elige."],
      ["Keep going, don't stop.", "kiip góuin, dóunt stap", "Sigue, no pares."],
    ],
  },
  {
    id: "pose-4",
    part: "Parte 2 · Poses + frases que generan dinero",
    title: "Pose 4 · Piernas abiertas + cara cerca",
    subtitle: "Intimidad uno a uno",
    emoji: "4️⃣",
    tip: "Momento ideal: cuando un usuario está conversando contigo y antes de invitarlo a privado.",
    phrases: [
      ["Look into my eyes.", "luk íntu mái áis", "Mírame a los ojos."],
      ["Come closer, I want to whisper something.", "kam klóuser, ái uánt tu uísper sámzin", "Acércate, quiero susurrarte algo."],
      ["Can you handle this?", "kan iu jándol dis", "¿Puedes con esto?"],
      ["Tell me what you'd do to me.", "tel mi uát iud du tu mi", "Dime qué me harías."],
      ["Show me how bad you want it.", "shóu mi jáu bad iu uánt it", "Demuéstrame cuánto lo deseas."],
    ],
  },
  {
    id: "pose-5",
    part: "Parte 2 · Poses + frases que generan dinero",
    title: "Pose 5 · De lado",
    subtitle: "Side tease",
    emoji: "5️⃣",
    tip: "Momento ideal: en momentos de charla, para descansar entre poses exigentes y en el cierre del show.",
    phrases: [
      ["Let's just relax and talk.", "lets yast riláks and tok", "Relajémonos y hablemos."],
      ["Do you like my curves?", "du iu láik mái kervs", "¿Te gustan mis curvas?"],
      ["Run your eyes all the way down.", "ran iór áis ol da uéi dáun", "Recórreme con la mirada hasta abajo."],
      ["Tip 10 and I'll pull it down a little more.", "tip ten and áil pul it dáun a lítol mor", "Da 10 y lo bajo un poquito más."],
      ["I could stay like this all night with you.", "ái kud stéi láik dis ol náit uiz iu", "Podría quedarme así toda la noche contigo."],
    ],
  },
  {
    id: "pose-6",
    part: "Parte 2 · Poses + frases que generan dinero",
    title: "Pose 6 · Sentadilla",
    subtitle: "Squatting",
    emoji: "6️⃣",
    tip: "Momento ideal: cuando la sala está fría y necesitas subir la energía, y en juegos de tip por repetición.",
    phrases: [
      ["Want to see me go lower?", "uánt tu sii mi góu lóuer", "¿Quieres verme bajar más?"],
      ["Tip 15 for every squat.", "tip fiftíin for évri skuat", "Da 15 por cada sentadilla."],
      ["Count with me: one, two, three...", "káunt uiz mi: uan, tu, zrii", "Cuenta conmigo: uno, dos, tres..."],
      ["Watch me bounce.", "uách mi báuns", "Mírame rebotar."],
      ["Do my legs look good from there?", "du mái legs luk gud fram dér", "¿Mis piernas se ven bien desde ahí?"],
    ],
  },
  {
    id: "pose-7",
    part: "Parte 2 · Poses + frases que generan dinero",
    title: "Pose 7 · Close-up de cara + boca",
    subtitle: "Máxima intimidad",
    emoji: "7️⃣",
    tip: "Momento ideal: para cerrar un privado, para agradecer un tip grande y en la despedida.",
    phrases: [
      ["Read my lips...", "riid mái lips", "Lee mis labios..."],
      ["I want to whisper in your ear.", "ái uánt tu uísper in iór íar", "Quiero susurrarte al oído."],
      ["Tip for a kiss. Mwah!", "tip for a kis. muá", "Da tip por un beso. ¡Muac!"],
      ["It's just you and me now.", "its yast iu and mi náu", "Ahora somos solo tú y yo."],
      ["Take me private and I'll tell you a secret.", "téik mi práivet and áil tel iu a síicret", "Llévame a privado y te cuento un secreto."],
    ],
  },
  {
    id: "pose-8",
    part: "Parte 2 · Poses + frases que generan dinero",
    title: "Pose 8 · De espaldas + tocarse",
    subtitle: "Mirando a cámara",
    emoji: "8️⃣",
    tip: "Momento ideal: durante bailes o striptease, justo después de completar una meta y como adelanto antes de un privado.",
    phrases: [
      ["Watch my hands...", "uách mái jands", "Mira mis manos..."],
      ["This is all for you.", "dis is ol for iu", "Todo esto es para ti."],
      ["Where do you want my hand next?", "uér du iu uánt mái jand next", "¿Dónde quieres mi mano ahora?"],
      ["Tip and I'll go slower.", "tip and áil góu slóuer", "Da tip y voy más lento."],
      ["Do you want me to keep going?", "du iu uánt mi tu kiip góuin", "¿Quieres que siga?"],
    ],
  },

  // ---------------------------------------------------------------- Parte 3
  {
    id: "combos",
    part: "Parte 3 · Combos y recursos rápidos",
    title: "5 combos ganadores",
    subtitle: "Pose + frase + momento exacto",
    emoji: "🎯",
    tip: "El patrón más efectivo: pose + frase de tip + silencio de 3 segundos.",
    phrases: [
      ["Hey [name]... do you like what you see?", "jéi [neim]... du iu láik uát iu sii", "Hola [nombre]... ¿te gusta lo que ves?", "Combo 1 · El gancho de bienvenida · Pose: mirada por encima del hombro"],
      ["Only 100 tokens left... help me get there?", "óunli uán jándred tóukens left... jelp mi guet dér", "Solo faltan 100 tokens... ¿me ayudas a llegar?", "Combo 2 · Rumbo a la meta · Pose: arqueo de espalda"],
      ["I can't show you that here... take me private.", "ái kant shóu iu dat jíar... téik mi práivet", "Eso no te lo puedo mostrar aquí... llévame a privado.", "Combo 3 · El empujón al privado · Pose: close-up de cara + boca"],
      ["Whoever tips the most decides my next move.", "ju-éver tips da móust disáids mái next muv", "El que más dé decide mi siguiente movimiento.", "Combo 4 · La subasta · Pose: en cuatro"],
      ["I'm leaving in 10 minutes... last chance to see me like this.", "áim líivin in ten mínits... last chans tu sii mi láik dis", "Me voy en 10 minutos... última oportunidad de verme así.", "Combo 5 · La despedida que deja con ganas · Pose: de lado"],
    ],
  },
  {
    id: "universales",
    part: "Parte 3 · Combos y recursos rápidos",
    title: "Frases universales",
    subtitle: "Funcionan con cualquier pose",
    emoji: "✨",
    phrases: [
      ["Do you like this angle?", "du iu láik dis ángol", "¿Te gusta este ángulo?"],
      ["Want me to stay like this?", "uánt mi tu stéi láik dis", "¿Quieres que me quede así?"],
      ["Tip if you want more.", "tip if iu uánt mor", "Da tip si quieres más."],
      ["Closer or farther?", "klóuser or fárder", "¿Más cerca o más lejos?"],
      ["Tell me where to touch.", "tel mi uér tu tach", "Dime dónde tocarme."],
      ["Just for you.", "yast for iu", "Solo para ti."],
      ["Is this what you wanted?", "is dis uát iu uánted", "¿Esto es lo que querías?"],
    ],
  },

  // ---------------------------------------------------------------- Ejercicios
  {
    id: "drill-voz",
    part: "Ejercicios y drills",
    title: "Drill 1 · Voz lenta y grave",
    subtitle: "Normal, lento y casi susurrando",
    emoji: "🎙️",
    tip: "Di cada frase tres veces: primero normal, luego a la mitad de velocidad, luego más grave y casi susurrando. Quédate con la tercera versión.",
    phrases: [
      ["Hey baby, welcome to my room.", "jéi béibi, uélcam tu mái rum", "Hola bebé, bienvenido a mi sala."],
      ["Do you like what you see?", "du iu láik uát iu sii", "¿Te gusta lo que ves?"],
      ["Come closer...", "kam klóuser", "Acércate..."],
      ["Make me feel it.", "méik mi fiil it", "Hazme sentirlo."],
    ],
  },
  {
    id: "drill-sonidos",
    part: "Ejercicios y drills",
    title: "Drill 2 · Sonidos difíciles",
    subtitle: "Que no te entiendan otra cosa",
    emoji: "👂",
    tip: "Marca bien la diferencia en cada par: si suenan iguales, el usuario puede entender otra cosa.",
    phrases: [
      ["kiss", "kis", "beso", "Par: kiss / keys"],
      ["keys", "kiiz", "llaves", "Par: kiss / keys"],
      ["hot", "jat", "caliente", "Par: hot / hat"],
      ["hat", "jat (a más abierta)", "sombrero", "Par: hot / hat"],
      ["want", "uánt", "quiero", "Par: want / won't"],
      ["won't", "uóunt", "no voy a", "Par: want / won't"],
      ["sheet", "shiit", "sábana", "Par: sheet / sh*t (¡que no suene a grosería!)"],
      ["beach", "biich", "playa", "Par: beach / b*tch (¡que no suene a grosería!)"],
      ["tease", "tiiz", "provocar", "Par: tease / this"],
      ["this", "dis", "esto", "Par: tease / this"],
      ["think", "zink", "pensar", "Par: think / sink"],
      ["sink", "sink", "lavamanos", "Par: think / sink"],
      ["Thank you for this, I think about that.", "zénk iu for dis, ái zink abáut dat", "Gracias por esto, pienso en eso.", "Trabalenguas para la «th»: repítelo 5 veces, cada vez más rápido"],
    ],
  },
  {
    id: "drill-respuesta",
    part: "Ejercicios y drills",
    title: "Drill 5 · Respuesta rápida",
    subtitle: "Contesta el chat en menos de 5 segundos",
    emoji: "⚡",
    tip: "Lee el mensaje, tapa la respuesta y contesta en voz alta en menos de 5 segundos. Luego compara.",
    phrases: [
      ["Hey baby! So happy you're here. How are you?", "jéi béibi! sóu jápi iúr jíar. jáu ar iu", "¡Hola bebé! Qué bueno que estás aquí. ¿Cómo estás?", "El usuario escribe: «hi bb»"],
      ["Aww, you're making me blush. Thank you, handsome.", "áu, iór méikin mi blash. zénk iu, jánsam", "Ay, me haces sonrojar. Gracias, guapo.", "El usuario escribe: «ur so hot»"],
      ["I'm from Colombia. And you?", "áim fram kolómbia. and iu", "Soy de Colombia. ¿Y tú?", "El usuario escribe: «where r u from?»"],
      ["Patience, baby. Check my tip menu and make it happen.", "péishens, béibi. chek mái tip méniu and méik it jápen", "Paciencia, bebé. Mira mi menú y hazlo realidad.", "El usuario escribe: «show me ur ass»"],
      ["It's on my profile, baby. In private it's just you and me.", "its on mái próufail, béibi. in práivet its yast iu and mi", "Está en mi perfil. En privado somos solo tú y yo.", "El usuario escribe: «how much for pvt?»"],
      ["Already? Thank you for tonight. Same time tomorrow?", "olrédi? zénk iu for tunáit. séim táim tumórou", "¿Ya? Gracias por esta noche. ¿Mañana a la misma hora?", "El usuario escribe: «gtg»"],
      ["Be nice, or you're out.", "bi náis, or iór áut", "Pórtate bien o te vas.", "Alguien escribe algo grosero"],
    ],
  },
  {
    id: "final",
    part: "Ejercicios y drills",
    title: "Mensaje final",
    subtitle: "Tu inglés no tiene que ser perfecto; tiene que ser tuyo",
    emoji: "🌟",
    phrases: [
      ["My English is sexy, not perfect.", "mái ínglish is séksi, nat pérfect", "Mi inglés es sexy, no perfecto.", "Si te disculpas por tu inglés, hazlo una sola vez y con humor"],
      ["You've got this, baby.", "iúv gat dis, béibi", "Tú puedes, bebé."],
    ],
  },
];

export interface Phrase {
  id: string;
  en: string;
  es: string;
  sounds: string;
  context?: string;
}

export interface Lesson {
  id: string;
  part: string;
  title: string;
  subtitle: string;
  emoji: string;
  tip?: string;
  phrases: Phrase[];
}

export const LESSONS: Lesson[] = LESSON_DATA.map(({ phrases, ...lesson }) => ({
  ...lesson,
  phrases: phrases.map(([en, sounds, es, context], i) => ({ id: `${lesson.id}-${i + 1}`, en, sounds, es, context })),
}));

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

/** Nombre de muestra que dice la voz de ejemplo donde la frase tiene "[name]". */
const SAMPLE_NAME = "Mike";

/** El texto que se dice en voz alta (para la voz de ejemplo). */
export function spokenText(en: string): string {
  return en.replace(/\[name\]/gi, SAMPLE_NAME);
}
