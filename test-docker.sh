#!/bin/bash

# Test script to verify Docker builds work with and without lockfiles

set -e

echo "🧪 Testing Docker build with and without lockfiles..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_test() {
    echo -e "${YELLOW}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Save current lockfiles if they exist
BACKUP_DIR="/tmp/bun-lockfile-backup-$$"
mkdir -p "$BACKUP_DIR"

if [ -f "bun.lockb" ]; then
    cp "bun.lockb" "$BACKUP_DIR/"
    echo "Backed up bun.lockb"
fi

if [ -f "bun.lock" ]; then
    cp "bun.lock" "$BACKUP_DIR/"
    echo "Backed up bun.lock"
fi

# Test 1: Build without lockfile
print_test "Building Docker image without lockfile..."
rm -f bun.lock* 2>/dev/null || true

if docker build -t pine-test-no-lock . > /tmp/docker-build-no-lock.log 2>&1; then
    print_success "Docker build succeeded without lockfile"
else
    print_error "Docker build failed without lockfile"
    echo "Build log:"
    cat /tmp/docker-build-no-lock.log
fi

# Test 2: Restore lockfile and test with it
print_test "Restoring lockfiles and testing build..."

if [ -f "$BACKUP_DIR/bun.lockb" ]; then
    cp "$BACKUP_DIR/bun.lockb" .
fi

if [ -f "$BACKUP_DIR/bun.lock" ]; then
    cp "$BACKUP_DIR/bun.lock" .
fi

if docker build -t pine-test-with-lock . > /tmp/docker-build-with-lock.log 2>&1; then
    print_success "Docker build succeeded with lockfile"
else
    print_error "Docker build failed with lockfile"
    echo "Build log:"
    cat /tmp/docker-build-with-lock.log
fi

# Test 3: Test production build
print_test "Testing production Docker build..."

if docker build -t pine-test-prod . > /tmp/docker-build-prod.log 2>&1; then
    print_success "Production Docker build succeeded"
else
    print_error "Production Docker build failed"
    echo "Build log:"
    cat /tmp/docker-build-prod.log
fi

# Cleanup
rm -rf "$BACKUP_DIR"
rm -f /tmp/docker-build-*.log

print_test "Cleaning up test images..."
docker rmi pine-test-no-lock pine-test-with-lock pine-test-prod 2>/dev/null || true

echo ""
echo "🎉 Docker lockfile compatibility tests completed!"
