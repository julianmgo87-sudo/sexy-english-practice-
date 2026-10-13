import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sexy English · Práctica",
    short_name: "Sexy English",
    description: "Practica la pronunciación de las frases del libro Sexy English.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0811",
    theme_color: "#0e0811",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
