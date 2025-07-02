# Docker Setup for Crypto Portfolio Tracker

This document explains how to use Docker and Docker Compose to run the Crypto Portfolio Tracker application.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- At least 2GB of available RAM

## Quick Start

### Production Build

To run the application in production mode:

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f frontend
```

### Development Mode

To run the application in development mode with hot reloading:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

## Services

### Frontend Service

- **Production**: Served by Nginx on port 3000
- **Development**: Vite dev server on port 3000
- **Features**:
  - React SPA with routing
  - Optimized static asset serving
  - Gzip compression
  - Security headers

### Backend Service (Optional)

- **Port**: 3001
- **Database**: PostgreSQL
- **Cache**: Redis
- **Features**: API endpoints for portfolio management

### Database Service (Optional)

- **Type**: PostgreSQL 15
- **Port**: 5432
- **Database**: crypto_portfolio
- **Credentials**: user/password

### Cache Service (Optional)

- **Type**: Redis 7
- **Port**: 6379
- **Features**: Session storage and caching

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Frontend
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Crypto Portfolio Tracker

# Backend (if using)
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@db:5432/crypto_portfolio
JWT_SECRET=your-secret-key

# Database
POSTGRES_DB=crypto_portfolio
POSTGRES_USER=user
POSTGRES_PASSWORD=password
```

### Nginx Configuration

The `nginx.conf` file includes:

- React Router support
- Static asset caching
- Gzip compression
- Security headers
- API proxy configuration
- Health check endpoint

## Commands

### Production Commands

```bash
# Build and start
docker-compose up --build

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build frontend

# View service status
docker-compose ps

# Execute commands in container
docker-compose exec frontend sh
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop development services
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild development container
docker-compose -f docker-compose.dev.yml build frontend-dev
```

### Utility Commands

```bash
# Clean up Docker resources
docker system prune -a

# Remove all containers and volumes
docker-compose down -v

# View resource usage
docker stats

# Backup database
docker-compose exec db pg_dump -U user crypto_portfolio > backup.sql
```

## File Structure

```
.
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── nginx.conf             # Nginx configuration
├── .dockerignore          # Docker ignore file
└── DOCKER.md              # This documentation
```

## Multi-stage Build

The production Dockerfile uses multi-stage builds:

1. **deps**: Install production dependencies
2. **builder**: Build the React application
3. **runner**: Serve with Nginx

This approach:

- Reduces final image size
- Improves build caching
- Separates build and runtime concerns

## Performance Optimizations

### Production Build

- Multi-stage Docker build
- Nginx for static file serving
- Gzip compression enabled
- Static asset caching (1 year)
- Optimized bundle size

### Development Build

- Hot module replacement
- Source maps for debugging
- Volume mounting for live code changes
- Fast refresh enabled

## Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Check what's using the port
   lsof -i :3000

   # Stop conflicting services
   docker-compose down
   ```

2. **Build fails**

   ```bash
   # Clean Docker cache
   docker system prune -a

   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Database connection issues**

   ```bash
   # Check database logs
   docker-compose logs db

   # Restart database
   docker-compose restart db
   ```

4. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Health Checks

The frontend service includes health checks:

```bash
# Check service health
docker-compose ps

# View health check logs
docker-compose logs frontend
```

## Security Considerations

- Security headers configured in Nginx
- Non-root user in containers
- Environment variables for secrets
- Network isolation between services
- Regular security updates

## Deployment

### Production Deployment

1. Set up environment variables
2. Build production image
3. Deploy to your hosting platform
4. Configure reverse proxy if needed

### Cloud Deployment

The application can be deployed to:

- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Heroku Container Registry

## Monitoring

### Logs

```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f frontend

# View logs with timestamps
docker-compose logs -t
```

### Metrics

- Container resource usage
- Application performance
- Error rates
- Response times

## Support

For issues related to Docker setup:

1. Check the troubleshooting section
2. Review Docker and Docker Compose logs
3. Verify environment configuration
4. Ensure all prerequisites are met
