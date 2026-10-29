import { test } from "node:test";
import assert from "node:assert/strict";
import { step } from "./fixtures.ts";
import {
  datetimeLocal,
  dayTime,
  duration,
  range,
  time,
} from "../src/scripts/helpers/format.ts";

test("duration shows hours and minutes, dropping a zero part", () => {
  assert.equal(duration(45), "45 min");
  assert.equal(duration(60), "1 h");
  assert.equal(duration(150), "2 h 30 min");
});

test("range collapses when min and max match", () => {
  assert.equal(range(step(30, 30, 30)), "30 min");
  assert.equal(range(step(45, 45, 60)), "45 min – 1 h");
});

test("datetimeLocal gives local time, zero-padded", () => {
  assert.equal(datetimeLocal(new Date(2026, 0, 5, 9, 7)), "2026-01-05T09:07");
});

test("dayTime adds the day to time", () => {
  const d = new Date(2026, 9, 28, 15, 0);
  assert.notEqual(dayTime(d), time(d));
});
