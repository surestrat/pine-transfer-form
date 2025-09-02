# Use the official Bun image
FROM oven/bun:1-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Set build-time environment variables for Vite
ARG VITE_API_URL=https://webform.surestrat.xyz
ARG VITE_PINE_API_URL=https://webform.surestrat.xyz/api/v1/transfer
ARG VITE_QUOTE_API_URL=https://webform.surestrat.xyz/api/v1/quote

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PINE_API_URL=$VITE_PINE_API_URL
ENV VITE_QUOTE_API_URL=$VITE_QUOTE_API_URL
ENV NODE_ENV=production

# Build the application
RUN bun run build

# Expose port (vite preview runs on 3000 with our start script)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Run the preview server
CMD ["bun", "run", "start"]
