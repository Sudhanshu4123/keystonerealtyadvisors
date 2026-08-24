#!/bin/bash
# ============================================================
# Keystone Realty Advisors — Hostinger VPS Setup Script
# Run this ONCE on your fresh VPS to prepare the server
# Usage: bash setup-vps.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Keystone Realty — VPS Server Setup   ${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. Update system packages
echo -e "\n${YELLOW}[1/8] Updating system packages...${NC}"
apt-get update -y && apt-get upgrade -y

# 2. Install Node.js 20 via NodeSource
echo -e "\n${YELLOW}[2/8] Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install PM2 globally
echo -e "\n${YELLOW}[3/8] Installing PM2 process manager...${NC}"
npm install -g pm2

# 4. Install Git
echo -e "\n${YELLOW}[4/8] Installing Git...${NC}"
apt-get install -y git

# 5. Install Nginx
echo -e "\n${YELLOW}[5/8] Installing Nginx reverse proxy...${NC}"
apt-get install -y nginx

# 6. Clone the project
echo -e "\n${YELLOW}[6/8] Cloning Keystone project from GitHub...${NC}"
mkdir -p /var/www
cd /var/www
git clone https://github.com/Sudhanshu4123/keystonerealtyadvisors.git keystone
cd keystone

# 7. Setup environment variables
echo -e "\n${YELLOW}[7/8] Setting up .env file...${NC}"
cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET_KEY"
EOF

echo -e "${RED}⚠️  IMPORTANT: Edit /var/www/keystone/.env and update JWT_SECRET!${NC}"

# 8. Install dependencies and build
echo -e "\n${YELLOW}[8/8] Installing dependencies and building app...${NC}"
npm ci
npx prisma generate
npx prisma db push
npm run build

# Start with PM2
pm2 start npm --name "keystone" -- start
pm2 save
pm2 startup

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Server Setup Complete!                ${NC}"
echo -e "${GREEN}  App running on port 3000              ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Update /var/www/keystone/.env with your JWT_SECRET"
echo "  2. Configure Nginx (run: bash setup-nginx.sh yourdomain.com)"
echo "  3. Add GitHub Secrets (see DEPLOYMENT.md)"
echo ""
