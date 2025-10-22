// src/utils/sunshineLoader.js

// Fetch text with no caching; return "" on error (don't crash the app)
async function fetchText(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return "";
  return await res.text();
}

// Split raw text into paragraphs: trims, normalizes newlines, preserves blank-line paragraph breaks.
function cleanToParagraphs(raw) {
  if (!raw) return [];
  let txt = raw.replace(/\r\n/g, "\n");
  // collapse 3+ blank lines to 2
  txt = txt.replace(/\n{3,}/g, "\n\n");
  // split on blank lines to get paragraphs
  const paras = txt
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paras;
}

// Group paragraphs into balanced pages (~4–5 paras per page), without splitting paragraphs.
// Uses a soft character budget to avoid micro- or mega-pages.
function groupBalanced(paragraphs, opts = {}) {
  const target = opts.target || 4;     // aim for 4
  const min = opts.min || 3;           // minimum 3 paras if possible
  const max = opts.max || 5;           // cap at 5 paras unless very short
  const charBudget = opts.charBudget || 1200; // soft budget per page

  const pages = [];
  let buf = [];
  let charCount = 0;

  const flush = () => {
    if (buf.length > 0) {
      pages.push(buf.join("\n\n"));
      buf = [];
      charCount = 0;
    }
  };

  for (const p of paragraphs) {
    const pLen = p.length;

    // If we already hit max paras or exceeded the char budget and have at least min,
    // push the page and start a new one.
    const willExceedCount = buf.length >= max;
    const willExceedChars = (charCount + pLen) > charBudget && buf.length >= min;

    if (willExceedCount || willExceedChars) {
      flush();
    }

    buf.push(p);
    charCount += pLen;

    // If we reached target count and we're comfortably near the budget, consider flushing early
    if (buf.length >= target && charCount >= charBudget * 0.8) {
      flush();
    }
  }

  // trailing buffer
  flush();

  // If we ended up with very tiny last page, merge it back into previous one
  if (pages.length >= 2) {
    const last = pages[pages.length - 1];
    if (last.length < 300) {
      const prev = pages[pages.length - 2];
      pages[pages.length - 2] = prev + "\n\n" + last;
      pages.pop();
    }
  }

  return pages;
}

/**
 * Loads Sunshine Punk — Act I as a paginated experience.
 * Fetches 6 parts, cleans to paragraphs, merges them, groups into balanced "pages".
 *
 * Expected files (case sensitive):
 *   /public/sunshine/act-1/part-1.txt
 *   ...
 *   /public/sunshine/act-1/part-6.txt
 */
export async function loadSunshineAct1() {
  const base = "/sunshine/act-1";

  const parts = await Promise.all(
    [1, 2, 3, 4, 5, 6].map((i) => fetchText(`${base}/part-${i}.txt`))
  );

  // Clean each part to paragraphs, flatten into one array
  const mergedParas = parts.flatMap(cleanToParagraphs);

  // Balanced pagination (longer pages)
  const pages = groupBalanced(mergedParas, {
    target: 5,       // aim for 5 paragraphs
    min: 4,          // at least 4
    max: 6,          // at most 6
    charBudget: 1800 // longer pages
  });

  const title = "SUNSHINE PUNK — ACT I";
  // Keep the same shape the app expects: "paragraphs" is actually our pages array.
  return { title, paragraphs: pages };
}
  
