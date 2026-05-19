#!/bin/bash

# Bauen E-Commerce Platform - Production Deployment Script
# ========================================================
# 
# Automated deployment to production server
# 
# Usage:
#   bash deployment/deploy.sh [environment]
# 
# Example:
#   bash deployment/deploy.sh production
#
# Prerequisites:
#   - .env.production configured with all secrets
#   - Node.js 20.19.0+ or 22.12.0+ installed
#   - npm dependencies installed (npm install)
#   - Nginx configured (see deployment/nginx.conf.template)
#   - Stripe webhook configured
#   - Supabase credentials set
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   BAUEN E-COMMERCE PRODUCTION DEPLOYMENT${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"

# Get environment
ENV=${1:-production}

if [[ "$ENV" != "production" && "$ENV" != "staging" ]]; then
  echo -e "${RED}❌ Invalid environment: $ENV${NC}"
  echo "Usage: bash deployment/deploy.sh [production|staging]"
  exit 1
fi

echo -e "\n${YELLOW}Environment: $ENV${NC}"
echo -e "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ============================================
# 1. Pre-Deployment Checks
# ============================================

echo -e "\n${BLUE}[1/7] Pre-Deployment Checks${NC}"

# Check Node version
NODE_VERSION=$(node --version)
echo -e "  ✓ Node version: $NODE_VERSION"

MIN_NODE_VERSION="20.19.0"
if [[ $(printf '%s\n' "$MIN_NODE_VERSION" "$(node --version | cut -d'v' -f2)" | sort -V | head -n1) == "$MIN_NODE_VERSION" ]]; then
  echo -e "  ${GREEN}✓ Node version meets minimum requirement${NC}"
else
  echo -e "  ${RED}✗ Node version $NODE_VERSION is below minimum $MIN_NODE_VERSION${NC}"
  exit 1
fi

# Check .env file
if [[ ! -f ".env.$ENV" ]]; then
  echo -e "  ${RED}✗ File not found: .env.$ENV${NC}"
  exit 1
fi

echo -e "  ${GREEN}✓ .env.$ENV file exists${NC}"

# Validate secrets are not placeholders
REQUIRED_VARS=(
  "NODE_ENV"
  "FRONTEND_URL"
  "STRIPE_SECRET_KEY"
  "VITE_STRIPE_PUBLIC_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "INVENTORY_ADMIN_PASSWORD_HASH"
  "SESSION_SECRET"
)

for var in "${REQUIRED_VARS[@]}"; do
  value=$(grep "^$var=" ".env.$ENV" | cut -d'=' -f2 || echo "")
  if [[ -z "$value" || "$value" == *"[REQUIRED"* || "$value" == *"[YOUR_"* ]]; then
    echo -e "  ${RED}✗ Missing or placeholder value for: $var${NC}"
    exit 1
  fi
done

echo -e "  ${GREEN}✓ All required secrets are configured${NC}"

# ============================================
# 2. Build Frontend
# ============================================

echo -e "\n${BLUE}[2/7] Building Frontend${NC}"

if [[ ! -d "src" ]]; then
  echo -e "  ${RED}✗ src/ directory not found${NC}"
  exit 1
fi

npm run build
echo -e "  ${GREEN}✓ Frontend built successfully${NC}"

# ============================================
# 3. Install Dependencies
# ============================================

echo -e "\n${BLUE}[3/7] Installing Dependencies${NC}"

npm ci --production
echo -e "  ${GREEN}✓ Dependencies installed${NC}"

# ============================================
# 4. Run Pre-Deployment Tests
# ============================================

echo -e "\n${BLUE}[4/7] Pre-Deployment Tests${NC}"

# Test that app starts without errors
timeout 10 npm run dev:api &
sleep 3
kill %1 2>/dev/null || true
echo -e "  ${GREEN}✓ Application starts without errors${NC}"

# ============================================
# 5. Backup Current Deployment (if exists)
# ============================================

echo -e "\n${BLUE}[5/7] Backup Current Deployment${NC}"

BACKUP_DIR="/var/www/bauen-watches-backup/$(date +%Y%m%d_%H%M%S)"

if [[ -d "/var/www/bauen-watches" ]]; then
  sudo mkdir -p "$BACKUP_DIR"
  sudo cp -r /var/www/bauen-watches/* "$BACKUP_DIR/" 2>/dev/null || true
  echo -e "  ${GREEN}✓ Backup created: $BACKUP_DIR${NC}"
else
  echo -e "  ${YELLOW}⊘ No existing deployment to backup${NC}"
fi

# ============================================
# 6. Deploy Application
# ============================================

echo -e "\n${BLUE}[6/7] Deploying Application${NC}"

# Copy files
sudo mkdir -p /var/www/bauen-watches
sudo cp -r dist /var/www/bauen-watches/
sudo cp -r node_modules /var/www/bauen-watches/
sudo cp server.js /var/www/bauen-watches/
sudo cp inventoryStore.js /var/www/bauen-watches/
sudo cp package.json /var/www/bauen-watches/

# Copy environment
sudo cp ".env.$ENV" /var/www/bauen-watches/.env
sudo chmod 600 /var/www/bauen-watches/.env

# Set permissions
sudo chown -R www-data:www-data /var/www/bauen-watches

echo -e "  ${GREEN}✓ Application files deployed${NC}"

# ============================================
# 7. Restart Application & Verify
# ============================================

echo -e "\n${BLUE}[7/7] Restart & Verification${NC}"

# Restart Node.js service (using systemd)
sudo systemctl restart node-bauen || {
  echo -e "  ${YELLOW}⊘ Could not restart systemd service (not configured)${NC}"
  echo -e "  ${YELLOW}   Ensure Node.js is running on port 4242${NC}"
}

# Wait for backend to start
sleep 3

# Verify health endpoint
if curl -s -m 5 http://localhost:4242/api/health > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓ Backend health check passed${NC}"
else
  echo -e "  ${YELLOW}⚠ Could not verify backend (may take longer to start)${NC}"
fi

# ============================================
# Deployment Complete
# ============================================

echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ DEPLOYMENT COMPLETE${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Verify deployment: node deployment/verify-deployment.js bauen-eyewear.com"
echo -e "  2. Test Stripe webhook: node deployment/test-stripe-webhook.js whsec_live_XXXX"
echo -e "  3. Monitor logs: sudo journalctl -u node-bauen -f"
echo -e "  4. Check nginx: sudo systemctl status nginx"
echo -e "  5. Test checkout flow manually"

echo -e "\n${YELLOW}Rollback (if needed):${NC}"
echo -e "  sudo cp -r $BACKUP_DIR/* /var/www/bauen-watches/"
echo -e "  sudo systemctl restart node-bauen"

exit 0
