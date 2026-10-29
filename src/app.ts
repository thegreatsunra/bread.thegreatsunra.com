import { BIGA } from "./recipe.ts";
import { startWindows } from "./schedule.ts";
import { saveEnd, savedEnd } from "./storage.ts";
import { drawTable } from "./table.ts";
import { drawTimeline } from "./timeline.ts";

// The markup is fixed, so these elements always exist.
const endInput = document.getElementById("end") as HTMLInputElement;
const stepsBody = document.getElementById("steps")!;
const timeline = document.getElementById("timeline")!;

endInput.value = savedEnd() ?? tomorrowAfternoon();
endInput.addEventListener("input", update);
update();

function update() {
  const when = new Date(endInput.value);
  if (Number.isNaN(when.getTime())) {
    drawTable(stepsBody, BIGA, null, []);
    timeline.replaceChildren();
  } else {
    const windows = startWindows(when, BIGA);
    drawTable(stepsBody, BIGA, when, windows);
    drawTimeline(timeline, BIGA, when, windows);
  }
  saveEnd(endInput.value);
}

// Tomorrow at 3 PM, in datetime-local's local-time format.
function tomorrowAfternoon() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(15, 0, 0, 0);
  // toISOString is in UTC, so shift by the timezone offset to get local time.
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}
