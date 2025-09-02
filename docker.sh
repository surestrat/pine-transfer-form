#!/bin/bash

# Simple Docker management script for Pine Transfer Form

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
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

show_usage() {
    echo "Pine Transfer Form - Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment with hot reload"
    echo "  prod        Start production environment"
    echo "  build       Build production Docker image"
    echo "  stop        Stop all containers"
    echo "  clean       Stop and remove containers and images"
    echo "  logs        Show container logs"
    echo "  shell       Open shell in running container"
    echo "  health      Check container health status"
    echo "  test        Test Docker builds"
    echo "  env         Show current environment configuration"
    echo ""
    echo "Examples:"
    echo "  $0 dev                    # Start development server"
    echo "  $0 prod                   # Start production server"
    echo "  $0 logs                   # View logs"
    echo "  $0 clean                  # Clean up everything"
}

load_env() {
    if [ -f .env ]; then
        print_info "Loading environment variables from .env file..."
        export $(grep -v '^#' .env | xargs)
    else
        print_warning "No .env file found. Using default values."
        print_info "Consider copying .env.example to .env and configuring your settings."
    fi
}

case "${1:-help}" in
    dev)
        load_env
        print_info "Starting development environment..."
        docker-compose --profile dev up --build -d
        print_success "Development server started on http://localhost:${PORT:-4343}"
        print_info "Use '$0 logs' to view output"
        ;;
    
    prod)
        load_env
        print_info "Starting production environment..."
        docker-compose up --build -d
        print_success "Production server started on http://localhost:${PORT:-4343}"
        print_info "Use '$0 logs' to view output"
        ;;
    
    build)
        load_env
        print_info "Building production Docker image..."
        docker-compose build
        print_success "Production image built successfully"
        ;;
    
    stop)
        print_info "Stopping all containers..."
        docker-compose --profile dev down
        docker-compose down
        print_success "All containers stopped"
        ;;
    
    clean)
        print_info "Cleaning up containers and images..."
        docker-compose --profile dev down --rmi all --volumes
        docker-compose down --rmi all --volumes
        print_success "Cleanup completed"
        ;;
    
    logs)
        if docker ps | grep -q "pine-transfer-form-dev"; then
            print_info "Showing development logs..."
            docker-compose --profile dev logs -f
        elif docker ps | grep -q "pine-transfer-form"; then
            print_info "Showing production logs..."
            docker-compose logs -f
        else
            print_warning "No Pine Transfer Form containers are running"
        fi
        ;;
    
    shell)
        if docker ps | grep -q "pine-transfer-form-dev"; then
            print_info "Opening shell in development container..."
            docker exec -it pine-transfer-form-dev sh
        elif docker ps | grep -q "pine-transfer-form"; then
            print_info "Opening shell in production container..."
            docker exec -it pine-transfer-form sh
        else
            print_error "No Pine Transfer Form containers are running"
            exit 1
        fi
        ;;
    
    health)
        if docker ps | grep -q "pine-transfer-form"; then
            print_info "Checking container health..."
            docker inspect --format='{{json .State.Health}}' pine-transfer-form | jq '.'
        else
            print_warning "Production container is not running"
        fi
        ;;
    
    test)
        print_info "Running Docker build tests..."
        ./test-docker.sh
        ;;
    
    env)
        load_env
        print_info "Current environment configuration:"
        echo "  - API URL: ${VITE_API_URL:-https://api.surestrat.xyz/api/v1}"
        echo "  - Port: ${PORT:-4343}"
        echo "  - Node Environment: ${NODE_ENV:-production}"
        ;;
    
    help|--help|-h)
        show_usage
        ;;
    
    *)
        print_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
