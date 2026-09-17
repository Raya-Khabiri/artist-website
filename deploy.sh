#!/bin/bash

set -e

PROJECT_PATH="/var/www/artist-website"
BRANCH="server"

echo "=================================="
echo "Starting deployment..."
echo "=================================="

cd "$PROJECT_PATH"

echo "→ Fetching latest changes..."
git fetch origin

echo "→ Resetting to origin/$BRANCH..."
git reset --hard "origin/$BRANCH"

echo "→ Building and starting containers..."
docker compose up -d --build

echo "→ Removing unused Docker images..."
docker image prune -f

echo "=================================="
echo "Deployment completed successfully."
echo "=================================="