# Production Deployment Toolkit - What I Created For You

All automation and documentation needed to deploy to production. Just provide the external API keys and you're done.

## 📁 New Files Created

### Executable Scripts

| File | Purpose | Run With |
|------|---------|----------|
| `scripts/generate-secrets.js` | Generate SESSION_SECRET, hash passwords, validate .env | `npm run generate:secrets` |
| `deployment/deploy.sh` | Automated deployment (builds, installs, deploys, restarts) | `npm run deploy` |
| `deployment/verify-deployment.js` | 8-test post-deployment verification suite | `npm run verify:deployment bauen-eyewear.com` |
| `deployment/test-stripe-webhook.js` | Webhook signature validation tester | `npm run test:webhook whsec_live_XXXX` |
| `setup-production-secrets.sh` | Interactive secret generation guide | `bash setup-production-secrets.sh` |

### Configuration Templates

| File | Purpose |
|------|---------|
| `.env.production.template` | Environment variables template (fill in blanks) |
| `deployment/nginx.conf.template` | Nginx reverse proxy config (edit domain name) |
| `deployment/node-bauen.service` | Systemd service for auto-restart & monitoring |

### Documentation

| File | When to Read |
|------|--------------|
| `PRODUCTION_READY.md` | Overview of all deployment tools & quick start |
| `PRODUCTION_DEPLOYMENT.md` | Step-by-step deployment guide (most detailed) |
| `QUICK_DEPLOY.md` | 30-minute checklist for fast deployment |
| `PRE_LAUNCH_CHECKLIST.md` | Verification test results & readiness assessment |

---

## 🚀 Quick Start Path

### Step 1: Local Machine - Generate Secrets

```bash
npm run setup:secrets
# Follows interactive prompts
# Creates .env.production template
```

### Step 2: Collect External Secrets

**From Stripe Dashboard:**
- Secret key (sk_live_...)
- Publishable key (pk_live_...)
- Webhook secret (whsec_...)

**From Supabase Console:**
- Project URL (https://xxx.supabase.co)
- Service Role Key

### Step 3: Fill .env.production

```bash
nano .env.production
# Paste all external secrets collected in Step 2
```

### Step 4: Validate

```bash
npm run validate:secrets
# Should show: ✅ All required secrets are present!
```

### Step 5: Deploy

```bash
npm run deploy
# Automates: build → install → test → backup → deploy → restart
```

### Step 6: Configure Server

SSH into server and follow `PRODUCTION_DEPLOYMENT.md`:
- Install Node.js, Nginx, Certbot
- Set up HTTPS certificate
- Start application service

### Step 7: Verify

```bash
npm run verify:deployment bauen-eyewear.com
# 8 automated tests: health, HTTPS, inventory, headers, etc.
```

---

## 📋 What Each Script Does

### `scripts/generate-secrets.js`

**Commands:**
```bash
node scripts/generate-secrets.js session    # Generate SESSION_SECRET
node scripts/generate-secrets.js password   # Hash admin password
node scripts/generate-secrets.js all        # Both
node scripts/generate-secrets.js validate   # Check .env file
```

**Output:**
- Generates cryptographically secure random values
- Hashes passwords with bcryptjs (10 rounds)
- Validates .env file doesn't have placeholders
- Guides you through each step

### `deployment/deploy.sh`

**What it does:**
1. ✅ Validates Node version meets requirement (20.19.0+)
2. ✅ Checks `.env.production` has no placeholders
3. ✅ Runs `npm run build` (frontend)
4. ✅ Installs `npm ci --production` (lean dependencies)
5. ✅ Tests that app starts without errors
6. ✅ Backs up current deployment to `/var/www/bauen-watches-backup/`
7. ✅ Copies files to `/var/www/bauen-watches/`
8. ✅ Sets permissions (www-data user)
9. ✅ Restarts Node.js service
10. ✅ Verifies backend responds

**What you do before running:**
- Fill `.env.production` with all secrets
- Run `npm run build` locally (creates `dist/`)

### `deployment/verify-deployment.js`

**8 Tests:**
1. Health endpoint responding
2. HTTP redirects to HTTPS
3. Public inventory endpoint working
4. Admin session endpoint accessible
5. Security headers present
6. Frontend assets loading (index.html)
7. Stripe Live keys configured
8. Response time acceptable (<2 seconds)

**Usage:**
```bash
node deployment/verify-deployment.js bauen-eyewear.com
# Takes ~30 seconds
# Returns 0 if all pass, 1 if failures
```

### `deployment/test-stripe-webhook.js`

**What it does:**
1. Validates webhook secret format (must start with `whsec_`)
2. Creates mock `payment_intent.succeeded` event
3. Signs it with your webhook secret (like Stripe does)
4. Sends to your webhook endpoint
5. Verifies signature validation passed

**Usage:**
```bash
node deployment/test-stripe-webhook.js whsec_live_XXXXX https://bauen-eyewear.com/api/stripe/webhook
```

**Output:**
- ✅ WEBHOOK ACCEPTED (200 response)
- ❌ WEBHOOK REJECTED (with error details)

### `setup-production-secrets.sh`

**Interactive script that:**
1. Generates SESSION_SECRET
2. Prompts for admin passcode → hashes it
3. Asks for domain and email
4. Creates `.env.production` with generated values
5. Shows you what to collect from Stripe/Supabase dashboards

**Usage:**
```bash
bash setup-production-secrets.sh
# Or
npm run setup:secrets
```

---

## 🔧 Configuration Files

### `nginx.conf.template`

Complete production-ready Nginx configuration:
- ✅ HTTP to HTTPS redirect
- ✅ SSL/TLS with Let's Encrypt paths
- ✅ Security headers (HSTS, X-Frame-Options, etc.)
- ✅ Gzip compression
- ✅ Static file caching (1 year expiry)
- ✅ API reverse proxy to localhost:4242
- ✅ WebSocket support (Supabase realtime)
- ✅ Single-page app routing (React Router)
- ✅ Stripe webhook path handling

**To use:**
```bash
sudo cp deployment/nginx.conf.template /etc/nginx/sites-available/bauen-watches
sudo nano /etc/nginx/sites-available/bauen-watches
# Replace [YOUR_DOMAIN] with your domain
# Replace [EMAIL] with your email
sudo ln -s /etc/nginx/sites-available/bauen-watches /etc/nginx/sites-enabled/
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

### `node-bauen.service`

Systemd service unit for running Node.js as a service:
- ✅ Starts on boot
- ✅ Auto-restarts on failure
- ✅ Resource limits (512M RAM, 50% CPU)
- ✅ Security hardening
- ✅ Logs to systemd journal

**To use:**
```bash
sudo cp deployment/node-bauen.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start node-bauen
sudo systemctl enable node-bauen
```

### `.env.production.template`

Template with all required variables and detailed comments:
- Clear explanations of each variable
- Where to get external secrets
- Security notes
- Example format for each value

---

## 📖 Documentation Files

### `PRODUCTION_READY.md` (Start Here)

Overview of entire toolkit:
- Quick start (3 steps)
- What each script does
- What each config file does
- Typical deployment flow
- Monitoring & maintenance
- Troubleshooting guide
- Security notes
- Environment variables reference

**Read time:** 10-15 minutes

### `PRODUCTION_DEPLOYMENT.md` (Most Detailed)

Complete step-by-step guide with prerequisites, server setup, HTTPS configuration:
- 🎯 Prerequisites checklist
- 🔑 Step 1: Generate secrets locally
- 📤 Step 2: Collect external secrets
- 🖥️ Step 3: Set up production server
- 🚀 Step 4: Deploy application
- 🔒 Step 5: Configure HTTPS
- 🆙 Step 6: Configure Node.js service
- ✅ Step 7: Verify deployment
- 🔧 Step 8: Configure Stripe webhook
- 🔍 Step 9: Final verification
- 📊 Step 10: Set up monitoring
- ↩️ Rollback procedures

**Read time:** 30-40 minutes

### `QUICK_DEPLOY.md` (Fast Reference)

Condensed checklist for fast deployment:
- 30-minute deployment checklist
- Phase-by-phase breakdown
- Quick troubleshooting
- Health check commands
- File checklist

**Read time:** 5 minutes

### `PRE_LAUNCH_CHECKLIST.md` (Status Report)

Comprehensive pre-launch assessment:
- Executive summary (GO/NO-GO status)
- Verification test results
- Security assessment matrix
- Production checklist (blocking items)
- Environment configuration template
- Version information

**Read time:** 20-30 minutes

---

## npm Scripts (Added to package.json)

```bash
npm run setup:secrets          # Interactive secret generation
npm run generate:secrets       # Generate all secrets
npm run validate:secrets       # Check .env file
npm run test:webhook XXXX      # Test Stripe webhook
npm run verify:deployment DOMAIN  # Post-deployment verification
npm run deploy                 # Main deployment automation
```

---

## 🎯 Your Next Steps

1. **Run the secret setup script:**
   ```bash
   npm run setup:secrets
   ```

2. **Collect external secrets from:**
   - Stripe Dashboard (sk_live_, pk_live_, whsec_)
   - Supabase Console (Project URL, Service Role Key)

3. **Fill in .env.production:**
   ```bash
   nano .env.production
   ```

4. **Validate secrets:**
   ```bash
   npm run validate:secrets
   ```

5. **When ready to deploy:**
   ```bash
   npm run deploy
   ```

6. **Configure server** (follow PRODUCTION_DEPLOYMENT.md):
   - SSH to server
   - Install Node.js, Nginx, Certbot
   - Set up HTTPS
   - Start Node.js service

7. **Verify deployment:**
   ```bash
   npm run verify:deployment bauen-eyewear.com
   ```

---

## 🔐 Security Reminders

✅ **Never commit `.env.production` to git** (already in .gitignore)
✅ **Rotate secrets quarterly** using the generation scripts
✅ **If any secret is exposed**, regenerate immediately
✅ **Use secure storage** (AWS Secrets Manager, GitHub Secrets, 1Password)
✅ **Backup current deployment** (deploy.sh does this automatically)

---

## 📊 Status

| Item | Status |
|------|--------|
| Codebase Security | ✅ Production-Ready |
| Payment Processing | ✅ Verified Working |
| Database Persistence | ✅ Supabase Integrated |
| Admin Authentication | ✅ Rate-Limited |
| Rate Limiting | ✅ Enforced |
| Pre-Launch Tests | ✅ All Passed |
| Deployment Automation | ✅ Complete |
| Infrastructure Templates | ✅ Complete |
| Documentation | ✅ Comprehensive |

---

## 📞 Need Help?

1. **Before deploying**: Read `PRODUCTION_DEPLOYMENT.md` (step-by-step)
2. **Quick reference**: Check `QUICK_DEPLOY.md` (30-min checklist)
3. **After deployment**: Run `npm run verify:deployment bauen-eyewear.com`
4. **Troubleshooting**: See documentation files for common issues
5. **Monitoring**: Use `sudo journalctl -u node-bauen -f` for logs

---

**You're all set!** Everything you need is in this toolkit. Just provide the external API keys and you can launch to production in ~1 hour.
