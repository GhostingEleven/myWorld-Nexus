// src/components/TosModal.jsx
import React, { useEffect } from "react";

export default function TosModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-[92%] max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-white">
          myWorld Nexus — Terms of Service
        </h2>

        <p className="text-neutral-300 text-sm leading-relaxed mb-4">
          By using this application, you agree not to redistribute or copy
          protected content. All material is for personal use only. We may
          update these terms over time, and continued use means you accept any
          changes. If you have questions, you can contact us at any time.
        </p>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
