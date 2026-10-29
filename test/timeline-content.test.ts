import { test } from "node:test";
import assert from "node:assert/strict";
import { step } from "./fixtures.ts";
import { startWindows } from "../src/scripts/helpers/time.ts";
import {
  tickTimes,
  timelineRows,
} from "../src/scripts/components/timeline-content.ts";

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

test("timelineRows places each step's window and target bars", () => {
  const steps = [step(60, 90, 120), step(30, 30, 30)];
  // The timeline runs 2.5 h, from the earliest start at 15:30 to out of the oven at 18:00.
  const end = at(18);
  const rows = timelineRows(steps, end, startWindows(end, steps));
  assert.deepEqual(
    rows.map((r) => [r.window, r.target]),
    [
      [
        { left: 0, width: 80 },
        { left: 20, width: 60 },
      ],
      [
        { left: 80, width: 20 },
        { left: 80, width: 20 },
      ],
    ],
  );
});
