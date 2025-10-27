// src/utils/billing.js
import { unlockBySku } from "./unlock";

const PLAY_METHOD = "https://play.google.com/billing";
let dgService = null; // Digital Goods service instance (Play)

async function getService() {
  if (dgService) return dgService;
  if (!("digitalGoods" in navigator) || !navigator.digitalGoods?.getService) {
    throw new Error("Play Billing not available in this environment.");
  }
  dgService = await navigator.digitalGoods.getService("play");
  return dgService;
}

// Optional: fetch SKU details (price/description) if you want to display live prices.
export async function getSkuDetails(productIds = []) {
  const service = await getService();
  // Some implementations expose listDetails / getDetailsForItems; fall back if needed.
  if (!service.listDetails) return [];
  return service.listDetails(productIds);
}

// Purchase a product by SKU (one-time IAP).
export async function purchase(sku) {
  const service = await getService();

  // 1) Ask Play for the product details (verifies SKU exists)
  if (service.getDetails) {
    await service.getDetails([sku]); // not all UA’s expose listDetails; this is a no-op if unsupported
  }

  // 2) Launch Payment Request with Play Billing as the method
  const methodData = [{
    supportedMethods: PLAY_METHOD,
    data: { sku } // minimal contract for Play via Payment Request
  }];

  const details = { total: { label: "Total", amount: { currency: "AUD", value: "0" } } };
  // Note: Play UI shows the actual price; this "0" is ignored for Play purchases.

  const pr = new PaymentRequest(methodData, details);
  const resp = await pr.show(); // Shows Google Play purchase sheet

  // If user completes, Play returns a token in response.details
  // Some UA’s auto-complete; still call complete() for spec compliance
  await resp.complete("success");

  // 3) After success, refresh owned items and unlock content if needed
  await restore(); // will call unlockBySku for relevant SKUs
}

// Query owned purchases and unlock entitlements locally
export async function restore() {
  const service = await getService();
  if (!service.listPurchases) return;

  const purchases = await service.listPurchases(); // [{itemId, purchaseToken, ...}]
  for (const p of purchases || []) {
    // Donations don’t unlock content, Dreamland does:
    unlockBySku(p.itemId);
  }
}

// Lightweight default export used by your components
const Billing = { purchase, restore, getSkuDetails };
export default Billing;
