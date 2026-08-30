# 🚀 Keystone Monorepo — VPS Deployment Guide

## GitHub Actions Automated CI/CD Pipeline

```
GitHub Push (main branch) → CI Check → SSH into VPS → Build & Restart PM2
```

## 🛡️ Multi-Website VPS Safety (Dono Websites Bina Kisi Conflict Ke Run Hongi)

Server par already dusri website live hai, isliye Keystone ko poori tarah isolate rakha gaya hai:
1. **Isolated Ports / PM2 Names:**
   * `keystone-backend` (Port 5000)
   * `keystone-frontend` (Port 3000)
   * `keystone-admin` (Port 3001)
   *(Note: Agar purani website port 3000 ya 5000 use karti hai, to Keystone ke ports 3002, 3003, 5002 change kar sakte hain bina kisi dikkat ke).*
2. **Nginx Virtual Host Isolation:**
   * Keystone ka Nginx config `/etc/nginx/sites-available/keystone` me alag rahega, dusri website ke Nginx configuration ko touch nahi karega.
3. **Separate MySQL Database:**
   * Database: `keystonedb` (dusre project ke database se bilkul alag).
4. **Separate Project Directory:**
   * Path: `/var/www/keystone`

---

## 🛠️ Step 1: Add GitHub Secrets

Aap apne GitHub Repository me **Settings** → **Secrets and variables** → **Actions** → **New repository secret** me ye 4 secrets add karein:

| Secret Name | Explanation | Example Value |
| :--- | :--- | :--- |
| `VPS_HOST` | Aapke VPS Server ka IP Address | `194.163.xxx.xxx` |
| `VPS_USER` | SSH Username (usually root) | `root` |
| `VPS_SSH_KEY` | Private SSH Key content | *(Private SSH Key text)* |
| `VPS_PROJECT_PATH` | Server par project ka path | `/var/www/keystone` |

---

## 🔑 How to Generate & Setup SSH Key (One-time)

Aap apne PC par Terminal / PowerShell me run karein:

```bash
# 1. SSH Key generate karein:
ssh-keygen -t ed25519 -C "github-actions-keystone" -f keystone_key

# 2. Public key content VPS me copy karein:
# File 'keystone_key.pub' ka content VPS me /root/.ssh/authorized_keys me add karein

# 3. Private key content GitHub Secrets me paste karein:
# File 'keystone_key' ka content GitHub Secret `VPS_SSH_KEY` me paste karein
```

---

## 🌐 Step 2: VPS First-Time One-Click Setup

VPS me Terminal (SSH) open karke run karein:

```bash
ssh root@YOUR_VPS_IP

# Setup server tools (Java 17, Node 20, PM2, Nginx)
mkdir -p /var/www && cd /var/www
git clone https://github.com/Sudhanshu4123/keystonerealtyadvisors.git keystone
cd keystone
bash setup-vps.sh

# Nginx Connect Karein (Separate Admin Domain Setup):
# Format: bash setup-nginx.sh maindomain.com admin.maindomain.com
bash setup-nginx.sh yourdomain.com admin.yourdomain.com

# Free SSL (HTTPS) Enable Karein (Donon Domains Ke Liye):
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com
```

---

## ⚡ Step 3: Automatic Deploy

Iske baad jab bhi aap GitHub repository me `git push origin main` karenge:
- GitHub Actions automatically VPS me connect hoga.
- Spring Boot Java Backend compile aur start kar dega (Port 5000).
- Showcase Frontend Website start kar dega (`http://yourdomain.com` - Port 3000).
- Admin Panel start kar dega (`http://admin.yourdomain.com` - Port 3001).
- PM2 reload karke live site update kar dega! 🎉
