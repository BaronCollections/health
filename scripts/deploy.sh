#!/bin/bash
set -e

echo "🌿 MintBit Health - One-Click Deploy"
echo "======================================"

# Check .env
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "Please edit .env with your actual credentials, then re-run this script."
    exit 1
fi

# Build and start all services
echo "Building and starting all services..."
docker compose up -d --build

# Wait for services
echo "Waiting for services to start..."
sleep 10

# Check service health
echo ""
echo "Service Status:"
echo "────────────────"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "======================================"
echo "MintBit Health deployed successfully!"
echo ""
echo "  Frontend:   http://localhost"
echo "  Backend:    http://localhost:8080"
echo "  Swagger:    http://localhost:8080/doc.html"
echo "  MinIO:      http://localhost:9001"
echo "  RabbitMQ:   http://localhost:15672"
echo "======================================"
