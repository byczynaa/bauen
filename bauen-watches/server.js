
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables.');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });

// In dev, allow any localhost port so Vite port changes don't break CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === frontendUrl || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const productCatalog = {
  1: { name: 'Abysse', priceCents: 7999 },
  2: { name: 'Chance', priceCents: 7999 },
  101: { name: 'Drift', priceCents: 7999 },
  102: { name: 'Glow', priceCents: 7999 },
  201: { name: 'Ruelles', priceCents: 7999 },
  202: { name: 'Sway', priceCents: 7999 },
  203: { name: 'Roam', priceCents: 7999 },
  204: { name: 'Impasse', priceCents: 7999 },
  207: { name: 'Boulevard', priceCents: 7999 },
};

app.use(cors(corsOptions));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!webhookSecret) {
    return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET');
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).send('Missing Stripe signature');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature';
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }
    default:
      break;
  }

  return res.json({ received: true });
});

app.use(express.json());

app.post('/api/create-payment-intent', async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  let amount = 0;
  const normalizedItems = [];

  for (const rawItem of items) {
    const productId = Number(rawItem?.id);
    const quantity = Number(rawItem?.quantity);
    const product = productCatalog[productId];

    if (!product) {
      return res.status(400).json({ error: `Invalid product id: ${productId}` });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: `Invalid quantity for product id: ${productId}` });
    }

    amount += product.priceCents * quantity;
    normalizedItems.push(`${product.name}x${quantity}`);
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: normalizedItems.join(', ').slice(0, 500),
      },
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to create payment intent';
    return res.status(500).json({ error: message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`));
