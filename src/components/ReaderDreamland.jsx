// src/components/ReaderDreamland.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getProgress, setProgress } from "../utils/progress.js";
import "../styles/dreamland.css";
import useSwipe from "../hooks/useSwipe.js";
import useEdgeTap from "../hooks/useEdgeTap.js";

export default function ReaderDreamland({ slug, title, chapters, titles, preview }) {
  const initialIndex = (() =>
    preview ? 0 : Math.min(getProgress(slug), Math.max(0, chapters.length - 1)))();
  const [index, setIndex] = useState(initialIndex);
  const [indexOpen, setIndexOpen] = useState(false);

  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  const pageTitle = titles?.[index] || title;
  const page = chapters?.[index] || "";

  // Split chapter into first paragraph + remaining
  const { firstPara, restParas } = useMemo(() => {
    const parts = page.split(/\n\s*\n/);
    return { firstPara: parts[0] || "", restParas: parts.slice(1) };
  }, [page]);

  // Progress + scroll reset
  useEffect(() => {
    if (!preview) setProgress(slug, index);
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [slug, index, preview]);

  function next() { if (index < chapters.length - 1) setIndex(index + 1); }
  function prev() { if (index > 0) setIndex(index - 1); }
  function jump(i) { setIndex(i); setIndexOpen(false); }

  // ✅ SWIPE + EDGE TAP (ONLY apply to reading section, not full screen)
  const swipeBind = useSwipe({ onLeft: next, onRight: prev });
  const tapBind = useEdgeTap({ onLeft: prev, onRight: next, edgePercent: 0.18 });

  // ✅ COPY / SELECT / TOUCH-CALLOUT DISABLE
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
    <>
      {/* Background Layer */}
      <div className="dl-scope" />

      {/* Foreground Content (gestures only apply INSIDE this reader section) */}
      <section
        className="relative z-10 w-full h-full text-white flex justify-center select-none"
        ref={containerRef}
        {...swipeBind}
        {...tapBind}
      >
        <div
          className="
            w-full
            md:max-w-3xl
            md:mt-6 md:mb-6
            md:rounded-[22px]
            md:border md:border-white/10
            md:overflow-hidden
            md:backdrop-blur-sm
          "
          style={{
            boxShadow: "0 24px 60px rgba(0,0,0,.45)",
            background: "linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.02))"
          }}
        >

          {/* Top bar */}
          <header className="flex items-center justify-between px-4 md:px-6 pt-4 md:pt-6">
            <button
              onClick={() => setIndexOpen(v => !v)}
              className="text-sm px-3 py-1.5 rounded-xl border border-white/20 text-neutral-200 hover:text-white hover:border-white/35"
            >
              INDEX
            </button>
            <h1
              className="text-neutral-300 text-sm tracking-wide"
              style={{ fontFamily: "Lora, Georgia, Cambria, 'Times New Roman', Times, serif" }}
            >
              {title}
            </h1>
            <Link to="/library" className="text-sm text-neutral-300 hover:text-white">
              Exit
            </Link>
          </header>

          {/* INDEX modal */}
          <div
            className={`
              absolute left-1/2 -translate-x-1/2 top-16
              w-[min(90vw,560px)]
              rounded-2xl border border-white/15 bg-black/80 backdrop-blur
              transition-all duration-200 origin-top z-30
              ${indexOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
            `}
            style={{ boxShadow: "0 0 24px rgba(255,255,255,.08)" }}
          >
            <div className="max-h-[55vh] overflow-auto p-3">
              {titles?.map((t, i) => (
                <button
                  key={t + i}
                  onClick={() => jump(i)}
                  className={`
                    w-full text-left px-4 py-2 rounded-lg text-[0.95rem]
                    ${i === index ? "bg-white/10 text-white" : "text-neutral-200 hover:bg-white/5 hover:text-white"}
                  `}
                  style={{ fontFamily: "Lora, Georgia, Cambria, 'Times New Roman', Times, serif" }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN READING BODY */}
          <div
            ref={scrollRef}
            className="
              reader-body
              px-4 md:px-6
              pt-4 pb-6
              md:max-h-[70vh]
              md:overflow-y-auto
            "
          >
            <h2
              className="mb-4 md:mb-5 text-center"
              style={{
                fontFamily: "'Playfair Display', 'Libre Baskerville', Georgia, 'Times New Roman', Times, serif",
                fontSize: "1.7rem",
                lineHeight: 1.3,
                color: "rgba(255,255,255,.94)",
                letterSpacing: ".3px",
                textShadow: "0 0 10px rgba(255,255,255,.05)"
              }}
            >
              {pageTitle}
            </h2>

            {firstPara && (
              <p
                className="dreamland-dropcap text-neutral-200"
                style={{
                  fontFamily: "Lora, Georgia, Cambria, 'Times New Roman', Times, serif",
                  fontSize: "1.06rem",
                  lineHeight: 1.85,
                  marginBottom: "1.05rem"
                }}
              >
                {firstPara}
              </p>
            )}

            {restParas.map((p, i) => (
              <p
                key={i}
                className="text-neutral-200"
                style={{
                  fontFamily: "Lora, Georgia, Cambria, 'Times New Roman', Times, serif",
                  fontSize: "1.06rem",
                  lineHeight: 1.85,
                  marginBottom: "1.05rem"
                }}
              >
                {p}
              </p>
            ))}

            {preview && (
              <p className="mt-4 text-xs text-neutral-400">
                Preview mode — full access coming soon.
              </p>
            )}
          </div>

          {/* FOOTER */}
          <footer className="reader-footer px-4 md:px-6 pb-6 pt-3 flex items-center justify-between text-sm text-neutral-300">
            <button onClick={prev} disabled={index === 0} className="hover:text-white disabled:opacity-30">
              ◀ Previous
            </button>
            <div>{index + 1} / {chapters.length}</div>
            <button onClick={next} disabled={index === chapters.length - 1} className="hover:text-white disabled:opacity-30">
              Next ▶
            </button>
          </footer>

        </div>
      </section>
    </>
  );
}
