// src/api/checkout.js
export async function beginCheckout({ slug, title, priceUSD = 7.99 }) {
  const res = await fetch("http://localhost:4242/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, title, priceUSD })
  });
  if (!res.ok) throw new Error("Unable to start checkout");
  const data = await res.json();
  if (!data.url) throw new Error("Checkout URL missing");
  window.location.href = data.url; // Go to Stripe
}

export async function verifySession(sessionId) {
  const res = await fetch(`http://localhost:4242/checkout-session?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error("Unable to verify session");
  return await res.json();
}
