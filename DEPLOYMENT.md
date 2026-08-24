# 🚀 Keystone Realty Advisors — Deployment Guide

## CI/CD Pipeline Overview

```
GitHub Push → CI (Build Check) → CD (Deploy to Hostinger VPS)
```

- **CI Workflow** — Runs on every push/PR: installs deps, generates Prisma, builds Next.js
- **CD Workflow** — Runs only on `main` branch push: SSHs into VPS, pulls code, rebuilds, restarts PM2

---

## Step 1: First-Time VPS Server Setup

SSH into your Hostinger VPS and run:

```bash
ssh root@YOUR_VPS_IP
bash <(curl -s https://raw.githubusercontent.com/Sudhanshu4123/keystonerealtyadvisors/main/setup-vps.sh)
```

Or manually:

```bash
ssh root@YOUR_VPS_IP
cd /var/www/keystone
git clone https://github.com/Sudhanshu4123/keystonerealtyadvisors.git keystone
cd keystone
bash setup-vps.sh
```

---

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 5 secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `VPS_HOST` | Your VPS IP address | `123.45.67.89` |
| `VPS_USER` | SSH username | `root` |
| `VPS_SSH_KEY` | Private SSH key content | *(see below)* |
| `DATABASE_URL` | SQLite path | `file:./prisma/dev.db` |
| `JWT_SECRET` | Random secret key | `your-super-secret-key-here` |
| `VPS_PROJECT_PATH` | Project folder on server | `/var/www/keystone` |

### How to get your SSH Private Key:

```bash
# On your LOCAL machine (Windows PowerShell or Git Bash):
ssh-keygen -t ed25519 -C "github-actions-keystone" -f keystone_deploy_key

# Copy the PUBLIC key to your VPS:
cat keystone_deploy_key.pub
# Paste this into your VPS: /root/.ssh/authorized_keys

# Copy the PRIVATE key content:
cat keystone_deploy_key
# Paste this as VPS_SSH_KEY secret in GitHub
```

---

## Step 3: Setup Nginx (Reverse Proxy)

On your VPS, run:

```bash
cd /var/www/keystone
bash setup-nginx.sh yourdomain.com
```

---

## Step 4: Setup SSL (HTTPS)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Step 5: Deploy!

Just push to `main` branch — GitHub Actions will automatically:

1. ✅ Run build check (CI)
2. 🚀 SSH into your VPS
3. 📥 Pull latest code
4. 📦 Install dependencies
5. 🔧 Run Prisma migrations
6. 🏗️ Build production app
7. ♻️ Restart PM2 (zero downtime)

```bash
git add .
git commit -m "feat: your changes"
git push origin main
# That's it! GitHub Actions deploys automatically 🎉
```

---

## PM2 Useful Commands (on VPS)

```bash
pm2 list              # See running apps
pm2 logs keystone     # View app logs
pm2 restart keystone  # Restart app
pm2 stop keystone     # Stop app
pm2 monit             # Real-time monitoring
```

---

## Admin Panel

- **URL**: `https://yourdomain.com/admin/login`
- **Email**: `admin@keystone.com`
- **Password**: `Admin@123456`

> ⚠️ Change the admin password after first login via Admin Settings page!
