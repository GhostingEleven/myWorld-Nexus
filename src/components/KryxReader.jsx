// src/components/KryxReader.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSwipe from "../hooks/useSwipe";
import useEdgeTap from "../hooks/useEdgeTap";

export default function KryxReader({ slug = "kryx", chapters = [], titles = [], page = 1 }) {
  const navigate = useNavigate();

  const maxIndex = chapters.length * 2 - 1;

  const initial = Math.max(0, Number(page) - 1);
  const [index, setIndex] = useState(initial);

  useEffect(() => {
    const newIndex = Math.max(0, Number(page) - 1);
    if (newIndex !== index) setIndex(newIndex);
  }, [page]);

  function goTo(i) {
    const safe = Math.max(0, Math.min(maxIndex, i));
    setIndex(safe);
    navigate(`/read/${slug}/${safe + 1}`);
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  const swipeBind = useSwipe({ onLeft: next, onRight: prev });
  const tapBind   = useEdgeTap({ onLeft: prev, onRight: next });

  const scrollRef = useRef(null);

  // ⭐ Scroll fix — scroll the entire page container
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [index]);

  const isImg = index % 2 === 0;
  const cIndex = Math.floor(index / 2);
  const chapter = chapters[cIndex];

  return (
    <section
      ref={scrollRef}
      className="min-h-screen w-full text-white pt-20 px-4 pb-10 select-none"
      {...swipeBind}
      {...tapBind}
    >
      <div className="max-w-3xl mx-auto text-center">

        <header className="flex justify-between items-center mb-4">
          <span className="text-neutral-400 text-sm tracking-widest">K R Y X</span>
          <Link to="/library" className="text-sm text-neutral-300 hover:text-white">Exit</Link>
        </header>

        <div
          className="rounded-2xl overflow-hidden bg-black/60 border border-white/10 backdrop-blur-sm"
          style={{ boxShadow: "0 0 18px rgba(59,224,255,0.25)" }}
        >
          {isImg ? (
            <img src={chapter.image} alt={chapter.title} className="w-full h-[65vh] object-cover pointer-events-none" />
          ) : (
            <div className="p-6 text-left leading-relaxed whitespace-pre-line pointer-events-none">
              <h2 className="text-xl font-semibold text-center mb-4">{chapter.title}</h2>
              <p className="text-neutral-200">{chapter.text}</p>
            </div>
          )}
        </div>

        <footer className="mt-6 flex items-center justify-between text-sm text-neutral-300">
          <button onClick={prev} disabled={index === 0} className="hover:text-white disabled:opacity-30">◀ Prev</button>
          <div>{cIndex + 1} / {chapters.length}</div>
          <button onClick={next} disabled={index === maxIndex} className="hover:text-white disabled:opacity-30">Next ▶</button>
        </footer>

      </div>
    </section>
  );
}
