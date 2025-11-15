// src/components/KryxReader.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSwipe from "../hooks/useSwipe.js";
import useEdgeTap from "../hooks/useEdgeTap.js";

export default function KryxReader({
  slug = "kryx",
  chapters = [],
  titles = [],
  page = 1,                        // URL param (1-based)
}) {
  const navigate = useNavigate();

  const maxIndex = chapters.length * 2 - 1;

  // Convert URL → internal index
  const initialIndex = Math.max(0, Math.min(maxIndex, Number(page) - 1));

  const [index, setIndex] = useState(initialIndex);

  // Keep sync with URL
  useEffect(() => {
    const urlIndex = Math.max(0, Math.min(maxIndex, Number(page) - 1));
    if (urlIndex !== index) setIndex(urlIndex);
  }, [page]);

  const total = chapters.length;

  const isImagePage = index % 2 === 0;
  const chapterIndex = Math.floor(index / 2);
  const chapter = chapters[chapterIndex];

  // URL navigation
  function goTo(newIndex) {
    const safe = Math.max(0, Math.min(maxIndex, newIndex));
    setIndex(safe);
    navigate(`/read/${slug}/${safe + 1}`);
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // Gesture setup
  const swipeBind = useSwipe({ onLeft: next, onRight: prev });
  const tapBind = useEdgeTap({ onLeft: prev, onRight: next });

  // Scroll reset fix
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [index]);

  // Disable copying
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prevent = (e) => e.preventDefault();
    el.addEventListener("contextmenu", prevent);
    el.addEventListener("copy", prevent);

    el.style.userSelect = "none";
    el.style.webkitUserSelect = "none";
    el.style.webkitTouchCallout = "none";

    return () => {
      el.removeEventListener("contextmenu", prevent);
      el.removeEventListener("copy", prevent);
    };
  }, []);

  return (
    <section
      className="min-h-screen w-full text-white pt-20 px-4 pb-10"
      ref={containerRef}
      {...swipeBind}
      {...tapBind}
    >
      <div className="max-w-3xl mx-auto text-center select-none">

        <header className="flex justify-between items-center mb-4">
          <span className="text-neutral-400 text-sm tracking-widest">K R Y X</span>
          <Link to="/library" className="text-sm text-neutral-300 hover:text-white">Exit</Link>
        </header>

        <div
          className="rounded-2xl overflow-hidden bg-black/60 border border-white/10 backdrop-blur-sm"
          style={{ boxShadow: "0 0 18px rgba(59,224,255,0.25)" }}
        >
          {isImagePage ? (
            <img
              src={chapter.image}
              alt={chapter.title}
              className="w-full h-[65vh] object-cover pointer-events-none"
            />
          ) : (
            <div
              ref={scrollRef}
              className="p-6 text-left leading-relaxed whitespace-pre-line pointer-events-none overflow-y-auto"
            >
              <h2 className="text-xl font-semibold text-center mb-4">
                {chapter.title}
              </h2>
              <p className="text-neutral-200">{chapter.text}</p>
            </div>
          )}
        </div>

        <footer className="mt-6 flex items-center justify-between text-sm text-neutral-300">
          <button onClick={prev} disabled={index === 0} className="hover:text-white disabled:opacity-30">
            ◀ Prev
          </button>

          <div>
            {chapterIndex + 1} / {total}
            <span className="text-neutral-500 text-xs"> ({isImagePage ? "image" : "text"})</span>
          </div>

          <button onClick={next} disabled={index === maxIndex} className="hover:text-white disabled:opacity-30">
            Next ▶
          </button>
        </footer>
      </div>
    </section>
  );
}
