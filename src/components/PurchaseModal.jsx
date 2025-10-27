// src/components/PurchaseModal.jsx
import React, { useState } from "react";
import Billing from "../utils/billing";

export default function PurchaseModal({ open, title, onClose }) {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  async function handlePurchase() {
    try {
      setLoading(true);
      await Billing.purchase("unlock_dreamland");
      onClose?.();
    } catch (err) {
      alert("Purchase failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 glass max-w-md w-full p-6 rounded-2xl">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-neutral-300">
          Purchase to unlock permanently on this device.
        </p>

        {/* Display price placeholder — will later auto-update with Billing.getPrice() */}
        <p className="mt-3 text-neon-blue font-semibold">$7.99</p>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/20"
          >
            Cancel
          </button>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-neon-blue text-neon-blue neon-link"
          >
            {loading ? "Processing…" : "Unlock Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
