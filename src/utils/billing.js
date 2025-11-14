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

// 🔵 MAIN PURCHASE FUNCTION — using Payment Request API + Digital Goods
async function purchase(sku = "unlock_dreamland") {
  try {
    const service = await getService();

    // Safety: if PaymentRequest API is not available, fall back to Play redirect
    if (typeof window.PaymentRequest !== "function") {
      console.warn("PaymentRequest API not available, using fallback redirect");

      const redirectUrl =
        `https://play.google.com/store/paymentmethods?sku=${sku}&package=${PACKAGE_NAME}`;

      window.location.href = redirectUrl;
      throw new Error("Redirecting to Google Play");
    }

    // Try to get details for this SKU (price, currency, title)
    let item = null;
    try {
      const details = await service.getDetails([sku]);
      if (details && details.length > 0) {
        item = details[0];
        console.log("🎯 Using SKU details for purchase:", item);
      } else {
        console.warn("No details returned for SKU:", sku);
      }
    } catch (e) {
      console.warn("getDetails failed, continuing without details:", e);
    }

    // Build the supported payment method for Google Play Billing
    const supportedInstruments = [{
      supportedMethods: "https://play.google.com/billing",
      data: { sku }
    }];

    const paymentDetails = {
      total: {
        label: item?.title || "Total",
        amount: {
          currency: item?.price?.currency || "USD",
          value: String(item?.price?.value || "0")
        }
      }
    };

    const request = new PaymentRequest(supportedInstruments, paymentDetails);

    console.log("🧾 Showing PaymentRequest for SKU:", sku);
    const response = await request.show();

    await response.complete("success");

    console.log("✅ PaymentRequest completed:", response);

    await restore();

    return response;

  } catch (err) {
    console.error("❌ Purchase failed:", err);

    // Play Billing quirk: RESULT_CANCELED can mean the Play UI
    // closed itself *after* completing the purchase.
    if (err.message?.includes("RESULT_CANCELED")) {
      console.warn("Treating RESULT_CANCELED as post-payment close event.");
      await restore();
      return { status: "completed_after_play_close" };
    }

    throw err;
  }   // <-- correct closing brace for catch
}     // <-- correct closing brace for purchase()


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
