// Library (Hybrid) + Book Preview — single-file React component (Tailwind)
// Drop into your project as LibraryApp.jsx (or replace export default with your router pages).
// - Hybrid layout (thumbnail + text row)
// - Neon accents to match your theme
// - Back-to-Hub hook via onBack prop (falls back to no-op)
// - Purchase flows: placeholders with TODOs
// - "Lexy and Stak" is FREE with optional Donate (button shows if donateLink exists)
// - Includes "Reflections" entry

import React, { useMemo, useState } from "react";

/*************************
 * Catalog Configuration  *
 *************************/
const CATALOG = [
  {
    id: "angeldown",
    order: 1,
    title: "Angeldown",
    type: "Main novel",
    access: "included", // included | iap | free | donation | paid | external
    cover: "/images/angeldown-cover.jpg",
    tagline: "Premier starship. Two lovers. A galaxy between them.",
    blurb:
      "Lighthearted, fast-paced space adventure following Aleria (princess of Arkos) and her partner aboard the Angeldown as they traverse hostile sectors on a long journey home.",
    actions: { readPath: "/read/angeldown" },
    theme: "space",
  },
  {
    id: "dreamland",
    order: 2,
    title: "Dreamland",
    type: "Novel",
    access: "iap",
    cover: "/images/dreamland-cover.jpg",
    tagline: "Mythic realms, dragons, and the logic of dreams.",
    blurb:
      "Unlock the mythic tapestry of Dreamland—where inner architecture meets high fantasy. Purchase to access full chapters and evolving extras.",
    actions: { purchasePath: "/buy/dreamland" },
    theme: "mythic",
  },
  {
    id: "kryx",
    order: 3,
    title: "Kryx",
    type: "Short Graphic Series",
    access: "free",
    cover: "/images/kryx-cover.jpg",
    tagline: "A silhouette approaches the sun. Freedom without anchors.",
    blurb:
      "Four micro-stories rendered like a motion comic—Kryx explores pure freedom: power without purpose, attitude untested.",
    actions: { readPath: "/read/kryx" },
    theme: "comic",
  },
  {
    id: "sunshine-punk",
    order: 4,
    title: "Sunshine Punk (Act 1)",
    type: "Novel",
    access: "donation",
    cover: "/images/sunshine-cover.jpg",
    tagline: "Bright anarchy meets grit. Act 1 in progress.",
    blurb:
      "Read Act 1 now and support development if you vibe with it—pay what you want keeps the chapters coming.",
    actions: { readPath: "/read/sunshine-punk", donateLink: "/donate/sunshine-punk" },
    theme: "vapor",
  },
  {
    id: "lexy-and-stak",
    order: 5,
    title: "Lexy and Stak",
    type: "Short Story Series",
    access: "free", // free with optional donate
    cover: "/images/lexy-stak-cover.jpg",
    tagline: "Urban mischief, sharp wit, unfinished but alive.",
    blurb:
      "Bite-sized chaos featuring Lexy and Stak. Free to read—tip if you want to fuel the next entry.",
    actions: { readPath: "/read/lexy-and-stak", donateLink: "/donate/lexy-and-stak" },
    theme: "neon",
  },
  {
    id: "the-never-manifest",
    order: 6,
    title: "The Never Manifest",
    type: "Hidden Book",
    access: "paid",
    cover: "/images/never-manifest-cover.jpg",
    tagline: "The book that almost wasn’t.",
    blurb:
      "A concealed manuscript with deliberate barriers. Purchase to reveal and explore what was never meant to surface.",
    actions: { purchasePath: "/buy/the-never-manifest" },
    theme: "occult",
  },
  {
    id: "sketchy-nfts",
    order: 7,
    title: "Sketchy NFTs",
    type: "External link",
    access: "external",
    cover: "/images/sketchy-nfts.jpg",
    tagline: "OpenSea collection — enter at your own delight.",
    blurb:
      "A doorway to visual experiments. Opens your browser to the OpenSea collection in a new tab.",
    actions: { externalUrl: "https://opensea.io/collection/sketchy-nfts" }, // <-- replace
    theme: "grid",
  },
  {
    id: "reflections",
    order: 8,
    title: "Reflections",
    type: "Collection",
    access: "included",
    cover: "/images/reflections.jpg",
    tagline: "17 pieces written in 3 days. Unfiltered clarity.",
    blurb:
      "Concise entries from a decisive window. Included for all users—browse piece by piece or read straight through.",
    actions: { readPath: "/read/reflections" },
    theme: "mono",
  },
];

/*********************
 * Visual Components  *
 *********************/
const NeonTag = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-cyan-400/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.35)]">
    {children}
  </span>
);

const AccessBadge = ({ access }) => {
  const map = {
    included: { label: "Included", cls: "border-emerald-400/60 text-emerald-200 shadow-[0_0_8px_rgba(52,211,153,0.25)]" },
    iap: { label: "In‑App Purchase", cls: "border-fuchsia-400/60 text-fuchsia-200 shadow-[0_0_8px_rgba(232,121,249,0.25)]" },
    free: { label: "Free", cls: "border-cyan-400/60 text-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.25)]" },
    donation: { label: "Donation", cls: "border-amber-400/60 text-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.25)]" },
    paid: { label: "Paid", cls: "border-rose-400/60 text-rose-200 shadow-[0_0_8px_rgba(251,113,133,0.25)]" },
    external: { label: "External", cls: "border-sky-400/60 text-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.25)]" },
  };
  const cfg = map[access] ?? map.free;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

const Cover = ({ src, alt }) => (
  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
    <div className="pointer-events-none absolute inset-0 ring-1 ring-cyan-400/20" />
  </div>
);

/***********************
 * Book Preview Screen  *
 ***********************/
function BookPreview({ book, onBack }) {
  if (!book) return null;
  const { title, type, access, cover, tagline, blurb, actions } = book;

  const primaryCta = () => {
    switch (access) {
      case "included":
      case "free":
        return { label: "Read Now", onClick: () => route(actions?.readPath) };
      case "iap":
      case "paid":
        return { label: "Purchase / Unlock", onClick: () => route(actions?.purchasePath) };
      case "donation":
        return { label: "Read (Pay‑What‑You‑Want)", onClick: () => route(actions?.readPath) };
      case "external":
        return { label: "Open Link", onClick: () => openExternal(actions?.externalUrl) };
      default:
        return { label: "Read", onClick: () => {} };
    }
  };

  const secondaryCtas = () => {
    const list = [];
    if (access === "donation" && actions?.donateLink) {
      list.push({ label: "Donate", onClick: () => route(actions.donateLink) });
    }
    if (access === "free" && actions?.donateLink) {
      list.push({ label: "Tip the Author", onClick: () => route(actions.donateLink) });
    }
    return list;
  };

  const p = primaryCta();
  const s = secondaryCtas();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur">
        <button
          onClick={() => (onBack ? onBack() : window.history.back?.())}
          className="rounded-xl border border-white/10 px-3 py-1 text-sm text-cyan-200 hover:border-cyan-400/40 hover:text-cyan-100"
        >
          ← Back
        </button>
        <div className="text-xs text-zinc-400">Book Preview</div>
      </div>

      {/* Header */}
      <div className="mx-auto grid w-full max-w-4xl grid-cols-[auto,1fr] gap-6 p-6">
        <Cover src={cover} alt={`${title} cover`} />
        <div>
          <div className="mb-1 flex items-center gap-2">
            <NeonTag>{type}</NeonTag>
            <AccessBadge access={access} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            {title}
          </h1>
          {tagline && <p className="mt-1 text-sm text-zinc-300">{tagline}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-4xl p-6 pt-0">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 shadow-[0_0_40px_rgba(0,255,255,0.06)]">
          <p className="text-zinc-200/90">{blurb}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={p.onClick}
              className="rounded-2xl border border-cyan-400/60 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.35)] hover:border-cyan-300/80 hover:shadow-[0_0_24px_rgba(34,211,238,0.55)]"
            >
              {p.label}
            </button>
            {s.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                className="rounded-2xl border border-amber-400/50 px-4 py-2 text-sm font-medium text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.25)] hover:border-amber-300/70"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/****************
 * Library List *
 ****************/
function Library({ items, onOpen, onBack }) {
  const sorted = useMemo(() =>
    [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  [items]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onBack ? onBack() : null)}
            className="rounded-xl border border-white/10 px-3 py-1 text-sm text-cyan-200 hover:border-cyan-400/40 hover:text-cyan-100"
          >
            ← Hub
          </button>
          <h2 className="text-sm font-medium text-zinc-300">Library</h2>
        </div>
        <div className="text-[11px] text-zinc-500">Hybrid layout</div>
      </div>

      {/* List */}
      <div className="mx-auto w-full max-w-3xl p-4">
        <ul className="space-y-3">
          {sorted.map((b) => (
            <li key={b.id}>
              <button
                onClick={() => onOpen?.(b)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-3 text-left shadow-[0_0_24px_rgba(34,211,238,0.05)] transition hover:border-cyan-400/30 hover:shadow-[0_0_36px_rgba(34,211,238,0.12)]"
              >
                <Cover src={b.cover} alt={`${b.title} cover`} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <NeonTag>{b.type}</NeonTag>
                    <AccessBadge access={b.access} />
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="truncate text-[15px] font-semibold text-zinc-100">
                      {b.order}. {b.title}
                    </h3>
                    <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">Tap to open →</span>
                  </div>
                  {b.tagline && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-zinc-300/90">
                      {b.tagline}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/********************
 * Helpers / Routing *
 ********************/
function route(path) {
  if (!path) return;
  // If using Next.js or React Router, replace with router.push(path).
  if (typeof window !== "undefined") {
    window.location.href = path;
  }
}
function openExternal(url) {
  if (!url) return;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/****************
 * Demo Wrapper  *
 ****************/
export default function LibraryApp({ onBack }) {
  const [active, setActive] = useState(null);

  if (active) {
    return (
      <BookPreview
        book={active}
        onBack={() => setActive(null)}
      />
    );
  }

  return (
    <Library
      items={CATALOG}
      onOpen={(b) => setActive(b)}
      onBack={onBack}
    />
  );
}
    