import { el } from "../helpers/dom.ts";
import type { Bar, Tick, TimelineRow } from "./timeline-content.ts";

// With no rows, the timeline is cleared.
export function drawTimeline(
  container: HTMLElement,
  rows: TimelineRow[],
  ticks: Tick[],
) {
  if (rows.length === 0) {
    container.replaceChildren();
    return;
  }
  container.replaceChildren(...rows.map(timelineRow), timeAxis(ticks));
}

function timelineRow(row: TimelineRow) {
  const track = el("div", "", "track");
  track.append(bar("window", row.window), bar("target", row.target));
  const node = el("div");
  node.append(el("small", row.name), track);
  return node;
}

function timeAxis(ticks: Tick[]) {
  const axis = el("div", "", "axis");
  for (const tick of ticks) {
    const label = el("small", tick.label);
    label.style.left = `${tick.left}%`;
    axis.append(label);
  }
  return axis;
}

function bar(className: string, { left, width }: Bar) {
  const node = el("div", "", className);
  node.style.left = `${left}%`;
  node.style.width = `${width}%`;
  return node;
}
