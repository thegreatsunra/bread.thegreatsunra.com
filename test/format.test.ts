import { test } from "node:test";
import assert from "node:assert/strict";
import { duration, range } from "../src/format.ts";
import type { Step } from "../src/schedule.ts";

const step = (min: number, max: number): Step => ({
  name: "",
  detail: "",
  then: "",
  min,
  target: min,
  max,
});

test("duration shows hours and minutes, dropping a zero part", () => {
  assert.equal(duration(45), "45 min");
  assert.equal(duration(60), "1 h");
  assert.equal(duration(150), "2 h 30 min");
});

test("range collapses when min and max match", () => {
  assert.equal(range(step(30, 30)), "30 min");
  assert.equal(range(step(45, 60)), "45 min – 1 h");
});
