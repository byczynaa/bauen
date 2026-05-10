# Production Deployment Guide
# ============================
# 
# Complete instructions for deploying Bauen to production
# 
# Time estimate: 2-4 hours (mostly waiting for DNS/certificate)
#

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Domain name registered (e.g., bauen-eyewear.com)
- [ ] VPS/server with Ubuntu 20.04+ or Debian 11+
- [ ] SSH access to server
- [ ] Stripe account with live keys
- [ ] Supabase project created
- [ ] Node.js 20.19.0+ or 22.12.0+ (will install via script)

---

## Step 1: Prepare Secrets (Local Machine)

Run these commands on your local machine to generate required secrets:

### Generate Session Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Save output → will paste into .env.production

### Generate Admin Password Hash
```bash
node scripts/generate-secrets.js password
# Follow prompts to create and hash admin passcode
```
Save output → will paste into .env.production

### Get External Secrets

**Stripe Dashboard** (https://dashboard.stripe.com):
1. Go to Settings → API Keys
2. Copy your **Secret key** (sk_live_...)
3. Copy your **Publishable key** (pk_live_...)
4. Go to Webhooks
5. Click "Add endpoint"
6. URL: `https://bauen-eyewear.com/api/stripe/webhook`
7. Select events: 
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - payment_intent.canceled
8. Copy **Signing secret** (whsec_...)

**Supabase Console** (https://app.supabase.com):
1. Select your project
2. Go to Settings → API
3. Copy **Project URL** (https://xxxx.supabase.co)
4. Copy **Service Role Secret** (NOT the anon key!)

---

## Step 2: Create Production Environment File

On your local machine, copy the template:

```bash
cp .env.production.template .env.production
```

Edit `.env.production` and fill in all values:

```bash
# Use the values you collected above
NODE_ENV=production
FRONTEND_URL=https://bauen-eyewear.com
CORS_ORIGINS=https://bauen-eyewear.com

STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXX
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXX

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (paste full key)

INVENTORY_ADMIN_PASSWORD_HASH=$2b$10$... (from Step 1)
SESSION_SECRET=abcdef123456... (from Step 1)
```

Validate all secrets are present:
```bash
node scripts/generate-secrets.js validate
```

---

## Step 3: Set Up Production Server

SSH into your server:

```bash
ssh ubuntu@your-server-ip
```

### Install System Dependencies

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be 20.19.0+
npm --version

# Install Nginx
sudo apt-get install -y nginx

# Install Certbot (for Let's Encrypt SSL)
sudo apt-get install -y certbot python3-certbot-nginx

# Install Systemd service manager (usually pre-installed)
systemctl --version
```

### Create Application Directory

```bash
# Create directory
sudo mkdir -p /var/www/bauen-watches
sudo chown $USER:$USER /var/www/bauen-watches

# Navigate to it
cd /var/www/bauen-watches
```

---

## Step 4: Deploy Application Files

On your local machine, run the automated deployment:

```bash
# Ensure all files are built
npm run build

# Run deployment (edit deploy.sh if using custom paths)
bash deployment/deploy.sh production
```

This script will:
- ✅ Validate environment
- ✅ Build frontend
- ✅ Install dependencies
- ✅ Run pre-deployment tests
- ✅ Backup current deployment
- ✅ Copy files to production
- ✅ Set proper permissions

---

## Step 5: Configure HTTPS (TLS Certificate)

On your server:

### Configure DNS (First)

Before requesting certificate, point your domain to the server:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update DNS A record to your server IP:
   - Name: @ (root)
   - Type: A
   - Value: your-server-ip
3. Wait 15-30 minutes for propagation (check with `nslookup bauen-eyewear.com`)

### Configure Nginx

Copy and customize the nginx template:

```bash
sudo cp deployment/nginx.conf.template /etc/nginx/sites-available/bauen-watches
sudo nano /etc/nginx/sites-available/bauen-watches

# Replace these:
#   [YOUR_DOMAIN] → bauen-eyewear.com
#   [EMAIL] → your-email@example.com
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bauen-watches /etc/nginx/sites-enabled/

# Disable default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
# Output should say "test successful"

# Reload nginx
sudo systemctl reload nginx
```

### Get SSL Certificate

```bash
# Request certificate from Let's Encrypt
sudo certbot --nginx -d bauen-eyewear.com

# Follow prompts:
# 1. Enter your email
# 2. Agree to terms (A)
# 3. Choose to redirect HTTP to HTTPS (Yes)
# 4. Auto-renew enabled by default
```

Verify certificate:

```bash
sudo certbot certificates
# Should show your certificate with renewal date
```

---

## Step 6: Configure Node.js Service

Create systemd service file:

```bash
sudo cp deployment/node-bauen.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable node-bauen
sudo systemctl start node-bauen

# Check status
sudo systemctl status node-bauen
```

View logs:

```bash
sudo journalctl -u node-bauen -f
# Press Ctrl+C to exit
```

---

## Step 7: Configure Nginx to Serve Frontend

Update your nginx config to point to the correct frontend directory:

```bash
# The deploy.sh script copies frontend to /var/www/bauen-watches/dist
# Verify nginx config has:
# root /var/www/bauen-watches/dist;
```

Reload nginx:

```bash
sudo systemctl reload nginx
```

---

## Step 8: Verify Deployment

### Run Verification Script

On your local machine:

```bash
node deployment/verify-deployment.js bauen-eyewear.com
```

This checks:
- ✅ HTTPS redirect working
- ✅ Health endpoint responding
- ✅ Inventory API accessible
- ✅ Security headers present
- ✅ Frontend assets loading

### Manual Tests

Test from your local machine:

```bash
# Health check
curl https://bauen-eyewear.com/api/health

# Get public inventory
curl https://bauen-eyewear.com/api/inventory/public

# Test frontend
curl https://bauen-eyewear.com/
```

### Test Admin Login

In browser, go to: `https://bauen-eyewear.com/inventory-login`

Login with your admin passcode (set in Step 1)

---

## Step 9: Configure Stripe Webhook

### Test Webhook Endpoint

On your local machine:

```bash
node deployment/test-stripe-webhook.js whsec_live_XXXXX https://bauen-eyewear.com/api/stripe/webhook
```

If test passes, webhook is correctly configured.

### Monitor Webhook Events

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Click your endpoint
3. Verify "Signed events" show recent activity
4. Check that payment events are being processed

---

## Step 10: Final Checks & Monitoring

### Monitor Backend Logs

```bash
# On production server
sudo journalctl -u node-bauen -f

# Or watch nginx logs
sudo tail -f /var/log/nginx/bauen-watches-access.log
```

### Set Up Monitoring

Consider setting up:
- **Uptime Monitoring**: UptimeRobot, StatusPage, or similar
- **Error Tracking**: Sentry, Rollbar, or Datadog
- **Log Aggregation**: CloudWatch, ELK, or Loggly
- **Health Alerts**: Email/Slack notifications for downtime

### Test Complete Checkout Flow

1. Open `https://bauen-eyewear.com`
2. Add product to cart
3. Proceed to checkout
4. Use Stripe test card: `4242 4242 4242 4242`
5. Verify order confirmation page appears
6. Check Stripe Dashboard for payment record
7. Verify inventory was decremented

---

## Troubleshooting

### Backend Not Responding

```bash
# Check if service is running
sudo systemctl status node-bauen

# Check logs for errors
sudo journalctl -u node-bauen -n 50

# Manually start and debug
ssh into server
cd /var/www/bauen-watches
NODE_ENV=production node server.js
```

### HTTPS Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew manually (normally automatic)
sudo certbot renew --force-renewal

# Check nginx has certificate paths
sudo grep -A2 "ssl_certificate" /etc/nginx/sites-enabled/bauen-watches
```

### Database Connection Errors

```bash
# Verify Supabase credentials in .env
cat /var/www/bauen-watches/.env | grep SUPABASE

# Test connection from server
cd /var/www/bauen-watches
node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL)"
```

### Payment Processing Issues

```bash
# Check Stripe keys in environment
echo $STRIPE_SECRET_KEY

# Check webhook logs in Stripe Dashboard
# Developers → Webhooks → Your endpoint → Events

# Test webhook manually
node deployment/test-stripe-webhook.js whsec_live_XXXX https://bauen-eyewear.com/api/stripe/webhook
```

---

## Maintenance

### Log Rotation

Nginx and Node logs are automatically rotated. Check configuration:

```bash
sudo cat /etc/logrotate.d/nginx
```

### Certificate Renewal

Automatic renewal is enabled via Certbot. Verify:

```bash
# List renewal jobs
sudo systemctl list-timers

# Check renewal log
sudo journalctl -u certbot.service --no-pager
```

### Database Backups

Enable in Supabase Console:
1. Project Settings → Backups
2. Enable automated daily backups
3. Test restore procedure (on non-production)

### Updates & Security Patches

Monthly maintenance window:

```bash
# On production server
sudo apt-get update
sudo apt-get upgrade -y
sudo systemctl restart node-bauen
```

---

## Rollback Procedure

If deployment has critical issues:

```bash
# Restore from backup
sudo cp -r /var/www/bauen-watches-backup/[TIMESTAMP]/* /var/www/bauen-watches/

# Restart service
sudo systemctl restart node-bauen

# Verify restoration
curl https://bauen-eyewear.com/api/health
```

---

## Contact & Support

For issues:
- Check logs: `sudo journalctl -u node-bauen -n 100`
- Review error messages in `/var/log/nginx/bauen-watches-error.log`
- Test locally: `npm run dev:api`
- Check Stripe Dashboard for payment status
- Verify Supabase connection via Supabase Console

---

## Success Criteria

You're ready for traffic when:

- ✅ HTTPS working (no certificate warnings)
- ✅ All /api endpoints responding (200 status)
- ✅ Admin login working
- ✅ Inventory showing correct stock
- ✅ Payment test completes successfully
- ✅ Stripe webhook receiving events
- ✅ No errors in logs after 24 hours
- ✅ Response times under 2 seconds

Congratulations! Your Bauen platform is live! 🚀
