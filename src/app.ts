import { startWindows, type Step, type Window } from "./schedule.ts";

const BIGA: Step[] = [
  { name: "Mix the biga", detail: "800 g flour, 544 g water at 80°F, 3/16 tsp yeast.", then: "Ferments", min: 12 * 60, target: 14 * 60, max: 14 * 60 },
  { name: "Mix the final dough", detail: "200 g flour, 206 g water at 105°F, 22 g salt, 2 g yeast.", then: "Bulk ferments", min: 150, target: 210, max: 210 },
  { name: "Form the loaves", detail: "", then: "Proofs", min: 45, target: 45, max: 60 },
  { name: "Into the oven", detail: "Covered, at 475°F.", then: "Bakes", min: 30, target: 30, max: 30 },
  { name: "Uncover", detail: "30 min is Ken Forkish done.", then: "Bakes", min: 10, target: 15, max: 15 },
];
const STORAGE_KEY = "bread-scheduler:v1";

// The markup is fixed, so every id app.ts asks for exists.
const $ = (id: string) => document.getElementById(id)!;
const end = $("end") as HTMLInputElement;

const time = (d: Date) => d.toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" });
const duration = (m: number) => [Math.floor(m / 60) && `${Math.floor(m / 60)} h`, m % 60 && `${m % 60} min`].filter(Boolean).join(" ");
const range = (s: Step) => s.min === s.max ? duration(s.min) : `${duration(s.min)} – ${duration(s.max)}`;

function el(tag: string, text = "", className = "") {
  const node = document.createElement(tag);
  node.textContent = text;
  node.className = className;
  return node;
}

function row(name: string, detail: string, start: string, window: string) {
  const th = el("th");
  th.setAttribute("scope", "row");
  th.append(el("strong", name), el("br"), el("small", detail));
  const tr = el("tr");
  tr.append(th, el("td", start), el("td", window));
  return tr;
}

function drawTable(when: Date | null, windows: Window[]) {
  $("steps").replaceChildren(
    ...BIGA.map((step, i) => {
      const w = windows[i];
      return row(step.name, `${step.detail} ${step.then} ${range(step)}.`.trim(), w ? time(w.target) : "–", w ? `${time(w.earliest)} –\n${time(w.latest)}` : "–");
    }),
    row("Out of the oven", "Cool on racks.", when ? time(when) : "–", ""),
  );
}

function drawTimeline(when: Date, windows: Window[]) {
  const start = windows[0].earliest.getTime();
  const span = when.getTime() - start;
  const at = (t: number) => (t - start) / span * 100;
  const place = (node: HTMLElement, from: Date, to: Date) => {
    node.style.left = `${at(from.getTime())}%`;
    node.style.width = `${at(to.getTime()) - at(from.getTime())}%`;
    return node;
  };
  const ends = [...windows.slice(1), { earliest: when, target: when, latest: when }];
  const rows = BIGA.map((step, i) => {
    const track = el("div", "", "track");
    track.append(place(el("div", "", "window"), windows[i].earliest, ends[i].latest), place(el("div", "", "target"), windows[i].target, ends[i].target));
    const r = el("div");
    r.append(el("span", step.name, "label"), track);
    return r;
  });
  const axis = el("div", "", "axis");
  const tick = new Date(start);
  tick.setMinutes(0, 0, 0);
  for (tick.setHours(tick.getHours() + 1); tick.getTime() < when.getTime(); tick.setHours(tick.getHours() + 3)) {
    // Skip ticks at the edges so their labels don't overflow the page.
    if (at(tick.getTime()) < 5 || at(tick.getTime()) > 95) continue;
    const label = el("span", tick.toLocaleTimeString([], { hour: "numeric" }));
    label.style.left = `${at(tick.getTime())}%`;
    axis.append(label);
  }
  $("timeline").replaceChildren(...rows, axis);
}

function update() {
  const when = new Date(end.value);
  const valid = !Number.isNaN(when.getTime());
  const windows = valid ? startWindows(when, BIGA) : [];
  drawTable(valid ? when : null, windows);
  if (valid) drawTimeline(when, windows);
  else $("timeline").replaceChildren();
  try { localStorage.setItem(STORAGE_KEY, end.value); } catch {} // storage can be blocked, e.g. in private browsing; the page works without it
}

// Default: tomorrow at 3 PM, in datetime-local's local-time format.
function tomorrowAfternoon() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(15, 0, 0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

let saved: string | null = null;
try { saved = localStorage.getItem(STORAGE_KEY); } catch {}
end.value = saved || tomorrowAfternoon();
end.addEventListener("input", update);
update();
