#!/bin/bash

# Pine Transfer Form Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check and load environment
check_env() {
    if [ ! -f .env ]; then
        print_warning "No .env file found!"
        print_status "Copying .env.example to .env..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
            print_warning "Please edit .env file to configure your settings"
        else
            print_error ".env.example not found. Please create .env manually."
        fi
    else
        print_status "Using existing .env configuration"
    fi
}

# Function to show usage
show_usage() {
    echo "Pine Transfer Form Docker Management"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  prod        Start production environment"
    echo "  build       Build production image"
    echo "  secure-build Build with registry authentication (optional push)"
    echo "  test        Test Docker builds with/without lockfiles"
    echo "  stop        Stop all containers"
    echo "  clean       Stop containers and remove images"
    echo "  logs        Show logs for running containers"
    echo "  shell       Open shell in development container"
    echo "  health      Check container status"
    echo "  env         Show environment configuration"
    echo ""
}

# Function to start development environment
start_dev() {
    check_env
    print_status "Starting development environment..."
    print_status "Note: Bun lockfiles (bun.lock/bun.lockb) are optional - build will work without them"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up pine-transfer-form-dev --build -d
    local port=${PORT:-4343}
    print_success "Development server started on http://localhost:$port"
    print_status "To view logs: $0 logs"
}

# Function to start production environment
start_prod() {
    check_env
    print_status "Building production image..."
    print_status "Note: Bun lockfiles (bun.lock/bun.lockb) are optional - build will work without them"
    docker-compose build pine-transfer-form
    
    print_status "Starting production environment..."
    docker-compose up pine-transfer-form -d
    local port=${PORT:-4343}
    print_success "Production server started on http://localhost:$port"
    print_status "To view logs: $0 logs"
}

# Function to build production image
build_prod() {
    check_env
    print_status "Building production image using secure build script..."
    chmod +x build-docker.sh
    ./build-docker.sh prod
}

# Function to stop containers
stop_containers() {
    print_status "Stopping all containers..."
    docker-compose down
    print_success "All containers stopped"
}

# Function to clean up
clean_up() {
    print_status "Stopping containers and removing images..."
    docker-compose down --rmi all --volumes --remove-orphans
    print_success "Cleanup completed"
}

# Function to show logs
show_logs() {
    docker-compose logs -f
}

# Function to open shell in development container
open_shell() {
    print_status "Opening shell in development container..."
    docker-compose exec pine-transfer-form-dev sh
}

# Function to run secure build
secure_build() {
    check_env
    print_status "Running secure build with authentication..."
    chmod +x build-docker.sh
    shift # Remove the 'secure-build' argument
    ./build-docker.sh "$@"
}

# Function to show environment info
show_env() {
    check_env
    print_status "Environment Configuration:"
    if [ -f .env ]; then
        echo "  .env file: ✓ Found"
        echo "  PORT: ${PORT:-4343} (default)"
        echo "  NODE_ENV: ${NODE_ENV:-production} (default)"
        echo "  VITE_API_URL: ${VITE_API_URL:-https://api.surestrat.xyz/api/v1} (default)"
        if [ -n "$DOCKER_REGISTRY" ]; then
            echo "  DOCKER_REGISTRY: $DOCKER_REGISTRY"
        else
            echo "  DOCKER_REGISTRY: Not configured"
        fi
    else
        echo "  .env file: ✗ Not found"
    fi
}

# Function to test Docker builds
test_builds() {
    check_env
    print_status "Running Docker lockfile compatibility tests..."
    chmod +x test-docker.sh
    ./test-docker.sh
}

# Function to check health
check_health() {
    print_status "Checking container health..."
    docker-compose ps
}

# Main script logic
case "$1" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "build")
        build_prod
        ;;
    "secure-build")
        secure_build "$@"
        ;;
    "test")
        test_builds
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_up
        ;;
    "logs")
        show_logs
        ;;
    "shell")
        open_shell
        ;;
    "health")
        check_health
        ;;
    "env")
        show_env
        ;;
    "")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
