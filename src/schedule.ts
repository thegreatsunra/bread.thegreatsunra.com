// Durations in minutes
export type Step = {
  name: string;
  detail: string;
  then: string;
  min: number;
  target: number;
  max: number;
};
export type Window = { earliest: Date; target: Date; latest: Date };

// Work backwards from when the bread comes out of the oven: when each step can start, in recipe order.
// Latest assumes every later step runs its minimum; earliest, its maximum.
export function startWindows(end: Date, steps: Step[]): Window[] {
  const before = (minutes: number) =>
    new Date(end.getTime() - minutes * 60_000);
  const windows: Window[] = [];
  let min = 0;
  let target = 0;
  let max = 0;
  for (let i = steps.length - 1; i >= 0; i--) {
    min += steps[i].min;
    target += steps[i].target;
    max += steps[i].max;
    windows[i] = {
      earliest: before(max),
      target: before(target),
      latest: before(min),
    };
  }
  return windows;
}
