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

    // 1️⃣ NEW 2024+ API
    if (service.payments?.purchase) {
      console.log("⚡ Using NEW Payments API");
      const result = await service.payments.purchase({ itemId: sku });
      await restore();
      return result;
    }

    // 2️⃣ OLD DigitalGoods API
    if (typeof service.purchase === "function") {
      console.log("⚡ Using OLD DigitalGoods API");
      const result = await service.purchase(sku);
      await restore();
      return result;
    }

    // 3️⃣ UNIVERSAL PLAY STORE FALLBACK (Triggers real purchase UI)
    console.log("⚡ Falling back to Play Store billing redirect");

    const redirectUrl =
      `android-app://com.android.vending/billing?sku=${sku}&package=${PACKAGE_NAME}`;

    window.location.href = redirectUrl;

    throw new Error("Redirected to Google Play billing redirect");

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
