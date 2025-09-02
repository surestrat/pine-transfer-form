#!/bin/bash

# Pine Transfer Form Development Startup Script
echo "🌲 Starting Pine Transfer Form Development Environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found! Creating default .env file..."
    cat > .env << EOL
# API Configuration
VITE_API_URL=https://api.surestrat.xyz/api/v1
VITE_PINE_API_URL=https://api.surestrat.xyz/api/v1/transfer
VITE_QUOTE_API_URL=https://api.surestrat.xyz/api/v1/quote

# Docker Configuration
PORT=4343
NODE_ENV=development
EOL
    echo "✅ Default .env file created"
fi

# Check if Docker is available
if command -v docker >/dev/null 2>&1; then
    echo "🐳 Starting with Docker..."
    docker-compose --profile dev up --build
else
    echo "📦 Docker not available, starting with local Bun..."
    
    # Check if bun is installed
    if command -v bun >/dev/null 2>&1; then
        echo "🏃 Installing dependencies..."
        bun install
        echo "🚀 Starting development server..."
        bun run dev --host 0.0.0.0
    else
        echo "❌ Neither Docker nor Bun is available!"
        echo "Please install Docker or Bun to run this project."
        echo "- Docker: https://docs.docker.com/get-docker/"
        echo "- Bun: https://bun.sh/"
        exit 1
    fi
fi
