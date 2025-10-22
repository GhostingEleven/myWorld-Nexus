// src/pages/Success.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { unlock } from "../utils/unlock.js";

export default function Success() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const slug = params.get("slug");

  useEffect(() => {
    // Auto-unlock and redirect after 2 seconds
    if (slug) unlock(slug);
    const t = setTimeout(() => {
      if (slug) navigate(`/read/${slug}`, { replace: true });
      else navigate("/library", { replace: true });
    }, 2000);
    return () => clearTimeout(t);
  }, [slug, navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="glass p-10 rounded-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-3">Thank you for your purchase</h1>
        <p className="text-neutral-300 text-sm">
          Redirecting...
        </p>
      </div>
    </section>
  );
}
