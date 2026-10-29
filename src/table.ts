import { el } from "./dom.ts";
import { range, time } from "./format.ts";
import type { Step, Window } from "./schedule.ts";

// One row per step, then the out-of-the-oven row. With no end time, times show as "–".
export function drawTable(
  body: HTMLElement,
  steps: Step[],
  when: Date | null,
  windows: Window[],
) {
  const rows = steps.map((step, i) => {
    const w = windows[i];
    return tableRow(
      step.name,
      `${step.detail} ${step.then} ${range(step)}.`.trim(),
      w ? time(w.target) : "–",
      w ? `${time(w.earliest)} –\n${time(w.latest)}` : "–",
    );
  });
  const out = tableRow(
    "Out of the oven",
    "Cool on racks.",
    when ? time(when) : "–",
    "",
  );
  body.replaceChildren(...rows, out);
}

function tableRow(name: string, detail: string, start: string, window: string) {
  const th = el("th");
  th.setAttribute("scope", "row");
  th.append(el("strong", name), el("br"), el("small", detail));
  const tr = el("tr");
  tr.append(th, el("td", start), el("td", window));
  return tr;
}
