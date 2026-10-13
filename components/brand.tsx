export function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display italic leading-none tracking-tight ${className}`}>
      <span className="text-gradient">Sexy</span> <span className="text-ink">English</span>
    </span>
  );
}
