import type { Recipe } from "../data/recipes.ts";
import { dayTime, range, time } from "../helpers/format.ts";
import type { StartWindow } from "../helpers/time.ts";

export type Row = {
  name: string;
  detail: string;
  start: string;
  window: string;
};

// One row per step, then the finish row. With no end time, times show as "–".
// Only the first start and the finish time show the day; the rest follow from them.
export function tableRows(
  recipe: Recipe,
  end: Date | null,
  windows: StartWindow[],
): Row[] {
  const rows = recipe.steps.map((step, i) => {
    const w = windows[i];
    const name = step.name;
    const detail = `${step.detail} ${step.then} ${range(step)}.`.trim();
    if (!w) return { name, detail, start: "–", window: "–" };
    return {
      name,
      detail,
      start: i === 0 ? dayTime(w.target) : time(w.target),
      window: `${time(w.earliest)} –\n${time(w.latest)}`,
    };
  });
  rows.push({
    name: recipe.finish.name,
    detail: recipe.finish.detail,
    start: end ? dayTime(end) : "–",
    window: "",
  });
  return rows;
}
