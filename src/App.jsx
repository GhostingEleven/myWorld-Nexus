// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Starfield from "./components/Starfield.jsx";
import NavBar from "./components/NavBar.jsx";
import Entry from "./pages/Entry.jsx";
import Library from "./pages/Library.jsx";
import WorkDetail from "./pages/WorkDetail.jsx";
import ReaderRouter from "./pages/ReaderRouter.jsx";

import Billing from "./utils/billing"; // ✅ auto-restore

export default function App() {
  // ✅ Restore purchases on app launch (Google requires this)
  useEffect(() => {
    Billing.restore().catch(() => {
      // Ignore errors when running in desktop browser or dev
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
          <Route path="/read/:slug" element={<ReaderRouter />} />

          {/* ❌ Stripe routes removed */}
          {/* <Route path="/success" element={<Success />} /> */}
          {/* <Route path="/cancel" element={<Cancel />} /> */}
        </Routes>
      </main>
    </div>
  );
}
