import { test } from "node:test";
import assert from "node:assert/strict";
import { tipsForWords } from "../lib/tips.ts";

test("da consejos distintos para sonidos difíciles", () => {
  const tips = tipsForWords(["smile", "thinking", "voice", "happy"]);
  assert.equal(tips.length, 3);
  assert.match(tips[0].tip, /«es»/);
  assert.match(tips[1].tip, /th/);
  assert.match(tips[2].tip, /«v»/);
});

test("siempre da al menos un consejo si hubo errores", () => {
  assert.equal(tipsForWords(["a"]).length, 1);
  assert.equal(tipsForWords([]).length, 0);
});
