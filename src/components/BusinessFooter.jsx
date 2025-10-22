// src/components/BusinessFooter.jsx
import React, { useState } from "react";
import TosModal from "./TosModal.jsx";

export default function BusinessFooter({
  version = "v0.3.0",
  contactHref = "mailto:aidandaley@example.com?subject=myWorld%20Nexus%20Support"
}) {
  const [showTos, setShowTos] = useState(false);

  return (
    <>
      <footer className="w-full py-4 mt-8 text-xs text-center text-neutral-400 select-none">
        <div className="space-x-4 mb-1">
          <button
            onClick={() => setShowTos(true)}
            className="hover:text-white transition"
          >
            Terms of Service
          </button>

          <a href={contactHref} className="hover:text-white transition">
            Contact
          </a>
        </div>

        {/* Version & Brand */}
        <div className="opacity-60 tracking-wide">
          myWorld Nexus {version}
        </div>
      </footer>

      {showTos && <TosModal onClose={() => setShowTos(false)} />}
    </>
  );
}
