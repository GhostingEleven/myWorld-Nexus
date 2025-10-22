// src/pages/Cancel.jsx
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Cancel() {
  const [params] = useSearchParams();
  const slug = params.get("slug");

  return (
    <section className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="glass p-10 rounded-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-3">Payment Cancelled</h1>
        <p className="text-neutral-300 text-sm mb-6">
          No charges were made.
        </p>
        <Link
          to={slug ? `/work/${slug}` : "/library"}
          className="text-neon-blue neon-link"
        >
          Return
        </Link>
      </div>
    </section>
  );
}
