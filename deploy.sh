#!/bin/bash
set -euo pipefail

echo "========================================="
echo "  NexoBot - Docker Deploy"
echo "  $(date)"
echo "========================================="

APP_DIR="/opt/nexobot"
cd ${APP_DIR}

# Pull latest code
echo "[1/4] Pulling latest code..."
git pull origin main

# Build and restart containers
echo "[2/4] Building Docker images..."
docker compose build --no-cache

echo "[3/4] Starting containers..."
docker compose up -d

# Run database migrations
echo "[4/4] Running database migrations..."
sleep 5
docker compose exec -T app npx prisma db push --accept-data-loss

echo ""
echo "========================================="
echo "  Deploy complete!"
echo "  App running at: http://$(hostname -I | awk '{print $1}')"
echo "========================================="
docker compose ps
