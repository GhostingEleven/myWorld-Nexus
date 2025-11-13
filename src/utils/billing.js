// src/utils/billing.js
import { unlockBySku } from "./unlock";

const PLAY_BILLING_URL = "https://play.google.com/billing";
const PACKAGE_NAME = "app.vercel.my_world_nexus_cdta.twa";

const PRODUCT_IDS = ["unlock_dreamland", "donate_support"];

let dgService = null;


// 🔵 Ensure Digital Goods service is loaded
async function getService() {
  if (dgService) return dgService;

  if (typeof window.getDigitalGoodsService !== "function") {
    throw new Error("Digital Goods API not available");
  }

  const service = await window.getDigitalGoodsService(PLAY_BILLING_URL);
  if (!service) throw new Error("Digital Goods API returned null");

  dgService = service;
  return dgService;
}


// 🔵 Pull SKU details
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


// 🔵 MAIN PURCHASE FUNCTION
async function purchase(sku = "unlock_dreamland") {
  try {
    const service = await getService();

    // 1️⃣ Standard Digital Goods purchase — this is the real API
    if (typeof service.purchase === "function") {
      console.log("⚡ Using service.purchase");
      const result = await service.purchase(sku);
      await restore(); 
      return result;
    }

    // 2️⃣ Fallback: correct Play Store redirect (opens the product directly)
    console.log("⚡ Using fallback Play redirect");

    const redirectUrl =
      `https://play.google.com/store/paymentmethods?sku=${sku}&package=${PACKAGE_NAME}`;

    window.location.href = redirectUrl;
    throw new Error("Redirecting to Google Play");

  } catch (err) {
    console.error("❌ Purchase failed:", err);
    throw err;
  }
}


// 🔵 Restore purchased items
async function restore() {
  try {
    const service = await getService();
    const purchases = await service.listPurchases();

    console.log("🧾 Restored purchases:", purchases);

    for (const p of purchases || []) {
      if (p.itemId) unlockBySku(p.itemId);
    }
  } catch (err) {
    console.warn("Restore failed:", err);
  }
}


export default {
  purchase,
  restore,
  getSkuDetails
};
