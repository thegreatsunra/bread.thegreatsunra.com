import { el } from "../helpers/dom.ts";
import type { Row } from "./table-content.ts";

export function drawTable(body: HTMLElement, rows: Row[]) {
  body.replaceChildren(...rows.map(tableRow));
}

function tableRow(row: Row) {
  const th = el("th");
  th.setAttribute("scope", "row");
  th.append(el("strong", row.name), el("br"), el("small", row.detail));
  const tr = el("tr");
  tr.append(th, el("td", row.start), el("td", row.window));
  return tr;
}
