// src/pages/WorkDetail.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { works } from "../data/works.js";
import PurchaseModal from "../components/PurchaseModal.jsx";
import DonationModal from "../components/DonationModal.jsx";
import { isUnlocked } from "../utils/unlock.js";

export default function WorkDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const item = useMemo(() => works.find((w) => w.slug === slug), [slug]);

  const [purchased, setPurchased] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

  const isSketchy = slug === "sketchy-nfts";

  useEffect(() => {
    if (slug) setPurchased(isUnlocked(slug));
  }, [slug]);

  if (!item) {
    return (
      <section className="min-h-screen flex items-center justify-center p-6">
        <div className="glass p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-2">Not found</h2>
          <p className="text-neutral-300">This work doesn’t exist (yet).</p>
          <Link to="/library" className="inline-block mt-4 text-neon-blue neon-link">
            Back to Library
          </Link>
        </div>
      </section>
    );
  }

  const effectiveCTA = isSketchy
    ? "View Collection"
    : item.behavior === "purchase" && purchased
    ? "Open"
    : item.cta;

  function handlePrimary() {
    // ✅ Sketchy should route to internal gallery, NOT external marketplace
    if (isSketchy) {
      navigate(`/read/${item.slug}`);
      return;
    }

    switch (item.behavior) {
      case "included":
      case "free":
        navigate(`/read/${item.slug}`);
        break;

      case "purchase":
        if (purchased) navigate(`/read/${item.slug}`);
        else setShowPurchase(true);
        break;

      case "donation":
        navigate(`/read/${item.slug}?preview=1`);
        break;

      default:
        alert("Action not implemented yet.");
    }
  }

  return (
    <section className="min-h-screen px-5 pt-24 pb-14">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div
          className="overflow-hidden rounded-2xl"
          style={{ boxShadow: "0 0 12px rgba(59,224,255,0.25), 0 0 28px rgba(138,124,255,0.18)" }}
        >
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>

        <div className="glass p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold">{item.title}</h1>
          <p className="mt-2 text-sm uppercase tracking-wide text-neon-blue">
            {item.typeLabel}
          </p>

          <p className="mt-4 text-neutral-200">{item.blurb}</p>

          <div className="mt-6 flex gap-3 flex-wrap items-center">
            {/* ✅ Primary CTA (now internal for Sketchy) */}
            <button
              onClick={handlePrimary}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 border border-neon-blue text-neon-blue neon-link"
            >
              {effectiveCTA}
            </button>

            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-neutral-200 hover:text-white hover:border-white/30"
            >
              Back
            </Link>

            {item.behavior === "purchase" && !purchased && (
              <span className="text-sm text-neutral-400">
                US${item.priceUSD?.toFixed?.(2) ?? "7.99"}
              </span>
            )}
          </div>

          {/* ✅ Sunshine donation CTA stays untouched (only shows for that work) */}
          {item.slug === "sunshine-punk" && (
            <button
              onClick={() => setShowDonate(true)}
              className="mt-4 text-sm text-yellow-300 underline hover:text-yellow-200"
            >
              Tip / Support / Donate
            </button>
          )}
        </div>
      </div>

      {/* ✅ Modals */}
      <PurchaseModal
        open={showPurchase}
        title={item.title}
        priceUSD={item.priceUSD}
        slug={item.slug}
        onClose={() => setShowPurchase(false)}
      />

      <DonationModal
        open={showDonate}
        title={item.title}
        onClose={() => setShowDonate(false)}
      />
    </section>
  );
}
