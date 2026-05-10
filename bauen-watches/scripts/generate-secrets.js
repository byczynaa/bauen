#!/usr/bin/env node

/**
 * Secret Rotation & Generation Utility
 * ====================================
 * 
 * Usage:
 *   node scripts/generate-secrets.js [command]
 * 
 * Commands:
 *   node scripts/generate-secrets.js session     → Generate new SESSION_SECRET
 *   node scripts/generate-secrets.js password    → Hash admin password (interactive)
 *   node scripts/generate-secrets.js all         → Generate all secrets at once
 *   node scripts/generate-secrets.js validate    → Validate existing .env file
 * 
 */

import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function generateSessionSecret() {
  const secret = crypto.randomBytes(32).toString('hex');
  console.log('\n📋 SESSION_SECRET (copy this):');
  console.log('═'.repeat(70));
  console.log(secret);
  console.log('═'.repeat(70));
  return secret;
}

async function generatePasswordHash() {
  const passcode = await prompt('\n🔐 Enter admin passcode: ');
  
  if (!passcode || passcode.length < 8) {
    console.error('❌ Passcode must be at least 8 characters');
    process.exit(1);
  }
  
  try {
    const hash = await bcryptjs.hash(passcode, 10);
    console.log('\n📋 INVENTORY_ADMIN_PASSWORD_HASH (copy this):');
    console.log('═'.repeat(70));
    console.log(hash);
    console.log('═'.repeat(70));
    console.log('\n✅ Keep this hash secure. Passcode cannot be recovered from hash.');
    return hash;
  } catch (err) {
    console.error('❌ Error hashing passcode:', err.message);
    process.exit(1);
  }
}

async function generateAllSecrets() {
  console.log('\n🔐 BAUEN SECRETS GENERATOR');
  console.log('═'.repeat(70));
  console.log('This utility generates production secrets for:');
  console.log('  • SESSION_SECRET (session signing key)');
  console.log('  • INVENTORY_ADMIN_PASSWORD_HASH (admin authentication)');
  console.log('\nKeep all secrets secure. Do not commit to git.');
  console.log('═'.repeat(70));
  
  const sessionSecret = await generateSessionSecret();
  const passwordHash = await generatePasswordHash();
  
  console.log('\n✅ SECRETS GENERATED');
  console.log('═'.repeat(70));
  console.log('\nNext steps:');
  console.log('  1. Copy the SESSION_SECRET to .env: SESSION_SECRET=<value>');
  console.log('  2. Copy the PASSWORD_HASH to .env: INVENTORY_ADMIN_PASSWORD_HASH=<value>');
  console.log('  3. Store these securely (1Password, AWS Secrets Manager, etc.)');
  console.log('  4. Get external secrets from Stripe and Supabase dashboards');
  console.log('  5. Fill remaining values in .env.production');
  console.log('  6. Run: npm run deploy:production');
  
  rl.close();
  process.exit(0);
}

function validateEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const envProdPath = path.join(__dirname, '..', '.env.production');
  
  let envContent = '';
  let filePath = '';
  
  if (fs.existsSync(envProdPath)) {
    envContent = fs.readFileSync(envProdPath, 'utf-8');
    filePath = '.env.production';
  } else if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
    filePath = '.env';
  } else {
    console.error('❌ No .env or .env.production file found');
    process.exit(1);
  }
  
  const required = [
    'NODE_ENV',
    'FRONTEND_URL',
    'STRIPE_SECRET_KEY',
    'VITE_STRIPE_PUBLIC_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'INVENTORY_ADMIN_PASSWORD_HASH',
    'SESSION_SECRET',
  ];
  
  const lines = envContent.split('\n');
  const envVars = {};
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, value] = trimmed.split('=');
    if (key) envVars[key] = value;
  });
  
  console.log(`\n🔍 Validating ${filePath}...`);
  console.log('═'.repeat(70));
  
  let allValid = true;
  required.forEach((key) => {
    const value = envVars[key];
    const isValid = value && !value.includes('[REQUIRED') && !value.includes('[YOUR_');
    const status = isValid ? '✅' : '❌';
    console.log(`${status} ${key}: ${isValid ? 'OK' : 'MISSING or PLACEHOLDER'}`);
    if (!isValid) allValid = false;
  });
  
  console.log('═'.repeat(70));
  
  if (allValid) {
    console.log('\n✅ All required secrets are present!');
    console.log('Ready to deploy with: npm run deploy:production');
  } else {
    console.log('\n❌ Some required secrets are missing.');
    console.log('Use: node scripts/generate-secrets.js all');
  }
  
  rl.close();
  process.exit(allValid ? 0 : 1);
}

async function main() {
  const command = process.argv[2] || 'all';
  
  switch (command) {
    case 'session':
      await generateSessionSecret();
      rl.close();
      process.exit(0);
      break;
    case 'password':
      await generatePasswordHash();
      rl.close();
      process.exit(0);
      break;
    case 'all':
      await generateAllSecrets();
      break;
    case 'validate':
      validateEnvFile();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log('\nUsage:');
      console.log('  node scripts/generate-secrets.js session    → Generate SESSION_SECRET');
      console.log('  node scripts/generate-secrets.js password   → Hash admin password');
      console.log('  node scripts/generate-secrets.js all        → Generate all secrets');
      console.log('  node scripts/generate-secrets.js validate   → Validate .env file');
      rl.close();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  rl.close();
  process.exit(1);
});
