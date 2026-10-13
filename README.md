# Sexy English · App de práctica

App web para que las modelos practiquen la pronunciación de las frases del libro **Sexy English**:

- **Escuchar**: cada frase tiene un ejemplo con voz femenina (normal y **lento**).
- **Hablar**: tocan el micrófono, dicen la frase y reciben una **calificación de 0 a 100**.
- **Palabra por palabra**: cada palabra sale en verde (bien), amarillo (casi) o rojo (mal / no se escuchó), con **consejos en español** para los sonidos difíciles (th, v, s inicial, h, r...).
- **Progreso**: se guarda cada intento, se ve cómo **sube la nota** en una gráfica, la mejor nota, estrellas y "¡Nuevo récord!". Una frase queda **dominada** con 85 o más.
- **Perfiles**: cada modelo pone su nombre, así varias pueden compartir el mismo computador del estudio.

Funciona en el celular y en el computador (Chrome, Edge o Safari). Es una app independiente:
no comparte código ni datos con ninguna otra aplicación.

## Publicarla y obtener el link (Vercel, gratis)

1. Entra a [vercel.com/new](https://vercel.com/new) con tu cuenta de GitHub.
2. Importa el repositorio `sexy-english-practice-`.
3. (Opcional, recomendado) En **Environment Variables** agrega `OPENAI_API_KEY` con tu clave de OpenAI.
4. Haz clic en **Deploy**. En un par de minutos tendrás un link como
   `https://sexy-english-practice.vercel.app` para compartir con las modelos.
   En **Settings → Domains** puedes ponerle tu propio dominio.

Si agregas o cambias variables de entorno después, vuelve a desplegar (**Deployments → Redeploy**).

## Dos modos de voz

| | Sin clave de OpenAI | Con `OPENAI_API_KEY` |
|---|---|---|
| Voz de ejemplo | Voz femenina en inglés del propio celular/computador (depende del dispositivo) | Voz femenina premium, cálida y coqueta (OpenAI `gpt-4o-mini-tts`, voz `marin`) |
| Calificación | Reconocimiento de voz del navegador (Chrome, Edge, Safari) | Transcripción con IA y confianza **por palabra**: detecta mejor el acento |
| Costo | Gratis | Centavos: cada frase se genera una sola vez y queda en caché; cada intento cuesta ~US$0,0005 |

La clave nunca llega al navegador. Para limitar el gasto, el servidor solo genera audio de las
frases del libro (nunca de texto libre) y rechaza grabaciones de más de ~2 MB.

Variables opcionales (ver `.env.example`):

- `OPENAI_TTS_VOICE`: otra voz de OpenAI (`shimmer`, `coral`, `nova`, `sage`...).
- `OPENAI_TTS_MODEL`, `OPENAI_TRANSCRIBE_MODEL`: otros modelos de OpenAI.

El estilo de la voz (sexy, cálida, pausada y muy clara) está en `VOICE_INSTRUCTIONS`, en `lib/config.ts`.

## Las frases del libro

La app trae las frases del libro **Sexy English – Inglés + poses que generan más dinero**
(edición 2026), con la pronunciación "a la española" y la traducción del libro, organizadas
como el libro: las 15 más rentables primero, las lecciones de la Parte 1, las 8 poses, los
combos, las frases universales y los ejercicios de pronunciación (drills).

Todas están en **`lib/phrases.ts`**. Cada frase es una línea así:

```ts
["Hey [name], welcome to my room!", "jéi [neim], uélcam tu mái rum", "¡Hola [nombre], bienvenido a mi sala!"],
//  inglés                             pronunciación                   traducción     (+ contexto opcional)
```

- El progreso se guarda por posición dentro de la lección (`saludos-1`, `saludos-2`...):
  agrega frases nuevas **al final** de su lección para no mezclar el progreso de las modelos.
- `[name]` se muestra tal cual; la voz de ejemplo dice un nombre de muestra y al calificar
  se acepta cualquier nombre (o ninguno).

Al subir el cambio a GitHub, Vercel publica la nueva versión sola.

## Cómo se calcula la nota

`lib/scoring.ts` compara lo que entendió el reconocedor con la frase, palabra por palabra:

- Palabra correcta = puntaje completo; palabra parecida ("rum" en vez de "room") = crédito parcial; palabra que falta = 0.
- Si el reconocedor dudó al entender una palabra, esa palabra baja (con IA se mide palabra por palabra).
- Contracciones y números cuentan igual ("I'm" = "I am", "50" = "fifty"); muletillas como "uh" no restan.
- La nota solo llega a 90+ ("¡Perfecta!") si todas las palabras salieron bien.

Los umbrales están al principio del archivo por si se quiere hacer más estricta o más suave.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # pruebas de la calificación y los consejos
npm run lint
npm run build
```

Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript. El progreso se guarda en el
navegador de cada dispositivo (`localStorage`); no se necesita base de datos.
