// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Starfield from "./components/Starfield.jsx";
import NavBar from "./components/NavBar.jsx";
import Entry from "./pages/Entry.jsx";
import Library from "./pages/Library.jsx";
import WorkDetail from "./pages/WorkDetail.jsx";
import ReaderRouter from "./pages/ReaderRouter.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";

export default function App() {
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
          {/* ✅ Stripe return routes */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </main>
    </div>
  );
}
  