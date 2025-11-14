// src/components/DonationModal.jsx
import React, { useState } from "react";
import Billing from "../utils/billing";

export default function DonationModal({ open, title, onClose }) {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  // 🔵 Updated SKUs — MUST match Play Console exactly
  const donationOptions = [
    { label: "$1.99", sku: "donation_199" },
    { label: "$4.99", sku: "donation_499" },
    { label: "$9.99", sku: "donation_999" },
  ];

  async function handleDonate(sku) {
    try {
      setLoading(true);
      await Billing.purchase(sku);
      alert("Thank you for your support!");
      onClose?.();
    } catch (err) {
      alert("Donation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 glass max-w-md w-full p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-neutral-300 mb-4">
          Choose an amount to support the author.
        </p>

        <div className="flex flex-col gap-3">
          {donationOptions.map((opt) => (
            <button
              key={opt.sku}
              disabled={loading}
              onClick={() => handleDonate(opt.sku)}
              className="w-full px-4 py-2 rounded-xl border border-yellow-400 text-yellow-200 hover:text-yellow-100 hover:border-yellow-300 transition text-center"
            >
              {loading ? "Processing…" : opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
