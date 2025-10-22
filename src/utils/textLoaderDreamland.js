// src/utils/textLoaderDreamland.js
export async function loadDreamlandChapters() {
  const res = await fetch("/text/dreamland.txt");
  const raw = await res.text();

  const lines = raw.split(/\r?\n/);

  const titles = [];
  const chapters = [];

  let currentTitle = null;
  let currentLines = [];

  function flushChapter() {
    if (currentTitle && currentLines.length > 0) {
      chapters.push(currentLines.join("\n").trim());
      currentLines = [];
    }
  }

  function isTitleLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return false;

    // Must NOT end in punctuation
    if (/[.,;:!?]$/.test(trimmed)) return false;

    // Word count 1–12
    const words = trimmed.split(/\s+/);
    if (words.length < 1 || words.length > 12) return false;

    // First letter uppercase
    if (!/^[A-Z]/.test(trimmed)) return false;

    // Allow “Part I / Part II / Part III”
    const partPattern = /\bPart\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)\b/i;
    const allWordsCap = words.every(w => /^[A-Z][A-Za-z’']*$/.test(w) || partPattern.test(trimmed));

    return allWordsCap;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isTitleLine(line)) {
      flushChapter();
      currentTitle = line.trim();
      titles.push(currentTitle);
    } else {
      if (currentTitle) {
        currentLines.push(line);
      }
    }
  }

  flushChapter();

  return { titles, chapters };
}
