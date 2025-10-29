// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Starfield from "./components/Starfield.jsx";
import NavBar from "./components/NavBar.jsx";
import Entry from "./pages/Entry.jsx";
import Library from "./pages/Library.jsx";
import WorkDetail from "./pages/WorkDetail.jsx";
import ReaderRouter from "./pages/ReaderRouter.jsx";

// ✅ Only import once — default + named diagBilling
import Billing, { diagBilling } from "./utils/billing";

export default function App() {
  // ✅ Restore purchases and run diagnostics on app launch
  useEffect(() => {
    // Try to restore purchases silently
    Billing.restore().catch(() => {
      // Ignore errors in non-Play contexts (browser/dev)
    });

    // Run diagnostics overlay
    diagBilling();
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
          <Route path="/read/:slug" element={<ReaderRouter />} />
        </Routes>
      </main>
    </div>
  );
}
