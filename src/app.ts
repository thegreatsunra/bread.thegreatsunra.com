import { startTimes, type Step } from "./schedule.ts";

// shortcut: placeholder steps until the real recipe is filled in
const STEPS: Step[] = [
  { name: "Mix", minutes: 60 },
  { name: "Bulk ferment", minutes: 5 * 60 },
  { name: "Proof", minutes: 12 * 60 },
  { name: "Bake", minutes: 50 },
];

// The markup is fixed, so every id app.ts asks for exists.
const end = document.getElementById("end") as HTMLInputElement;
const rows = document.getElementById("steps")!;

function update() {
  const when = end.value ? new Date(end.value) : null;
  const starts = when ? startTimes(when, STEPS) : [];
  rows.replaceChildren(...STEPS.map((step, i) => {
    const row = document.createElement("tr");
    const name = document.createElement("th");
    name.scope = "row";
    name.textContent = step.name;
    const start = document.createElement("td");
    start.textContent = starts[i]?.toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }) ?? "–";
    row.append(name, start);
    return row;
  }));
}

end.addEventListener("input", update);
update();
