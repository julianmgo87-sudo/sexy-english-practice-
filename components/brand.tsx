/** Logo como en la portada del libro: "Sexy" dorado y "ENGLISH" en mayúsculas espaciadas. */
export function Brand({ className = "", stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <span className={`inline-flex leading-none ${stacked ? "flex-col items-center gap-2" : "items-baseline gap-2"} ${className}`}>
      <span className="text-gold-gradient pr-1 font-display font-bold italic">Sexy</span>
      <span className={`font-sans font-semibold uppercase text-ink ${stacked ? "text-[0.36em] tracking-[0.45em]" : "text-[0.42em] tracking-[0.3em]"}`}>
        English
      </span>
    </span>
  );
}
