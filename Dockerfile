# Use Node.js alpine for lightweight production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json first for better Docker layer caching
COPY package.json ./

# Install dependencies
RUN npm install

# Install serve globally for static file serving
RUN npm i -g serve

# Copy the rest of the application
COPY . .

# Set environment variables for build time (Vite needs these during build)
ENV VITE_API_URL=https://api.usa-solarenergy.com
ENV VITE_PINE_API_URL=https://api.usa-solarenergy.com/api/v1/transfer
ENV VITE_QUOTE_API_URL=https://api.usa-solarenergy.com/api/v1/quote

# Build the application
RUN npm run build

# Expose port 3939 (port 3000 is already in use)
EXPOSE 3939

# Serve the built application with SPA support on port 3939
CMD ["serve", "-s", "dist", "-l", "3939"]
