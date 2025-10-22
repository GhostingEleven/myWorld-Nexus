// server/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.error('❌ Missing STRIPE_SECRET_KEY in .env');
  process.exit(1);
}
const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

/** -------------------------------
 *  PURCHASE: create checkout session
 *  -------------------------------- */
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { slug = 'dreamland', title = 'Digital Book', priceUSD = 7.99 } = req.body;
    const unitAmount = Math.round(Number(priceUSD) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: { name: title },
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&slug=${encodeURIComponent(
        slug
      )}`,
      cancel_url: `http://localhost:5173/cancel?slug=${encodeURIComponent(slug)}`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/** -------------------------------
 *  DONATION: pay-what-you-want
 *  -------------------------------- */
app.post('/create-donation-session', async (req, res) => {
  try {
    const {
      slug = 'sunshine-punk',
      title = 'Support the Author — Sunshine Punk',
      amountUSD = 5.0,
    } = req.body;

    // guardrails
    const clamped = Math.max(1, Math.min(500, Number(amountUSD) || 0));
    const unitAmount = Math.round(clamped * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: { name: title },
          },
          quantity: 1,
        },
      ],
      // add kind=donation so Success page knows not to unlock
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&slug=${encodeURIComponent(
        slug
      )}&kind=donation`,
      cancel_url: `http://localhost:5173/cancel?slug=${encodeURIComponent(slug)}`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Donation session error:', err);
    res.status(500).json({ error: 'Failed to create donation session' });
  }
});

/** Verify session for success page */
app.get('/checkout-session', async (req, res) => {
  try {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(String(session_id));
    res.json({
      status: session.status,
      payment_status: session.payment_status,
    });
  } catch (err) {
    console.error('Fetch session error:', err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Stripe server running on :${port}`));
