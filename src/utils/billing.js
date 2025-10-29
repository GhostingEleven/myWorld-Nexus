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
    const [product] = await service.getDetails([sku]);
    if (!product) throw new Error("Product not found: " + sku);

    const token = await service.purchase(product);
    console.log("✅ Purchase success:", token);

    await restore();
    return token;
  } catch (err) {
    console.error("❌ Purchase failed:", err);
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
    console.log("🧾 Restored purchases:", purchases);

    for (const p of purchases || []) {
      unlockBySku(p.itemId);
    }
  } catch (err) {
    console.warn("Restore failed or not supported:", err);
  }
}

/**
 * 🔍 Diagnostic function — shows on-screen + logs to console
 */
export async function diagBilling() {
  const output = [];
  try {
    output.push("🧩 diagBilling start...");

    if (typeof window.getDigitalGoodsService !== "function") {
      output.push("❌ window.getDigitalGoodsService not found.");
    } else {
      const service = await window.getDigitalGoodsService(PLAY_BILLING_URL);
      if (service) {
        output.push("✅ Digital Goods service found!");
        if (service.listPurchases) {
          const purchases = await service.listPurchases();
          output.push(`🔹 listPurchases OK: ${purchases.length} items`);
        } else {
          output.push("⚠️ listPurchases() not supported.");
        }

        if (service.getDetails) {
          const details = await service.getDetails(PRODUCT_IDS);
          output.push(`🔹 getDetails() result: ${JSON.stringify(details)}`);
        } else {
          output.push("⚠️ getDetails() not supported.");
        }
      } else {
        output.push("❌ getDigitalGoodsService returned null.");
      }
    }
  } catch (err) {
    output.push("❌ Exception: " + err.message);
  }

  // 🧩 Display diagnostic results on screen
  const diagBox = document.createElement("pre");
  diagBox.textContent = output.join("\n");
  diagBox.style.position = "fixed";
  diagBox.style.bottom = "10px";
  diagBox.style.left = "10px";
  diagBox.style.background = "rgba(0,0,0,0.8)";
  diagBox.style.color = "lime";
  diagBox.style.fontSize = "12px";
  diagBox.style.padding = "10px";
  diagBox.style.border = "1px solid lime";
  diagBox.style.zIndex = "9999";
  diagBox.style.maxWidth = "90vw";
  diagBox.style.whiteSpace = "pre-wrap";
  document.body.appendChild(diagBox);

  console.log(output.join("\n"));
}

/**
 * Default export
 */
const Billing = { purchase, restore, getSkuDetails, diagBilling };
export default Billing;
