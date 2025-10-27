// src/utils/unlock.js

// Local storage key
const KEY = "unlocks_v1";

// Map of which SKU unlocks which content
// You can expand this later if you add more paid content
export const SKU_TO_SLUG = {
  unlock_dreamland: "dreamland",
};

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

// Called by billing during restore
export function unlockBySku(sku) {
  const slug = SKU_TO_SLUG[sku];
  if (slug) {
    unlock(slug);
  }
}
