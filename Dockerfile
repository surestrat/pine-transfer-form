# Use the official Bun image
FROM oven/bun:1-alpine

# Set working directory
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies with memory optimization
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application with increased memory limit
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN bun run build

# Expose port (vite preview runs on 3000 with our start script)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Run the preview server
CMD ["bun", "run", "start"]
