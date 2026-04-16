
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

const app = express();
const stripe = new Stripe('STRIPE_SECRET_KEY_REMOVED', { apiVersion: '2023-10-16' }); // Mets ta clé secrète Stripe ici

app.use(cors());
app.use(express.json());

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centimes (ex: 1000 = 10€)
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`));
