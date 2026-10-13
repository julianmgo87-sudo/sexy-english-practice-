import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getPhrase } from "@/lib/phrases";
import { isLiveAIConfigured, TTS_VERSION } from "@/lib/config";
import { shortHash } from "@/lib/hash";
import { staticAudioUrl } from "@/lib/audio";
import { PracticeScreen } from "@/components/practice-screen";

export async function generateMetadata({ params }: PageProps<"/frase/[id]">): Promise<Metadata> {
  const phrase = getPhrase((await params).id);
  return { title: phrase ? `${phrase.en} · Sexy English` : "Sexy English" };
}

export default async function Page({ params }: PageProps<"/frase/[id]">) {
  // Se renderiza en cada visita para leer la configuración actual (p. ej. si se agregó
  // OPENAI_API_KEY después de publicar), no la del momento del build.
  await connection();
  const { id } = await params;
  const phrase = getPhrase(id);
  if (!phrase) notFound();

  const live = isLiveAIConfigured();
  // Primero el audio con voz natural pregenerado; si falta (frase nueva), la voz de OpenAI.
  // La versión en la URL cambia si cambia el texto o la voz, para no reproducir un audio viejo.
  const voiceSources = [
    staticAudioUrl(phrase),
    live ? `/api/tts?id=${encodeURIComponent(phrase.id)}&v=${shortHash(phrase.en)}-${TTS_VERSION}` : null,
  ].filter((src): src is string => src !== null);

  return (
    <PracticeScreen
      key={phrase.id}
      phraseId={phrase.id}
      live={live}
      voiceSources={voiceSources}
    />
  );
}
