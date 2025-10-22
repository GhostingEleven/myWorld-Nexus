// src/utils/unlock.js
const KEY = "unlocks_v1";

export function getUnlocks() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function isUnlocked(slug) {
  const map = getUnlocks();
  return !!map[slug];
}

export function unlock(slug) {
  const map = getUnlocks();
  map[slug] = true;
  localStorage.setItem(KEY, JSON.stringify(map));
}
    