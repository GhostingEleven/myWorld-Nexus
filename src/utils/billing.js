// src/utils/billing.js
import { unlockBySku } from "./unlock";

const PLAY_BILLING_URL = "https://play.google.com/billing";
const PRODUCT_IDS = ["dreamland_unlock"]; // Add more SKUs here if needed

let dgService = null;

/**
 * Get or initialize the Play Billing Digital Goods service.
 */
async function getService() {
  if (dgService) return dgService;

  // Check API support
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
 * Fetch details (price, title) for your SKUs if needed.
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
 * Launch purchase flow for a specific SKU.
 */
export async function purchase(sku = "dreamland_unlock") {
  try {
    const service = await getService();

    // Fetch SKU details
    const [product] = await service.getDetails([sku]);
    if (!product) throw new Error("Product not found: " + sku);

    // Launch purchase flow
    const token = await service.purchase(product);
    console.log("Purchase success:", token);

    // Restore owned items to unlock content
    await restore();
    return token;
  } catch (err) {
    console.error("Purchase failed:", err);
    throw err;
  }
}

/**
 * Restore owned purchases and unlock entitlements.
 */
export async function restore() {
  try {
    const service = await getService();
    const purchases = await service.listPurchases();
    console.log("Restored purchases:", purchases);

    for (const p of purchases || []) {
      unlockBySku(p.itemId);
    }
  } catch (err) {
    console.warn("Restore failed or not supported:", err);
  }
}

/**
 * Lightweight default export
 */
const Billing = { purchase, restore, getSkuDetails };
export default Billing;
