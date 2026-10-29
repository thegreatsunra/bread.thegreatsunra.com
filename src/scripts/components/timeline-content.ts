import type { Step } from "../data/recipes.ts";
import { hour } from "../helpers/format.ts";
import type { StartWindow } from "../helpers/time.ts";

// Positions are percentages along the timeline, from the earliest start to out of the oven.
export type Bar = { left: number; width: number };
export type TimelineRow = { name: string; window: Bar; target: Bar };
export type Tick = { label: string; left: number };

// One row per step: a band for when the step could run, and a bar for its target.
export function timelineRows(
  steps: Step[],
  end: Date,
  windows: StartWindow[],
): TimelineRow[] {
  const start = windows[0].earliest;
  // A step runs until the next one starts; the last one, until the bread is out.
  const out = { earliest: end, target: end, latest: end };
  return steps.map((step, i) => {
    const next = windows[i + 1] ?? out;
    return {
      name: step.name,
      window: bar(windows[i].earliest, next.latest, start, end),
      target: bar(windows[i].target, next.target, start, end),
    };
  });
}

export function timelineTicks(end: Date, windows: StartWindow[]): Tick[] {
  const start = windows[0].earliest;
  return tickTimes(start, end).map((tick) => ({
    label: hour(tick),
    left: percent(tick, start, end),
  }));
}

// Every 3 hours from the first whole hour after start,
// skipping ticks near the edges so their labels don't overflow the page.
export function tickTimes(start: Date, end: Date) {
  const ticks: Date[] = [];
  const tick = new Date(start);
  tick.setHours(tick.getHours() + 1, 0, 0, 0);
  while (tick < end) {
    const left = percent(tick, start, end);
    if (left >= 5 && left <= 95) ticks.push(new Date(tick));
    tick.setHours(tick.getHours() + 3);
  }
  return ticks;
}

function bar(from: Date, to: Date, start: Date, end: Date): Bar {
  const left = percent(from, start, end);
  return { left, width: percent(to, start, end) - left };
}

// How far t is along the timeline from start to end, from 0 to 100.
function percent(t: Date, start: Date, end: Date) {
  const span = end.getTime() - start.getTime();
  return ((t.getTime() - start.getTime()) / span) * 100;
}
