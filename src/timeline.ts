import { el } from "./dom.ts";
import type { Step, Window } from "./schedule.ts";

// A bar chart of the steps: a light band for when each step could run, a solid bar for its target.
export function drawTimeline(
  container: HTMLElement,
  steps: Step[],
  when: Date,
  windows: Window[],
) {
  const start = windows[0].earliest;
  // A step runs until the next one starts; the last one, until the bread is out.
  const out = { earliest: when, target: when, latest: when };
  const rows = steps.map((step, i) => {
    const next = windows[i + 1] ?? out;
    const track = el("div", "", "track");
    track.append(
      bar("window", windows[i].earliest, next.latest, start, when),
      bar("target", windows[i].target, next.target, start, when),
    );
    const row = el("div");
    row.append(el("span", step.name, "label"), track);
    return row;
  });
  container.replaceChildren(...rows, timeAxis(start, when));
}

function timeAxis(start: Date, end: Date) {
  const axis = el("div", "", "axis");
  for (const tick of tickTimes(start, end)) {
    const label = el("span", tick.toLocaleTimeString([], { hour: "numeric" }));
    label.style.left = `${percent(tick, start, end)}%`;
    axis.append(label);
  }
  return axis;
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

// A bar from `from` to `to`, on a timeline that runs from start to end.
function bar(className: string, from: Date, to: Date, start: Date, end: Date) {
  const node = el("div", "", className);
  const left = percent(from, start, end);
  node.style.left = `${left}%`;
  node.style.width = `${percent(to, start, end) - left}%`;
  return node;
}

// How far t is along the timeline from start to end, from 0 to 100.
function percent(t: Date, start: Date, end: Date) {
  const span = end.getTime() - start.getTime();
  return ((t.getTime() - start.getTime()) / span) * 100;
}
