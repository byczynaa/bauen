# 🚀 Bauen E-Commerce Platform - Production Deployment

Complete production-ready deployment tooling and infrastructure configuration.

## Quick Start

### 1. Generate Secrets (Local Machine)

```bash
# Interactive setup - guides you through generating secrets
bash setup-production-secrets.sh

# Or use npm shortcut
npm run setup:secrets
```

This script:
- ✅ Generates SESSION_SECRET
- ✅ Hashes admin password with bcryptjs
- ✅ Creates .env.production template
- ✅ Guides you to collect Stripe and Supabase keys

### 2. Fill External Secrets

Edit `.env.production` and paste your external API keys:

```bash
nano .env.production
```

Values needed from:
- **Stripe Dashboard**: Secret key, Publishable key, Webhook secret
- **Supabase Console**: Project URL, Service Role Key

### 3. Validate Secrets

```bash
npm run validate:secrets
```

### 4. Deploy

```bash
npm run deploy
```

---

## Deployment Scripts

All scripts located in `deployment/` directory:

### `deploy.sh` — Main Deployment Script

Automates the entire deployment process:

```bash
bash deployment/deploy.sh production
```

**What it does:**
- ✅ Pre-deployment validation (Node version, secrets)
- ✅ Builds frontend (npm run build)
- ✅ Installs production dependencies
- ✅ Runs pre-deployment tests
- ✅ Backs up current deployment
- ✅ Deploys application files
- ✅ Restarts Node.js service
- ✅ Verifies backend health check

**Shortcut:**
```bash
npm run deploy
```

### `verify-deployment.js` — Post-Deployment Verification

Runs 8 automated smoke tests on production:

```bash
node deployment/verify-deployment.js bauen-eyewear.com
```

**Tests:**
- ✅ Health endpoint responding
- ✅ HTTPS redirect working
- ✅ Public inventory endpoint
- ✅ Admin session endpoint
- ✅ Security headers present
- ✅ Frontend assets loading
- ✅ Stripe Live keys configured
- ✅ Response time under 2 seconds

**Shortcut:**
```bash
npm run verify:deployment bauen-eyewear.com
```

### `test-stripe-webhook.js` — Webhook Testing

Tests that your Stripe webhook is correctly configured:

```bash
node deployment/test-stripe-webhook.js whsec_live_XXXXX
```

Creates a mock payment_intent.succeeded event and sends it to your webhook endpoint. Verifies signature validation and processing.

**Shortcut:**
```bash
npm run test:webhook whsec_live_XXXXX
```

### `generate-secrets.js` — Secret Generation Utility

Standalone secret generation:

```bash
# Generate session secret
node scripts/generate-secrets.js session

# Hash admin password
node scripts/generate-secrets.js password

# Generate all secrets
node scripts/generate-secrets.js all

# Validate .env file
node scripts/generate-secrets.js validate
```

**Shortcuts:**
```bash
npm run generate:secrets        # all
npm run validate:secrets        # validate
```

---

## Infrastructure Files

### `nginx.conf.template` — Reverse Proxy Configuration

Complete nginx configuration for production:

```bash
sudo cp deployment/nginx.conf.template /etc/nginx/sites-available/bauen-watches
sudo nano /etc/nginx/sites-available/bauen-watches
# Edit: [YOUR_DOMAIN] → your domain
# Edit: [EMAIL] → your email
sudo ln -s /etc/nginx/sites-available/bauen-watches /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

**Features:**
- ✅ HTTPS enforcement (HTTP → HTTPS redirect)
- ✅ Let's Encrypt integration
- ✅ Security headers (HSTS, X-Frame-Options, etc.)
- ✅ Gzip compression
- ✅ Static file caching
- ✅ API reverse proxy (to Node.js port 4242)
- ✅ WebSocket support (for Supabase realtime)
- ✅ Single-page app routing (React Router)
- ✅ Stripe webhook path handling

### `node-bauen.service` — Systemd Service Unit

Manages Node.js process as systemd service:

```bash
sudo cp deployment/node-bauen.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable node-bauen
sudo systemctl start node-bauen
```

**Features:**
- ✅ Auto-restart on failure
- ✅ Automatic startup on server reboot
- ✅ Resource limits (512M RAM, 50% CPU)
- ✅ Security hardening (NoNewPrivileges, ProtectHome)
- ✅ Journal logging (viewable via systemctl)
- ✅ Health check support

**Monitor:**
```bash
sudo systemctl status node-bauen
sudo journalctl -u node-bauen -f
```

---

## Configuration Files

### `.env.production.template`

Template for production environment configuration:

```bash
cp .env.production.template .env.production
nano .env.production
```

**Required Variables:**
- `NODE_ENV=production`
- `FRONTEND_URL=https://yourdomain.com`
- `STRIPE_SECRET_KEY=sk_live_...` (from Stripe Dashboard)
- `VITE_STRIPE_PUBLIC_KEY=pk_live_...` (from Stripe Dashboard)
- `STRIPE_WEBHOOK_SECRET=whsec_...` (from Stripe Webhooks)
- `SUPABASE_URL=https://xxx.supabase.co` (from Supabase)
- `SUPABASE_SERVICE_ROLE_KEY=...` (from Supabase Settings)
- `SESSION_SECRET=...` (generated via script)
- `INVENTORY_ADMIN_PASSWORD_HASH=...` (generated via script)

---

## Documentation

### `PRODUCTION_DEPLOYMENT.md` — Complete Step-by-Step Guide

Full deployment walkthrough with all prerequisite checks, server setup, HTTPS configuration, and troubleshooting:

- 📋 Prerequisites checklist
- 🔑 Secret generation instructions
- 🖥️ Server setup (Node.js, Nginx, Certbot)
- 🔒 HTTPS/TLS certificate configuration
- 🚀 Application deployment
- ✅ Verification steps
- 🔧 Troubleshooting guide
- 🔄 Monitoring and maintenance
- ↩️ Rollback procedures

**Read before deploying:**
```bash
less PRODUCTION_DEPLOYMENT.md
```

### `PRE_LAUNCH_CHECKLIST.md` — Pre-Launch Verification

Comprehensive checklist with:
- ✅ All verification test results
- ✅ Security assessment
- ✅ Production readiness status
- ✅ Blocking items (external infrastructure)
- ✅ Go/no-go decision framework

---

## Typical Deployment Flow

### Day 1: Preparation (Local Machine)

```bash
# 1. Generate all secrets
npm run setup:secrets
# Follow prompts, save output

# 2. Collect external secrets from Stripe & Supabase
# Go to dashboards and copy API keys

# 3. Fill .env.production
nano .env.production
# Paste all external secrets

# 4. Validate
npm run validate:secrets

# 5. Build frontend
npm run build
```

### Day 2: Infrastructure Setup (Server)

```bash
# 1. SSH into server
ssh ubuntu@your-server-ip

# 2. Install dependencies
sudo apt-get update && sudo apt-get upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx

# 3. Create app directory
sudo mkdir -p /var/www/bauen-watches
sudo chown $USER:$USER /var/www/bauen-watches

# 4. Setup DNS (point domain to server IP)
# Wait for propagation (~15-30 min)
nslookup bauen-eyewear.com
```

### Day 3: Deployment (Server)

```bash
# 1. Deploy from local machine
npm run deploy

# 2. Configure Nginx on server
sudo cp deployment/nginx.conf.template /etc/nginx/sites-available/bauen-watches
sudo nano /etc/nginx/sites-available/bauen-watches
# Replace [YOUR_DOMAIN] and [EMAIL]

# 3. Enable Nginx and get SSL cert
sudo ln -s /etc/nginx/sites-available/bauen-watches /etc/nginx/sites-enabled/
sudo certbot --nginx -d bauen-eyewear.com

# 4. Start Node.js service
sudo systemctl start node-bauen
sudo systemctl enable node-bauen

# 5. Verify deployment (from local machine)
npm run verify:deployment bauen-eyewear.com

# 6. Test Stripe webhook
npm run test:webhook whsec_live_XXXXX
```

---

## Monitoring & Maintenance

### View Logs

```bash
# Node.js backend
sudo journalctl -u node-bauen -f

# Nginx access logs
sudo tail -f /var/log/nginx/bauen-watches-access.log

# Nginx errors
sudo tail -f /var/log/nginx/bauen-watches-error.log
```

### Verify Health

```bash
# From local machine
curl https://bauen-eyewear.com/api/health

# From server
curl http://localhost:4242/api/health
```

### Monitor Stripe Webhooks

Stripe Dashboard → Developers → Webhooks → Your Endpoint
- Check "Signed events" to see recent webhook activity
- Review any failed deliveries

### Certificate Renewal

Automatic renewal enabled. Verify:

```bash
sudo certbot certificates
sudo systemctl list-timers | grep certbot
```

### Regular Updates

```bash
# Monthly maintenance
sudo apt-get update && sudo apt-get upgrade -y

# Restart services
sudo systemctl restart node-bauen
sudo systemctl reload nginx

# Verify still working
curl https://bauen-eyewear.com/api/health
```

---

## Troubleshooting

### Backend Not Responding (502 Bad Gateway)

```bash
# Check if service is running
sudo systemctl status node-bauen

# View recent logs
sudo journalctl -u node-bauen -n 50

# Check port 4242 is listening
sudo netstat -tlnp | grep 4242

# Check .env variables
cat /var/www/bauen-watches/.env | grep -v "^#"
```

### HTTPS Certificate Issues

```bash
# View certificates
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check nginx has correct paths
sudo grep ssl_certificate /etc/nginx/sites-enabled/bauen-watches
```

### Database Connection Errors

```bash
# Verify Supabase credentials
cat /var/www/bauen-watches/.env | grep SUPABASE

# Test connection
node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL)"
```

### Payment Processing Not Working

```bash
# Check Stripe keys in environment
echo $STRIPE_SECRET_KEY

# View webhook events in Stripe Dashboard
# Developers → Webhooks → Your endpoint → Events

# Test webhook locally
npm run test:webhook whsec_live_XXXXX
```

---

## Environment Variables Reference

### Required (Must Set)

| Variable | Example | Source |
|----------|---------|--------|
| `NODE_ENV` | `production` | Code requirement |
| `FRONTEND_URL` | `https://bauen-eyewear.com` | Your domain |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe Dashboard → API Keys |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_...` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Dashboard → Webhooks |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Console → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase Console → Settings → API |
| `SESSION_SECRET` | `(random hex)` | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `INVENTORY_ADMIN_PASSWORD_HASH` | `$2b$10$...` | Generate with: `node scripts/generate-secrets.js password` |

### Optional (Have Defaults)

| Variable | Default | Purpose |
|----------|---------|---------|
| `CORS_ORIGINS` | `FRONTEND_URL` | Comma-separated list of allowed origins |
| `ADMIN_LOGIN_WINDOW_MS` | `600000` | Rate limit window (10 min) |
| `ADMIN_LOGIN_MAX_REQUESTS` | `8` | Max login attempts per window |
| `PAYMENT_INTENT_WINDOW_MS` | `60000` | Payment rate limit window (60 sec) |
| `PAYMENT_INTENT_MAX_REQUESTS` | `20` | Max payment intents per window |

---

## Rollback

If critical issue occurs:

```bash
# Restore backup
sudo cp -r /var/www/bauen-watches-backup/[TIMESTAMP]/* /var/www/bauen-watches/

# Restart service
sudo systemctl restart node-bauen

# Verify
curl https://bauen-eyewear.com/api/health
```

---

## Security Notes

🔒 **Never commit secrets to git:**
```bash
# .gitignore includes:
.env
.env.*
node_modules/
dist/
```

🔒 **Rotate secrets periodically (quarterly recommended):**
- `SESSION_SECRET`: Generate new, update .env, restart service
- `INVENTORY_ADMIN_PASSWORD_HASH`: Hash new password, update .env, restart
- `STRIPE_SECRET_KEY`: Rotate in Stripe Dashboard, update .env
- `SUPABASE_SERVICE_ROLE_KEY`: Rotate in Supabase Settings, update .env

🔒 **If secrets are exposed:**
1. Regenerate immediately
2. Rotate all API keys
3. Review access logs for abuse
4. Update .env and restart services

---

## Contact & Support

For deployment issues:
1. Check relevant logs (see "View Logs" section above)
2. Review "Troubleshooting" section
3. Run `npm run verify:deployment bauen-eyewear.com` to diagnose
4. Consult `PRODUCTION_DEPLOYMENT.md` for detailed guides
5. Check `PRE_LAUNCH_CHECKLIST.md` for verification test results

---

## Success Indicators

✅ You're ready for production traffic when:

- [ ] `npm run verify:deployment` passes all 8 tests
- [ ] `npm run test:webhook` shows webhook accepted
- [ ] Admin login working at `https://yourdomain.com/inventory-login`
- [ ] Inventory showing correct stock with preview images
- [ ] Full test checkout completes (Stripe test card: 4242 4242 4242 4242)
- [ ] Stripe webhook receiving real payment events
- [ ] No 5xx errors in logs after 24 hours
- [ ] Response times consistently under 2 seconds
- [ ] HTTPS certificate valid and auto-renewing

---

**Last Updated**: 2026-05-09  
**Status**: Production-Ready  
**Next Steps**: Follow `PRODUCTION_DEPLOYMENT.md` for complete deployment guide
