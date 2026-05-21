
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { createInventoryStore } from './inventoryStore.js';
import ordersApi from './server/ordersApi.js';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOrigins = (process.env.CORS_ORIGINS || frontendUrl)
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const sessionSecret = process.env.SESSION_SECRET || 'dev_only_replace_me';
const adminPasswordHash = process.env.INVENTORY_ADMIN_PASSWORD_HASH;
const adminPassword = process.env.INVENTORY_ADMIN_PASSWORD;
const defaultStock = 25;
const requestLimitStore = new Map();

if (!stripeSecretKey && !isProduction) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe payment routes are disabled in development.');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' }) : null;

if (sessionSecret === 'dev_only_replace_me') {
  console.warn('SESSION_SECRET is not set. Configure SESSION_SECRET in .env before production.');
}

if (isProduction) {
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY must be configured in production.');
  }
  if (sessionSecret === 'dev_only_replace_me') {
    throw new Error('SESSION_SECRET must be configured in production.');
  }
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET must be configured in production.');
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials must be configured in production.');
  }
}

function createRateLimiter({ windowMs, maxRequests, keyPrefix, keyResolver }) {
  return (req, res, next) => {
    const now = Date.now();
    const suffix = keyResolver?.(req) || req.ip || 'unknown';
    const key = `${keyPrefix}:${suffix}`;
    const existing = requestLimitStore.get(key);

    if (!existing || existing.resetAt <= now) {
      requestLimitStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    if (existing.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
    }

    existing.count += 1;
    return next();
  };
}

const adminLoginRateLimiter = createRateLimiter({
  keyPrefix: 'admin_login',
  windowMs: 10 * 60 * 1000,
  maxRequests: 8,
});

const createPaymentIntentRateLimiter = createRateLimiter({
  keyPrefix: 'payment_intent',
  windowMs: 60 * 1000,
  maxRequests: 20,
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (!isProduction && /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const productCatalog = {
  101: { name: 'Drift', priceCents: 7999, previewImage: '/bauen-content/frame01/IMG_2811.jpeg' },
  102: { name: 'Glow', priceCents: 7999, previewImage: '/bauen-content/frame06/IMG_4518.jpeg' },
  201: { name: 'Ruelles', priceCents: 7999, previewImage: '/bauen-content/frame03/IMG_2880.jpeg' },
  202: { name: 'Sway', priceCents: 7999, previewImage: '/bauen-content/frame04/IMG_2893.jpeg' },
  203: { name: 'Roam', priceCents: 7999, previewImage: '/bauen-content/frame06/IMG_4518.jpeg' },
  204: { name: 'Impasse', priceCents: 7999, previewImage: '/bauen-content/frame07/IMG_4493.jpeg' },
  207: { name: 'Boulevard', priceCents: 7999, previewImage: '/bauen-content/frame05/IMG_4503.jpeg' },
};

const inventoryStore = createInventoryStore({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  defaultStock,
  logger: console,
});

function getErrorMessage(err, fallback) {
  if (err instanceof Error) {
    return err.message;
  }

  if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
    return err.message;
  }

  return fallback;
}

function getReservationTokenFromPaymentIntent(paymentIntent, fallbackReservationToken = '') {
  const metadataReservationToken = paymentIntent?.metadata?.reservation_token;
  if (typeof metadataReservationToken === 'string' && metadataReservationToken.trim()) {
    return metadataReservationToken.trim();
  }

  return fallbackReservationToken.trim();
}

async function verifyAdminPasscode(passcode) {
  if (adminPasswordHash) {
    return bcrypt.compare(passcode, adminPasswordHash);
  }

  if (adminPassword) {
    return passcode === adminPassword;
  }

  return false;
}

function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized' });
}

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

app.use((req, res, next) => {
  if (!isProduction) {
    next();
    return;
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const isHttps = String(forwardedProto || '').split(',')[0].trim() === 'https';
  if (isHttps) {
    next();
    return;
  }

  res.status(426).json({ error: 'HTTPS is required.' });
});

app.use(cors(corsOptions));

// Serve static assets (images, CSS, JS)
app.use(express.static('public'));
app.use('/bauen-content', express.static('bauen-content'));

app.use(session({
  name: 'bauen_admin_session',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? 'strict' : 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 8,
  },
}));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).send('Stripe is not configured.');
  }

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
    return res.status(400).send(`Webhook Error: ${getErrorMessage(err, 'Invalid webhook signature')}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const reservationToken = getReservationTokenFromPaymentIntent(paymentIntent);
        if (reservationToken) {
          await inventoryStore.completeReservation(paymentIntent.id, reservationToken);
        }
        break;
      }
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        const reservationToken = getReservationTokenFromPaymentIntent(paymentIntent);
        if (reservationToken) {
          await inventoryStore.releaseReservation(reservationToken);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    return res.status(500).send(getErrorMessage(err, 'Webhook processing failed'));
  }

  return res.json({ received: true });
});

app.use(express.json());

// Admin Orders API (protected)
app.use('/api/admin/orders', requireAdmin, ordersApi);

app.get('/api/admin/session', (req, res) => {
  res.json({ authenticated: Boolean(req.session?.isAdmin) });
});

app.post('/api/admin/login', adminLoginRateLimiter, async (req, res) => {
  const passcode = String(req.body?.passcode ?? '').trim();

  if (!adminPasswordHash && !adminPassword) {
    return res.status(500).json({ error: 'Admin passcode is not configured on server.' });
  }

  if (!passcode) {
    return res.status(400).json({ error: 'Passcode is required.' });
  }

  try {
    const isValid = await verifyAdminPasscode(passcode);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid passcode.' });
    }

    req.session.isAdmin = true;
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err, 'Unable to verify passcode') });
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('bauen_admin_session');
    res.json({ ok: true });
  });
});

app.get('/api/inventory', requireAdmin, async (_req, res) => {
  try {
    return res.json({ items: await inventoryStore.getInventoryItems() });
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err, 'Unable to load inventory') });
  }
});

app.get('/api/inventory/public', async (_req, res) => {
  try {
    return res.json({ items: await inventoryStore.getPublicInventoryItems() });
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err, 'Unable to load inventory') });
  }
});

app.post('/api/inventory/stock', requireAdmin, async (req, res) => {
  const id = Number(req.body?.id);
  const stock = Number(req.body?.stock);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid product id.' });
  }

  if (!Number.isFinite(stock) || stock < 0) {
    return res.status(400).json({ error: 'Invalid stock value.' });
  }

  try {
    const item = await inventoryStore.setStock(id, Math.floor(stock));
    return res.json({ ok: true, item });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err, 'Unable to update stock') });
  }
});

app.post('/api/inventory/reset', requireAdmin, async (_req, res) => {
  try {
    return res.json({ ok: true, items: await inventoryStore.resetInventory() });
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err, 'Unable to reset inventory') });
  }
});

app.post('/api/inventory/release-reservation', async (req, res) => {
  const reservationToken = String(req.body?.reservationToken ?? '').trim();

  if (!reservationToken) {
    return res.status(400).json({ error: 'Missing reservationToken.' });
  }

  try {
    const released = await inventoryStore.releaseReservation(reservationToken);
    return res.json({ ok: released });
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err, 'Unable to release reservation') });
  }
});

app.post('/api/inventory/decrement-order', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured on server.' });
  }

  const paymentIntentId = String(req.body?.paymentIntentId ?? '').trim();
  const fallbackReservationToken = String(req.body?.reservationToken ?? '').trim();

  if (!paymentIntentId) {
    return res.status(400).json({ error: 'Missing paymentIntentId.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment is not completed.' });
    }

    const reservationToken = getReservationTokenFromPaymentIntent(paymentIntent, fallbackReservationToken);
    if (!reservationToken) {
      return res.status(400).json({ error: 'Missing reservation token.' });
    }

    const completed = await inventoryStore.completeReservation(paymentIntentId, reservationToken);
    if (!completed) {
      return res.status(400).json({ error: 'Reservation is no longer valid.' });
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err, 'Unable to verify payment intent') });
  }
});

app.post('/api/create-payment-intent', createPaymentIntentRateLimiter, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured on server.' });
  }

  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  let amount = 0;
  const normalizedItems = [];
  let reservationToken = '';
  let reservationExpiresAt = '';

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
    const reservation = await inventoryStore.reserveItems(items);
    reservationToken = reservation.reservationToken;
    reservationExpiresAt = reservation.expiresAt;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: normalizedItems.join(', ').slice(0, 500),
        reservation_token: reservationToken,
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      reservationToken,
      reservationExpiresAt,
    });
  } catch (err) {
    if (reservationToken) {
      await inventoryStore.releaseReservation(reservationToken).catch(() => null);
    }

    return res.status(400).json({ error: getErrorMessage(err, 'Unable to create payment intent') });
  }
});

app.get('/api/health', async (_req, res) => {
  try {
    await inventoryStore.getPublicInventoryItems();
    return res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: getErrorMessage(err, 'Inventory store unavailable') });
  }
});

const PORT = 4242;

try {
  await inventoryStore.initializeCatalog(productCatalog);
  const server = app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Kill the existing process and retry.`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });
} catch (err) {
  console.error('Failed to initialize inventory store:', err);
  process.exit(1);
}
