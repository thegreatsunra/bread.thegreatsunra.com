import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { saveEnd, savedEnd } from "../src/storage.ts";

const FUTURE = "2999-01-01T15:00";
const PAST = "2000-01-01T15:00";

function fakeStorage(storage: Partial<Storage>) {
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
}

beforeEach(() => {
  const items = new Map<string, string>();
  fakeStorage({
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
  });
});

test("savedEnd returns a saved time that's still ahead", () => {
  saveEnd(FUTURE);
  assert.equal(savedEnd(), FUTURE);
});

test("savedEnd ignores a saved time that's already past", () => {
  saveEnd(PAST);
  assert.equal(savedEnd(), null);
});

test("savedEnd is null when nothing is saved", () => {
  assert.equal(savedEnd(), null);
});

test("blocked storage doesn't break saving or loading", () => {
  const blocked = () => {
    throw new Error("SecurityError");
  };
  fakeStorage({ getItem: blocked, setItem: blocked });
  assert.doesNotThrow(() => saveEnd(FUTURE));
  assert.equal(savedEnd(), null);
});
