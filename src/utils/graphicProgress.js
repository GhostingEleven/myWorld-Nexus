// src/utils/graphicProgress.js

export function getGraphicProgress(slug) {
  try {
    const raw = localStorage.getItem(`kryx-progress-${slug}`);
    return raw ? JSON.parse(raw) : { chapter: 0, panel: 0 };
  } catch {
    return { chapter: 0, panel: 0 };
  }
}

export function setGraphicProgress(slug, data) {
  try {
    localStorage.setItem(`kryx-progress-${slug}`, JSON.stringify(data));
  } catch {
    // ignore write issues (e.g. private mode)
  }
}
  