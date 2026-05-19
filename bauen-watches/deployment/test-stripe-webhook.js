#!/usr/bin/env node

/**
 * Stripe Webhook Configuration Validator
 * ======================================
 * 
 * Verifies that your Stripe webhook is correctly configured
 * 
 * Usage:
 *   node deployment/test-stripe-webhook.js [webhook_secret]
 * 
 * Example:
 *   node deployment/test-stripe-webhook.js whsec_test_1234567890
 * 
 * This script:
 *   1. Validates webhook secret format
 *   2. Creates a mock payment_intent.succeeded event
 *   3. Signs it with your webhook secret (like Stripe does)
 *   4. Sends it to your local/production webhook endpoint
 *   5. Verifies the response
 * 
 */

import crypto from 'crypto';
import https from 'https';

function createWebhookSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedContent = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedContent)
    .digest('hex');
  return {
    signature: `t=${timestamp},v1=${signature}`,
    timestamp,
  };
}

function createMockEvent() {
  return {
    id: 'evt_1234567890',
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test_1234567890',
        object: 'payment_intent',
        amount: 7999,
        amount_capturable: 0,
        amount_received: 7999,
        currency: 'eur',
        customer: null,
        description: 'Drift x1, Sway x1',
        metadata: {
          items: 'Drift x1, Sway x1',
          reservation_token: '550e8400-e29b-41d4-a716-446655440000',
        },
        status: 'succeeded',
        charges: {
          object: 'list',
          data: [
            {
              id: 'ch_1234567890',
              object: 'charge',
              amount: 7999,
              currency: 'eur',
              paid: true,
              status: 'succeeded',
            },
          ],
        },
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null,
    },
  };
}

function makeRequest(url, payload, signature) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : https;
    const parsedUrl = new URL(url);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': signature,
        'User-Agent': 'Bauen-Webhook-Tester/1.0',
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data,
          ok: res.statusCode >= 200 && res.statusCode < 300,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(payload);
    req.end();
  });
}

async function testWebhook(webhookSecret, targetUrl) {
  console.log('\n🔔 STRIPE WEBHOOK CONFIGURATION TESTER');
  console.log('═'.repeat(70));

  // Validate secret format
  if (!webhookSecret.startsWith('whsec_')) {
    console.error('❌ Invalid webhook secret format');
    console.error('   Webhook secrets should start with "whsec_"');
    console.error('   Found: ' + webhookSecret.substring(0, 20) + '...');
    return 1;
  }

  console.log(`✅ Webhook secret format valid`);
  console.log(`   Secret: ${webhookSecret.substring(0, 30)}...`);

  // Create mock event
  const mockEvent = createMockEvent();
  const payload = JSON.stringify(mockEvent);

  // Sign like Stripe would
  const { signature } = createWebhookSignature(payload, webhookSecret);

  console.log(`✅ Mock event created`);
  console.log(`   Event type: ${mockEvent.type}`);
  console.log(`   Reservation token: ${mockEvent.data.object.metadata.reservation_token}`);
  console.log(`   Amount: €${(mockEvent.data.object.amount / 100).toFixed(2)}`);

  // Send to webhook
  console.log(`\n📤 Sending test webhook to: ${targetUrl}`);
  console.log(`   Signature: ${signature.substring(0, 50)}...`);

  try {
    const response = await makeRequest(targetUrl, payload, signature);

    if (response.ok) {
      console.log(`\n✅ WEBHOOK ACCEPTED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${response.body.substring(0, 100)}`);
      console.log('\n✅ Your Stripe webhook is correctly configured!');
      console.log('\nNext steps:');
      console.log('  1. Verify in Stripe dashboard: https://dashboard.stripe.com/webhooks');
      console.log('  2. Check "Signed events" shows recent activity');
      console.log('  3. Test a real payment to confirm integration');
      return 0;
    } else {
      console.log(`\n❌ WEBHOOK REJECTED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${response.body}`);
      console.log('\nTroubleshooting:');
      console.log('  • Check nginx logs: sudo journalctl -u nginx -n 20');
      console.log('  • Verify backend is running: ps aux | grep node');
      console.log('  • Check webhook signature validation in server.js');
      console.log('  • Ensure STRIPE_WEBHOOK_SECRET is set in .env');
      return 1;
    }
  } catch (err) {
    console.log(`\n❌ WEBHOOK DELIVERY FAILED`);
    console.log(`   Error: ${err.message}`);
    console.log('\nTroubleshooting:');
    console.log('  • Is your domain accessible from the internet?');
    console.log('  • Is HTTPS certificate valid?');
    console.log(`  • Can you access the endpoint manually?`);
    console.log(`    curl -X POST ${targetUrl} -H "Content-Type: application/json"`);
    console.log('  • Check nginx is running: sudo systemctl status nginx');
    console.log('  • Check Node.js backend: sudo systemctl status node-bauen');
    return 1;
  }
}

// Main
const webhookSecret = process.argv[2];
const targetUrl = process.argv[3] || 'https://bauen-eyewear.com/api/stripe/webhook';

if (!webhookSecret) {
  console.error('Usage: node deployment/test-stripe-webhook.js [webhook_secret] [target_url]');
  console.error('\nExample:');
  console.error('  node deployment/test-stripe-webhook.js whsec_test_1234567890');
  console.error('  node deployment/test-stripe-webhook.js whsec_live_1234567890 https://bauen-eyewear.com/api/stripe/webhook');
  process.exit(1);
}

testWebhook(webhookSecret, targetUrl)
  .then((code) => {
    process.exit(code);
  })
  .catch((err) => {
    console.error('\n❌ Error testing webhook:', err.message);
    process.exit(1);
  });
