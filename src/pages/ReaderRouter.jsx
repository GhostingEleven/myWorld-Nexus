// src/pages/ReaderRouter.jsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { works } from "../data/works.js";
import { isUnlocked } from "../utils/unlock.js";
import { loadAngeldownChapters } from "../utils/textLoader.js";
import { loadDreamlandChapters } from "../utils/textLoaderDreamland.js";
import { loadKryxStructure } from "../utils/kryxLoader.js";
import { loadSunshineAct1 } from "../utils/sunshineLoader.js";

import ReaderSciFi from "../components/ReaderSciFi.jsx";
import ReaderDreamland from "../components/ReaderDreamland.jsx";
import KryxReader from "../components/KryxReader.jsx";
import ReaderSunshine from "../components/ReaderSunshine.jsx";
import SketchyGallery from "../components/SketchyGallery.jsx"; // ✅ NEW

export default function ReaderRouter() {
  const { slug } = useParams();
  const [search] = useSearchParams();
  const item = works.find((w) => w.slug === slug);

  const [titles, setTitles] = useState(null);
  const [chapters, setChapters] = useState(null);
  const [err, setErr] = useState(null);

  // ✅ New: If this work isn't a reader (Sketchy NFTs), handle it immediately
  if (slug === "sketchy-nfts") {
    return <SketchyGallery />;
  }

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        if (!item) return;

        if (slug === "angeldown") {
          const { titles, chapters } = await loadAngeldownChapters();
          if (!alive) return;
          setTitles(titles);
          setChapters(chapters);

        } else if (slug === "dreamland") {
          const { titles, chapters } = await loadDreamlandChapters();
          if (!alive) return;
          setTitles(titles);
          setChapters(chapters);

        } else if (slug === "kryx") {
          const { titles, chapters } = await loadKryxStructure();
          if (!alive) return;
          setTitles(titles);
          setChapters(chapters);

        } else if (slug === "sunshine-punk") {
          const { title, paragraphs } = await loadSunshineAct1();
          if (!alive) return;
          setTitles([title]);
          setChapters([paragraphs]);

        } else {
          throw new Error("Invalid reader slug.");
        }

      } catch (e) {
        if (!alive) return;
        setErr(e.message || String(e));
      }
    }

    run();
    return () => { alive = false; };
  }, [slug, item]);

  if (!item) return <Navigate to="/library" replace />;

  if (slug === "dreamland" && !isUnlocked("dreamland")) {
    return <Navigate to={`/work/${slug}`} replace />;
  }

  if (err) {
    return (
      <section className="min-h-screen flex items-center justify-center p-6">
        <div className="glass p-6 rounded-2xl max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load</h2>
          <p className="text-neutral-300">{err}</p>
        </div>
      </section>
    );
  }

  if (!chapters || !titles) {
    return (
      <section className="min-h-screen flex items-center justify-center p-6">
        <div className="glass p-6 rounded-2xl">Loading…</div>
      </section>
    );
  }

  const preview = search.get("preview") === "1";

  if (slug === "dreamland") {
    return (
      <ReaderDreamland
        slug={slug}
        title={item.title}
        chapters={chapters}
        titles={titles}
        preview={preview}
      />
    );
  }

  if (slug === "sunshine-punk") {
    return (
      <ReaderSunshine
        title={titles[0]}
        paragraphs={chapters[0] || []}
      />
    );
  }

  if (slug === "kryx") {
    return <KryxReader slug={slug} titles={titles} chapters={chapters} />;
  }

  return (
    <ReaderSciFi
      slug={slug}
      title={item.title}
      chapters={chapters}
      titles={titles}
      preview={preview}
    />
  );
}
