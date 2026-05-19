# Production Deployment Quick Reference

## 🚀 30-Minute Deployment Checklist

Use this after you have all secrets ready.

### Prerequisites (Before You Start)
- [ ] `.env.production` created with all secrets filled in
- [ ] `npm run validate:secrets` passes
- [ ] Server with Ubuntu 20.04+, Node.js 20.19.0+, 2GB RAM, 20GB storage
- [ ] Domain registered and DNS ready to update
- [ ] Stripe and Supabase accounts with live keys
- [ ] Email address for Let's Encrypt SSL certificate

### Phase 1: Local Preparation (5 min)

```bash
# 1. Build frontend
npm run build

# 2. Deploy application
npm run deploy
```

### Phase 2: Server Setup (15 min)

```bash
# SSH into server
ssh ubuntu@your-server-ip

# 1. Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Nginx and Certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 4. Create application directory
sudo mkdir -p /var/www/bauen-watches
sudo chown $USER:$USER /var/www/bauen-watches

# 5. UPDATE DNS RECORDS
# Go to your domain registrar and point A record to server IP
# Example: bauen-eyewear.com A 123.45.67.89
# Wait 15-30 minutes for DNS propagation
nslookup bauen-eyewear.com  # Verify DNS is working
```

### Phase 3: HTTPS Setup (5 min)

```bash
# Back on server

# 1. Copy Nginx config
sudo cp /home/$USER/bauen-watches/deployment/nginx.conf.template /etc/nginx/sites-available/bauen-watches

# 2. Edit it
sudo nano /etc/nginx/sites-available/bauen-watches
# Replace: [YOUR_DOMAIN] with bauen-eyewear.com
# Replace: [EMAIL] with your@email.com

# 3. Enable site
sudo ln -s /etc/nginx/sites-available/bauen-watches /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# 4. Test Nginx
sudo nginx -t
# Should output: "test successful"

# 5. Get SSL certificate
sudo certbot --nginx -d bauen-eyewear.com
# Follow prompts

# 6. Reload Nginx
sudo systemctl reload nginx
```

### Phase 4: Start Application (5 min)

```bash
# Back on server

# 1. Copy systemd service
sudo cp /home/$USER/bauen-watches/deployment/node-bauen.service /etc/systemd/system/

# 2. Start service
sudo systemctl daemon-reload
sudo systemctl enable node-bauen
sudo systemctl start node-bauen

# 3. Check status
sudo systemctl status node-bauen

# 4. Verify backend
curl http://localhost:4242/api/health
```

### Phase 5: Verification (No time limit, but ~5 min)

```bash
# Back on local machine

# 1. Test deployment
npm run verify:deployment bauen-eyewear.com
# Should show: ✅ ALL TESTS PASSED

# 2. Test Stripe webhook
npm run test:webhook whsec_live_YOUR_WEBHOOK_SECRET
# Should show: ✅ WEBHOOK ACCEPTED

# 3. Manual tests
curl https://bauen-eyewear.com/api/health
curl https://bauen-eyewear.com/api/inventory/public
```

### Phase 6: Go Live

```bash
# 1. Test admin login
# https://bauen-eyewear.com/inventory-login
# Login with your admin passcode

# 2. Test checkout (use Stripe test card)
# https://bauen-eyewear.com/product/101
# Add to cart → Checkout
# Card: 4242 4242 4242 4242 (expiry: any future date, CVC: any 3 digits)

# 3. Verify inventory decremented
# /inventory-login → check stock was decremented

# 4. Check Stripe Dashboard
# https://dashboard.stripe.com/payments
# Verify payment appears

# 5. Monitor logs for 24 hours
sudo journalctl -u node-bauen -f
```

---

## 🆘 Quick Troubleshooting

### "Connection Refused" (502 Bad Gateway)
```bash
sudo systemctl status node-bauen
sudo journalctl -u node-bauen -n 20
```

### "Certificate Not Found"
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

### "Stripe Webhook Not Firing"
```bash
npm run test:webhook whsec_live_YOUR_SECRET
# Check Stripe Dashboard → Webhooks → Events
```

### "Admin Login Not Working"
```bash
# Check credentials
echo $INVENTORY_ADMIN_PASSWORD_HASH
# Verify bcryptjs hash is correct format ($2b$10$...)
```

### "Payment Failing"
```bash
# Check Stripe keys
grep STRIPE_ /var/www/bauen-watches/.env
# Verify sk_live_ (not sk_test_)
# Check webhook is configured in Stripe Dashboard
```

---

## 📊 Health Check Commands

```bash
# Is backend running?
curl https://bauen-eyewear.com/api/health

# Is HTTPS working?
curl -I https://bauen-eyewear.com/

# Are security headers present?
curl -I https://bauen-eyewear.com/ | grep -i "strict-transport"

# Is inventory accessible?
curl https://bauen-eyewear.com/api/inventory/public

# Are logs clean?
sudo journalctl -u node-bauen --since "5 minutes ago" | grep -i error
```

---

## 📋 Files You Need

### Before Deploying (from project root)
- ✅ `.env.production` (filled with all secrets)
- ✅ `deployment/deploy.sh` (automation script)
- ✅ `deployment/nginx.conf.template` (web server config)
- ✅ `deployment/node-bauen.service` (process manager)

### After Building Locally
- ✅ `dist/` (frontend build)
- ✅ `node_modules/` (dependencies)
- ✅ `server.js` (backend)
- ✅ `inventoryStore.js` (database layer)

---

## 🔐 Secret Checklist

Before Phase 1, ensure you have:

- [ ] `SESSION_SECRET` - Random 64-char hex string
- [ ] `INVENTORY_ADMIN_PASSWORD_HASH` - bcryptjs hash
- [ ] `STRIPE_SECRET_KEY` - sk_live_... (from Stripe)
- [ ] `VITE_STRIPE_PUBLIC_KEY` - pk_live_... (from Stripe)
- [ ] `STRIPE_WEBHOOK_SECRET` - whsec_... (from Stripe Webhooks)
- [ ] `SUPABASE_URL` - https://xxx.supabase.co
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - From Supabase Settings
- [ ] `FRONTEND_URL` - https://your-domain.com

All must be in `.env.production` before starting Phase 1.

---

## 📞 Getting Help

1. **Pre-deployment**: Read `PRODUCTION_DEPLOYMENT.md` for detailed steps
2. **During deployment**: Check troubleshooting section above
3. **After deployment**: Run `npm run verify:deployment bauen-eyewear.com`
4. **Stripe issues**: Check Stripe Dashboard → Developers → Webhooks
5. **Database issues**: Check Supabase Console → SQL Editor for errors
6. **Logs**: `sudo journalctl -u node-bauen -f` for real-time monitoring

---

**Estimated total time: 30-45 minutes** (plus DNS propagation wait)

Good luck! 🚀
