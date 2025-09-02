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

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Serve the built application with SPA support
CMD ["serve", "-s", "dist"]
