#!/bin/bash
# ============================================================
# Keystone Monorepo — Hostinger VPS Server Setup Script
# Installs Java 17, Node.js 20, Maven, Nginx, PM2
# Usage: bash setup-vps.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Keystone Monorepo — VPS Server Setup  ${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. Update system packages
echo -e "\n${YELLOW}[1/6] Updating system packages...${NC}"
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git wget build-essential openjdk-17-jdk maven

# 2. Install Node.js 20 & PM2
echo -e "\n${YELLOW}[2/6] Installing Node.js 20 & PM2...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

# 3. Install Nginx
echo -e "\n${YELLOW}[3/6] Installing Nginx...${NC}"
apt-get install -y nginx

# 4. Clone project
echo -e "\n${YELLOW}[4/6] Setting up project directory...${NC}"
mkdir -p /var/www
cd /var/www
if [ ! -d "/var/www/keystone" ]; then
  git clone https://github.com/Sudhanshu4123/keystonerealtyadvisors.git keystone
fi
cd /var/www/keystone

# 5. Build applications
echo -e "\n${YELLOW}[5/6] Building Backend (Java Spring Boot)...${NC}"
cd /var/www/keystone/backend
chmod +x mvnw
./mvnw clean package -DskipTests

echo -e "\n${YELLOW}[5/6] Building Frontend (Next.js)...${NC}"
cd /var/www/keystone
npm --prefix frontend ci
npm --prefix frontend run build

echo -e "\n${YELLOW}[5/6] Building Admin Panel (Next.js)...${NC}"
npm --prefix admin ci
npm --prefix admin run build

# 6. Start PM2 Processes
echo -e "\n${YELLOW}[6/6] Launching PM2 process manager...${NC}"
pm2 start "java -jar backend/target/keystone-backend-1.0.0.jar" --name "keystone-backend" || pm2 restart keystone-backend
pm2 start npm --name "keystone-frontend" --prefix frontend -- start -- -p 3000 || pm2 restart keystone-frontend
pm2 start npm --name "keystone-admin" --prefix admin -- start -- -p 3001 || pm2 restart keystone-admin

pm2 save
pm2 startup || true

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Keystone Monorepo Setup Complete!    ${NC}"
echo -e "${GREEN}  Backend API: http://localhost:5000     ${NC}"
echo -e "${GREEN}  Frontend:    http://localhost:3000     ${NC}"
echo -e "${GREEN}  Admin Panel: http://localhost:3001     ${NC}"
echo -e "${GREEN}========================================${NC}"
