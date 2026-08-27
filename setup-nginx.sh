#!/bin/bash
# ============================================================
# Nginx Reverse Proxy Setup for Keystone Monorepo
# Support both main domain (/admin) and separate subdomain (admin.yourdomain.com)
# Usage:
#   bash setup-nginx.sh yourdomain.com admin.yourdomain.com
#   OR
#   bash setup-nginx.sh yourdomain.com
# ============================================================

DOMAIN=$1
ADMIN_DOMAIN=$2

if [ -z "$DOMAIN" ]; then
  echo "Usage: bash setup-nginx.sh maindomain.com [admin.maindomain.com]"
  exit 1
fi

if [ -z "$ADMIN_DOMAIN" ]; then
  ADMIN_DOMAIN="admin.$DOMAIN"
fi

echo "Setting up Nginx reverse proxy for:"
echo "  Main Showcase Domain : $DOMAIN (www.$DOMAIN)"
echo "  Admin Panel Domain   : $ADMIN_DOMAIN"

cat > /etc/nginx/sites-available/keystone << EOF
# ------------------------------------------------------------
# 1. Main Showcase Frontend, Admin & API Proxy
# ------------------------------------------------------------
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Spring Boot Backend API Proxy (Port 5000)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 90s;
        proxy_connect_timeout 90s;
    }

    # Uploaded Media / PDFs Proxy (Port 5000)
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Next.js Admin Panel Proxy (Port 3001 with /admin basePath)
    location /admin {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Next.js Showcase Frontend Proxy (Port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

# ------------------------------------------------------------
# 2. Separate Next.js Admin Panel Subdomain Proxy
# ------------------------------------------------------------
server {
    listen 80;
    server_name $ADMIN_DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Spring Boot Backend API Proxy (Port 5000)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 90s;
        proxy_connect_timeout 90s;
    }

    # Uploaded Media / PDFs Proxy (Port 5000)
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Next.js Admin Panel Proxy (Port 3001)
    location / {
        proxy_pass http://localhost:3001/admin/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/keystone /etc/nginx/sites-enabled/keystone
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

echo "✅ Nginx reverse proxy configured successfully!"
echo "   Main Website: http://$DOMAIN"
echo "   Admin Panel (Subpath):   http://$DOMAIN/admin"
echo "   Admin Panel (Subdomain): http://$ADMIN_DOMAIN"
echo ""
echo "To enable SSL (HTTPS) for both domains, run:"
echo "  apt install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $ADMIN_DOMAIN"
