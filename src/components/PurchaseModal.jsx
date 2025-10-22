// src/components/PurchaseModal.jsx
import React, { useState } from "react";

export default function PurchaseModal({ open, title, priceUSD, slug, onClose }) {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  async function handleCheckout() {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4242/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, priceUSD }),
      });

      const { url, error } = await res.json();
      if (error) throw new Error(error);

      // ✅ Stripe modern redirect
      window.location.href = url;

    } catch (err) {
      alert("Checkout failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 glass max-w-md w-full p-6 rounded-2xl">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-neutral-300">Purchase to unlock permanently on this device.</p>
        <p className="mt-3 text-neon-blue font-semibold">
          US${priceUSD?.toFixed?.(2) ?? "7.99"}
        </p>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/20">
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-neon-blue text-neon-blue neon-link"
          >
            {loading ? "Processing…" : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
  