import { test } from "node:test";
import assert from "node:assert/strict";
import { step } from "./fixtures.ts";
import {
  startWindows,
  tomorrowAfternoon,
} from "../src/scripts/helpers/time.ts";

const iso = (d: Date) => d.toISOString().slice(11, 16);

test("startWindows works backwards from the end time", () => {
  const end = new Date("2026-10-28T18:00:00Z");
  const windows = startWindows(end, [step(60, 90, 120), step(30, 30, 30)]);
  assert.deepEqual(
    windows.map((w) => [iso(w.earliest), iso(w.target), iso(w.latest)]),
    [
      ["15:30", "16:00", "16:30"],
      ["17:30", "17:30", "17:30"],
    ],
  );
});

test("startWindows with no steps is empty", () => {
  assert.deepEqual(startWindows(new Date(), []), []);
});

test("tomorrowAfternoon is 3 PM the next day, across a month end", () => {
  const d = tomorrowAfternoon(new Date(2026, 9, 31, 22, 45));
  assert.deepEqual(
    [d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()],
    [10, 1, 15, 0],
  );
});
