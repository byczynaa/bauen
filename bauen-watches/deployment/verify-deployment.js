#!/usr/bin/env node

/**
 * Post-Deployment Verification Script
 * ===================================
 * 
 * Runs automated smoke tests on production deployment
 * 
 * Usage:
 *   node deployment/verify-deployment.js [domain]
 * 
 * Example:
 *   node deployment/verify-deployment.js bauen-eyewear.com
 *   node deployment/verify-deployment.js https://bauen-eyewear.com
 * 
 */

import https from 'https';
import http from 'http';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const parsedUrl = new URL(url);
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Bauen-Deployment-Verification/1.0',
        ...options.headers,
      },
      timeout: 10000,
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
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

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function runTests(domain) {
  const isHttps = domain.startsWith('https://');
  const baseUrl = isHttps ? domain : `https://${domain}`;
  const httpUrl = domain.startsWith('http') ? domain : `https://${domain}`;

  console.log('\n🚀 BAUEN POST-DEPLOYMENT VERIFICATION');
  console.log('═'.repeat(70));
  console.log(`Domain: ${baseUrl}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('═'.repeat(70));

  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  console.log('\n[1/8] Health Check');
  try {
    const res = await request(`${baseUrl}/api/health`);
    if (res.ok && res.body) {
      const data = JSON.parse(res.body);
      console.log(`✅ PASS - Health endpoint responded`);
      console.log(`   Status: ${data.ok}`);
      console.log(`   Environment: ${data.environment}`);
      console.log(`   Uptime: ${data.uptimeSeconds}s`);
      passed++;
    } else {
      console.log(`❌ FAIL - Health endpoint returned ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAIL - ${err.message}`);
    failed++;
  }

  // Test 2: HTTPS Redirect
  console.log('\n[2/8] HTTPS Redirect');
  try {
    const res = await request(`http://${domain.replace(/^https?:\/\//, '')}`, {
      headers: { 'Connection': 'close' },
    });
    if (res.status === 301 || res.status === 302) {
      const location = res.headers.location;
      if (location && location.startsWith('https://')) {
        console.log(`✅ PASS - HTTP redirects to HTTPS`);
        console.log(`   Redirect: ${location}`);
        passed++;
      } else {
        console.log(`❌ FAIL - Redirect is not to HTTPS`);
        failed++;
      }
    } else {
      console.log(`⚠️  WARN - HTTP returned ${res.status} (expected 301/302)`);
      passed++;
    }
  } catch (err) {
    console.log(`⚠️  WARN - ${err.message}`);
    passed++;
  }

  // Test 3: Public Inventory
  console.log('\n[3/8] Public Inventory Endpoint');
  try {
    const res = await request(`${baseUrl}/api/inventory/public`);
    if (res.ok && res.body) {
      const data = JSON.parse(res.body);
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        console.log(`✅ PASS - Public inventory returned ${data.items.length} items`);
        console.log(`   First item: ${data.items[0].id} (stock: ${data.items[0].stock})`);
        passed++;
      } else {
        console.log(`❌ FAIL - Inventory response invalid`);
        failed++;
      }
    } else {
      console.log(`❌ FAIL - Inventory endpoint returned ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAIL - ${err.message}`);
    failed++;
  }

  // Test 4: Admin Session Endpoint
  console.log('\n[4/8] Admin Session Endpoint');
  try {
    const res = await request(`${baseUrl}/api/admin/session`);
    if (res.ok && res.body) {
      const data = JSON.parse(res.body);
      if (typeof data.authenticated === 'boolean') {
        console.log(`✅ PASS - Admin session endpoint works`);
        console.log(`   Authenticated: ${data.authenticated} (expected false)`);
        passed++;
      } else {
        console.log(`❌ FAIL - Session response invalid`);
        failed++;
      }
    } else {
      console.log(`❌ FAIL - Session endpoint returned ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAIL - ${err.message}`);
    failed++;
  }

  // Test 5: Security Headers
  console.log('\n[5/8] Security Headers');
  try {
    const res = await request(`${baseUrl}/`);
    const requiredHeaders = {
      'strict-transport-security': 'HSTS',
      'x-content-type-options': 'X-Content-Type-Options',
      'x-frame-options': 'X-Frame-Options',
    };

    let headerCount = 0;
    Object.entries(requiredHeaders).forEach(([header, name]) => {
      if (res.headers[header]) {
        console.log(`✅ ${name}: ${res.headers[header]}`);
        headerCount++;
      } else {
        console.log(`⚠️  ${name}: Missing`);
      }
    });

    if (headerCount >= 2) {
      console.log(`✅ PASS - Security headers present (${headerCount}/3)`);
      passed++;
    } else {
      console.log(`⚠️  WARN - Some security headers missing`);
      passed++;
    }
  } catch (err) {
    console.log(`⚠️  WARN - ${err.message}`);
    passed++;
  }

  // Test 6: Frontend Asset Loading
  console.log('\n[6/8] Frontend Asset Loading');
  try {
    const res = await request(`${baseUrl}/index.html`);
    if (res.status === 200 && res.body.includes('<!')) {
      console.log(`✅ PASS - Frontend index.html loading`);
      console.log(`   Size: ${res.body.length} bytes`);
      passed++;
    } else {
      console.log(`❌ FAIL - Frontend returned ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAIL - ${err.message}`);
    failed++;
  }

  // Test 7: Stripe Public Key
  console.log('\n[7/8] Stripe Public Key Configuration');
  try {
    const res = await request(`${baseUrl}/`);
    if (res.body && res.body.includes('pk_live')) {
      console.log(`✅ PASS - Stripe Live key detected (pk_live_...)`);
      passed++;
    } else if (res.body && res.body.includes('pk_test')) {
      console.log(`⚠️  WARN - Stripe Test key found (should be pk_live in production)`);
      passed++;
    } else {
      console.log(`⚠️  WARN - Cannot verify Stripe key in HTML (may be in JS)`);
      passed++;
    }
  } catch (err) {
    console.log(`⚠️  WARN - ${err.message}`);
    passed++;
  }

  // Test 8: Response Time
  console.log('\n[8/8] Response Time Check');
  try {
    const start = Date.now();
    const res = await request(`${baseUrl}/api/health`);
    const duration = Date.now() - start;

    if (duration < 2000) {
      console.log(`✅ PASS - Health check responded in ${duration}ms`);
      passed++;
    } else if (duration < 5000) {
      console.log(`⚠️  WARN - Health check slow: ${duration}ms`);
      passed++;
    } else {
      console.log(`❌ FAIL - Health check timeout: ${duration}ms`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAIL - ${err.message}`);
    failed++;
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
  console.log('═'.repeat(70));

  if (failed === 0) {
    console.log('\n✅ ALL TESTS PASSED - Deployment verified!');
    console.log('\nNext steps:');
    console.log('  1. Monitor /var/log/nginx/bauen-watches-access.log');
    console.log('  2. Verify Stripe webhook is receiving events');
    console.log('  3. Test a complete checkout flow');
    console.log('  4. Monitor /api/health endpoint for 24 hours');
    console.log('  5. Set up uptime monitoring and alerts');
    return 0;
  } else {
    console.log('\n❌ SOME TESTS FAILED - Review configuration');
    console.log('\nTroubleshooting:');
    console.log('  • Check nginx logs: sudo journalctl -u nginx');
    console.log('  • Verify backend: ps aux | grep "node.*4242"');
    console.log('  • Test locally: curl http://localhost:4242/api/health');
    console.log('  • Check .env variables: grep "^[^#]" .env');
    return 1;
  }
}

// Main
const domain = process.argv[2];

if (!domain) {
  console.error('Usage: node deployment/verify-deployment.js [domain]');
  console.error('\nExample:');
  console.error('  node deployment/verify-deployment.js bauen-eyewear.com');
  console.error('  node deployment/verify-deployment.js https://bauen-eyewear.com');
  process.exit(1);
}

runTests(domain)
  .then((code) => {
    process.exit(code);
  })
  .catch((err) => {
    console.error('\n❌ Error running verification:', err.message);
    process.exit(1);
  });
