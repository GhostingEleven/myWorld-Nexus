// src/data/works.js
export const works = [
  {
    title: "Angeldown",
    slug: "angeldown",
    image: "/works/angeldown.jpg",
    typeLabel: "Included",
    blurb:
      "Two lovers, an Angeldown-class ship, and a galaxy to cross. Fast, witty, adventure-first.",
    cta: "Open",
    behavior: "included" // opens in-app reader
  },

  {
    title: "Dreamland",
    slug: "dreamland",
    image: "/works/dreamland.jpg",
    typeLabel: "Book • Purchase",
    blurb:
      "A mythic fable-cycle. Kingdoms, vows, and trials told in a dream cadence — meant to be earned.",
    cta: "Buy",
    behavior: "purchase",   // ✅ must buy to unlock
    priceUSD: 7.99          // ✅ Stripe reads this
  },

  {
    title: "Sunshine Punk",
    slug: "sunshine-punk",
    image: "/works/sunshine-punk.jpg",
    typeLabel: "Act I • Donation",
    blurb:
      "Unfinished work — bright edge, heart-forward. Read a preview and tip if you vibe.",
    cta: "Preview",
    behavior: "donation"
  },

  {
    title: "KRYX",
    slug: "kryx",
    image: "/works/kryx.jpg",
    typeLabel: "Graphic Short • Free",
    blurb:
      "A black silhouette facing the sky. Comic-panel rhythm; crisp, high-contrast myth.",
    cta: "Read",
    behavior: "free"
  },

  {
    title: "Sketchy NFTs",
    slug: "sketchy-nfts",
    image: "/works/sketchy-nfts.jpg",
    typeLabel: "External",
    blurb:
      "The Sketchy series on-chain. Browse pieces, traits, and provenance.",
    cta: "Visit",
    behavior: "external",
    externalUrl: "https://opensea.io/" // replace with real link later
  }
];
