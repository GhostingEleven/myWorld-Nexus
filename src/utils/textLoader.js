// src/utils/textLoader.js
// Robust loader for Angeldown .txt
// It finds chapter headings like "Angeldown I", "Angeldown II", etc.
// Returns: { titles: string[], chapters: string[] }

const ROMAN = "[IVXLCDM]+"; // roman numerals
// matches a heading line containing "Angeldown" and a roman numeral somewhere on the line
const HEADING_RE = new RegExp(
  "^\\s*Angeldown[^\\S\\r\\n\\-:]*([^\\S\\r\\n\\-:]*)(" + ROMAN + ")[^\\S\\r\\n\\-:]*[\\-:,.!?\\s]*$",
  "gim"
);

export async function loadAngeldownChapters() {
  const res = await fetch("/text/angeldown.txt", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load angeldown.txt");
  const raw = await res.text();

  // normalize newlines
  const text = raw.replace(/\r\n/g, "\n");

  // find all heading matches with their index positions
  const matches = [];
  let m;
  while ((m = HEADING_RE.exec(text)) !== null) {
    matches.push({
      matchText: m[0],
      numeral: (m[2] || "").toUpperCase(),
      index: m.index,
      length: m[0].length
    });
  }

  // Fallback strategy: if no matches were found, try a looser search
  if (matches.length === 0) {
    // look for lines that equal "Angeldown" and then a following line that contains a roman numeral
    const lines = text.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      if (/^\s*Angeldown\s*$/i.test(lines[i])) {
        const next = lines[i + 1];
        const mm = next.match(/^\s*Angeldown\s+([IVXLCDM]+)\s*$/i) || next.match(/^\s*([IVXLCDM]+)\s*$/i);
        if (mm) {
          // compute approximate index in raw text for the next line
          const prefix = lines.slice(0, i + 1).join("\n") + "\n";
          const idx = prefix.length + (mm.input ? 0 : 0);
          matches.push({
            matchText: lines[i + 1],
            numeral: (mm[1] || "").toUpperCase(),
            index: idx,
            length: lines[i + 1].length
          });
        }
      }
    }
  }

  if (matches.length === 0) {
    // Give helpful debug text so you can see the first part of file if needed.
    const preview = text.slice(0, 200).replace(/\n/g, "\\n");
    throw new Error(
      `No chapters found. Ensure headings like 'Angeldown I' exist. File preview: "${preview}"`
    );
  }

  // Build chapters by slicing text between heading indices
  const titles = [];
  const chapters = [];

  for (let i = 0; i < matches.length; i++) {
    const thisMatch = matches[i];
    const nextIndex = i + 1 < matches.length ? matches[i + 1].index : text.length;

    // Compute heading title string
    const numeral = thisMatch.numeral || `#${i + 1}`;
    const title = `ANGELDOWN ${numeral}`;
    titles.push(title);

    // Slice content from end of this heading line to start of next heading
    const contentStart = thisMatch.index + thisMatch.length;
    let chunk = text.slice(contentStart, nextIndex).trim();

    // If chunk starts with extra heading line (rare), remove it
    chunk = chunk.replace(/^\s*[\r\n]+/, "");

    chapters.push(chunk);
  }

  // Final sanity
  if (chapters.length === 0) {
    throw new Error("No chapters found after parsing.");
  }

  return { titles, chapters };
}
