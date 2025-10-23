// src/pages/Entry.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/entry-animations.css"; // ✅ NEW IMPORT

export default function Entry() {
  return (
    <section className="min-h-screen flex items-center justify-center p-6">
      <div className="glass p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 fade-in-title">
          myWorld Nexus
        </h1>

        <p className="text-neutral-300 fade-in-subtitle">
          Welcome to my world
        </p>

        <Link
          to="/library"
          className="inline-block mt-6 text-neon-blue neon-link font-semibold pulse-link"
        >
          Enter Library →
        </Link>
        
        <footer className="mt-10 w-full text-center">
  <p className="text-[10px] md:text-xs text-neutral-400/60 tracking-wide">
    Create your own myWorld app — contact.myworldnexus@gmail.com
  </p>
</footer>

      </div>
    </section>
  );
}
