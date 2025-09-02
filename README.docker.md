# Pine Transfer Form - Docker Setup

This project uses Bun and Docker for containerized development and deployment with secure environment-based configuration.

## Quick Start

### Environment Setup (Required)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Using the Management Script (Recommended)

```bash
# Make the script executable (first time only)
chmod +x docker.sh

# Check environment configuration
./docker.sh env

# Start development environment
./docker.sh dev

# Start production environment
./docker.sh prod

# Secure build with registry authentication
./docker.sh secure-build --push prod

# View logs
./docker.sh logs

# Stop all containers
./docker.sh stop

# Clean up (remove containers and images)
./docker.sh clean
```

### Manual Docker Commands

#### Development Environment
```bash
# Start development server on port 4173
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up pine-transfer-form-dev --build -d

# View logs
docker-compose logs -f pine-transfer-form-dev
```

#### Production Environment
```bash
# Build and start production server on port 4173
docker-compose up pine-transfer-form --build -d

# View logs
docker-compose logs -f pine-transfer-form
```

## Configuration

### Environment Variables (.env file)
```bash
# API Configuration
VITE_API_URL=https://api.surestrat.xyz/api/v1

# Docker Registry (optional)
DOCKER_REGISTRY=your-registry.com
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password

# Application
NODE_ENV=production
PORT=4173
```

### Ports
- **Development**: `http://localhost:${PORT:-4173}`
- **Production**: `http://localhost:${PORT:-4173}`

### API Configuration
- **Production API**: Configured via `VITE_API_URL` in .env
- Environment-based configuration prevents credential leakage
- Supports private Docker registries with authentication

### Environment Variables
- `NODE_ENV`: Set to `development` or `production`
- `VITE_API_URL`: API base URL (defaults to production API)
- `VITE_HMR_HOST`: Hot module replacement host for development

## Docker Services

### pine-transfer-form (Production)
- **Image**: Multi-stage build optimized for production
- **Port**: 4173:3000 (external:internal)
- **Features**: 
  - Optimized build with Bun
  - Health checks
  - Production-ready configuration

### pine-transfer-form-dev (Development)
- **Image**: Development-optimized build
- **Port**: 4173:5173 (external:internal)
- **Features**:
  - Hot module replacement
  - Volume mounting for live code changes
  - Development server with Bun

## Scripts and Commands

### Package.json Scripts
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production preview server
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

### Docker Management Script Commands
- `./docker.sh dev` - Start development environment
- `./docker.sh prod` - Start production environment  
- `./docker.sh build` - Build production image only
- `./docker.sh stop` - Stop all containers
- `./docker.sh clean` - Clean up containers and images
- `./docker.sh logs` - Show container logs
- `./docker.sh shell` - Open shell in development container
- `./docker.sh health` - Check container status

## Development Workflow

1. **Start Development**:
   ```bash
   ./docker.sh dev
   ```

2. **Make Code Changes**: 
   - Edit files in your IDE
   - Changes are automatically reflected due to volume mounting
   - Hot module replacement provides instant feedback

3. **View Logs**:
   ```bash
   ./docker.sh logs
   ```

4. **Stop Development**:
   ```bash
   ./docker.sh stop
   ```

## Production Deployment

1. **Build and Deploy**:
   ```bash
   ./docker.sh prod
   ```

2. **Access Application**:
   - Open `http://localhost:4173`
   - Application connects to production API at `https://api.surestrat.xyz`

## Troubleshooting

### Port Already in Use
If port 4173 is already in use, you can modify the port mapping in the docker-compose files:
```yaml
ports:
  - "YOUR_PORT:3000"  # for production
  - "YOUR_PORT:5173"  # for development
```

### Container Won't Start
1. Check if Docker is running
2. Ensure no other services are using the ports
3. Check logs: `./docker.sh logs`

### Build Failures
1. Clean up: `./docker.sh clean`
2. Rebuild: `./docker.sh build`
3. Check Docker daemon and disk space

### API Connection Issues
1. Verify the API URL in docker-compose files
2. Check network connectivity to `https://api.surestrat.xyz`
3. Verify API endpoints are accessible

## File Structure

```
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev         # Development build
├── docker-compose.yml     # Main compose configuration
├── docker-compose.dev.yml # Development overrides
├── docker.sh              # Management script
├── build-docker.sh        # Secure build script
├── test-docker.sh         # Lockfile compatibility tests
├── .env.example           # Environment template
├── .dockerignore          # Comprehensive ignore rules
└── package.json           # Node.js/Bun configuration
```

## Security Features

### Environment-Based Configuration
- ✅ **No Hardcoded Secrets**: All sensitive data in .env files
- ✅ **Registry Authentication**: Secure Docker registry login/logout
- ✅ **Comprehensive .dockerignore**: Prevents credential leakage
- ✅ **Optional Registry**: Works with or without private registries

### Secure Build Process
```bash
# Use the secure build script for sensitive deployments
./docker.sh secure-build --push prod

# Or directly with the build script
./build-docker.sh --push prod
```

### Docker Management Script Commands
- `./docker.sh env` - Show environment configuration
- `./docker.sh dev` - Start development environment  
- `./docker.sh prod` - Start production environment  
- `./docker.sh build` - Build production image only
- `./docker.sh secure-build [--push] [prod|dev]` - Secure build with registry auth
- `./docker.sh stop` - Stop all containers
- `./docker.sh clean` - Clean up containers and images
- `./docker.sh logs` - Show container logs
- `./docker.sh shell` - Open shell in development container
- `./docker.sh health` - Check container status
- `./docker.sh test` - Test builds with/without lockfiles

### Secure Build Examples
```bash
# Build production image with registry authentication
./docker.sh secure-build prod

# Build and push to registry
./docker.sh secure-build --push prod

# Build development image without registry login
./docker.sh secure-build --no-login dev
```
