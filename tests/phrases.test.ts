import { test } from "node:test";
import assert from "node:assert/strict";
import { LESSONS, PHRASES, spokenText } from "../lib/phrases.ts";
import { scorePronunciation } from "../lib/scoring.ts";

test("las frases del libro tienen ids únicos y todos los campos", () => {
  const ids = new Set(PHRASES.map((p) => p.id));
  assert.equal(ids.size, PHRASES.length);
  assert.equal(new Set(LESSONS.map((l) => l.id)).size, LESSONS.length);
  for (const p of PHRASES) {
    assert.ok(p.en.trim() && p.es.trim() && p.sounds.trim(), p.id);
  }
});

test("cada frase del libro dicha tal cual saca 100", () => {
  for (const p of PHRASES) {
    const r = scorePronunciation(p.en, { transcript: spokenText(p.en) });
    assert.equal(r.score, 100, `${p.id}: ${p.en} -> ${r.score}`);
  }
});
