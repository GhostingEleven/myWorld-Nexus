// src/utils/billing.js
import { unlockBySku } from "./unlock";

const PLAY_BILLING_URL = "https://play.google.com/billing";
const PRODUCT_IDS = ["unlock_dreamland", "donate_support"];

let dgService = null;

async function getService() {
  if (dgService) return dgService;

  if (typeof window.getDigitalGoodsService !== "function") {
    throw new Error("Play Billing not available in this environment");
  }

  const service = await window.getDigitalGoodsService(PLAY_BILLING_URL);
  if (!service) throw new Error("Play Billing not available in this environment");

  dgService = service;
  return dgService;
}

async function getSkuDetails(productIds = PRODUCT_IDS) {
  try {
    const service = await getService();
    const details = await service.getDetails(productIds);

    console.log("📦 SKU details:", details);

    return details || [];
  } catch (err) {
    console.warn("getSkuDetails failed:", err);
    return [];
  }
}

async function purchase(sku = "unlock_dreamland") {
  try {
    const service = await getService();

    // CORRECT: DigitalGoods purchase takes a string SKU
    const purchaseToken = await service.purchase(sku);

    console.log("✅ Purchase success:", purchaseToken);

    // Quick popup
    const msg = document.createElement("div");
    msg.textContent = "✅ Dreamland unlocked!";
    Object.assign(msg.style, {
      position: "fixed",
      bottom: "20px",
      left: "20px",
      background: "#0f0",
      color: "#000",
      padding: "10px 15px",
      borderRadius: "10px",
      fontWeight: "bold",
      zIndex: 10000,
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);

    await restore();
    return purchaseToken;
  } catch (err) {
    console.error("❌ Purchase failed:", err);
    throw err;
  }
}

async function restore() {
  try {
    const service = await getService();
    const purchases = await service.listPurchases();

    console.log("🧾 Restored purchases:", purchases);

    for (const p of purchases || []) {
      unlockBySku(p.itemId);
    }
  } catch (err) {
    console.warn("Restore failed or not supported:", err);
  }
}

export default {
  purchase,
  restore,
  getSkuDetails
};
