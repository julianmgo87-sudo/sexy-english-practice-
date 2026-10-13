"""Genera los audios de ejemplo (voz femenina natural) de todas las frases del libro.

Usa Kokoro (https://github.com/thewh1teagle/kokoro-onnx), un modelo de voz neuronal de
código abierto (Apache 2.0) que corre en el computador, sin claves ni costos. Los audios
quedan en public/audio/<id>.mp3 y en lib/audio-manifest.json; la app los usa solos.

Solo regenera las frases nuevas o cambiadas (o todas si cambias la voz o la velocidad).

Uso (ver README):
    python3 -m venv .venv-audio
    .venv-audio/bin/pip install kokoro-onnx soundfile
    # descargar kokoro-v1.0.onnx y voices-v1.0.bin en una carpeta, p. ej. ~/kokoro
    .venv-audio/bin/python scripts/generate-audio.py --models ~/kokoro
    .venv-audio/bin/python scripts/generate-audio.py --models ~/kokoro --voice af_nicole --speed 0.9

Requiere Node 22+ y ffmpeg.
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "public" / "audio"
MANIFEST = ROOT / "lib" / "audio-manifest.json"

# Voz por defecto: cálida y sensual. Otras voces femeninas de Kokoro: af_heart, af_nicole
# (susurrada), af_sky, af_sarah, af_nova. También se pueden mezclar: "af_bella:60,af_nicole:40".
DEFAULT_VOICE = "af_bella"
DEFAULT_SPEED = 0.9

# Ajustes por frase para palabras sueltas que con la voz por defecto no se entienden bien
# (lo comprobamos transcribiendo los audios con dos reconocedores de voz distintos).
# "text" cambia solo lo que se le pasa a la voz (p. ej. la entonación con "!"), no la frase;
# con "phonemes" el texto va en símbolos fonéticos (IPA).
OVERRIDES = {
    "vocab-cuerpo-2": {"voice": "af_sky"},  # neck
    "vocab-cuerpo-4": {"text": "tʃʰˈɛst.", "phonemes": True},  # chest: la "ch" se perdía
    "vocab-cuerpo-10": {"voice": "af_heart"},  # ass
    "vocab-sensaciones-4": {"voice": "af_nicole"},  # horny
    "vocab-acciones-8": {"voice": "af_nicole", "text": "Shake!"},  # shake
    "drill-sonidos-8": {"speed": 0.85},  # beach: a 0.9 se oía "beat"
}

def gentle_trim(samples, sample_rate, threshold=0.004, pad_seconds=0.15):
    """Quita el silencio de los extremos sin comerse sonidos suaves del inicio ("ch", "h", "s").

    El recorte de Kokoro es más agresivo y en palabras sueltas como "chest" o "neck" se
    llevaba la primera consonante.
    """
    import numpy as np

    loud = np.where(np.abs(samples) > threshold)[0]
    if len(loud) == 0:
        return samples
    pad = int(pad_seconds * sample_rate)
    return samples[max(0, loud[0] - pad) : min(len(samples), loud[-1] + pad)]


def load_phrases():
    out = subprocess.run(
        ["node", "--experimental-strip-types", "--no-warnings", str(ROOT / "scripts" / "list-phrases.ts")],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(out.stdout)


def resolve_voice(kokoro, spec):
    """Una voz ("af_bella") o una mezcla con pesos ("af_bella:60,af_nicole:40")."""
    if "," not in spec and ":" not in spec:
        return spec
    parts = []
    for item in spec.split(","):
        name, _, weight = item.partition(":")
        parts.append((kokoro.get_voice_style(name.strip()), float(weight or 1)))
    total = sum(w for _, w in parts)
    return sum(style * (w / total) for style, w in parts)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--models", required=True, help="carpeta con kokoro-v1.0.onnx y voices-v1.0.bin")
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--speed", type=float, default=DEFAULT_SPEED)
    parser.add_argument("--all", action="store_true", help="regenerar todos los audios")
    args = parser.parse_args()

    import soundfile as sf
    from kokoro_onnx import Kokoro

    kokoro = Kokoro(os.path.join(args.models, "kokoro-v1.0.onnx"), os.path.join(args.models, "voices-v1.0.bin"))
    voice = resolve_voice(kokoro, args.voice)

    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {"phrases": {}}
    same_voice = manifest.get("voice") == args.voice and manifest.get("speed") == args.speed
    old_entries = manifest.get("phrases", {}) if same_voice and not args.all else {}

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    phrases = load_phrases()
    entries = {}
    generated = 0

    with tempfile.TemporaryDirectory() as tmp:
        for i, p in enumerate(phrases, 1):
            mp3 = AUDIO_DIR / f"{p['id']}.mp3"
            old = old_entries.get(p["id"])
            if old and old.get("text") == p["textHash"] and old.get("override") == OVERRIDES.get(p["id"]) and mp3.exists():
                entries[p["id"]] = old
                continue

            override = OVERRIDES.get(p["id"], {})
            samples, sample_rate = kokoro.create(
                override.get("text", p["text"]),
                voice=resolve_voice(kokoro, override["voice"]) if "voice" in override else voice,
                speed=override.get("speed", args.speed),
                lang="en-us",
                is_phonemes=override.get("phonemes", False),
                trim=False,
            )
            samples = gentle_trim(samples, sample_rate)
            wav = os.path.join(tmp, "frase.wav")
            sf.write(wav, samples, sample_rate)
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "64k", str(mp3)],
                check=True,
            )
            version = hashlib.sha1(f"{p['textHash']}|{args.voice}|{args.speed}|{json.dumps(override, sort_keys=True)}".encode()).hexdigest()[:8]
            entries[p["id"]] = {"text": p["textHash"], "v": version}
            if override:
                entries[p["id"]]["override"] = override
            generated += 1
            print(f"[{i}/{len(phrases)}] {p['id']}: {p['text']}", flush=True)

    # Borra audios de frases que ya no existen.
    for f in AUDIO_DIR.glob("*.mp3"):
        if f.stem not in entries:
            f.unlink()

    MANIFEST.write_text(json.dumps({"voice": args.voice, "speed": args.speed, "phrases": entries}, indent=1) + "\n")
    print(f"Listo: {generated} audios generados, {len(entries) - generated} sin cambios.", file=sys.stderr)


if __name__ == "__main__":
    main()
