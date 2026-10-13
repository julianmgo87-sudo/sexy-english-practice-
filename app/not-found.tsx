import Link from "next/link";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <Brand className="text-4xl" />
      <p className="text-mute">Esta frase no existe (o cambió de lugar).</p>
      <Link href="/" className="rounded-full bg-gradient-to-r from-rose to-orchid px-5 py-2.5 font-semibold text-white">
        Ver las lecciones
      </Link>
    </main>
  );
}
