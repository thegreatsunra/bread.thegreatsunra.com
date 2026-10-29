import type { Step } from "../data/recipes.ts";

export type StartWindow = { earliest: Date; target: Date; latest: Date };

// Work backwards from when the bread comes out of the oven: when each step can start, in recipe order.
// Latest assumes every later step runs its minimum; earliest, its maximum.
export function startWindows(end: Date, steps: Step[]): StartWindow[] {
  const windows: StartWindow[] = [];
  let min = 0;
  let target = 0;
  let max = 0;
  for (let i = steps.length - 1; i >= 0; i--) {
    min += steps[i].min;
    target += steps[i].target;
    max += steps[i].max;
    windows[i] = {
      earliest: minutesBefore(end, max),
      target: minutesBefore(end, target),
      latest: minutesBefore(end, min),
    };
  }
  return windows;
}

// The default out-of-the-oven time: tomorrow at 3 PM.
export function tomorrowAfternoon(now: Date) {
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  d.setHours(15, 0, 0, 0);
  return d;
}

function minutesBefore(end: Date, minutes: number) {
  return new Date(end.getTime() - minutes * 60_000);
}
