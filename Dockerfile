# Multi-stage build for optimization
FROM oven/bun:1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN bun run build

# Production stage with static file server
FROM node:18-alpine

# Install serve for static file serving and curl for health checks
RUN npm install -g serve && apk add --no-cache curl

# Copy built files from builder stage
COPY --from=builder /app/dist /app

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Serve static files with SPA support for client-side routing
CMD ["serve", "-s", ".", "-l", "3000", "--no-clipboard"]
