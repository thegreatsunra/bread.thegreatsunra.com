export type Step = { name: string; minutes: number };

// Work backwards from when the bread comes out of the oven: each step's start time, in recipe order.
export function startTimes(end: Date, steps: Step[]): Date[] {
  const starts: Date[] = [];
  let t = end.getTime();
  for (let i = steps.length - 1; i >= 0; i--) starts[i] = new Date(t -= steps[i].minutes * 60_000);
  return starts;
}
