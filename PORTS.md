# Port Configuration

This document outlines the port usage across different environments and services.

## Port Allocation

| Service | Environment | Internal Port | External Port | Access URL |
|---------|-------------|---------------|---------------|------------|
| Development Server | Local | 5173 | 5173 | http://localhost:5173 |
| Development Server | Docker | 5173 | 5173 | http://localhost:5173 |
| Production Server | Local Preview | 3000 | 3000 | http://localhost:3000 |
| Production Server | Docker | 3000 | 3573 | http://localhost:3573 |
| Preview Server | Local | 4173 | 4173 | http://localhost:4173 |

## Environment Variables

- `PORT=3573` - Production external port for Docker
- `DEV_PORT=5173` - Development external port for Docker

## Docker Services

### Development
```bash
# Start development environment
docker-compose --profile dev up

# Access at: http://localhost:5173
```

### Production
```bash
# Start production environment
docker-compose up

# Access at: http://localhost:3573
```

## Local Development

```bash
# Development server
bun run dev
# Access at: http://localhost:5173

# Production preview
bun run start
# Access at: http://localhost:3000

# Preview server
bun run preview
# Access at: http://localhost:4173
```

## Port Conflicts

If you encounter port conflicts:

1. **Development (5173)**: Check if another Vite server is running
2. **Production (3573)**: Check if the production container is already running
3. **Preview (4173)**: Standard Vite preview port

Use `netstat -tlnp | grep <port>` to check what's using a specific port.
