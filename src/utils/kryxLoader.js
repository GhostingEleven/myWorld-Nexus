// src/utils/kryxLoader.js
export async function loadKryxStructure() {
  const chapters = [];

  for (let i = 1; i <= 5; i++) {
    const roman = ["I", "II", "III", "IV", "V"][i - 1];

    // Fetch the text
    const txtRes = await fetch(`/kryx/chapter-${i}/Kryx${roman}.txt`);
    const text = txtRes.ok ? (await txtRes.text()).trim() : "(Missing text)";

    // Image path
    const img = `/kryx/chapter-${i}/Kryx${roman}.jpg`;

    chapters.push({
      title: `KRYX ${roman}`,
      image: img,
      text
    });
  }

  return {
    titles: chapters.map(c => c.title),
    chapters // array of { title, image, text }
  };
}
