import type { Step } from "../src/scripts/data/recipes.ts";

// A step with the given durations, in minutes. The tests don't read its text.
export function step(min: number, target: number, max: number): Step {
  return { name: "", detail: "", then: "", min, target, max };
}
