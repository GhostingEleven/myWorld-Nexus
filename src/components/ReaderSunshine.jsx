// src/components/ReaderSunshine.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DonationModal from "./DonationModal.jsx";
import useSwipe from "../hooks/useSwipe.js";
import useEdgeTap from "../hooks/useEdgeTap.js";

export default function ReaderSunshine({
  title = "SUNSHINE PUNK — ACT I",
  paragraphs = [],
  page = 1,
}) {
  const navigate = useNavigate();

  // Convert URL page → index
  const initialIndex = Math.max(0, Number(page) - 1);
  const [index, setIndex] = useState(initialIndex);
  const [showDonate, setShowDonate] = useState(false);
  const lastIndex = Math.max(0, paragraphs.length - 1);

  const scrollRef = useRef(null);

  // URl → internal sync
  useEffect(() => {
    const newIndex = Math.max(0, Number(page) - 1);
    if (newIndex !== index) setIndex(newIndex);
  }, [page]);

  // Navigation with URL sync
  function goTo(i) {
    const safe = Math.max(0, Math.min(lastIndex, i));
    setIndex(safe);
    navigate(`/read/sunshine-punk/${safe + 1}`);
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // Apply scroll-to-top on correct container
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [index]);

  const containerRef = useRef(null);
  const swipeBind = useSwipe({ onLeft: next, onRight: prev });
  const tapBind   = useEdgeTap({ onLeft: prev, onRight: next, edgePercent: 0.18 });

  const text = paragraphs[index] || "";
  const parts = text.split(/\n\s*\n/);

  return (
    <section className="min-h-screen relative text-white">

      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 520px at 50% -8%, rgba(245, 200, 80, 0.08), transparent 60%)," +
            "linear-gradient(180deg, #0c0c10 0%, #0b0b0f 55%, #0a0a0e 100%)",
        }}
      />

      {/* ⭐ SCROLL REF GOES HERE */}
      <div
        ref={scrollRef}
        className="relative z-10 max-w-6xl mx-auto pt-20 px-4 pb-24 grid grid-cols-1 lg:grid-cols-5 gap-6"
        {...swipeBind}
        {...tapBind}
      >

        {/* Left panel */}
        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 text-center mt-4 select-none">
            <div className="text-[0.8rem] tracking-[0.25em] text-yellow-200/85">— ACT —</div>
            <h1 className="mt-1 text-xl md:text-2xl tracking-[0.18em] font-medium">SUNSHINE PUNK</h1>
            <h2 className="text-sm md:text-base tracking-[0.35em] text-neutral-300 font-light">ACT I</h2>

            <div
              className="mx-auto mt-3 h-px"
              style={{ width: "220px", background: "linear-gradient(90deg, transparent, rgba(245,200,80,.55), transparent)" }}
            />

            <button
              onClick={() => setShowDonate(true)}
              className="mt-5 w-full px-4 py-2.5 rounded-lg border border-yellow-300/70 
                         text-yellow-200 bg-black/40 backdrop-blur shadow-[0_0_18px_rgba(245,200,80,0.18)] 
                         hover:border-yellow-200 hover:text-yellow-100 transition"
            >
              Tip / Support / Donate
            </button>
          </div>
        </aside>

        {/* Right panel */}
        <main className="lg:col-span-3 select-none">

          {paragraphs.length === 0 ? (
            <div className="glass p-4 rounded-xl text-neutral-300">
              Unable to load Sunshine Punk Act I.
            </div>
          ) : (
            <article className="leading-relaxed text-[1.06rem] text-neutral-200">
              {parts.map((p, i) => (
                <p key={i} className="mb-4">{p}</p>
              ))}

              <footer className="mt-8 flex items-center justify-between text-sm text-neutral-300">
                <button onClick={prev} disabled={index === 0} className="hover:text-white disabled:opacity-30">◀ Previous</button>
                <div>{index + 1} / {lastIndex + 1}</div>
                <button onClick={next} disabled={index === lastIndex} className="hover:text-white disabled:opacity-30">Next ▶</button>
              </footer>

              <div className="text-center mt-6">
                <Link to="/library" className="text-sm text-neutral-400 hover:text-neutral-200 underline underline-offset-4">
                  Exit to Library
                </Link>
              </div>
            </article>
          )}
        </main>
      </div>

      <DonationModal open={showDonate} title="Support the Author — Sunshine Punk" onClose={() => setShowDonate(false)} />
    </section>
  );
}
