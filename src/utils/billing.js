// src/utils/billing.js
import { unlockBySku } from "./unlock";

const PLAY_BILLING_URL = "https://play.google.com/billing";
const PACKAGE_NAME = "app.vercel.my_world_nexus_cdta.twa";

// 🔵 UPDATED PRODUCT LIST — all available SKUs
const PRODUCT_IDS = [
  "unlock_dreamland",
  "donation_199",
  "donation_499",
  "donation_999"
];

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

// 🔵 Pull SKU details safely
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

    // ❗ VALIDATE SKU — ensures only known SKUs are allowed
    if (!PRODUCT_IDS.includes(sku)) {
      console.error("❌ Invalid SKU passed to purchase():", sku);
      throw new Error("Invalid SKU: " + sku);
    }

    // ❗ If PaymentRequest not supported, fallback to Play redirect
    if (typeof window.PaymentRequest !== "function") {
      console.warn("PaymentRequest API not available, using fallback redirect");

      const redirectUrl =
        `https://play.google.com/store/paymentmethods?sku=${sku}&package=${PACKAGE_NAME}`;

      window.location.href = redirectUrl;
      throw new Error("Redirecting to Google Play");
    }

    // 🔵 Try to load SKU details (price, title)
    let item = null;
    try {
      const details = await service.getDetails([sku]);

      if (details && details.length > 0) {
        item = details[0];
        console.log("🎯 SKU details for purchase:", item);
      } else {
        console.warn("⚠ No details returned for SKU:", sku);
      }
    } catch (err) {
      console.warn("⚠ getDetails failed:", err);
    }

    // ❗ NEW: If no details, DO NOT AUTO-SUCCESS  
    // This fix prevents "Thank you for your donation" with no billing!
    if (!item) {
      throw new Error("Missing SKU details — cannot launch billing.");
    }

    // 🔵 Build supported billing method
    const supportedInstruments = [{
      supportedMethods: PLAY_BILLING_URL,
      data: { sku }
    }];

    const paymentDetails = {
      total: {
        label: item.title || "Purchase",
        amount: {
          currency: item.price?.currency || "AUD",
          value: String(item.price?.value || "0")
        }
      }
    };

    console.log("🧾 Displaying PaymentRequest for:", sku);

    const request = new PaymentRequest(supportedInstruments, paymentDetails);
    const response = await request.show();

    await response.complete("success");

    console.log("✅ PaymentRequest completed:", response);

    await restore();

    return response;

  } catch (err) {
    console.error("❌ Purchase error:", err);

    if (err.message?.includes("RESULT_CANCELED")) {
      console.warn("Treating RESULT_CANCELED as completed purchase");
      await restore();
      return { status: "completed_after_play_close" };
    }

    throw err;
  }
}

// 🔵 Restore purchased items (unlock everything already owned)
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
