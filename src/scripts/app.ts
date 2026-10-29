import { BIGA } from "./data/recipes.ts";

import { datetimeLocal } from "./helpers/format.ts";
import { saveEnd, savedEnd } from "./helpers/storage.ts";
import { startWindows, tomorrowAfternoon } from "./helpers/time.ts";

import { drawTable } from "./components/table.ts";
import { tableRows } from "./components/table-content.ts";
import { drawTimeline } from "./components/timeline.ts";
import { timelineRows, timelineTicks } from "./components/timeline-content.ts";

// The markup is fixed, so these elements always exist.
const recipeName = document.getElementById("recipeName")!;
const endInput = document.getElementById("end") as HTMLInputElement;
const stepsBody = document.getElementById("steps")!;
const timeline = document.getElementById("timeline")!;

recipeName.textContent = BIGA.name;
endInput.value = savedEnd() ?? datetimeLocal(tomorrowAfternoon(new Date()));
endInput.addEventListener("input", update);
update();

function update() {
  const end = new Date(endInput.value);
  if (Number.isNaN(end.getTime())) {
    drawTable(stepsBody, tableRows(BIGA, null, []));
    drawTimeline(timeline, [], []);
  } else {
    const windows = startWindows(end, BIGA.steps);
    drawTable(stepsBody, tableRows(BIGA, end, windows));
    drawTimeline(
      timeline,
      timelineRows(BIGA.steps, end, windows),
      timelineTicks(end, windows),
    );
  }
  saveEnd(endInput.value);
}
