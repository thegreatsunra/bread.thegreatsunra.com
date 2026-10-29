// Remembers the out-of-the-oven time between visits.
// Storage can be blocked, e.g. in private browsing; the page works without it.

const STORAGE_KEY = "bread-scheduler:v1";

export function savedEnd() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // A saved bake that's already over is stale.
    if (saved && new Date(saved) > new Date()) return saved;
  } catch {}
  return null;
}

export function saveEnd(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}
