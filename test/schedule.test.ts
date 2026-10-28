import { test } from "node:test";
import assert from "node:assert/strict";
import { startTimes } from "../src/schedule.ts";

test("startTimes works backwards from the end time", () => {
  const end = new Date("2026-10-28T18:00:00Z");
  const starts = startTimes(end, [{ name: "Mix", minutes: 60 }, { name: "Bake", minutes: 50 }]);
  assert.deepEqual(starts.map((d) => d.toISOString()), ["2026-10-28T16:10:00.000Z", "2026-10-28T17:10:00.000Z"]);
});

test("startTimes with no steps is empty", () => {
  assert.deepEqual(startTimes(new Date(), []), []);
});
