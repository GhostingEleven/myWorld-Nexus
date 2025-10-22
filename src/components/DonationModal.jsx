// src/components/DonationModal.jsx
import React, { useState } from "react";

export default function DonationModal({ open, slug, title, onClose }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("5");

  if (!open) return null;

  function handleDonate() {
    setLoading(true);
    alert(`Thanks for supporting with $${amount}! (Stripe donation coming soon)`);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 glass max-w-md w-full p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-neutral-300 mb-4">
          Choose an amount to support the author.
        </p>

        <input
          type="number"
          min="1"
          className="w-full p-2 rounded bg-black/50 border border-white/20 mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/20"
          >
            Cancel
          </button>
          <button
            onClick={handleDonate}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-yellow-400 text-yellow-200 hover:text-yellow-100 hover:border-yellow-300 transition"
          >
            {loading ? "Processing…" : "Donate"}
          </button>
        </div>
      </div>
    </div>
  );
}
