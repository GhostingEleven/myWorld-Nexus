// src/utils/billing.js
import { unlockBySku } from "./unlock";

const PLAY_BILLING_URL = "https://play.google.com/billing";
const PRODUCT_IDS = ["unlock_dreamland", "donate_support"]; // Your actual SKUs
let dgService = null;

/**
 * Initialize or get the Play Billing Digital Goods service
 */
async function getService() {
  if (dgService) return dgService;

  if (typeof window.getDigitalGoodsService !== "function") {
    throw new Error("Play Billing not available in this environment");
  }

  const service = await window.getDigitalGoodsService(PLAY_BILLING_URL);
  if (!service) {
    throw new Error("Play Billing not available in this environment");
  }

  dgService = service;
  return dgService;
}

/**
 * Fetch details for your SKUs (price, title, etc.)
 */
export async function getSkuDetails(productIds = PRODUCT_IDS) {
  try {
    const service = await getService();
    if (service.getDetails) {
      return await service.getDetails(productIds);
    }
    return [];
  } catch (err) {
    console.warn("getSkuDetails failed:", err);
    return [];
  }
}

/**
 * Launch purchase flow for a specific SKU
 */
export async function purchase(sku = "unlock_dreamland") {
  try {
    const service = await getService();

    // Fetch product details first
    const [product] = await service.getDetails([sku]);
    if (!product) throw new Error("Product not found: " + sku);

    // ✅ Call purchase() using the SKU string
    const token = await service.purchase(sku);
    console.log("✅ Purchase success:", token);

    // Visual feedback (temporary popup)
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
      zIndex: "10000",
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);

    await restore();
    return token;
  } catch (err) {
    console.error("❌ Purchase failed:", err);
    throw err;
  }
}

/**
 * Restore owned purchases and unlock entitlements
 */
export async function restore() {
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

/**
 * Default export
 */
const Billing = { purchase, restore, getSkuDetails };
export default Billing;
