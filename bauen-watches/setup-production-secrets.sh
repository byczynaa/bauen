#!/bin/bash

# Quick Setup Script for Production Secrets
# ==========================================
# 
# This script helps you quickly generate all required production secrets
# and guide you through getting external API keys
#
# Run on your local machine:
#   bash setup-production-secrets.sh
#

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}   BAUEN PRODUCTION SECRETS SETUP${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

# Generate Session Secret
echo -e "\n${YELLOW}[1/4] Generating SESSION_SECRET${NC}"
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo -e "${GREEN}✓ Session Secret: ${SESSION_SECRET}${NC}"

# Generate Admin Password Hash
echo -e "\n${YELLOW}[2/4] Generating Admin Password Hash${NC}"
echo "Enter your admin passcode (min 8 characters):"
read -s ADMIN_PASSCODE
echo ""

if [ ${#ADMIN_PASSCODE} -lt 8 ]; then
  echo -e "${RED}❌ Passcode must be at least 8 characters${NC}"
  exit 1
fi

ADMIN_HASH=$(node -e "require('bcryptjs').hash('$ADMIN_PASSCODE', 10).then(h => console.log(h))")
echo -e "${GREEN}✓ Admin Hash: ${ADMIN_HASH}${NC}"

# Collect domain and other variables
echo -e "\n${YELLOW}[3/4] Configuration Information${NC}"
echo "Enter your production domain (e.g., bauen-eyewear.com):"
read DOMAIN

echo "Enter your email (for Let's Encrypt notifications):"
read EMAIL

# Display what to collect next
echo -e "\n${YELLOW}[4/4] Next Steps - Collect External Secrets${NC}"
echo -e "\n${BLUE}From Stripe Dashboard:${NC}"
echo "  1. Go to https://dashboard.stripe.com/apikeys"
echo "  2. Copy Secret key (sk_live_...)"
echo "  3. Copy Publishable key (pk_live_...)"
echo "  4. Go to Webhooks → Add endpoint"
echo "  5. URL: https://${DOMAIN}/api/stripe/webhook"
echo "  6. Select: payment_intent.succeeded, payment_intent.payment_failed, payment_intent.canceled"
echo "  7. Copy Signing secret (whsec_...)"

echo -e "\n${BLUE}From Supabase Console:${NC}"
echo "  1. Go to https://app.supabase.com/projects"
echo "  2. Select your project → Settings → API"
echo "  3. Copy Project URL (https://xxxx.supabase.co)"
echo "  4. Copy Service Role Secret (NOT anon key)"

# Create .env.production file
echo -e "\n${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}Creating .env.production...${NC}"

cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production

# Domain Configuration
FRONTEND_URL=https://${DOMAIN}
CORS_ORIGINS=https://${DOMAIN}

# Stripe Live Keys (GET FROM STRIPE DASHBOARD)
STRIPE_SECRET_KEY=sk_live_[PASTE_YOUR_SECRET_KEY_HERE]
VITE_STRIPE_PUBLIC_KEY=pk_live_[PASTE_YOUR_PUBLISHABLE_KEY_HERE]
STRIPE_WEBHOOK_SECRET=whsec_[PASTE_YOUR_WEBHOOK_SECRET_HERE]

# Supabase Configuration (GET FROM SUPABASE CONSOLE)
SUPABASE_URL=https://[PASTE_YOUR_PROJECT_URL_HERE].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[PASTE_YOUR_SERVICE_ROLE_KEY_HERE]

# Generated Secrets (ALREADY FILLED)
SESSION_SECRET=${SESSION_SECRET}
INVENTORY_ADMIN_PASSWORD_HASH=${ADMIN_HASH}

# Email for certificate renewal
CERTBOT_EMAIL=${EMAIL}
EOF

chmod 600 .env.production

echo -e "${GREEN}✓ Created .env.production${NC}"
echo -e "\n${YELLOW}IMPORTANT: Edit .env.production and paste your external keys:${NC}"
echo -e "  nano .env.production"
echo -e "\n${YELLOW}Generated values (already in file):${NC}"
echo -e "  SESSION_SECRET=${SESSION_SECRET}"
echo -e "  INVENTORY_ADMIN_PASSWORD_HASH=${ADMIN_HASH}"

echo -e "\n${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

echo -e "\nNext steps:"
echo -e "  1. Edit .env.production and fill in Stripe and Supabase keys"
echo -e "  2. Run: node scripts/generate-secrets.js validate"
echo -e "  3. Run: npm run build"
echo -e "  4. Run: bash deployment/deploy.sh production"
echo -e "  5. SSH into your server and follow PRODUCTION_DEPLOYMENT.md"
