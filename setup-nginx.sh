#!/bin/bash
# ============================================================
# Nginx Reverse Proxy Setup for Keystone Realty Advisors
# Usage: bash setup-nginx.sh yourdomain.com
# ============================================================

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
  echo "Usage: bash setup-nginx.sh yourdomain.com"
  exit 1
fi

echo "Setting up Nginx for domain: $DOMAIN"

# Create Nginx config
cat > /etc/nginx/sites-available/keystone << EOF
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

    # Static assets caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    # Proxy all requests to Next.js app
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
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/keystone /etc/nginx/sites-enabled/keystone

# Remove default if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

echo "✅ Nginx configured for $DOMAIN"
echo ""
echo "To enable HTTPS (SSL), run:"
echo "  apt install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN"
