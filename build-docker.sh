#!/bin/bash

# Secure Docker Build Script
# Handles environment variables and optional Docker registry authentication

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

# Function to check if .env file exists and load it
load_env() {
    if [ -f .env ]; then
        print_info "Loading environment variables from .env file..."
        export $(grep -v '^#' .env | xargs)
    else
        print_warning "No .env file found. Using default values and environment variables."
        print_info "Copy .env.example to .env and configure your settings."
    fi
}

# Function to handle Docker registry authentication
docker_login() {
    if [ -n "$DOCKER_REGISTRY" ] && [ -n "$DOCKER_USERNAME" ] && [ -n "$DOCKER_PASSWORD" ]; then
        print_info "Logging into Docker registry: $DOCKER_REGISTRY"
        echo "$DOCKER_PASSWORD" | docker login "$DOCKER_REGISTRY" --username "$DOCKER_USERNAME" --password-stdin
        print_success "Successfully logged into Docker registry"
    elif [ -n "$DOCKER_REGISTRY" ]; then
        print_warning "Docker registry specified but missing credentials. Skipping login."
    fi
}

# Function to handle Docker logout
docker_logout() {
    if [ -n "$DOCKER_REGISTRY" ]; then
        print_info "Logging out of Docker registry..."
        docker logout "$DOCKER_REGISTRY" 2>/dev/null || true
    fi
}

# Function to build and optionally push Docker image
build_and_push() {
    local target="$1"
    local push="$2"
    
    print_info "Building Docker image for target: $target"
    
    # Construct image name
    local image_name="pine-transfer-form"
    if [ -n "$DOCKER_REGISTRY" ]; then
        image_name="$DOCKER_REGISTRY/$image_name"
    fi
    
    # Add target suffix
    if [ "$target" = "dev" ]; then
        image_name="$image_name:dev"
        dockerfile="Dockerfile.dev"
    else
        image_name="$image_name:latest"
        dockerfile="Dockerfile"
    fi
    
    # Build the image
    print_info "Building image: $image_name"
    docker build -f "$dockerfile" -t "$image_name" .
    
    # Push if requested and registry is configured
    if [ "$push" = "true" ] && [ -n "$DOCKER_REGISTRY" ]; then
        print_info "Pushing image to registry..."
        docker push "$image_name"
        print_success "Image pushed successfully: $image_name"
    else
        print_success "Image built successfully: $image_name"
    fi
}

# Function to show usage
show_usage() {
    echo "Secure Docker Build Script for Pine Transfer Form"
    echo ""
    echo "Usage: $0 [OPTIONS] [TARGET]"
    echo ""
    echo "Targets:"
    echo "  prod        Build production image (default)"
    echo "  dev         Build development image"
    echo ""
    echo "Options:"
    echo "  --push      Push image to registry after building"
    echo "  --no-login  Skip Docker registry login"
    echo "  --help      Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DOCKER_REGISTRY   Docker registry URL (optional)"
    echo "  DOCKER_USERNAME   Docker registry username"
    echo "  DOCKER_PASSWORD   Docker registry password"
    echo "  PORT             Application port (default: 4173)"
    echo "  VITE_API_URL     API URL"
    echo ""
    echo "Examples:"
    echo "  $0                    # Build production image"
    echo "  $0 dev                # Build development image"
    echo "  $0 --push prod        # Build and push production image"
    echo "  $0 --no-login dev     # Build dev image without registry login"
}

# Parse command line arguments
TARGET="prod"
PUSH="false"
SKIP_LOGIN="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        --push)
            PUSH="true"
            shift
            ;;
        --no-login)
            SKIP_LOGIN="true"
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        prod|dev)
            TARGET="$1"
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
print_info "Pine Transfer Form - Secure Docker Build"
print_info "Target: $TARGET"

# Load environment variables
load_env

# Validate required environment variables
if [ -z "$VITE_API_URL" ]; then
    print_warning "VITE_API_URL not set. Using default: https://api.surestrat.xyz/api/v1"
    export VITE_API_URL="https://api.surestrat.xyz/api/v1"
fi

# Handle Docker registry authentication
if [ "$SKIP_LOGIN" != "true" ]; then
    docker_login
fi

# Ensure cleanup on exit
trap docker_logout EXIT

# Build and optionally push the image
build_and_push "$TARGET" "$PUSH"

print_success "Build process completed successfully!"

# Show final information
echo ""
print_info "Image built with the following configuration:"
echo "  - Target: $TARGET"
echo "  - API URL: $VITE_API_URL"
echo "  - Port: ${PORT:-4173}"
if [ -n "$DOCKER_REGISTRY" ]; then
    echo "  - Registry: $DOCKER_REGISTRY"
fi
