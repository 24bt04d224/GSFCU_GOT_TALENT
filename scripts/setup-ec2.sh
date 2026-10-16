#!/usr/bin/env bash
# ==============================================================================
# GSFCU Got Talent 2026 - AWS EC2 Automated Backend Setup & Deployment Script
# Supports: Ubuntu 20.04/22.04/24.04 LTS & Amazon Linux 2023
# ==============================================================================

set -e

echo "🚀 [1/6] Starting GSFCU Got Talent EC2 Backend Setup..."

# Detect Linux Distribution
if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS=$ID
else
  OS=$(uname -s)
fi

echo "Detected OS: $OS"

# 1. Update package managers and install base utilities
echo "📦 [2/6] Updating system packages..."
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
  sudo apt-get update -y
  sudo apt-get install -y curl wget git build-essential ufw nginx
elif [[ "$OS" == "amzn" || "$OS" == "rhel" || "$OS" == "centos" ]]; then
  sudo dnf update -y || sudo yum update -y
  sudo dnf install -y curl wget git gcc-c++ make nginx || sudo yum install -y curl wget git gcc-c++ make nginx
fi

# 2. Install Node.js LTS (v20.x)
echo "🟢 [3/6] Installing Node.js LTS (v20)..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - || true
  if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    sudo apt-get install -y nodejs
  else
    sudo dnf install -y nodejs || sudo yum install -y nodejs
  fi
fi

echo "Node version: $(node -v)"
echo "NPM version:  $(npm -v)"

# 3. Install PM2 process manager
echo "⚡ [4/6] Installing PM2 process manager globally..."
sudo npm install -g pm2

# 4. Project dependencies
echo "📂 [5/6] Installing backend dependencies..."
if [ -f "package.json" ]; then
  npm install --production=false
fi

# Create logs directory
mkdir -p logs data

# 5. Start or Reload Backend Service using PM2
echo "🔥 [6/6] Starting backend server via PM2..."
pm2 delete gsfcu-talent-backend 2>/dev/null || true
pm2 start ecosystem.config.cjs

# Persist PM2 across server reboots
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME || true

echo "======================================================================"
echo "🎉 GSFCU Got Talent Backend is now LIVE on your AWS EC2 Instance!"
echo "======================================================================"
echo "Health Check:"
echo "  curl http://localhost:5000/health"
echo ""
echo "Public Access:"
echo "  http://<YOUR-EC2-PUBLIC-IP>:5000/api/health"
echo "  http://<YOUR-EC2-PUBLIC-IP>:5000/api/registrations"
echo ""
echo "Useful PM2 Commands:"
echo "  pm2 status"
echo "  pm2 logs gsfcu-talent-backend"
echo "  pm2 restart gsfcu-talent-backend"
echo "======================================================================"
