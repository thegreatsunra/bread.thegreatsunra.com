import { test } from "node:test";
import assert from "node:assert/strict";
import { tickTimes } from "../src/timeline.ts";

// Local times, on a day with no daylight saving change in the US or EU.
const at = (hour: number, minute = 0) => new Date(2026, 9, 28, hour, minute);

test("tickTimes labels every 3 hours from the first whole hour", () => {
  const ticks = tickTimes(at(0), at(12));
  assert.deepEqual(
    ticks.map((t) => t.getHours()),
    [1, 4, 7, 10],
  );
});

test("tickTimes skips ticks near either edge", () => {
  // 1:00 is 2.6% along and 19:00 is 97.4% along, so both are dropped.
  const ticks = tickTimes(at(0, 30), at(19, 30));
  assert.deepEqual(
    ticks.map((t) => t.getHours()),
    [4, 7, 10, 13, 16],
  );
});
