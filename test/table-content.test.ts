import { test } from "node:test";
import assert from "node:assert/strict";
import { step } from "./fixtures.ts";
import { dayTime, time } from "../src/scripts/helpers/format.ts";
import { startWindows } from "../src/scripts/helpers/time.ts";
import { tableRows } from "../src/scripts/components/table-content.ts";

const steps = [step(60, 60, 60), step(30, 30, 30), step(30, 30, 30)];
const recipe = {
  name: "Test",
  steps,
  finish: { name: "Done", detail: "Eat it." },
};
const end = new Date(2026, 9, 28, 15, 0);

// Compare against the formatters rather than literal strings, since output depends on locale.
test("only the first start and the out-of-the-oven time show the day", () => {
  const windows = startWindows(end, steps);
  const rows = tableRows(recipe, end, windows);
  assert.deepEqual(
    rows.map((r) => r.start),
    [
      dayTime(windows[0].target),
      time(windows[1].target),
      time(windows[2].target),
      dayTime(end),
    ],
  );
});

test("windows never show the day", () => {
  const windows = startWindows(end, steps);
  const rows = tableRows(recipe, end, windows);
  assert.deepEqual(
    rows.map((r) => r.window),
    [...windows.map((w) => `${time(w.earliest)} –\n${time(w.latest)}`), ""],
  );
});

test("with no end time, every time is a dash", () => {
  const rows = tableRows(recipe, null, []);
  assert.deepEqual(
    rows.map((r) => [r.start, r.window]),
    [
      ["–", "–"],
      ["–", "–"],
      ["–", "–"],
      ["–", ""],
    ],
  );
});

test("the last row is the recipe's finish", () => {
  const rows = tableRows(recipe, end, startWindows(end, steps));
  const last = rows[rows.length - 1];
  assert.deepEqual([last.name, last.detail], ["Done", "Eat it."]);
});
