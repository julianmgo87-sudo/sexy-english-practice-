import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sexy English · Práctica",
  description: "Escucha cada frase del libro Sexy English, repítela y mira cómo sube tu calificación de pronunciación.",
  appleWebApp: { capable: true, title: "Sexy English", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0e0811",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
