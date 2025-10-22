import React from "react";
import { sketchyNFTs } from "../data/sketchy.js";

export default function SketchyGallery() {
  return (
    <section className="min-h-screen relative bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-widest text-neutral-100">
          SKETCHY NFTs
        </h1>
        <p className="text-neutral-400 mt-2">
          A limited collection of 15 digital sketches — tap any to view on OpenSea.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {sketchyNFTs.map((nft) => (
          <a
            key={nft.id}
            href={nft.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-white/30 transition"
          >
            <img
              src={nft.img}
              alt={nft.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-sm tracking-widest">
              <span className="text-yellow-200">{nft.title}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
