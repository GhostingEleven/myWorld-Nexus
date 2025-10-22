// src/utils/progress.js
const KEY = "reading_progress_v1";

function loadMap() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}

export function getProgress(slug) {
  const map = loadMap();
  const n = map[slug];
  return Number.isInteger(n) && n >= 0 ? n : 0;
}

export function setProgress(slug, index) {
  const map = loadMap();
  map[slug] = index;
  localStorage.setItem(KEY, JSON.stringify(map));
}
