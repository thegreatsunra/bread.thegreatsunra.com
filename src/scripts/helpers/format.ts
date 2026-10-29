import type { Step } from "../data/recipes.ts";

// e.g. "3:00 PM", in the viewer's locale
export function time(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// e.g. "3 PM", in the viewer's locale
export function hour(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric" });
}

// e.g. "Wed 3:00 PM", in the viewer's locale
export function dayTime(d: Date) {
  return d.toLocaleString([], {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

// e.g. "2026-10-28T15:00", the local-time format a datetime-local input takes
export function datetimeLocal(d: Date) {
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return `${date}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function duration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export function range(step: Step) {
  if (step.min === step.max) return duration(step.min);
  return `${duration(step.min)} – ${duration(step.max)}`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}
