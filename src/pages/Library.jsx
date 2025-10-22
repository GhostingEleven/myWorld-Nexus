// src/pages/Library.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { works } from "../data/works.js";
import { isUnlocked } from "../utils/unlock.js";

export default function Library() {
  const navigate = useNavigate();

  const ordered = [
    "angeldown",
    "dreamland",
    "sunshine-punk",
    "kryx",
    "sketchy-nfts"
  ];

  const sortedWorks = ordered
    .map(slug => works.find(w => w.slug === slug))
    .filter(Boolean);

  return (
    <section className="min-h-screen px-5 pt-24 pb-14">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-8">
        {sortedWorks.map((w) => {
          const isSunshine = w.slug === "sunshine-punk";

          return (
            <div
              key={w.slug}
              onClick={() => navigate(`/work/${w.slug}`)}   // ✅ ALWAYS go to WorkDetail
              className="cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition"
              style={{
                boxShadow:
                  "0 0 12px rgba(59,224,255,0.25), 0 0 28px rgba(138,124,255,0.18)",
              }}
            >
              <img src={w.image} alt={w.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold">{w.title}</h2>
                <p className="text-sm uppercase tracking-wide text-neon-blue mt-1">
                  {w.typeLabel}
                </p>
                <p className="text-neutral-300 text-sm mt-3">{w.blurb}</p>

                {isSunshine && (
                  <p
                    className="text-xs text-yellow-300 underline mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/work/${w.slug}?donate=1`);
                    }}
                  >
                    Tip / Support / Donate
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
