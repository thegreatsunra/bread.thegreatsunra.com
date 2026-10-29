import type { Step } from "./schedule.ts";

// e.g. "Wed 3:00 PM", in the viewer's locale
export function time(d: Date) {
  return d.toLocaleString([], {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
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
