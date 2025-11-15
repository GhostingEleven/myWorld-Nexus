// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Starfield from "./components/Starfield.jsx";
import NavBar from "./components/NavBar.jsx";
import Entry from "./pages/Entry.jsx";
import Library from "./pages/Library.jsx";
import WorkDetail from "./pages/WorkDetail.jsx";
import ReaderRouter from "./pages/ReaderRouter.jsx";

// Import Billing once
import Billing from "./utils/billing";

export default function App() {
  useEffect(() => {
    // Ensures Billing module stays bundled
    Billing.getSkuDetails?.();

    // Restore purchases silently on app launch
    Billing.restore().catch(() => {
      // Ignore errors outside Play environment
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <Starfield />
      <NavBar />

      <main className="relative z-10 pt-20">
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/library" element={<Library />} />
          <Route path="/work/:slug" element={<WorkDetail />} />

          {/* ⭐ NEW: support page numbers */}
          <Route path="/read/:slug/:page" element={<ReaderRouter />} />

          {/* Backwards compatible route */}
          <Route path="/read/:slug" element={<ReaderRouter />} />
        </Routes>
      </main>
    </div>
  );
}
