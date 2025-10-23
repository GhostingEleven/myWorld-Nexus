// src/components/ReaderSciFi.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getProgress, setProgress } from "../utils/progress.js";
import useSwipe from "../hooks/useSwipe.js";
import useEdgeTap from "../hooks/useEdgeTap.js";

export default function ReaderSciFi({ slug, title, chapters, titles, preview }) {
  const initialIndex = (() => {
    const saved = getProgress(slug);
    return preview ? 0 : Math.min(saved, Math.max(0, chapters.length - 1));
  })();

  const [index, setIndex] = useState(initialIndex);
  const [menuOpen, setMenuOpen] = useState(false);

  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  const lastIndex = (preview && chapters.length > 0) ? 0 : chapters.length - 1;
  const pageTitle = titles?.[index] || title;
  const page = chapters?.[index] || "";

  useEffect(() => {
    if (!preview) setProgress(slug, index);
  }, [slug, index, preview]);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [index]);

  function nextPage() { if (index < lastIndex) setIndex(index + 1); }
  function prevPage() { if (index > 0) setIndex(index - 1); }
  function jumpTo(i) { setIndex(i); setMenuOpen(false); }

  const swipeBind = useSwipe({ onLeft: nextPage, onRight: prevPage });
  const tapBind = useEdgeTap({ onLeft: prevPage, onRight: nextPage, edgePercent: 0.18 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e) => e.preventDefault();
    el.addEventListener("contextmenu", prevent);
    el.addEventListener("copy", prevent);
    el.style.userSelect = "none";
    el.style.webkitUserSelect = "none";
    el.style.webkitTouchCallout = "none";
    el.style.webkitUserDrag = "none";
    return () => {
      el.removeEventListener("contextmenu", prevent);
      el.removeEventListener("copy", prevent);
    };
  }, []);

  return (
    <section
      className="min-h-screen px-0 md:px-5 pt-24 pb-14 select-none"
      ref={containerRef}
      {...swipeBind}
      {...tapBind}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="
            relative rounded-2xl p-4 md:p-6
            bg-black/50 backdrop-blur-md border border-neon-blue/30
          "
          style={{
            boxShadow:
              "0 0 12px rgba(59,224,255,.35), inset 0 0 24px rgba(138,124,255,.12)"
          }}
        >
          {/* Header */}
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-base md:text-lg tracking-wide text-neon-blue uppercase">
              {title}
            </h1>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="text-xs md:text-sm px-3 py-1.5 rounded border border-neon-blue/50 text-neon-blue hover:border-neon-blue neon-link"
              >
                [ CHAPTERS ]
              </button>
              <Link to="/library" className="text-sm text-neutral-300 hover:text-white">
                Exit
              </Link>
            </div>

            <div
              ref={panelRef}
              className={`
                absolute right-4 top-12 w-56 rounded-xl overflow-hidden border border-neon-blue/30 bg-black/80
                transition-all duration-200 origin-top z-30
                ${menuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}
              `}
              style={{ boxShadow: "0 0 16px rgba(59,224,255,.25)" }}
            >
              <div className="max-h-[55vh] overflow-auto">
                {titles?.map((t, i) => (
                  <button
                    key={t + i}
                    onClick={() => jumpTo(i)}
                    className={`w-full text-left px-3 py-2 text-sm
                      ${i === index ? "bg-white/10 text-white" : "text-neutral-300 hover:bg-white/5 hover:text-white"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="relative overflow-hidden rounded-xl p-4 md:p-6 bg-black/40 border border-white/10">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent,transparent 3px,rgba(255,255,255,.07) 4px)"
              }}
            />

            <div
              ref={contentRef}
              className="relative z-10 px-1 md:px-0 md:max-h-[70vh] md:overflow-y-auto"
            >
              <div className="text-neutral-300/90 text-xs tracking-widest mb-1">
                {index + 1} / {lastIndex + 1}
              </div>

              <h2 className="text-2xl md:text-[28px] font-semibold text-white/90 mb-4 uppercase">
                {pageTitle}
              </h2>

              <article
                className="leading-7 md:leading-7 text-neutral-200 whitespace-pre-line"
                style={{ textAlign: "left" }}
              >
                {page}
              </article>

              {preview && (
                <p className="mt-4 text-xs text-neutral-400">
                  Preview mode — full access coming soon.
                </p>
              )}
            </div>
          </div>

          {/* Footer Nav */}
          <footer className="mt-6 flex items-center justify-between text-sm text-neutral-400">
            <button
              onClick={prevPage}
              disabled={index === 0}
              className="px-3 py-2 hover:text-white disabled:opacity-30"
            >
              ◀ Prev
            </button>
            <div className="px-2 py-1">{index + 1} / {lastIndex + 1}</div>
            <button
              onClick={nextPage}
              disabled={index === lastIndex}
              className="px-3 py-2 hover:text-white disabled:opacity-30"
            >
              Next ▶
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}
