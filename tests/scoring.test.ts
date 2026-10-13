import { test } from "node:test";
import assert from "node:assert/strict";
import { scorePronunciation, normalizeWord } from "../lib/scoring.ts";

const PHRASE = "Hi baby, welcome to my room!";

test("una pronunciación perfecta saca 100", () => {
  const r = scorePronunciation(PHRASE, { transcript: "hi baby welcome to my room" });
  assert.equal(r.score, 100);
  assert.ok(r.words.every((w) => w.status === "good"));
});

test("las contracciones y los números no penalizan", () => {
  assert.equal(scorePronunciation("I'm so happy to see you here.", { transcript: "I am so happy to see you here" }).score, 100);
  assert.equal(scorePronunciation("Only fifty tokens left for the goal.", { transcript: "only 50 tokens left for the goal" }).score, 100);
  assert.equal(scorePronunciation("Let's reach the goal together.", { transcript: "lets reach the goal together" }).score, 100);
  assert.deepEqual(normalizeWord("Don't"), ["do", "not"]);
});

test("las muletillas se ignoran", () => {
  assert.equal(scorePronunciation(PHRASE, { transcript: "uh hi baby welcome to my room" }).score, 100);
});

test("una palabra parecida da crédito parcial y se marca", () => {
  const r = scorePronunciation("You are so sweet.", { transcript: "you are so suite" });
  const sweet = r.words[3];
  assert.notEqual(sweet.status, "good");
  assert.equal(sweet.heard, "suite");
  assert.ok(r.score > 60 && r.score < 100, `score ${r.score}`);
});

test("las palabras faltantes bajan la nota", () => {
  const r = scorePronunciation(PHRASE, { transcript: "hi baby to my room" });
  assert.equal(r.words[2].status, "missing");
  assert.ok(r.score < 90);
});

test("el puntaje mejora a medida que la frase se dice mejor", () => {
  const attempts = ["hi", "hi baby come to room", "hi baby welcome to my rum", "hi baby welcome to my room"];
  const scores = attempts.map((t) => scorePronunciation(PHRASE, { transcript: t }).score);
  for (let i = 1; i < scores.length; i++) assert.ok(scores[i] > scores[i - 1], `scores ${scores}`);
});

test("la confianza baja del reconocedor reduce la nota", () => {
  const clear = scorePronunciation(PHRASE, { transcript: "hi baby welcome to my room", confidence: 0.95 }).score;
  const unsure = scorePronunciation(PHRASE, { transcript: "hi baby welcome to my room", confidence: 0.5 }).score;
  assert.ok(clear > unsure);
});

test("la confianza por palabra marca solo la palabra dudosa", () => {
  const words = ["hi", "baby", "welcome", "to", "my", "room"].map((word) => ({ word, confidence: word === "welcome" ? 0.2 : 0.97 }));
  const r = scorePronunciation(PHRASE, { transcript: "hi baby welcome to my room", words });
  assert.equal(r.words[2].status, "close");
  assert.equal(r.words[0].status, "good");
});

test("nada reconocido saca 0", () => {
  assert.equal(scorePronunciation(PHRASE, { transcript: "" }).score, 0);
});

test("una sola palabra mal dicha no puede ser «¡Perfecta!»", () => {
  const r = scorePronunciation(PHRASE, { transcript: "hi baby welcome to my rum" });
  assert.ok(r.score < 90 && r.score >= 65, `score ${r.score}`);
  const two = scorePronunciation(PHRASE, { transcript: "hi baby come to my rum" });
  assert.ok(two.score < r.score && two.score < 70, `score ${two.score}`);
});

test("si alguna palabra no salió bien, la nota no llega a «¡Perfecta!»", () => {
  const words = ["you", "look", "really", "sexy", "tonight"].map((word) => ({ word, confidence: word === "really" ? 0.35 : 0.97 }));
  const r = scorePronunciation("You look really sexy tonight.", { transcript: "you look really sexy tonight", words });
  assert.ok(r.score <= 89, `score ${r.score}`);
  assert.equal(scorePronunciation("You look really sexy tonight.", { transcript: "you look really sexy tonite" }).score, 100);
});
